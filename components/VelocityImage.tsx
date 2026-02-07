import React from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollVelocity } from "../hooks/useScrollVelocity";

interface VelocityImageProps {
  src: string;
  alt?: string;
}

export default function VelocityImage({ src, alt = "Luxury Image" }: VelocityImageProps) {
  const velocity = useScrollVelocity();
  
  // Parallax y-offset
  const y = useTransform(velocity, [-1000, 1000], [-50, 50]);
  
  // Scale effect on movement
  const absVelocity = useTransform(velocity, (latest) => Math.abs(latest));
  const scale = useTransform(absVelocity, [0, 1000], [1, 1.05]);

  return (
    <div className="w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl my-12 relative group">
      <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-black/0 transition-colors duration-500" />
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-[120%] -mt-[10%] object-cover"
      />
    </div>
  );
}