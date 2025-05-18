import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundType: SoundType) => void;
}

type SoundType = "click" | "countdown" | "success" | "error" | "achievement";

const SoundContext = createContext<SoundContextType>({
  isSoundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>("soundEnabled", true);

  const sounds = {
    click: new Audio("https://assets.codepen.io/350/pop.mp3"),
    countdown: new Audio("https://assets.codepen.io/350/blip.mp3"),
    success: new Audio("https://assets.codepen.io/350/success.mp3"),
    error: new Audio("https://assets.codepen.io/350/error.mp3"),
    achievement: new Audio("https://assets.codepen.io/350/achievement.mp3"),
  };

  const playSound = (soundType: SoundType) => {
    if (isSoundEnabled) {
      const sound = sounds[soundType];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.error("Error playing sound:", err));
      }
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <SoundContext.Provider
      value={{ isSoundEnabled, toggleSound, playSound }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
