import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/:path',
  '/api/(.*)',
])


export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

// Konfigurasi matcher
export const config = {
  matcher: [
    // Skip file statis dan internal Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Jalankan juga di semua API/trpc routes
    '/(api|trpc)(.*)',
  ],
}
