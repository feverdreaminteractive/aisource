// Temporarily disabled middleware to fix redirect loops
// import { authMiddleware } from '@clerk/nextjs';

// export default authMiddleware({
//   publicRoutes: [
//     '/',
//     '/track.js',
//     '/api/track',
//     '/test-data'
//   ]
// });

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };