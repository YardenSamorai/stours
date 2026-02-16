import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

// Define protected routes (admin area)
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/he/admin(.*)',
  '/en/admin(.*)',
]);

// Define public routes that don't need auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/he(.*)',
  '/en(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Redirect /he/admin... or /en/admin... to /admin...
  const localeAdminMatch = pathname.match(/^\/(he|en)(\/admin.*)$/);
  if (localeAdminMatch) {
    const adminPath = localeAdminMatch[2]; // e.g. "/admin" or "/admin/deals"
    return NextResponse.redirect(new URL(adminPath, req.url));
  }

  // Check if it's an admin route
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // Handle internationalization for non-admin routes
  if (!pathname.startsWith('/admin') && 
      !pathname.startsWith('/sign-in') && 
      !pathname.startsWith('/sign-up') &&
      !pathname.startsWith('/api')) {
    return intlMiddleware(req);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
