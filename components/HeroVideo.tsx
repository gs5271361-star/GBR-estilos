import React from 'react';
import { motion } from 'framer-motion';
import { HERO_VIDEO_URL } from '../constants';
import { useSettings } from '../context/SettingsContext';

export default function HeroVideo() {
  const { settings } = useSettings();
  
  // Note: Logo has been removed from Hero to keep it clean. 
  // Branding relies on the Navbar and the large Typography below.

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-black">
         <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-60"
          >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
        {/* Typography Only - Editorial Style */}
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-serif text-white mb-4 tracking-tight"
        >
          {settings.siteName.toUpperCase()}
        </motion.h1>
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm md:text-base text-gray-200 uppercase tracking-[0.3em]"
        >
          Redefinindo a elegância para a era moderna
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-xs tracking-widest animate-bounce"
      >
        ROLE PARA EXPLORAR
      </motion.div>
    </section>
  );
}