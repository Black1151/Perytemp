"use client";

import React, { useEffect, useRef } from "react";

interface MiniConfettiProps {
  show: boolean;
  position: { x: number; y: number };
}

const MiniConfetti: React.FC<MiniConfettiProps> = ({ show, position }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particles = useRef<any[]>([]).current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to a small area around the FAB
    canvas.width = 200;
    canvas.height = 200;

    const colors = [
      "#FF3CAC",
      "#FFB800",
      "#00F5FF",
      "#8AFF00",
      "#FFD700",
      "#FF5F6D",
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;

      constructor(origin: { x: number; y: number }, angleDeg: number, speed: number) {
        const angleRad = (angleDeg * Math.PI) / 180;
        this.x = origin.x;
        this.y = origin.y;
        this.vx = Math.cos(angleRad) * speed;
        this.vy = Math.sin(angleRad) * -speed;
        this.size = Math.random() * 2 + 1; // Smaller particles
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // Slightly faster gravity
        this.opacity -= 0.02; // Faster fade
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.opacity <= 0) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const spawnParticles = () => {
      const totalParticles = 20; // Fewer particles
      const origin = { x: canvas.width / 2, y: canvas.height }; // Start from bottom center

      // Create particles shooting upward
      for (let i = 0; i < totalParticles; i++) {
        const angle = 270 + (Math.random() * 60 - 30); // Angle between 240-300 degrees (straight up with slight spread)
        const speed = Math.random() + 3; // Faster upward speed
        particles.push(new Particle(origin, angle, speed));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update());
      particles.forEach((p) => p.draw(ctx));
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].opacity <= 0) {
          particles.splice(i, 1);
        }
      }
      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (show) {
      particles.length = 0;
      spawnParticles();
      animate();

      const timeout = setTimeout(() => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        particles.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 2000); // Shorter duration

      return () => {
        clearTimeout(timeout);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [show]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: position.y - 200, // Position above the button
        left: position.x - 100,
        width: "200px",
        height: "200px",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
};

export default MiniConfetti; 