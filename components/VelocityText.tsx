import React, { PropsWithChildren } from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollVelocity } from "../hooks/useScrollVelocity";

export default function VelocityText({ children }: PropsWithChildren) {
  const velocity = useScrollVelocity();
  
  const absVelocity = useTransform(velocity, (latest) => Math.abs(latest));
  
  // Increase letter spacing as user scrolls faster
  const letterSpacing = useTransform(absVelocity, [0, 1000], ["0em", "0.1em"]);
  
  // Slight skew for dynamic motion feel
  const skewX = useTransform(velocity, [-1000, 1000], [-10, 10]);
  
  const opacity = useTransform(absVelocity, [0, 800], [1, 0.7]);

  return (
    <div className="overflow-hidden py-4">
      <motion.h2
        style={{ letterSpacing, skewX, opacity }}
        className="text-5xl md:text-8xl font-serif font-bold text-center text-black dark:text-white uppercase tracking-tighter"
      >
        {children}
      </motion.h2>
    </div>
  );
}