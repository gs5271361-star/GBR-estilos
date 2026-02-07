import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Truck, CreditCard, ShieldCheck, Minus, Plus, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { fadeUp, buttonClick } from '../lib/animations';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await api.products.getById(Number(id));
          setProduct(data || null);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-32 flex items-center justify-center">Carregando...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-black dark:text-white">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link to="/" className="text-gold hover:underline">{t('backToHome')}</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    setIsAdded(true);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-light-bg dark:bg-dark-bg text-black dark:text-white">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-xs uppercase tracking-widest hover:text-gold transition-colors">
          <ArrowLeft size={16} /> {t('backToHome')}
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-[4/5] bg-gray-200 overflow-hidden relative shadow-lg"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Details Section */}
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
            <p className="text-3xl text-gold mb-8 font-light">{product.price}</p>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* Quantity Selector - Luxury Style with Animation */}
            <div className="mb-8">
                <span className="block text-xs uppercase tracking-widest text-gray-500 mb-3">{t('quantity')}</span>
                <div className="inline-flex items-center gap-6 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-full">
                    <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <Minus size={18} />
                    </button>
                    
                    <div className="w-8 text-center relative h-6 overflow-hidden">
                       <AnimatePresence mode="wait">
                        <motion.span
                          key={qty}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="font-serif text-xl font-bold absolute inset-0"
                        >
                          {qty}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    <button 
                        onClick={() => setQty(q => q + 1)}
                        className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
            
            <div className="mb-10 space-y-4">
              <motion.button 
                variants={buttonClick}
                whileHover="hover"
                whileTap="tap"
                onClick={handleAddToCart}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 uppercase text-sm tracking-[0.2em] hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors shadow-xl hover:shadow-gold/20"
              >
                {t('addToCart')}
              </motion.button>

              <AnimatePresence>
                {isAdded && (
                  <motion.button
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    variants={buttonClick}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-green-600 text-white py-5 uppercase text-sm tracking-[0.2em] hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <ShoppingBag size={18} />
                    {t('checkout')}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Trust Badges / Info */}
            <div className="grid grid-cols-1 gap-6 border-t border-gray-200 dark:border-gray-800 pt-8">
                <div className="flex items-start gap-4">
                    <Truck className="text-gold mt-1" size={24} />
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('shipping')}</h4>
                        <p className="text-sm text-gray-500">{t('shippingTime')}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <CreditCard className="text-gold mt-1" size={24} />
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('paymentMethods')}</h4>
                        <p className="text-sm text-gray-500">{t('paymentMethodsList')}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <ShieldCheck className="text-gold mt-1" size={24} />
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('secure')}</h4>
                        <p className="text-sm text-gray-500">SSL Encrypted / Safe Data</p>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}