import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Expense Manager",
  description: "Track and analyze your expenses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <ClerkProvider
        appearance={{
          variables: { colorPrimary: "#f59e0b" }
        }}
      >
        <ConvexClientProvider>
          <body className={`${inter.className} min-h-screen bg-background`}>
            {children}
          </body>
        </ConvexClientProvider>
      </ClerkProvider>
    </html>
  );
}
