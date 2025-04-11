"use client";

interface MonthlyComparisonProps {
  data: {
    currentMonth: number;
    previousMonth: number;
    difference: number;
    percentage: number;
  };
}

export default function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const { currentMonth, previousMonth, difference, percentage } = data;
  const isIncrease = difference > 0;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-400">Current month</span>
          <span className="text-lg font-bold">${currentMonth.toFixed(2)}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full overflow-hidden bg-neutral-800">
          <div
            className="h-full bg-amber-500"
            style={{ width: `${Math.min(100, (currentMonth / (previousMonth || 1)) * 100)}%` }}
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-400">Previous month</span>
          <span className="text-lg font-bold">${previousMonth.toFixed(2)}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full overflow-hidden bg-neutral-800">
          <div
            className="h-full bg-neutral-600"
            style={{ width: `${Math.min(100, (previousMonth / (currentMonth || 1)) * 100)}%` }}
          />
        </div>
      </div>
      
      <div className="pt-2 border-t border-neutral-800">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-400">Difference</span>
          <span className={`text-lg font-bold ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
            {isIncrease ? '+' : '-'}${Math.abs(difference).toFixed(2)}
            <span className="ml-1 text-xs">
              ({Math.abs(percentage).toFixed(1)}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
} 