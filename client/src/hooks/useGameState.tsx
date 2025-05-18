import { createContext, useContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useSound } from "./useSound";
import { useToast } from "./use-toast";
import {
  User,
  Score,
  Stats,
  Achievement,
  LeaderboardEntry,
  Settings,
  GameState,
  GameContext as GameContextType,
} from "@/types";

// Define achievement condition functions separately for better type safety
const achievementConditions = {
  speedDemon: (stats: Stats, scores: Score[]) => scores.some(score => score.time < 350),
  consistent: (stats: Stats, scores: Score[]) => stats.testsCompleted >= 5,
  champion: (stats: Stats, scores: Score[]) => scores.some(score => score.time < 330),
  analyst: (stats: Stats, scores: Score[]) => stats.testsCompleted >= 100,
  bullseye: (stats: Stats, scores: Score[]) => scores.some(score => score.time < 320),
};

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Under 350ms",
    emoji: "⚡",
    unlocked: false,
    gradient: "from-blue-500 to-indigo-600",
    condition: achievementConditions.speedDemon,
  },
  {
    id: "consistent",
    name: "Consistent",
    description: "5 tests in a row",
    emoji: "🔄",
    unlocked: false,
    gradient: "from-pink-500 to-purple-600",
    condition: achievementConditions.consistent,
  },
  {
    id: "champion",
    name: "Champion",
    description: "Under 330ms",
    emoji: "🥇",
    unlocked: false,
    gradient: "from-amber-500 to-orange-600",
    condition: achievementConditions.champion,
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "100 tests completed",
    emoji: "📊",
    unlocked: false,
    gradient: "from-green-500 to-teal-600",
    condition: achievementConditions.analyst,
  },
  {
    id: "bullseye",
    name: "Bullseye",
    description: "Under 320ms",
    emoji: "🎯",
    unlocked: false,
    gradient: "from-red-500 to-pink-600",
    condition: achievementConditions.bullseye,
  },
];

// Default leaderboard entries
const defaultLeaderboard: LeaderboardEntry[] = [
  {
    id: "user1",
    name: "John Doe",
    initials: "JD",
    bestTime: 325,
    date: new Date(2024, 2, 15),
    isCurrentUser: false,
    avatarGradient: "from-green-500 to-emerald-600",
  },
  {
    id: "user2",
    name: "Mike Lee",
    initials: "ML",
    bestTime: 342,
    date: new Date(2024, 2, 14),
    isCurrentUser: false,
    avatarGradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "current",
    name: "Mr. X",
    initials: "MX",
    bestTime: 356,
    date: new Date(2024, 2, 16),
    isCurrentUser: true,
    avatarGradient: "from-primary to-secondary",
  },
  {
    id: "user3",
    name: "Alex Patel",
    initials: "AP",
    bestTime: 378,
    date: new Date(2024, 2, 13),
    isCurrentUser: false,
    avatarGradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "user4",
    name: "Sarah Rodriguez",
    initials: "SR",
    bestTime: 395,
    date: new Date(2024, 2, 12),
    isCurrentUser: false,
    avatarGradient: "from-amber-500 to-orange-600",
  },
];

const defaultSettings: Settings = {
  darkMode: false,
  sound: true,
  showGhost: true,
  username: "Mr. X",
};

const defaultUser: User = {
  name: "Mr. X",
  initials: "MX",
  testsCompleted: 25,
  rank: 3,
};

const defaultStats: Stats = {
  bestScore: 356,
  bestScoreDate: new Date(2024, 2, 16),
  average: 385,
  testsCompleted: 25,
  todayBest: 356,
  chartPoints: [395, 378, 365, 342, 356],
};

// Generate initial 5 scores
const generateInitialScores = (): Score[] => {
  const baseDate = new Date();
  return [
    { time: 395, date: new Date(baseDate.getTime() - 5 * 60000) },
    { time: 378, date: new Date(baseDate.getTime() - 4 * 60000) },
    { time: 365, date: new Date(baseDate.getTime() - 3 * 60000) },
    { time: 342, date: new Date(baseDate.getTime() - 2 * 60000) },
    { time: 356, date: new Date(baseDate.getTime() - 1 * 60000) },
  ];
};

const GameContext = createContext<GameContextType>({
  user: defaultUser,
  stats: defaultStats,
  scores: [],
  gameState: "resting",
  settings: defaultSettings,
  achievements: defaultAchievements,
  leaderboard: defaultLeaderboard,
  lastReactionTime: null,
  isNewBest: false,
  startTime: null,
  updateSettings: () => {},
  startGame: () => {},
  handleTargetClick: () => {},
  handleTooEarlyClick: () => {},
  resetGameData: () => {},
  generateChallengeCode: () => "",
});

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps): JSX.Element {
  const [user, setUser] = useLocalStorage<User>("user", defaultUser);
  const [scores, setScores] = useLocalStorage<Score[]>("scores", generateInitialScores());
  const [stats, setStats] = useLocalStorage<Stats>("stats", defaultStats);
  const [gameState, setGameState] = useLocalStorage<GameState>("gameState", "resting");
  const [settings, setSettings] = useLocalStorage<Settings>("settings", defaultSettings);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("achievements", defaultAchievements);
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>("leaderboard", defaultLeaderboard);
  const [lastReactionTime, setLastReactionTime] = useLocalStorage<number | null>("lastReactionTime", null);
  const [isNewBest, setIsNewBest] = useLocalStorage<boolean>("isNewBest", false);
  const [startTime, setStartTime] = useLocalStorage<number | null>("startTime", null);
  const [countdownTimer, setCountdownTimer] = useLocalStorage<number | null>("countdownTimer", null);
  const [waitingTimer, setWaitingTimer] = useLocalStorage<number | null>("waitingTimer", null);

  const { playSound } = useSound();
  const { toast } = useToast();

  // Initialize leaderboard with current user if needed
  useEffect(() => {
    if (!leaderboard.some(entry => entry.isCurrentUser)) {
      const userEntry: LeaderboardEntry = {
        id: "current",
        name: settings.username,
        initials: getInitials(settings.username),
        bestTime: stats.bestScore,
        date: stats.bestScoreDate || new Date(),
        isCurrentUser: true,
        avatarGradient: "from-primary to-secondary",
      };
      
      const updatedLeaderboard = [...leaderboard, userEntry].sort((a, b) => a.bestTime - b.bestTime);
      setLeaderboard(updatedLeaderboard);
    }
  }, [leaderboard, settings.username, stats.bestScore, stats.bestScoreDate]);

  // Check for achievements
  useEffect(() => {
    try {
      const updatedAchievements = achievements.map(achievement => {
        if (!achievement.unlocked && 
            achievement.condition && 
            typeof achievement.condition === 'function') {
          try {
            const shouldUnlock = achievement.condition(stats, scores);
            if (shouldUnlock) {
              // Achievement newly unlocked
              toast({
                title: "Achievement Unlocked!",
                description: `${achievement.name}: ${achievement.description}`,
                duration: 5000,
              });
              playSound("achievement");
              
              return {
                ...achievement,
                unlocked: true,
                unlockedAt: new Date(),
              };
            }
          } catch (err) {
            console.error(`Error checking achievement ${achievement.id}:`, err);
          }
        }
        return achievement;
      });
      
      if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
        setAchievements(updatedAchievements);
      }
    } catch (err) {
      console.error("Error processing achievements:", err);
    }
  }, [stats, scores, achievements, toast, playSound]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Update user name if changed
    if (newSettings.username && newSettings.username !== settings.username) {
      const newInitials = getInitials(newSettings.username);
      setUser({ ...user, name: newSettings.username, initials: newInitials });
      
      // Update leaderboard entry
      const updatedLeaderboard = leaderboard.map(entry => {
        if (entry.isCurrentUser) {
          return {
            ...entry,
            name: newSettings.username!,
            initials: newInitials,
          };
        }
        return entry;
      });
      
      setLeaderboard(updatedLeaderboard);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const startGame = () => {
    // Clear any existing timers
    if (countdownTimer) clearTimeout(countdownTimer);
    if (waitingTimer) clearTimeout(waitingTimer);
    
    setGameState("countdown");
    playSound("countdown");
    
    // 3-second countdown
    setCountdownTimer(
      window.setTimeout(() => {
        setGameState("waiting");
        
        // Random delay between 1-5 seconds before showing target
        const delay = Math.floor(Math.random() * 4000) + 1000;
        setWaitingTimer(
          window.setTimeout(() => {
            setGameState("target");
            setStartTime(Date.now());
          }, delay)
        );
      }, 3000)
    );
  };

  const handleTargetClick = () => {
    if (gameState === "target" && startTime) {
      const reactionTime = Date.now() - startTime;
      setLastReactionTime(reactionTime);
      
      // Add to scores
      const newScore = { time: reactionTime, date: new Date() };
      let newScores = [newScore, ...scores].slice(0, 10); // Keep only last 10 scores
      setScores(newScores);
      
      // Calculate new stats
      const allTimes = newScores.map(s => s.time);
      const newAverage = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length);
      
      // Check if this is a new best score
      const newBest = reactionTime < stats.bestScore;
      setIsNewBest(newBest);
      
      // Calculate today's best score
      const today = new Date().setHours(0, 0, 0, 0);
      const todaysScores = newScores.filter(score => {
        // Ensure we're working with a proper Date object
        const scoreDate = new Date(score.date);
        return scoreDate.setHours(0, 0, 0, 0) === today;
      });
      const todayBest = todaysScores.length > 0
        ? Math.min(...todaysScores.map(s => s.time))
        : null;
      
      // Update statistics
      const newStats = {
        ...stats,
        bestScore: newBest ? reactionTime : stats.bestScore,
        bestScoreDate: newBest ? new Date() : stats.bestScoreDate,
        average: newAverage,
        testsCompleted: stats.testsCompleted + 1,
        todayBest,
        chartPoints: allTimes.slice(0, 6).reverse(),
      };
      setStats(newStats);
      
      // Update user
      setUser({
        ...user,
        testsCompleted: stats.testsCompleted + 1,
      });
      
      // Update leaderboard if necessary
      if (newBest) {
        const updatedLeaderboard = leaderboard.map(entry => {
          if (entry.isCurrentUser) {
            return {
              ...entry,
              bestTime: reactionTime,
              date: new Date(),
            };
          }
          return entry;
        }).sort((a, b) => a.bestTime - b.bestTime);
        
        // Find user's new rank
        const newRank = updatedLeaderboard.findIndex(entry => entry.isCurrentUser) + 1;
        setUser({
          ...user,
          testsCompleted: stats.testsCompleted + 1,
          rank: newRank,
        });
        
        setLeaderboard(updatedLeaderboard);
      }
      
      setGameState("result");
      playSound("success");
    }
  };

  const handleTooEarlyClick = () => {
    if (gameState === "waiting") {
      setGameState("tooSoon");
      playSound("error");
      
      toast({
        title: "Too Soon!",
        description: "Wait for the green target to appear.",
        variant: "destructive",
      });
    }
  };

  const resetGameData = () => {
    // Clear all localStorage items
    localStorage.clear();
    
    // Reset all state to defaults
    setUser(defaultUser);
    setScores(generateInitialScores());
    setStats(defaultStats);
    setAchievements(defaultAchievements);
    setLeaderboard(defaultLeaderboard);
    setLastReactionTime(null);
    setIsNewBest(false);
    setGameState("resting");
    setSettings(defaultSettings);
    
    toast({
      title: "Data Reset",
      description: "All game data has been reset to default values.",
    });
  };

  const generateChallengeCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SPEED-';
    
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    code += '-RT';
    return code;
  };

  return (
    <GameContext.Provider
      value={{
        user,
        stats,
        scores,
        gameState,
        settings,
        achievements,
        leaderboard,
        lastReactionTime,
        isNewBest,
        startTime,
        updateSettings,
        startGame,
        handleTargetClick,
        handleTooEarlyClick,
        resetGameData,
        generateChallengeCode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => useContext(GameContext);
