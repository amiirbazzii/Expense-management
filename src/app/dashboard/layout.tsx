"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to home if not signed in
      router.push("/");
    } else if (isLoaded && isSignedIn) {
      // If authenticated, stop loading
      setIsLoading(false);
    }
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
      // If still not authenticated after timeout, redirect
      if (!isSignedIn) {
        router.push("/");
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, [isSignedIn, isLoaded, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center">
          <div className="animate-pulse text-white mb-4">Loading...</div>
          <div className="text-neutral-400 text-sm">
            If this takes too long, try <button 
              onClick={() => router.push("/")} 
              className="text-amber-500 underline hover:text-amber-400"
            >
              returning to the home page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 