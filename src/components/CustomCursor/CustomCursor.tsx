// src/components/CustomCursor.tsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const moveCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      rafId = requestAnimationFrame(moveCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      const isInteractive =
        target?.tagName === "A" ||
        target?.tagName === "BUTTON" ||
        target?.closest('[role="button"]') ||
        target?.closest('[role="link"]') ||
        target?.closest('input[type="submit"]') ||
        target?.closest('input[type="button"]') ||
        target?.closest('[data-interactive="true"]');

      setIsHovered(!!isInteractive);
    };

    document.addEventListener("mousemove", handleMouseMove);
    moveCursor(); // start RAF loop

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      data-testid="custom-cursor"
      className={`${styles.customCursor} ${isHovered ? styles.hovered : ""}`}
    />
  );
};

export default CustomCursor;
