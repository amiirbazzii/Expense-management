"use client";

import { SignInButton } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface CustomSignInProps {
  children: ReactNode;
}

export function CustomSignIn({ children }: CustomSignInProps) {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);
  
  return (
    <SignInButton>
      {children}
    </SignInButton>
  );
} 