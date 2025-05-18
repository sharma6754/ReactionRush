import { useGameState } from "@/hooks/useGameState";
import { HistoryIcon } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export default function HistoryCard() {
  const { scores } = useGameState();

  const formatDate = (date: Date) => {
    if (isToday(new Date(date))) {
      return `Today ${format(new Date(date), 'h:mm a')}`;
    } else if (isYesterday(new Date(date))) {
      return `Yesterday ${format(new Date(date), 'h:mm a')}`;
    } else {
      return format(new Date(date), 'MMM dd, yyyy');
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center">
        <HistoryIcon className="mr-2 text-secondary h-5 w-5" />
        Recent History
      </h3>
      {scores.length > 0 ? (
        <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {scores.map((score, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-mono">{score.time} ms</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(score.date)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No reaction tests completed yet
        </p>
      )}
    </section>
  );
}
