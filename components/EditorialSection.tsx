import React from 'react';
import { motion } from "framer-motion";
import { useSettings } from '../context/SettingsContext';

interface EditorialSectionProps {
  title: string;
  text: string;
  image: string;
}

export default function EditorialSection({ title, text, image }: EditorialSectionProps) {
  const { settings } = useSettings();
  
  // Dynamic text replacement
  const dynamicText = text.includes("GBR Estilos") ? text.replace("GBR Estilos", settings.siteName) : text;

  return (
    <section className="min-h-[80vh] grid md:grid-cols-2 gap-12 items-center px-6 md:px-12 py-20 bg-light-bg dark:bg-dark-bg overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-xl"
      >
        <div className="w-12 h-1 bg-gold mb-8"></div>
        <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-8 text-black dark:text-white leading-tight">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
          {dynamicText}
        </p>
      </motion.div>

      <div className="relative h-[500px] md:h-[700px] w-full">
         <motion.div 
            className="absolute inset-0 bg-gold/10 -translate-x-4 translate-y-4 rounded-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
         />
         <motion.img
            src={image}
            alt="Editorial"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="w-full h-full object-cover rounded-xl shadow-2xl relative z-10"
         />
      </div>
    </section>
  );
}