import React from 'react';
import { motion } from "framer-motion";
import { useSettings } from '../context/SettingsContext';
import { fadeUp } from '../lib/animations';

interface StorySectionProps {
  title: string;
  text: string;
}

export default function StorySection({ title, text }: StorySectionProps) {
  const { settings } = useSettings();
  
  // If the text prop contains the default hardcoded string, replace it dynamically
  const dynamicText = text.includes("GBR Estilos") ? text.replace("GBR Estilos", settings.siteName) : text;

  return (
    <section className="py-32 px-6 md:px-12 bg-light-bg dark:bg-dark-bg text-center overflow-hidden">
      <motion.div 
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-8 text-black dark:text-white">
          {title}
        </h2>
        <div className="w-24 h-[1px] bg-gold mx-auto mb-8"></div>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
          {dynamicText}
        </p>
      </motion.div>
    </section>
  );
}