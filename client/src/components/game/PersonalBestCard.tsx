import { useGameState } from "@/hooks/useGameState";
import { TrophyIcon } from "lucide-react";
import { format } from "date-fns";

export default function PersonalBestCard() {
  const { stats, isNewBest } = useGameState();
  const { bestScore, bestScoreDate } = stats;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center">
        <TrophyIcon className="mr-2 text-accent h-5 w-5" />
        Personal Best
      </h3>
      <div className="flex flex-col items-center">
        <p className="text-5xl font-mono font-bold mb-2">{bestScore} ms</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {bestScoreDate 
            ? `Achieved on ${format(new Date(bestScoreDate), 'MMM dd, yyyy')}`
            : 'Not set yet'}
        </p>
        {isNewBest && (
          <div className="mt-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            New Record!
          </div>
        )}
      </div>
    </section>
  );
}
