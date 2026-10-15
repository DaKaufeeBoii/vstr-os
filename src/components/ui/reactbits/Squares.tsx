"use client";

import React, { useRef, useEffect } from "react";

interface SquaresProps {
  direction?: "up" | "down" | "left" | "right" | "diagonal";
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

export default function Squares({
  direction = "right",
  speed = 0.5,
  borderColor = "rgba(255, 255, 255, 0.05)",
  squareSize = 48,
  hoverFillColor = "rgba(255, 255, 255, 0.08)",
  className = "",
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredSquareRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const gridOffset = { x: 0, y: 0 };

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const col = Math.floor((mouseX - (gridOffset.x % squareSize)) / squareSize);
      const row = Math.floor((mouseY - (gridOffset.y % squareSize)) / squareSize);

      hoveredSquareRef.current = { x: col, y: row };
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Move grid offset
      switch (direction) {
        case "right":
          gridOffset.x = (gridOffset.x + speed) % squareSize;
          break;
        case "left":
          gridOffset.x = (gridOffset.x - speed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.y = (gridOffset.y - speed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.y = (gridOffset.y + speed) % squareSize;
          break;
        case "diagonal":
          gridOffset.x = (gridOffset.x + speed) % squareSize;
          gridOffset.y = (gridOffset.y + speed) % squareSize;
          break;
      }

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      const startX = Math.floor(gridOffset.x % squareSize) - squareSize;
      const startY = Math.floor(gridOffset.y % squareSize) - squareSize;

      // Draw squares
      for (let x = startX; x < width + squareSize; x += squareSize) {
        for (let y = startY; y < height + squareSize; y += squareSize) {
          const col = Math.floor((x - (gridOffset.x % squareSize)) / squareSize);
          const row = Math.floor((y - (gridOffset.y % squareSize)) / squareSize);

          if (
            hoveredSquareRef.current &&
            hoveredSquareRef.current.x === col &&
            hoveredSquareRef.current.y === row
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
          }

          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
