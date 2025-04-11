"use client";

import { NextRequest } from "next/server";

/**
 * Get the user information from a request
 * This is a simple utility to check for authentication cookies
 */
export function getUserFromRequest(req: NextRequest) {
  // Check for Clerk's authentication cookie
  const hasClerkCookie = 
    req.cookies.has('__clerk_db_jwt') || 
    req.cookies.has('__session') ||
    req.cookies.has('__clerk_session');
  
  // Return authentication status based on cookies
  return {
    isAuthenticated: hasClerkCookie,
  };
} 