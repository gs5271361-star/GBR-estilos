import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth springs for "magnetic" lag feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setActive(true);
    const handleMouseLeave = () => setActive(false);

    // Attach listeners to interactive elements
    const addListeners = () => {
        const elements = document.querySelectorAll("a, button, input, textarea, select, .cursor-pointer");
        elements.forEach(el => {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        });
        return elements;
    };

    window.addEventListener("mousemove", moveCursor);
    const elements = addListeners();

    const observer = new MutationObserver(() => {
        addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
        window.removeEventListener("mousemove", moveCursor);
        elements.forEach(el => {
            el.removeEventListener("mouseenter", handleMouseEnter);
            el.removeEventListener("mouseleave", handleMouseLeave);
        });
        observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  // Hide on touch
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null;

  return (
    <>
      {/* Main Large Circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold dark:border-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: active ? 2.5 : 1,
          opacity: isVisible ? 1 : 0,
          backgroundColor: active ? "rgba(212, 175, 55, 0.1)" : "rgba(0,0,0,0)"
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Center Dot (No Spring for instant feedback) */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-gold dark:bg-white rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
      />
    </>
  );
}