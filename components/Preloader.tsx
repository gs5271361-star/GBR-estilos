import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../context/SettingsContext";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    // Extended slightly for the full text effect
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.5em", scale: 0.9 }}
            animate={{ opacity: 1, letterSpacing: "0.2em", scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="text-white text-3xl md:text-6xl font-serif font-bold tracking-widest text-center px-4"
          >
            {settings.siteName.toUpperCase()}
          </motion.h1>
          
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "120px", opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="h-[1px] bg-gold mt-8"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
            className="absolute bottom-12 text-gray-600 text-[9px] uppercase tracking-[0.3em]"
          >
            EXPERIENCE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}