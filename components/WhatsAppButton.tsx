import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const defaultMessage = "Olá, estou visitando a GBR Estilos e gostaria de atendimento exclusivo.";

  const handleClick = () => {
    // Ensure we clean the number string for the URL
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-shadow duration-300 flex items-center justify-center"
      title="Falar com Personal Shopper"
    >
      <MessageCircle size={32} fill="white" className="text-white" />
    </motion.button>
  );
}