import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/ratelimit'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const phoneRegex = /^[+\s()0-9-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const controlCharRegex = /[\x00-\x1F\x7F]/;

function validateAndSanitizeString(
  val: any,
  maxLength: number,
  fieldName: string,
  required = false
): string | null {
  if (val === undefined || val === null) {
    if (required) {
      throw new Error(`${fieldName} is required`);
    }
    return null;
  }

  if (typeof val !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  const trimmed = val.trim();
  if (required && trimmed.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} exceeds maximum length of ${maxLength} characters`);
  }

  if (controlCharRegex.test(trimmed)) {
    throw new Error(`${fieldName} contains invalid control characters`);
  }

  return trimmed;
}

export async function POST(request: NextRequest) {
  // Apply leads rate limiter: 10 requests per 1 minute by default
  const limitResult = await rateLimit(request, 'leads', { limit: 10, window: '1m' })

  if (!limitResult.success) {
    return NextResponse.json(
      { error: 'Too many lead submissions. Please try again later.' },
      { status: 429, headers: limitResult.headers }
    )
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      const response = NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
      limitResult.headers.forEach((val, key) => response.headers.set(key, val));
      return response;
    }

    const {
      org_id,
      employee_id,
      customer_name,
      customer_phone,
      email,
      company,
      visitor_company,
      notes
    } = body;

    // 1 & 5. Validate & Sanitize string inputs
    let orgId: string;
    let employeeId: string;
    let customerName: string;
    let customerPhone: string;
    let customerEmail: string | null;
    let customerCompany: string | null;
    let customerNotes: string | null;

    try {
      orgId = validateAndSanitizeString(org_id, 50, 'org_id', true)!;
      employeeId = validateAndSanitizeString(employee_id, 50, 'employee_id', true)!;
      customerName = validateAndSanitizeString(customer_name, 100, 'customer_name', true)!;
      customerPhone = validateAndSanitizeString(customer_phone, 20, 'customer_phone', true)!;
      customerEmail = validateAndSanitizeString(email, 255, 'email', false);
      customerCompany = validateAndSanitizeString(company || visitor_company, 100, 'company', false);
      customerNotes = validateAndSanitizeString(notes, 1000, 'notes', false);
    } catch (validationError: any) {
      return NextResponse.json({ error: validationError.message }, { status: 400 });
    }

    // 2. Validate UUID formats
    if (!uuidRegex.test(orgId)) {
      return NextResponse.json({ error: 'org_id must be a valid UUID' }, { status: 400 });
    }
    if (!uuidRegex.test(employeeId)) {
      return NextResponse.json({ error: 'employee_id must be a valid UUID' }, { status: 400 });
    }

    // Validate phone format
    if (!phoneRegex.test(customerPhone)) {
      return NextResponse.json({ error: 'customer_phone must be a valid phone number' }, { status: 400 });
    }

    // Validate email format if present
    if (customerEmail && !emailRegex.test(customerEmail)) {
      return NextResponse.json({ error: 'email must be a valid email address' }, { status: 400 });
    }

    // 3. Verify organization exists
    const { data: orgExists, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', orgId)
      .maybeSingle();

    if (orgError) {
      console.error('Error verifying organization:', orgError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (!orgExists) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // 4. Verify employee exists and belongs to the organization
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id, org_id')
      .eq('id', employeeId)
      .maybeSingle();

    if (employeeError) {
      console.error('Error verifying employee:', employeeError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (!employeeData) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    if (employeeData.org_id !== orgId) {
      return NextResponse.json({ error: 'Employee does not belong to the specified organization' }, { status: 400 });
    }

    // 6 & 8. Save the lead using verified server-side identifiers & keep database fields
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        org_id: orgId,
        employee_id: employeeId,
        visitor_name: customerName,
        visitor_phone: customerPhone,
        visitor_email: customerEmail,
        visitor_company: customerCompany,
        notes: customerNotes,
        status: 'new'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, data: newLead });
    limitResult.headers.forEach((val, key) => response.headers.set(key, val));
    return response;
  } catch (error: any) {
    console.error('Unexpected error in lead API route:', error);
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    limitResult.headers.forEach((val, key) => response.headers.set(key, val));
    return response;
  }
}
