import { useEffect, useState } from "react";

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  color: string;
}

const colors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-green-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // Position between 0-100% of container width
        y: Math.random() * 20 + 80, // Start near the bottom (80-100% of container height)
        size: Math.random() * 1 + 0.5, // Size between 0.5-1.5rem
        rotate: Math.random() * 360, // Random rotation
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      
      setPieces(newPieces);
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setPieces([]);
        if (onComplete) onComplete();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (pieces.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute ${piece.color} animate-confetti`}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}rem`,
            height: `${piece.size * 1.5}rem`,
            transform: `rotate(${piece.rotate}deg)`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
