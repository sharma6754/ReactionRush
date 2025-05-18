import { useGameState } from "@/hooks/useGameState";
import { LineChartIcon } from "lucide-react";
import MiniChart from "@/components/ui/mini-chart";

export default function StatsCard() {
  const { stats } = useGameState();
  const { average, testsCompleted, todayBest, chartPoints } = stats;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center">
        <LineChartIcon className="mr-2 text-primary h-5 w-5" />
        Statistics
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Average:</span>
          <span className="font-mono font-semibold">{average} ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Tests Completed:</span>
          <span className="font-mono font-semibold">{testsCompleted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Today's Best:</span>
          <span className="font-mono font-semibold">{todayBest ? `${todayBest} ms` : 'N/A'}</span>
        </div>
        
        {/* Simple Chart */}
        <MiniChart points={chartPoints} height={24} />
      </div>
    </section>
  );
}
