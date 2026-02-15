import { NextResponse } from 'next/server';
import { db, deals } from '@/db';
import { eq } from 'drizzle-orm';
import { validateId, ValidationError } from '@/lib/validation';

// GET - Fetch single deal
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID format
    let dealId: number;
    try {
      dealId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const deal = await db.select().from(deals).where(eq(deals.id, dealId));
    
    if (!deal.length) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json(deal[0]);
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 });
  }
}

// PATCH - Update deal
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID format
    let dealId: number;
    try {
      dealId = validateId(id);
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
    
    const updatedDeal = await db.update(deals)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(deals.id, dealId))
      .returning();
    
    if (!updatedDeal.length) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedDeal[0]);
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

// DELETE - Delete deal
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID format
    let dealId: number;
    try {
      dealId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const deletedDeal = await db.delete(deals)
      .where(eq(deals.id, dealId))
      .returning();
    
    if (!deletedDeal.length) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}
