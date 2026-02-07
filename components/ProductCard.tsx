import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { Heart } from 'lucide-react';
import { fadeUp, imageHover } from '../lib/animations';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  
  const handleVibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const onFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  if (!product.active) return null;

  return (
    <motion.div 
      variants={fadeUp}
      className="group relative cursor-pointer"
    >
      <Link to={`/product/${product.id}`} onClick={handleVibrate}>
        <motion.div 
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="overflow-hidden relative aspect-[4/5] bg-gray-200"
        >
          <motion.img 
            variants={imageHover}
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-gold hover:text-white transition-colors z-10"
          >
            <Heart size={18} fill={favorite ? "currentColor" : "none"} className={favorite ? "text-red-500" : ""} />
          </motion.button>
        </motion.div>
        
        <div className="pt-6 text-center">
          <h3 className="font-serif text-xl mb-1 text-black dark:text-white group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 tracking-wide font-bold">
            {product.price}
          </p>
          
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex justify-center gap-4 text-xs uppercase tracking-widest text-gray-500">
             <span className="border-b border-black dark:border-white text-black dark:text-white pb-1">
               {t('buyNow')}
             </span>
             {product.stock < 5 && (
               <span className="text-red-500 font-bold">Últimas Unidades</span>
             )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}