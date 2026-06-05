"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useOS } from "@/store/windowStore";

export default function FlappyGameApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>(0);

  // Game state refs (to avoid dependency cycles in requestAnimationFrame)
  const state = useRef({
    birdY: 200,
    birdVelocity: 0,
    pipes: [] as { x: number; topHeight: number; passed?: boolean }[],
    score: 0,
    frames: 0,
    gameSpeed: 7,
    gravity: 0.6,
    jump: -11,
  });

  const BIRD_SIZE = 24;
  const PIPE_WIDTH = 50;
  const PIPE_GAP = 140;

  const resetGame = () => {
    state.current = {
      birdY: 200,
      birdVelocity: 0,
      pipes: [],
      score: 0,
      frames: 0,
      gameSpeed: 3,
      gravity: 0.6,
      jump: -8,
    };
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  };

  const jump = useCallback(() => {
    if (gameOver) {
      resetGame();
    } else if (!playing) {
      setPlaying(true);
      state.current.birdVelocity = state.current.jump;
    } else {
      state.current.birdVelocity = state.current.jump;
    }
  }, [gameOver, playing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const update = () => {
      if (!playing || gameOver) return;

      const s = state.current;
      s.frames++;

      // Bird physics
      s.birdVelocity += s.gravity;
      s.birdY += s.birdVelocity;

      // Pipe generation
      if (s.frames % 90 === 0) {
        const minPipeHeight = 50;
        const maxPipeHeight = canvas.height - PIPE_GAP - minPipeHeight;
        const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1) + minPipeHeight);
        s.pipes.push({ x: canvas.width, topHeight, passed: false });
      }

      // Pipe update & collision
      for (let i = 0; i < s.pipes.length; i++) {
        const p = s.pipes[i];
        p.x -= s.gameSpeed;

        // Collision detection
        const birdLeft = 50;
        const birdRight = 50 + BIRD_SIZE;
        const birdTop = s.birdY;
        const birdBottom = s.birdY + BIRD_SIZE;

        const hitTopPipe = birdRight > p.x && birdLeft < p.x + PIPE_WIDTH && birdTop < p.topHeight;
        const hitBottomPipe = birdRight > p.x && birdLeft < p.x + PIPE_WIDTH && birdBottom > p.topHeight + PIPE_GAP;

        if (hitTopPipe || hitBottomPipe || birdBottom >= canvas.height || birdTop <= 0) {
          setGameOver(true);
          return;
        }

        // Score
        if (p.x < 50 && !p.passed) {
          p.passed = true;
          s.score++;
          setScore(s.score);
        }
      }

      // Remove off-screen pipes
      if (s.pipes.length > 0 && s.pipes[0].x < -PIPE_WIDTH) {
        s.pipes.shift();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const s = state.current;

      // Draw background
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pipes
      ctx.fillStyle = "#10b981"; // var(--os-green)
      s.pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
        ctx.fillRect(p.x, p.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - p.topHeight - PIPE_GAP);
      });

      // Draw bird
      ctx.fillStyle = "#00d4ff"; // var(--os-cyan)
      ctx.fillRect(50, s.birdY, BIRD_SIZE, BIRD_SIZE);
    };

    let lastTime = performance.now();
    const fps = 60;
    const interval = 1000 / fps;

    const loop = (currentTime: number) => {
      requestRef.current = requestAnimationFrame(loop);
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= interval) {
        lastTime = currentTime - (deltaTime % interval);
        update();
        draw();
      }
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestRef.current);
  }, [playing, gameOver]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        color: "white",
        fontFamily: "var(--font-mono)",
      }}
      onClick={jump}
    >
      <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", width: 360 }}>
        <span>Score: {score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={360}
        height={400}
        style={{
          border: "2px solid var(--os-border)",
          borderRadius: 8,
          background: "#0d1117",
          cursor: "pointer",
        }}
      />
      {!playing && !gameOver && (
        <div style={{ position: "absolute", top: "50%", pointerEvents: "none", background: "rgba(0,0,0,0.7)", padding: "10px 20px", borderRadius: 8 }}>
          Click or Space to Start
        </div>
      )}
      {gameOver && (
        <div style={{ position: "absolute", top: "50%", pointerEvents: "none", textAlign: "center", background: "rgba(0,0,0,0.8)", padding: "20px", borderRadius: 8, border: "1px solid var(--os-red)" }}>
          <div style={{ fontSize: 24, color: "var(--os-red)", marginBottom: 10 }}>GAME OVER</div>
          <div>Score: {score}</div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>Click to Restart</div>
        </div>
      )}
    </div>
  );
}
