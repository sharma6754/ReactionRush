import { useGameState } from "@/hooks/useGameState";
import { MedalIcon } from "lucide-react";
import AchievementBadge from "@/components/ui/achievement-badge";

export default function AchievementsSection() {
  const { achievements } = useGameState();

  return (
    <section className="w-full mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center">
        <MedalIcon className="mr-2 text-accent h-5 w-5" />
        Achievements
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </section>
  );
}
