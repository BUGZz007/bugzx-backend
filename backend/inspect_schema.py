import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("c:/Users/visha/OneDrive/Documents/BUG/BUGZX/backend/.env", encoding='utf-8')

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SECRET_KEY")

if not url or not key:
    print("Missing Supabase credentials")
    exit(1)

sb = create_client(url, key)

try:
    # Try inserting with columns from supabase_schema.sql
    res = sb.table("submissions").insert({
        "submission_id": "test-dummy-sql",
        "form_type": "Inquiry",
        "name": "Test Name",
        "email": "test@test.com",
        "details": "This is a test details string that replaces message",
        "service": "Web Development",
        "website": "example.com"
    }).execute()
    print("Insert succeeded! Columns available:")
    if res.data:
        print(list(res.data[0].keys()))
        # clean it up
        sb.table("submissions").delete().eq("submission_id", "test-dummy-sql").execute()
except Exception as e:
    print("Insert failed:", e)
