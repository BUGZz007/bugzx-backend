-- =========================================================
-- BUGZ X - Supabase Database Schema Script
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- =========================================================

-- 1. Create Submissions Table (Stores all user form data)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id TEXT UNIQUE NOT NULL,
    form_type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    country TEXT,
    city TEXT,
    subject TEXT,
    details TEXT,
    service TEXT,
    website TEXT,
    resume_url TEXT,
    docs_url TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    email_sent BOOLEAN DEFAULT false,
    email_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Index for fast search by submission ID & created_at
CREATE INDEX IF NOT EXISTS idx_submissions_submission_id ON public.submissions(submission_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies to allow Backend Service Role full access
-- Ensure idempotence: drop existing policy if present, then create
DROP POLICY IF EXISTS "Allow service role full access" ON public.submissions;
CREATE POLICY "Allow service role full access" 
ON public.submissions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Create Storage Bucket for Uploaded Resumes/Documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bugzx-uploads', 'bugzx-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Create Storage Policies for Public Access to Uploads
-- Ensure idempotence: drop existing storage policies if present, then create
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
CREATE POLICY "Public Upload Access" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bugzx-uploads');

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bugzx-uploads');
