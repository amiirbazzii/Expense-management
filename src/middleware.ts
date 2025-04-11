import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple auth check based on cookies
function isUserAuthenticated(req: NextRequest): boolean {
  // Check for Clerk's authentication cookies
  return (
    req.cookies.has('__clerk_db_jwt') || 
    req.cookies.has('__session') ||
    req.cookies.has('__clerk_session')
  );
}

export function middleware(req: NextRequest) {
  // Check if user is on the home page
  const isHomePage = req.nextUrl.pathname === '/';
  
  if (isHomePage) {
    try {
      // Check if user is authenticated
      if (isUserAuthenticated(req)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (error) {
      console.error("Error in middleware:", error);
    }
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