import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: [
    '/',
    '/dashboard', // Allow dashboard access (will show sign-in if not authenticated)
    '/test-data', // Test page for debugging
  ],
  // Routes that bypass middleware completely (for tracking)
  ignoredRoutes: [
    '/api/track',      // Tracking endpoint must be accessible without auth
    '/api/track-script', // Alternative tracking script endpoint
    '/track.js',       // Static tracking script
  ],
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};