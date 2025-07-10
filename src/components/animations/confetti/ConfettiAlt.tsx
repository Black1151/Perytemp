"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiAltProps {
  show: boolean;
  colors?: string[];
}

const ConfettiAlt: React.FC<ConfettiAltProps> = ({ show, colors }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particles = useRef<any[]>([]).current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiColors = colors && colors.length > 0 ? colors : [
      "#FF3CAC",
      "#FFB800",
      "#00F5FF",
      "#8AFF00",
      "#FFD700",
      "#FF5F6D",
    ];
    const leftOrigin = { x: 0, y: canvas.height - 10 };
    const rightOrigin = { x: canvas.width, y: canvas.height - 10 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;

      constructor(
        origin: { x: number; y: number },
        angleDeg: number,
        speed: number
      ) {
        const angleRad = (angleDeg * Math.PI) / 180;
        this.x = origin.x;
        this.y = origin.y;
        this.vx = Math.cos(angleRad) * speed;
        this.vy = Math.sin(angleRad) * -speed; // -Y is up
        this.size = Math.random() * 4 + 3;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.opacity -= 0.01;
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
      const totalParticles = 75;

      // Left burst: 15° to 65° (up and to the right)
      for (let i = 0; i < totalParticles; i++) {
        const angle = Math.random() * 60 + 30; 
        const speed = Math.random() * 4 + 6;
        particles.push(new Particle(leftOrigin, angle, speed));
      }

      // Right burst: 115° to 165° (up and to the left — mirrored)
      for (let i = 0; i < totalParticles; i++) {
        const angle = Math.random() * 60 + 85; // 115–165°
        const speed = Math.random() * 4 + 6;
        particles.push(new Particle(rightOrigin, angle, speed));
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
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
        particles.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 10000);

      return () => {
        clearTimeout(timeout);
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [show]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default ConfettiAlt;
