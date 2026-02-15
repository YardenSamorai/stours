/**
 * Simple in-memory rate limiting
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const defaultOptions: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
};

/**
 * Get client identifier from request
 */
function getClientId(request: Request): string {
  // Try to get IP from headers (works with most proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Also consider user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent}`;
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or NextResponse with error if rate limited
 */
export function checkRateLimit(
  request: Request,
  options: Partial<RateLimitOptions> = {}
): NextResponse | null {
  const opts = { ...defaultOptions, ...options };
  const clientId = getClientId(request);
  const now = Date.now();
  
  // Clean up old entries (simple cleanup, not perfect but works)
  if (Math.random() < 0.01) { // 1% chance to cleanup
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }
  
  // Get or create entry for this client
  if (!store[clientId] || store[clientId].resetTime < now) {
    store[clientId] = {
      count: 1,
      resetTime: now + opts.windowMs,
    };
    return null; // Allowed
  }
  
  // Increment count
  store[clientId].count++;
  
  // Check if exceeded limit
  if (store[clientId].count > opts.maxRequests) {
    const resetTime = store[clientId].resetTime;
    const retryAfter = Math.ceil((resetTime - now) / 1000);
    
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': opts.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    );
  }
  
  return null; // Allowed
}

/**
 * Rate limit middleware for API routes
 * Use stricter limits for write operations
 */
export function rateLimit(
  options: Partial<RateLimitOptions> = {}
) {
  return (request: Request): NextResponse | null => {
    return checkRateLimit(request, options);
  };
}

/**
 * Stricter rate limit for write operations (POST, PATCH, DELETE)
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute
});

/**
 * Standard rate limit for read operations (GET)
 */
export const standardRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});
