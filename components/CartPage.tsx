import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-light-bg dark:bg-dark-bg text-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-12 text-center">{t('myCart')}</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg mb-6 text-gray-500">{t('emptyCart')}</p>
            <Link to="/" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-gold transition-colors">
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <motion.div 
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <div className="w-24 h-32 bg-gray-200 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="font-serif text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.price}</p>
                  </div>

                  {/* Quantity Control in Cart with Animation */}
                  <div className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-black dark:hover:text-white"
                    >
                        <Minus size={16} />
                    </button>
                    
                     <div className="w-6 text-center relative h-5 overflow-hidden">
                       <AnimatePresence mode="wait">
                        <motion.span
                          key={item.quantity}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="font-medium absolute inset-0"
                        >
                          {item.quantity}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-black dark:hover:text-white"
                    >
                        <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                      <p className="font-bold text-gold">
                          R$ {(parseFloat(item.price.replace('R$', '').replace('.', '').replace(',', '.').trim()) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title={t('remove')}
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col items-end">
              <div className="flex justify-between w-full max-w-sm mb-8 text-xl font-serif border-b border-gray-100 dark:border-gray-800 pb-4">
                <span>{t('total')}</span>
                <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <Link 
                to="/checkout"
                className="w-full max-w-sm text-center bg-black dark:bg-white text-white dark:text-black py-4 uppercase text-xs tracking-widest hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors"
              >
                {t('checkout')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}