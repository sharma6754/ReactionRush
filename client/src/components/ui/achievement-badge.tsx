import { Achievement } from "@/types";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { name, description, emoji, unlocked, gradient } = achievement;

  return (
    <div 
      className={`achievement-badge bg-gradient-to-br ${gradient} rounded-xl p-3 text-center text-white ${!unlocked ? 'locked' : ''}`}
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <h4 className="font-semibold text-sm">{name}</h4>
      <p className="text-xs opacity-80">{description}</p>
    </div>
  );
}
