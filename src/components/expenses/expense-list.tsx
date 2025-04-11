"use client";

import { formatDistanceToNow } from "date-fns";

type Expense = {
  _id: string;
  amount: number;
  description: string;
  category?: string;
  date: number;
};

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center">
        <p className="text-neutral-400">No expenses yet. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">${expense.amount.toFixed(2)}</span>
                {expense.category && (
                  <span className="text-xs text-neutral-400 uppercase">
                    {expense.category}
                  </span>
                )}
              </div>
              <div className="mt-1 text-neutral-400">{expense.description}</div>
            </div>
            <div className="text-xs text-neutral-500">
              {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 