import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: [
    '/',
    '/dashboard', // Allow dashboard access (will show sign-in if not authenticated)
    '/sites', // Allow sites page access (will show sign-in if not authenticated)
    '/test-data', // Test page for debugging
    '/sign-in(.*)', // Clerk sign-in pages
    '/sign-up(.*)', // Clerk sign-up pages
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
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ],
};