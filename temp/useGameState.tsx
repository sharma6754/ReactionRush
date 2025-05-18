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
  GameContext,
} from "@/types";

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Under 200ms",
    emoji: "⚡",
    unlocked: false,
    gradient: "from-blue-500 to-indigo-600",
    condition: (stats, scores) => scores.some(score => score.time < 200),
  },
  {
    id: "consistent",
    name: "Consistent",
    description: "5 tests in a row",
    emoji: "🔄",
    unlocked: false,
    gradient: "from-pink-500 to-purple-600",
    condition: (stats) => stats.testsCompleted >= 5,
  },
  {
    id: "champion",
    name: "Champion",
    description: "Top leaderboard",
    emoji: "🥇",
    unlocked: false,
    gradient: "from-amber-500 to-orange-600",
    condition: (stats, scores) => scores.some(score => score.time < 180),
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "100 tests completed",
    emoji: "📊",
    unlocked: false,
    gradient: "from-green-500 to-teal-600",
    condition: (stats) => stats.testsCompleted >= 100,
  },
  {
    id: "bullseye",
    name: "Bullseye",
    description: "Under 150ms",
    emoji: "🎯",
    unlocked: false,
    gradient: "from-red-500 to-pink-600",
    condition: (stats, scores) => scores.some(score => score.time < 150),
  },
];

// Default leaderboard entries
const defaultLeaderboard: LeaderboardEntry[] = [
  {
    id: "user1",
    name: "Jane Smith",
    initials: "JS",
    bestTime: 172,
    date: new Date(2023, 6, 24),
    isCurrentUser: false,
    avatarGradient: "from-green-500 to-emerald-600",
  },
  {
    id: "user2",
    name: "Mike Lee",
    initials: "ML",
    bestTime: 183,
    date: new Date(2023, 6, 26),
    isCurrentUser: false,
    avatarGradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "current",
    name: "John Doe",
    initials: "JD",
    bestTime: 189,
    date: new Date(2023, 6, 25),
    isCurrentUser: true,
    avatarGradient: "from-primary to-secondary",
  },
  {
    id: "user3",
    name: "Alex Patel",
    initials: "AP",
    bestTime: 195,
    date: new Date(2023, 6, 22),
    isCurrentUser: false,
    avatarGradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "user4",
    name: "Sarah Rodriguez",
    initials: "SR",
    bestTime: 201,
    date: new Date(2023, 6, 20),
    isCurrentUser: false,
    avatarGradient: "from-amber-500 to-orange-600",
  },
];

const defaultSettings: Settings = {
  darkMode: false,
  sound: true,
  showGhost: true,
  username: "John Doe",
};

const defaultUser: User = {
  name: "John Doe",
  initials: "JD",
  testsCompleted: 20,
  rank: 3,
};

const defaultStats: Stats = {
  bestScore: 189,
  bestScoreDate: new Date(2023, 6, 25),
  average: 246,
  testsCompleted: 20,
  todayBest: 203,
  chartPoints: [247, 203, 226, 210, 189],
};

// Generate initial 5 scores
const generateInitialScores = (): Score[] => {
  const today = new Date();
  return [
    { time: 247, date: new Date(today.setMinutes(today.getMinutes() - 5)) },
    { time: 203, date: new Date(today.setMinutes(today.getMinutes() - 2)) },
    { time: 226, date: new Date(today.setMinutes(today.getMinutes() - 3)) },
    { time: 210, date: new Date(today.setMinutes(today.getMinutes() - 4)) },
    { time: 189, date: new Date(2023, 6, 25) },
  ];
};

const GameContext = createContext<GameContext>({
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

export const GameProvider = ({ children }: { children: ReactNode }) => {
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
  }, []);

  // Check for achievements
  useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.unlocked && achievement.condition(stats, scores)) {
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
      return achievement;
    });
    
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
      setAchievements(updatedAchievements);
    }
  }, [stats, scores]);

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
      const todaysScores = newScores.filter(
        score => score.date.setHours(0, 0, 0, 0) === today
      );
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
    setUser(defaultUser);
    setScores(generateInitialScores());
    setStats(defaultStats);
    setAchievements(defaultAchievements);
    setLeaderboard(defaultLeaderboard);
    setLastReactionTime(null);
    setIsNewBest(false);
    
    toast({
      title: "Data Reset",
      description: "All game data has been reset.",
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
