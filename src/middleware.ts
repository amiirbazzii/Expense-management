import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Export our middleware for handling redirects
export function middleware(req: NextRequest) {
  const isHomePage = req.nextUrl.pathname === '/';
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
  const isWebhookPage = req.nextUrl.pathname === '/clerk-users-webhook';
  
  // Check for authentication cookies to determine if user is logged in
  const hasAuthCookies = 
    req.cookies.has('__clerk_db_jwt') || 
    req.cookies.has('__session');
  
  // Redirect authenticated users from home to dashboard
  if (isHomePage && hasAuthCookies) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Redirect unauthenticated users from dashboard to home
  if (isDashboardPage && !hasAuthCookies) {
    // Create a response that redirects to home
    const response = NextResponse.redirect(new URL('/', req.url));
    
    // Clear any potentially invalid Clerk cookies
    response.cookies.delete('__clerk_db_jwt');
    response.cookies.delete('__session');
    response.cookies.delete('__clerk_session');
    
    return response;
  }
  
  // Allow requests to the webhook endpoint
  if (isWebhookPage) {
    return NextResponse.next(); // Allow the request to proceed
  }

  // Proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 