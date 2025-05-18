import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Volume2, VolumeX, Settings } from "lucide-react";
import UserProfile from "@/components/ui/user-profile";
import GameArea from "@/components/game/GameArea";
import PersonalBestCard from "@/components/game/PersonalBestCard";
import StatsCard from "@/components/game/StatsCard";
import HistoryCard from "@/components/game/HistoryCard";
import AchievementsSection from "@/components/game/AchievementsSection";
import Leaderboard from "@/components/game/Leaderboard";
import SettingsModal from "@/components/modals/SettingsModal";
import ChallengeModal from "@/components/modals/ChallengeModal";
import { useState } from "react";

export default function Home() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSoundEnabled, toggleSound } = useSound();
  const { user } = useGameState();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);

  useEffect(() => {
    document.title = "Radigo";
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Radigo
        </h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            onClick={toggleSound}
          >
            {isSoundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex flex-col items-center">
        {/* User Profile */}
        <UserProfile user={user} />

        {/* Game Area */}
        <GameArea />

        {/* Dashboard with Stats and History */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <PersonalBestCard />
          <StatsCard />
          <HistoryCard />
        </div>

        {/* Achievements Section */}
        <AchievementsSection />

        {/* Leaderboard */}
        <Leaderboard onChallengeClick={() => setIsChallengeOpen(true)} />
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <ChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
      />
    </div>
  );
}
