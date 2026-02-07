import React, { PropsWithChildren } from "react";
import { motion } from "framer-motion";

export default function CinematicSection({ children }: PropsWithChildren) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96, y: 60 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // Custom "Cinema" easing
      viewport={{ once: true, margin: "-10%" }} // Triggers when 10% into view
      className="w-full py-10 md:py-20 will-change-transform"
    >
      {children}
    </motion.section>
  );
}