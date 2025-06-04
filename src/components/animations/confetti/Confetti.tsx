"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  show: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const confettiParticles = useRef<any[]>([]).current; // store particles in a ref to persist between renders

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize the canvas to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["primary", "secondary", "#000000", "#FFFFFF"];

    class ConfettiParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      opacity: number;
      constructor() {
        const canvasWidth = canvas ? canvas.width : 0;
        const canvasHeight = canvas ? canvas.height : 0;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight - canvasHeight;
        this.size = Math.random() * 8 + 2;
        this.speed = Math.random() * 3 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      animationFrameIdRef.current = requestAnimationFrame(animateConfetti);
    };

    // Start/stop confetti based on `show`
    if (show) {
      // Populate confetti if it's empty
      if (confettiParticles.length === 0) {
        for (let i = 0; i < 200; i++) {
          confettiParticles.push(new ConfettiParticle());
        }
      }
      animateConfetti();
    } else {
      // Clear out particles and stop animation
      confettiParticles.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }

    // Cleanup on unmount or when `show` toggles
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [show, confettiParticles]);

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

export default Confetti;
