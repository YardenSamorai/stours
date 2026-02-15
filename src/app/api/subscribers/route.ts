import { NextResponse } from 'next/server';
import { db, newsletterSubscribers } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { strictRateLimit } from '@/lib/rate-limit';
import { validateEmail, validateRequired, ValidationError } from '@/lib/validation';

// GET - Fetch all subscribers (admin only)
export async function GET() {
  try {
    // Require authentication for admin access
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const subscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// POST - Add new subscriber (from public form)
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
      validateRequired(body, ['email']);
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
    
    // Check if already subscribed
    const existing = await db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, body.email));
    
    if (existing.length) {
      // If inactive, reactivate
      if (!existing[0].isActive) {
        const reactivated = await db.update(newsletterSubscribers)
          .set({ isActive: true })
          .where(eq(newsletterSubscribers.email, body.email))
          .returning();
        return NextResponse.json(reactivated[0]);
      }
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }
    
    const newSubscriber = await db.insert(newsletterSubscribers).values({
      firstName: body.firstName || null,
      lastName: body.lastName || null,
      phone: body.phone || null,
      email: body.email,
      isActive: true,
    }).returning();
    
    return NextResponse.json(newSubscriber[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating subscriber:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
