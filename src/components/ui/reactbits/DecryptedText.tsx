"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "mount" | "hover";
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  characters = DEFAULT_CHARS,
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "mount",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isScramblingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(text);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    isScramblingRef.current = true;

    let iteration = 0;
    const textLength = text.length;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";

            let revealCondition = false;
            if (sequential) {
              if (revealDirection === "start") {
                revealCondition = index < iteration;
              } else if (revealDirection === "end") {
                revealCondition = index >= textLength - iteration;
              } else {
                // center outward
                const mid = Math.floor(textLength / 2);
                revealCondition = Math.abs(index - mid) <= iteration;
              }
            } else {
              revealCondition = iteration >= maxIterations;
            }

            if (revealCondition) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");
      });

      iteration += 1;

      if (iteration > (sequential ? textLength + 2 : maxIterations)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isScramblingRef.current = false;
        setDisplayText(text);
      }
    }, speed);
  }, [text, speed, maxIterations, sequential, revealDirection, characters]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (animateOn === "mount") {
      timer = setTimeout(() => {
        scramble();
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateOn, scramble]);

  const handleMouseEnter = () => {
    if (animateOn === "hover" && !isScramblingRef.current) {
      setIsHovered(true);
      scramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span
      className={parentClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      <span className={isHovered ? encryptedClassName || className : className}>
        {displayText}
      </span>
    </span>
  );
}
