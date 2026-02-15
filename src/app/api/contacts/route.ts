import { NextResponse } from 'next/server';
import { db, contactSubmissions } from '@/db';
import { desc, eq, sql } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { strictRateLimit } from '@/lib/rate-limit';
import { validateEmail, validateRequired, ValidationError } from '@/lib/validation';

// GET - Fetch all contact submissions (admin only)
export async function GET() {
  try {
    // Require authentication for admin access
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const submissions = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

// POST - Create new contact submission (from public form)
export async function POST(request: Request) {
  try {
    // Rate limiting for public endpoint
    const rateLimitError = strictRateLimit(request);
    if (rateLimitError) {
      return rateLimitError;
    }
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate required fields
    try {
      validateRequired(body, ['name', 'email']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    const newSubmission = await db.insert(contactSubmissions).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      destination: body.destination,
      message: body.message,
      isRead: false,
    }).returning();
    
    return NextResponse.json(newSubmission[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating contact submission:', error);
    
    // Handle database unique constraint violations
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
