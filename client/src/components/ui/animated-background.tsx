import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      glowColor: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        
        if (isDarkMode) {
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`;
          this.glowColor = 'rgba(255, 255, 255, 0.2)';
        } else {
          // Use purple and blue colors for light mode
          const colors = [
            `rgba(147, 51, 234, ${Math.random() * 0.4 + 0.2})`,
            `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.2})`,
          ];
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.glowColor = this.color.replace('0.6', '0.2');
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        
        // Draw glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.glowColor;
        
        // Draw particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 35;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)'
          : 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'
      }}
    />
  );
} 