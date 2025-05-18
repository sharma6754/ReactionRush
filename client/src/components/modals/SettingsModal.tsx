import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetGameData } = useGameState();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSoundEnabled, toggleSound } = useSound();
  const { toast } = useToast();
  
  const [username, setUsername] = useState(settings.username);
  const [showGhost, setShowGhost] = useState(settings.showGhost);
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [sound, setSound] = useState(isSoundEnabled);

  // Update local state when settings change
  useEffect(() => {
    setUsername(settings.username);
    setShowGhost(settings.showGhost);
    setDarkMode(isDarkMode);
    setSound(isSoundEnabled);
  }, [settings, isDarkMode, isSoundEnabled, isOpen]);

  const handleSave = () => {
    // Update settings
    updateSettings({
      username,
      showGhost,
    });
    
    // Update theme if changed
    if (darkMode !== isDarkMode) {
      toggleTheme();
    }
    
    // Update sound if changed
    if (sound !== isSoundEnabled) {
      toggleSound();
    }
    
    toast({
      title: "Settings saved",
      description: "Your settings have been updated.",
    });
    
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all game data? This cannot be undone.")) {
      resetGameData();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-display font-semibold text-lg">Settings</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h4 className="font-semibold mb-3">Profile</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="username" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
            
            {/* Appearance Section */}
            <div>
              <h4 className="font-semibold mb-3">Appearance</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    id="darkModeToggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sound Effects</span>
                  <Switch
                    checked={sound}
                    onCheckedChange={setSound}
                    id="soundToggleSettings"
                  />
                </div>
              </div>
            </div>
            
            {/* Game Settings */}
            <div>
              <h4 className="font-semibold mb-3">Game Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Show Ghost Indicator</span>
                  <Switch
                    checked={showGhost}
                    onCheckedChange={setShowGhost}
                    id="ghostToggle"
                  />
                </div>
              </div>
            </div>
            
            {/* Reset Data */}
            <div>
              <h4 className="font-semibold mb-3">Data Management</h4>
              <Button
                variant="destructive"
                onClick={handleReset}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors text-sm"
              >
                Reset All Game Data
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button
            onClick={handleSave}
            className="py-2 px-6 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
