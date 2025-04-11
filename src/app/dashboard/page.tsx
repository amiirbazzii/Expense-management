"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseList from "@/components/expenses/expense-list";
import MonthlyComparison from "@/components/expenses/monthly-comparison";
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const currentMonthTotal = useQuery(api.expenses.currentMonthTotal);
  const monthComparison = useQuery(api.expenses.compareMonths);
  const expenses = useQuery(api.expenses.list);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 p-4">
        <h1 className="text-xl font-bold">Expense Manager</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-neutral-400">Track and analyze your expenses</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Month Card */}
          <Card className="bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription className="text-neutral-400">Total expenses for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-bold">${currentMonthTotal ?? 0}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                    <Progress value={66} className="h-full bg-amber-500" />
                  </div>
                  <span className="text-sm text-neutral-400">66% Overall Completion</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Month Comparison Card */}
          <Card className="bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
              <CardTitle>Month Comparison</CardTitle>
              <CardDescription className="text-neutral-400">Compare with last month</CardDescription>
            </CardHeader>
            <CardContent>
              {monthComparison ? (
                <MonthlyComparison data={monthComparison} />
              ) : (
                <div className="flex h-24 items-center justify-center">
                  <p className="text-neutral-400">Loading comparison data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Add Expense Card */}
          <Card className="bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
              <CardDescription className="text-neutral-400">Quickly log your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-neutral-900 text-neutral-400">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800 text-white">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription className="text-neutral-400">Your latest expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  {expenses ? (
                    <ExpenseList expenses={expenses.slice(0, 5)} />
                  ) : (
                    <div className="flex h-24 items-center justify-center">
                      <p className="text-neutral-400">Loading expenses...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expenses" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800 text-white">
                <CardHeader>
                  <CardTitle>All Expenses</CardTitle>
                  <CardDescription className="text-neutral-400">Manage all your expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  {expenses ? (
                    <ExpenseList expenses={expenses} />
                  ) : (
                    <div className="flex h-24 items-center justify-center">
                      <p className="text-neutral-400">Loading expenses...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800 text-white">
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription className="text-neutral-400">Analyze your spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Monthly Spending</h3>
                      <p className="text-sm text-neutral-400">
                        This month: ${currentMonthTotal ?? 0}
                      </p>
                      {monthComparison && (
                        <p className="text-sm text-neutral-400">
                          Previous month: ${monthComparison.previousMonth}
                          <span className={monthComparison.difference < 0 
                            ? "ml-2 text-green-500" 
                            : "ml-2 text-red-500"}>
                            ({monthComparison.difference < 0 ? "-" : "+"}$
                            {Math.abs(monthComparison.difference)})
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
} 