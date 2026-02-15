import { NextResponse } from 'next/server';
import { db, contactSubmissions } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateId, ValidationError } from '@/lib/validation';

// PATCH - Mark contact as read/unread (admin only)
export async function PATCH(
  request: Request,
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
    let submissionId: number;
    try {
      submissionId = validateId(id);
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

    // Validate isRead is boolean
    if (typeof body.isRead !== 'boolean') {
      return NextResponse.json(
        { error: 'isRead must be a boolean value' },
        { status: 400 }
      );
    }
    
    const updatedSubmission = await db.update(contactSubmissions)
      .set({ isRead: body.isRead })
      .where(eq(contactSubmissions.id, submissionId))
      .returning();
    
    if (!updatedSubmission.length) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedSubmission[0]);
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json({ error: 'Failed to update contact submission' }, { status: 500 });
  }
}

// DELETE - Delete contact submission (admin only)
export async function DELETE(
  request: Request,
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
    let submissionId: number;
    try {
      submissionId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const deleted = await db.delete(contactSubmissions)
      .where(eq(contactSubmissions.id, submissionId))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json({ error: 'Failed to delete contact submission' }, { status: 500 });
  }
}
