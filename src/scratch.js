const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].replace(/\r$/, '');
});

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'frixn' } }
);

async function checkAdithya() {
  const { data: emps, error } = await supabase
    .from('employees')
    .select('id, name, email, email_template_subject, email_template_body, email_attachment_url');

  fs.writeFileSync(path.join(__dirname, 'allemps.json'), JSON.stringify({ emps, error }, null, 2));
}

checkAdithya();
