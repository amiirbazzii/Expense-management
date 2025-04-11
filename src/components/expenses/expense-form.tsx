"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const createExpense = useMutation(api.expenses.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createExpense({
        amount: parseFloat(amount),
        description,
        category: category || undefined,
      });
      
      // Reset form
      setAmount("");
      setDescription("");
      setCategory("");
      
      // Refresh the page to show new data
      router.refresh();
    } catch (error) {
      console.error("Failed to create expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-neutral-800 border-neutral-700 text-white"
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Description (e.g., 'to buy an hour')"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-neutral-800 border-neutral-700 text-white"
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-neutral-800 border-neutral-700 text-white"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-amber-500 hover:bg-amber-600 text-black" 
        disabled={isSubmitting || !amount || !description}
      >
        {isSubmitting ? "Adding..." : "Add Expense"}
      </Button>
    </form>
  );
} 