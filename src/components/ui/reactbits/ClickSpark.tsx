"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  speed: number;
  startTime: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function ClickSpark({
  sparkColor = "#ffffff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  children,
  className = "",
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = !children ? window.innerWidth : (canvas.parentElement?.getBoundingClientRect().width || window.innerWidth);
      const height = !children ? window.innerHeight : (canvas.parentElement?.getBoundingClientRect().height || window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [children]);

  const createSparks = useCallback(
    (x: number, y: number) => {
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const now = performance.now();
      const newSparks: Spark[] = [];

      for (let i = 0; i < sparkCount; i++) {
        const angle = (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.4;
        newSparks.push({
          x,
          y,
          angle,
          speed: sparkRadius / (duration / 16.6),
          startTime: now,
        });
      }

      sparksRef.current.push(...newSparks);
    },
    [sparkCount, sparkRadius, duration]
  );

  useEffect(() => {
    if (!children) {
      const handleGlobalMouseDown = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        createSparks(e.clientX - rect.left, e.clientY - rect.top);
      };
      window.addEventListener("mousedown", handleGlobalMouseDown, { passive: true });
      return () => window.removeEventListener("mousedown", handleGlobalMouseDown);
    }
  }, [children, createSparks]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    createSparks(e.clientX - rect.left, e.clientY - rect.top);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const currentDistance = progress * sparkRadius;
        const opacity = 1 - progress;

        const currentX = spark.x + Math.cos(spark.angle) * currentDistance;
        const currentY = spark.y + Math.sin(spark.angle) * currentDistance;

        const lineLength = sparkSize * (1 - progress);
        const endX = currentX + Math.cos(spark.angle) * lineLength;
        const endY = currentY + Math.sin(spark.angle) * lineLength;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = sparkColor;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1.5;
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [duration, sparkColor, sparkRadius, sparkSize]);

  if (!children) {
    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={className}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {children}
    </div>
  );
}
