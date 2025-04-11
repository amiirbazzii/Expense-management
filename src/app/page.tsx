import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomSignIn } from "@/components/auth/custom-sign-in";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 p-4">
        <h1 className="text-xl font-bold">Expense Manager</h1>
        <div>
          <CustomSignIn>
            <Button variant="default" className="bg-amber-500 hover:bg-amber-600 text-black">
              Sign In
            </Button>
          </CustomSignIn>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Track your expenses with ease
          </h2>
          <p className="mt-6 text-lg text-neutral-400">
            Log your daily expenses and get insights into your spending habits.
            Quick and simple - just enter what you spent and where.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <CustomSignIn>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black text-lg px-8 py-6">
                Get Started
              </Button>
            </CustomSignIn>
            <Link href="/dashboard">
              <Button className="bg-neutral-800 hover:bg-neutral-700 text-white text-lg px-8 py-6">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-xl font-semibold">Simple Logging</h3>
            <p className="mt-2 text-neutral-400">
              Log expenses in seconds with our streamlined interface.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-xl font-semibold">Insightful Reports</h3>
            <p className="mt-2 text-neutral-400">
              Visualize your spending with easy-to-understand charts and comparisons.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-xl font-semibold">Ask Questions</h3>
            <p className="mt-2 text-neutral-400">
              Get answers to questions like "How much did I spend this month?"
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-950 p-4 text-center text-sm text-neutral-400">
        <p>© {new Date().getFullYear()} Expense Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
