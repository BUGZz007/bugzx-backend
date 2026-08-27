import os
from dotenv import load_dotenv
import asyncio
from pathlib import Path

# Load env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', encoding='utf-8')

# Import our email functions
from server import send_email, build_confirmation_email, build_admin_notification_email

async def main():
    # Simulate an inquiry submission
    submission = {
        "submission_id": "INQ-20260811-TEST88",
        "form_type": "Inquiry",
        "name": "Vishal Suthar",
        "email": "vishalsuthar2002@outlook.com",
        "phone": "+91 99999 99999",
        "company": "BUGZX",
        "country": "India",
        "city": "Rajasthan",
        "subject": "Web Development Consultation",
        "message": "Hello, I would like to get a quote for a new web development project.",
        "resume_url": None,
        "docs_url": None,
        "ip_address": "127.0.0.1",
        "created_at": "2026-08-11T17:07:00Z"
    }

    applicant_email = "vishalsuthar2002@outlook.com"
    admin_emails = os.environ.get("NOTIFICATION_EMAIL", "team@bugzx.space")

    print(f"Sending confirmation email to applicant: {applicant_email}...")
    user_html = build_confirmation_email(submission)
    user_subject = f"Your inquiry has been received - {submission['submission_id']}"
    user_ok = send_email(applicant_email, user_subject, user_html)
    print(f"Applicant email status: {'SUCCESS' if user_ok else 'FAILED'}")

    print(f"Sending admin notification to: {admin_emails}...")
    admin_html = build_admin_notification_email(submission)
    admin_subject = f"New Inquiry: Vishal Suthar - {submission['submission_id']}"
    admin_ok = send_email(admin_emails, admin_subject, admin_html)
    print(f"Admin email status: {'SUCCESS' if admin_ok else 'FAILED'}")

if __name__ == "__main__":
    asyncio.run(main())
