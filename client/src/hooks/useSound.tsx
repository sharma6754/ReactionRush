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

interface SoundProviderProps {
  children: ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps): JSX.Element {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>("soundEnabled", true);

  // Use a simple beep function instead of external audio files
  const createBeep = (freq: number, duration: number, volume: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = volume;
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, duration);
      
      return true;
    } catch (err) {
      console.error("Error playing sound:", err);
      return false;
    }
  };

  // Simplified sound effects
  const sounds = {
    click: () => createBeep(800, 100, 0.2),
    countdown: () => createBeep(500, 100, 0.2),
    success: () => createBeep(1200, 300, 0.2),
    error: () => createBeep(300, 300, 0.2),
    achievement: () => {
      createBeep(600, 100, 0.2);
      setTimeout(() => createBeep(900, 200, 0.2), 150);
    },
  };

  const playSound = (soundType: SoundType) => {
    if (isSoundEnabled) {
      const soundFunction = sounds[soundType];
      if (soundFunction) {
        soundFunction();
      }
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
