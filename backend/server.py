from fastapi import FastAPI, APIRouter, HTTPException, Header, UploadFile, File, Form, Request, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import hashlib
from datetime import datetime, timezone, timedelta
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', encoding='utf-8')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== SUPABASE CLIENT =====
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip().strip('"').strip("'")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "").strip().strip('"').strip("'")
SUPABASE_STORAGE_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "bugzx-uploads").strip().strip('"').strip("'")

supabase = None
SUPABASE_READY = False

try:
    from supabase import create_client
    if SUPABASE_URL and SUPABASE_SECRET_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
        SUPABASE_READY = True
        logger.info("[OK] Supabase client initialized.")
    else:
        logger.warning("Supabase URL/key not configured.")
except Exception as e:
    logger.error(f"Supabase init warning (continuing with HTTP direct operations): {e}")

# ===== MONGODB (legacy) =====
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017').strip().strip('"').strip("'")
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ.get('DB_NAME', 'bugzx_database').strip().strip('"').strip("'")]



# ===== EMAIL CONFIG =====
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASSWORD", "")
NOTIFICATION_EMAIL = os.environ.get("NOTIFICATION_EMAIL", "team@bugzx.space")

# Branding defaults (override in backend/.env)
COMPANY_LOGO_URL = os.environ.get("COMPANY_LOGO_URL", "https://assets.bugzx.space/logo-light.png")
BRAND_COLOR = os.environ.get("BRAND_COLOR", "#09090b")
BRAND_ACCENT = os.environ.get("BRAND_ACCENT", "#a1a1aa")
BRAND_FONT = os.environ.get("BRAND_FONT", "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif")
BRAND_TEXT = os.environ.get("BRAND_TEXT", "#ffffff")

# ===== APP =====
app = FastAPI(title="BUGZ X API")
api_router = APIRouter(prefix="/api")


# ===== MODELS =====

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class LeadSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fullName: str
    company: Optional[str] = ""
    email: str
    phone: Optional[str] = ""
    city: Optional[str] = ""
    service: str
    website: Optional[str] = ""
    details: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadSubmissionCreate(BaseModel):
    fullName: str
    company: Optional[str] = ""
    email: str
    phone: Optional[str] = ""
    city: Optional[str] = ""
    service: str
    website: Optional[str] = ""
    details: str

class SubmissionPatch(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class OTPRequest(BaseModel):
    email: str


class OTPVerify(BaseModel):
    email: str
    otp: str


# ===== HELPERS =====

TYPE_PREFIXES = {
    "inquiry": "INQ",
    "job application": "APP",
    "business partnership": "BIZ",
    "support request": "SUP",
}

def generate_submission_id(form_type: str) -> str:
    prefix = TYPE_PREFIXES.get(form_type.lower(), "SUB")
    date_part = datetime.now(timezone.utc).strftime("%Y%m%d")
    rand_part = str(uuid.uuid4()).replace("-", "").upper()[:6]
    return f"{prefix}-{date_part}-{rand_part}"


# ===== SUPABASE DB HELPERS (sync, called via asyncio.to_thread) =====

def _sb_insert(data: dict) -> bool:
    try:
        # Create a copy and map keys to match Supabase schema
        payload = data.copy()
        if "message" in payload:
            payload["details"] = payload.pop("message")
        payload.pop("ip_address", None)
        
        result = supabase.table("submissions").insert(payload).execute()
        logger.info(f"Supabase insert: {data.get('submission_id')}")
        return True
    except Exception as e:
        logger.error(f"Supabase insert failed: {e}")
        return False

def _sb_get_all() -> list:
    try:
        result = supabase.table("submissions").select("*").order("created_at", desc=True).execute()
        data = result.data or []
        # Map "details" back to "message" for frontend compatibility
        for row in data:
            if "details" in row:
                row["message"] = row["details"]
        return data
    except Exception as e:
        logger.error(f"Supabase fetch failed: {e}")
        return []

def _sb_update(submission_id: str, updates: dict) -> bool:
    try:
        supabase.table("submissions").update(updates).eq("submission_id", submission_id).execute()
        return True
    except Exception as e:
        logger.error(f"Supabase update failed: {e}")
        return False

def _sb_update_email_status(submission_id: str, email_sent: bool) -> None:
    try:
        supabase.table("submissions").update({
            "email_sent": email_sent,
            "email_status": "sent" if email_sent else "failed"
        }).eq("submission_id", submission_id).execute()
    except Exception as e:
        logger.warning(f"Email status update failed: {e}")

def _sb_upload_file(file_bytes: bytes, filename: str, content_type: str) -> Optional[str]:
    try:
        path = f"submissions/{uuid.uuid4().hex}/{filename}"
        supabase.storage.from_(SUPABASE_STORAGE_BUCKET).upload(
            path, file_bytes, {"content-type": content_type}
        )
        return supabase.storage.from_(SUPABASE_STORAGE_BUCKET).get_public_url(path)
    except Exception as e:
        logger.error(f"File upload failed: {e}")
        return None


# ===== EMAIL HELPERS =====

SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "no-reply@bugzx.space")
BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "")




def send_email_via_brevo(to: str, subject: str, html: str) -> bool:
    if not BREVO_API_KEY:
        logger.info("Brevo API key not configured - skipping email.")
        return False

    url = "https://api.brevo.com/v3/smtp/email"
    payload = {
        "sender": {"name": "BUGz X", "email": SENDER_EMAIL},
        "to": [{"email": to}],
        "subject": subject,
        "htmlContent": html,
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        if response.status_code in (200, 201, 202):
            logger.info("Email sent via Brevo API -> %s", to)
            return True
        logger.error("Brevo API email failed: %s %s", response.status_code, response.text)
        return False
    except Exception as e:
        logger.error("Brevo API email exception: %s", e)
        return False


def send_email(to: str, subject: str, html: str) -> bool:
    recipients = [r.strip() for r in to.split(",") if r.strip()]
    if not recipients:
        return False
    if len(recipients) > 1:
        results = []
        for r in recipients:
            results.append(send_email(r, subject, html))
        return any(results)

    single_to = recipients[0]
    sent_via_api = False
    if BREVO_API_KEY:
        sent_via_api = send_email_via_brevo(single_to, subject, html)
        if sent_via_api:
            return True

    if not SMTP_USER or not SMTP_PASS or "yourprovider" in SMTP_HOST:
        logger.info("SMTP not configured - skipping email fallback.")
        return sent_via_api
    try:
        from email.header import Header
        msg = MIMEMultipart("alternative")
        msg["Subject"] = Header(subject, "utf-8")
        msg["From"] = f"BUGz X <{SENDER_EMAIL}>"
        msg["To"] = single_to
        msg.attach(MIMEText(html, "html", "utf-8"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=5) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SENDER_EMAIL, single_to, msg.as_string())
        logger.info("Email sent via SMTP fallback -> %s", single_to)
        return True
    except Exception as e:
        logger.error(f"Email failed via SMTP fallback: {e}")
        return False


def build_confirmation_email(submission: dict) -> str:
    form_type = submission.get('form_type', 'Submission')
    ft_lower = form_type.lower()
    is_job = "job" in ft_lower or "career" in ft_lower or "apply" in ft_lower or "application" in ft_lower
    is_partner = "partner" in ft_lower or "biz" in ft_lower or "business" in ft_lower

    if is_job:
        title = "Application Received"
        header_title = "We Received Your Application"
        message_body = "Thank you for applying. Your job application has been submitted successfully."
        subject_label = "Position:"
        info_note = "Our HR team will review your application and contact you within <strong>24 hours</strong>."
    elif is_partner:
        title = "Partnership Inquiry Received"
        header_title = "Thank You for Reaching Out"
        message_body = "Thank you for your interest in partnering with us. Your partnership inquiry has been received."
        subject_label = "Inquiry Type:"
        info_note = "Our team will connect with you to discuss partnership opportunities."
    else:
        title = "Inquiry Received"
        header_title = "We Received Your Inquiry"
        message_body = "Thank you for reaching out. Your inquiry has been submitted successfully."
        subject_label = "Subject:"
        info_note = "Our operations team will review your submission and revert back to you soon."

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <style>
            body {{ margin:0; padding:0; background-color:#f4f4f5; font-family:{BRAND_FONT}; color:#18181b; }}
            .card {{ max-width:640px; margin:24px auto; background-color: #ffffff; border-radius:12px; overflow:hidden; border:1px solid #e4e4e7; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }}
            .header {{ padding:28px 32px; display:flex; align-items:center; justify-content:space-between; background:#09090b; }}
            .logo {{ height:40px; }}
            .confirmed {{ background:rgba(255,255,255,0.1); color:#a1a1aa; padding:8px 12px; border-radius:20px; font-weight:700; font-size:12px; }}
            .body {{ padding:28px 32px; }}
            .muted {{ color: #71717a; }}
            .idbox {{ background:#f4f4f5; border:1px solid #e4e4e7; padding:18px; border-radius:10px; font-family:monospace; font-weight:800; letter-spacing:0.06em; color:#18181b; font-size:18px; }}
            table.details {{ width:100%; margin-top:18px; border-collapse:collapse; color:#18181b; }}
            table.details td.label {{ color: #71717a; width:160px; padding:10px 0; font-weight:700; }}
            table.details td.value {{ padding:10px 0; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <div style="display:flex;align-items:center;gap:16px;">
                    <img src="{COMPANY_LOGO_URL}" alt="logo" class="logo" />
                    <div style="font-weight:800;letter-spacing:0.08em;color:#ffffff; text-transform:uppercase;">BUGz <span style="color:{BRAND_ACCENT};">X</span></div>
                </div>
                <div class="confirmed">CONFIRMED</div>
            </div>
            <div class="body">
                <h1 style="margin:0 0 12px 0;color:#09090b;">{header_title}</h1>
                <p class="muted">Hello <strong style="color:#18181b;">{submission.get('name','Applicant')}</strong>,<br/>{message_body}</p>

                <div style="margin:18px 0;">
                    <div style="font-size:11px;color:#71717a;text-transform:uppercase;font-weight:700;margin-bottom:8px;">Reference Submission ID</div>
                    <div class="idbox">{submission.get('submission_id','SUB-PENDING')}</div>
                </div>

                <table class="details">
                    <tr>
                        <td class="label">Form Type:</td>
                        <td class="value">{form_type}</td>
                    </tr>
                    <tr>
                        <td class="label">{subject_label}</td>
                        <td class="value">{submission.get('subject') or submission.get('service') or 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Submitted At:</td>
                        <td class="value">{submission.get('created_at','Just now')}</td>
                    </tr>
                </table>

                <div style="margin-top:20px;padding:14px;background:#f4f4f5;border-radius:8px;color:#27272a;border:1px solid #e4e4e7;">{info_note}</div>
            </div>
            <div style="padding:18px 32px;background:transparent;color:#71717a;text-align:center;font-size:12px;">Need help? Contact <a href="mailto:team@bugzx.space" style="color:#09090b;font-weight:600;text-decoration:none;">team@bugzx.space</a></div>
        </div>
    </body>
    </html>
    """


def build_admin_notification_email(submission: dict) -> str:
    fields = [
        ("Submission ID","submission_id"),("Form Type","form_type"),
        ("Name","name"),("Email","email"),("Phone","phone"),
        ("Company","company"),("Country","country"),("City","city"),
        ("Subject / Position","subject"),("IP Address","ip_address"),
        ("Resume URL","resume_url"),("Docs URL","docs_url"),("Submitted At","created_at"),
    ]
    
    rows = ""
    for lbl, key in fields:
        val = submission.get(key) or "-"
        if isinstance(val, str) and (val.startswith("http://") or val.startswith("https://")):
            val_html = f'<a href="{val}" target="_blank" style="color:#000;text-decoration:underline;word-break:break-all;">{val}</a>'
        else:
            val_html = val
        rows += (
            f'<tr style="border-bottom:1px solid #f0f0f0;">'
            f'<td style="padding:9px 0;color:#888;font-weight:600;width:170px;font-size:13px;">{lbl}:</td>'
            f'<td style="padding:9px 0;color:#111;font-size:13px;">{val_html}</td>'
            f'</tr>'
        )

    message = submission.get("message","")
    return f"""
    <html><body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:30px;color:#111;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
        <div style="background:#000;padding:20px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">New {submission.get('form_type','Submission')}</h1>
          <p style="color:#aaa;margin:4px 0 0;font-size:12px;">BUGz X Internal Notification</p>
        </div>
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;">{rows}</table>
          <div style="margin-top:20px;">
            <p style="font-weight:bold;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message / Cover Letter:</p>
            <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;font-size:13px;color:#333;white-space:pre-wrap;line-height:1.6;">{message}</div>
          </div>
          <div style="margin-top:24px;">
            <a href="https://bugzx.space/admin" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-decoration:none;">VIEW IN ADMIN -></a>
          </div>
        </div>
        <div style="background:#f9f9f9;border-top:1px solid #e4e4e7;padding:14px 32px;font-size:11px;color:#aaa;text-align:center;">BUGZ X Internal - do not forward</div>
      </div>
    </body></html>
    """


# ===== LEGACY EMAIL =====
def send_lead_email(lead_data: dict):
    if not BREVO_API_KEY and not SMTP_USER:
        return False
    try:
        subject = f"New BUGZ X Lead: {lead_data['fullName']}"
        html = f"""<html><body style="font-family:Arial,sans-serif;color:#111;background:#f4f4f5;padding:20px;">
          <div style="max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:12px;">
            <h2>New BUGZ X Lead</h2>
            <p><strong>Name:</strong> {lead_data['fullName']}</p>
            <p><strong>Email:</strong> {lead_data['email']}</p>
            <p><strong>Service:</strong> {lead_data['service']}</p>
            <p><strong>Details:</strong><br/>{lead_data['details']}</p>
          </div></body></html>"""
        return send_email(NOTIFICATION_EMAIL, subject, html)
    except Exception as e:
        logger.error(f"Lead email failed: {e}")
        return False


# ===== ROUTES =====

@api_router.get("/")
async def root():
    project_id = "unknown"
    if SUPABASE_URL and "//" in SUPABASE_URL:
        try:
            project_id = SUPABASE_URL.split("//")[1].split(".")[0]
        except Exception:
            pass
    return {
        "message": "BUGZ X API Running",
        "supabase": SUPABASE_READY,
        "project": project_id,
    }


async def dispatch_emails(submission: dict):
    form_type = submission.get("form_type", "")
    submission_id = submission.get("submission_id", "")
    name = submission.get("name", "")
    email = submission.get("email", "")
    user_html = build_confirmation_email(submission)
    admin_html = build_admin_notification_email(submission)
    is_job = "job application" in form_type.lower()
    user_subject = f"Your application has been received - {submission_id}" if is_job else f"Your inquiry has been received - {submission_id}"
    user_ok = await asyncio.to_thread(
        send_email, email,
        user_subject,
        user_html
    )
    admin_ok = await asyncio.to_thread(
        send_email, NOTIFICATION_EMAIL,
        f"New {form_type}: {name} - {submission_id}",
        admin_html
    )
    if SUPABASE_READY:
        await asyncio.to_thread(_sb_update_email_status, submission_id, user_ok)
    logger.info("Email dispatch result user_ok=%s admin_ok=%s", user_ok, admin_ok)

# ---- Universal Submit ----

@api_router.post("/submit")
async def universal_submit(
    request: Request,
    background_tasks: BackgroundTasks,
    form_type: str = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    company: str = Form(""),
    country: str = Form(""),
    city: str = Form(""),
    subject: str = Form(""),
    message: str = Form(...),
    consent: str = Form(...),
    resume: Optional[UploadFile] = File(None),
    docs: Optional[UploadFile] = File(None),
):
    if not name or not email or not message:
        raise HTTPException(status_code=422, detail="Name, email and message are required.")
    if consent.lower() not in ("true", "1", "yes"):
        raise HTTPException(status_code=422, detail="You must agree to the Privacy Policy.")
    if len(message) < 20:
        raise HTTPException(status_code=422, detail="Message must be at least 20 characters.")

    submission_id = generate_submission_id(form_type)
    now = datetime.now(timezone.utc).isoformat()
    forwarded_for = request.headers.get("x-forwarded-for", "")
    ip_address = forwarded_for.split(",")[0].strip() if forwarded_for else request.client.host

    # Upload files (async thread)
    resume_url, docs_url = None, None
    if resume and resume.filename and SUPABASE_READY:
        resume_bytes = await resume.read()
        resume_url = await asyncio.to_thread(
            _sb_upload_file, resume_bytes, resume.filename, resume.content_type or "application/octet-stream"
        )
    if docs and docs.filename and SUPABASE_READY:
        docs_bytes = await docs.read()
        docs_url = await asyncio.to_thread(
            _sb_upload_file, docs_bytes, docs.filename, docs.content_type or "application/octet-stream"
        )

    submission = {
        "submission_id": submission_id,
        "form_type": form_type,
        "name": name,
        "email": email,
        "phone": phone or None,
        "company": company or None,
        "country": country or None,
        "city": city or None,
        "subject": subject or None,
        "message": message,
        "resume_url": resume_url,
        "docs_url": docs_url,
        "ip_address": ip_address,
        "status": "New",
        "notes": "",
        "email_sent": False,
        "email_status": "pending",
        "created_at": now,
    }

    # Save to Supabase
    if SUPABASE_READY:
        await asyncio.to_thread(_sb_insert, submission)

    # Queue email dispatch as background task
    background_tasks.add_task(dispatch_emails, submission)

    return {
        "ok": True,
        "submission_id": submission_id,
        "email_sent": "pending",
        "admin_email_sent": "pending",
        "message": f"Submission received. Your ID is {submission_id}. We'll respond within 24 hours.",
    }





# ---- Legacy Routes ----

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    try:
        await db.status_checks.insert_one(doc)
    except Exception as e:
        logger.warning(f"Mongo insert error: {e}")
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    try:
        checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        for c in checks:
            if isinstance(c['timestamp'], str):
                c['timestamp'] = datetime.fromisoformat(c['timestamp'])
        return checks
    except Exception as e:
        logger.warning(f"Mongo fetch error: {e}")
        return []

@api_router.post("/leads", response_model=LeadSubmission)
async def create_lead(input: LeadSubmissionCreate):
    lead_obj = LeadSubmission(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    try:
        await db.leads.insert_one(doc)
        logger.info(f"Lead saved: {lead_obj.id}")
    except Exception as e:
        logger.warning(f"Mongo storage skipped: {e}")
    asyncio.create_task(asyncio.to_thread(send_lead_email, doc))
    return lead_obj

@api_router.get("/leads", response_model=List[LeadSubmission])
async def get_leads():
    try:
        leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
        for lead in leads:
            if isinstance(lead['timestamp'], str):
                lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
        return leads
    except Exception as e:
        logger.warning(f"Mongo fetch error: {e}")
        return []


# ===== REGISTER =====

@app.get("/")
async def home():
    return {
        "message": "BUGZ X API Running",
        "docs": "/docs",
        "api": "/api",
        "supabase": SUPABASE_READY,
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    pass

@app.on_event("shutdown")
async def shutdown():
    mongo_client.close()