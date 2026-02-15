import { NextRequest, NextResponse } from 'next/server';
import { db, services } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateId, ValidationError } from '@/lib/validation';

// GET - Fetch single service (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID format
    let serviceId: number;
    try {
      serviceId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const service = await db.select().from(services).where(eq(services.id, serviceId));
    
    if (!service.length) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json(service[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// PATCH - Update service (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const { id } = await params;
    
    // Validate ID format
    let serviceId: number;
    try {
      serviceId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    const updated = await db.update(services)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(services.id, serviceId))
      .returning();
    
    if (!updated.length) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('Error updating service:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A service with this key already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE - Delete service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const { id } = await params;
    
    // Validate ID format
    let serviceId: number;
    try {
      serviceId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const deleted = await db.delete(services)
      .where(eq(services.id, serviceId))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
