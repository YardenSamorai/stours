import { NextResponse } from 'next/server';
import { ratehawk } from '@/lib/ratehawk';

/**
 * Check RateHawk API configuration status
 * GET /api/ratehawk/status
 */
export async function GET() {
  const isConfigured = ratehawk.isReady();
  
  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured 
      ? 'RateHawk API is configured and ready'
      : 'RateHawk API credentials are missing. Please add RATEHAWK_API_KEY and RATEHAWK_KEY_ID to your environment variables.',
    required_env_vars: [
      'RATEHAWK_API_KEY',
      'RATEHAWK_KEY_ID',
      'RATEHAWK_API_URL (optional, defaults to production)',
      'RATEHAWK_SANDBOX (optional, set to "true" for sandbox mode)',
    ],
  });
}
