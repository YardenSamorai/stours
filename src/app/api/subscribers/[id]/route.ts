import { NextResponse } from 'next/server';
import { db, newsletterSubscribers } from '@/db';
import { eq } from 'drizzle-orm';

// PATCH - Update subscriber status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await db.update(newsletterSubscribers)
      .set({ isActive: body.isActive })
      .where(eq(newsletterSubscribers.id, parseInt(id)))
      .returning();
    
    if (!updated.length) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 });
  }
}

// DELETE - Delete subscriber
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, parseInt(id)))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
