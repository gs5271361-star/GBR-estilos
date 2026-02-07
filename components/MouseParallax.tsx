import React from 'react';
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface MouseParallaxProps {
    children: React.ReactNode;
    intensity?: number;
    className?: string;
}

export default function MouseParallax({ children, intensity = 20, className = "" }: MouseParallaxProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        const normalizedX = (e.clientX / window.innerWidth) - 0.5;
        const normalizedY = (e.clientY / window.innerHeight) - 0.5;
        x.set(normalizedX * intensity);
        y.set(normalizedY * intensity);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensity, x, y]);

  return (
    <motion.div style={{ x: springX, y: springY }} className={className}>
      {children}
    </motion.div>
  );
}