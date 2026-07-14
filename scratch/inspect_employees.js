const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY; // Service role key to bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'frixn'
  }
});

async function inspect() {
  try {
    const { data: emp, error: empErr } = await supabase.from('employees').select('*').limit(1);
    if (empErr) {
      console.error('Employees error:', empErr);
    } else {
      console.log('Employees Columns:', Object.keys(emp[0] || {}));
    }

    const { data: lead, error: leadErr } = await supabase.from('leads').select('*').limit(1);
    if (leadErr) {
      console.error('Leads error:', leadErr);
    } else {
      console.log('Leads Columns:', Object.keys(lead[0] || {}));
    }
  } catch (err) {
    console.error('Inspect error:', err);
  }
}

inspect();
