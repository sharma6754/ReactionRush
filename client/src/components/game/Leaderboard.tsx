import { useGameState } from "@/hooks/useGameState";
import { UsersIcon, Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface LeaderboardProps {
  onChallengeClick: () => void;
}

export default function Leaderboard({ onChallengeClick }: LeaderboardProps) {
  const { leaderboard } = useGameState();

  return (
    <section className="w-full mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center">
        <UsersIcon className="mr-2 text-primary h-5 w-5" />
        Leaderboard
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-2 w-12 text-gray-500 dark:text-gray-400">#</th>
              <th className="py-3 text-gray-500 dark:text-gray-400">Player</th>
              <th className="py-3 px-2 text-right text-gray-500 dark:text-gray-400">Best Time</th>
              <th className="py-3 px-2 text-right text-gray-500 dark:text-gray-400 hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr 
                key={entry.id}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  entry.isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <td className="py-3 px-2 font-semibold">{index + 1}</td>
                <td className="py-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${entry.avatarGradient} flex items-center justify-center text-white font-bold text-xs mr-2`}>
                      {entry.initials}
                    </div>
                    <span>{entry.name}</span>
                    {entry.isCurrentUser && (
                      <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-semibold px-2 py-0.5 rounded">You</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 font-mono font-semibold text-right">{entry.bestTime} ms</td>
                <td className="py-3 px-2 text-right text-gray-500 dark:text-gray-400 hidden md:table-cell">
                  {format(new Date(entry.date), 'MMM dd, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={onChallengeClick}
          className="py-2 px-6 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-300 dark:border-gray-600 flex items-center"
        >
          <Share2Icon className="mr-2 h-4 w-4" />
          Challenge a Friend
        </Button>
      </div>
    </section>
  );
}
