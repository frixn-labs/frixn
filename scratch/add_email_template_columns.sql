-- Run this exactly as provided in your Supabase SQL Editor (inside the SQL Editor tab of the Supabase dashboard):
ALTER TABLE frixn.employees ADD COLUMN email_template_subject text;
ALTER TABLE frixn.employees ADD COLUMN email_template_body text;
ALTER TABLE frixn.employees ADD COLUMN email_attachment_url text;
