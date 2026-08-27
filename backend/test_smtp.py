import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv("c:/Users/visha/OneDrive/Documents/BUG/BUGZX/backend/.env", encoding='utf-8')

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp-relay.brevo.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASSWORD", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "no-reply@bugzx.space")
print(f"SMTP_HOST: {repr(SMTP_HOST)}")
print(f"SMTP_PORT: {repr(SMTP_PORT)}")
print(f"SMTP_USER: {repr(SMTP_USER)}")

to = os.environ.get("NOTIFICATION_EMAIL", "team@bugzx.space")
msg = MIMEMultipart("alternative")
msg["Subject"] = "Test SMTP"
msg["From"] = f"BUGz X <{SENDER_EMAIL}>"
msg["To"] = to
msg.attach(MIMEText("This is a test email.", "html"))

print(f"Connecting to {SMTP_HOST}:{SMTP_PORT} as {SMTP_USER}...")
try:
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.set_debuglevel(1)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SENDER_EMAIL, to, msg.as_string())
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {e}")
