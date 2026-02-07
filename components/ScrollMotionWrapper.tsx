import React, { PropsWithChildren } from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollVelocity } from "../hooks/useScrollVelocity";

export default function ScrollMotionWrapper({ children }: PropsWithChildren) {
  const velocity = useScrollVelocity();
  
  // Create a slight skew effect based on velocity direction and magnitude
  const skewY = useTransform(velocity, [-1000, 0, 1000], [2, 0, -2]);
  
  // Slight opacity dip on very fast scrolls to reduce visual noise
  const absVelocity = useTransform(velocity, (latest) => Math.abs(latest));
  const opacity = useTransform(absVelocity, [0, 1000], [1, 0.9]);

  return (
    <motion.div style={{ skewY, opacity }} className="w-full will-change-transform">
      {children}
    </motion.div>
  );
}