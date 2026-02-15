/**
 * Authentication utilities for API routes
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Check if user is authenticated
 * Returns user ID if authenticated, null otherwise
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication for API route
 * Returns NextResponse with error if not authenticated, null if authenticated
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const userId = await getAuthUserId();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized. Please sign in to access this resource.' },
      { status: 401 }
    );
  }
  
  return null;
}

/**
 * Check if user has admin role
 * Note: Adjust this based on your Clerk role setup
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const authError = await requireAuth();
  if (authError) {
    return authError;
  }

  try {
    const user = await currentUser();
    
    // Check if user has admin role
    // Adjust this based on your Clerk organization/role setup
    const isAdmin = user?.publicMetadata?.role === 'admin' || 
                    user?.publicMetadata?.isAdmin === true;
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }
    
    return null;
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { error: 'Failed to verify admin access' },
      { status: 500 }
    );
  }
}
