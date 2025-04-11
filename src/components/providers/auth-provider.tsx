"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn && window.location.pathname.includes("/dashboard")) {
      router.push("/");
    }
    
    if (isLoaded && isSignedIn && window.location.pathname === "/") {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  return <>{children}</>;
} 