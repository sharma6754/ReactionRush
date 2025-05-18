import { useEffect, useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import Confetti from "@/components/ui/confetti";
import { useSound } from "@/hooks/useSound";
import ShareResultModal from "@/components/modals/ShareResultModal";

export default function GameArea() {
  const { 
    gameState, 
    startGame, 
    handleTargetClick, 
    handleTooEarlyClick,
    lastReactionTime,
    isNewBest,
    settings
  } = useGameState();
  
  const { playSound } = useSound();
  const [countdown, setCountdown] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Handle countdown timer
  useEffect(() => {
    if (gameState === "countdown") {
      setCountdown(3);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          playSound("countdown");
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState, playSound]);

  // Show confetti on new best score
  useEffect(() => {
    if (gameState === "result" && isNewBest) {
      setShowConfetti(true);
    }
  }, [gameState, isNewBest]);

  // Handle clicks on the game area
  const handleGameAreaClick = () => {
    if (gameState === "waiting") {
      handleTooEarlyClick();
    }
  };

  // Render the ghost indicator - this shows a visual marker of your previous best reaction time
  // to help you compare and try to beat it during the current attempt
  const renderGhostIndicator = () => {
    if (settings.showGhost && gameState === "waiting") {
      return (
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-secondary opacity-50 w-1"
            style={{ left: "30%" }}
            title="Your previous best reaction time"
          ></div>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      className="w-full max-w-2xl mb-6 aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden"
      onClick={handleGameAreaClick}
    >
      {/* Resting State */}
      {gameState === "resting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-display font-bold mb-4">Test Your Reaction Speed</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center px-4">
            Wait for the green circle, then click as fast as you can!
          </p>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              startGame();
            }}
            className="py-3 px-8 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Start Test
          </Button>
        </div>
      )}

      {/* Countdown State */}
      {gameState === "countdown" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl md:text-8xl font-mono font-bold">
            {countdown}
          </div>
        </div>
      )}

      {/* Waiting State */}
      {gameState === "waiting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-semibold mb-2">Get Ready!</p>
          <p className="text-gray-500 dark:text-gray-400">Wait for the green target...</p>
        </div>
      )}

      {/* Target State */}
      {gameState === "target" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-green-500 hover:bg-green-600 transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg animate-pulse"
            onClick={(e) => {
              e.stopPropagation();
              handleTargetClick();
            }}
            aria-label="Click me!"
          ></button>
        </div>
      )}

      {/* Result State */}
      {gameState === "result" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-2xl font-display font-bold mb-2">Your time:</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold mb-4">
            {lastReactionTime} ms
          </p>
          <div className="flex space-x-3">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="py-2 px-6 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="py-2 px-6 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-300 dark:border-gray-600"
            >
              Share Result
            </Button>
          </div>
        </div>
      )}

      {/* Too Soon State */}
      {gameState === "tooSoon" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-2xl font-display font-bold text-error mb-2">Too Soon!</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            Wait for the green target to appear before clicking.
          </p>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              startGame();
            }}
            className="py-2 px-6 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Ghost Indicator */}
      {renderGhostIndicator()}
      
      {/* Confetti for new record */}
      <Confetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Share Result Modal */}
      <ShareResultModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </section>
  );
}
