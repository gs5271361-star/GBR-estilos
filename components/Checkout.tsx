import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, User, ArrowLeft, ShoppingBag, Lock, ShieldCheck, MessageCircle, Home, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import { PaymentMethod } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { cart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    whatsapp: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const finalizarCompra = async () => {
    setLoading(true);
    try {
      await api.orders.create({
        userId: user?.id || 0,
        customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.whatsapp,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            }
        },
        items: cart,
        total: total,
        paymentMethod: paymentMethod
      });
      
      clearCart();
      setIsSuccess(true);
    } catch (error) {
      alert("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
      const waMessage = `Olá! Acabei de fazer o pedido (Total: R$ ${total.toLocaleString('pt-BR')}) e gostaria de confirmar o envio.`;
      const cleanNumber = settings.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-light-bg dark:bg-dark-bg px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-[#111] p-12 text-center shadow-2xl border border-gray-100 dark:border-gray-800 rounded-xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>
          
          <h2 className="text-4xl font-serif mb-4 text-black dark:text-white">Compra Concluída 🎉</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            A confirmação foi enviada para seu WhatsApp e Email.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] text-white py-4 mb-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={18} /> {t('talkToConcierge')}
          </motion.button>
          
          <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 dark:bg-zinc-900 text-black dark:text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all"
          >
            <Home size={16} /> {t('backToStore')}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <motion.h3 initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="text-xl font-serif mb-4 flex items-center gap-2">
              <ShoppingBag size={20} /> {t('summary')}
            </motion.h3>
            {cart.length === 0 ? (
              <p className="text-gray-500">{t('emptyCart')}</p>
            ) : (
              <div className="space-y-4">
                {cart.map((p, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-gray-500">{p.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 font-bold text-lg">
                  <span>{t('total')}</span>
                  <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <motion.h3 initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="text-xl font-serif mb-4 flex items-center gap-2">
              <User size={20} /> {t('contactDetails')}
            </motion.h3>
            <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder={t('fullName')} className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder={t('email')} className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
                <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} type="tel" placeholder={t('whatsapp')} className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
            </div>

            <motion.h3 initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="text-xl font-serif mb-2 mt-6 flex items-center gap-2">
              <MapPin size={20} /> {t('address')}
            </motion.h3>
            <input name="street" value={formData.street} onChange={handleInputChange} type="text" placeholder="Rua e Número" className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
                <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Cidade" className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
                <input name="state" value={formData.state} onChange={handleInputChange} type="text" placeholder="Estado (UF)" className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
            </div>
            <input name="zip" value={formData.zip} onChange={handleInputChange} type="text" placeholder="CEP" className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-gold transition-colors rounded-lg" />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <motion.h3 initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="text-xl font-serif mb-4 flex items-center gap-2">
              <CreditCard size={20} /> {t('payment')}
            </motion.h3>
            
            <div className="space-y-4">
              <label className="block text-sm uppercase tracking-widest text-gray-500 mb-2">{t('paymentMethods')}</label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-4 border text-left flex items-center justify-between transition-colors rounded-lg ${paymentMethod === 'PIX' ? 'border-gold bg-gold/10' : 'border-gray-200 dark:border-gray-800'}`}
                >
                  <span className="font-bold">PIX</span>
                  {paymentMethod === 'PIX' && <CheckCircle size={18} className="text-gold" />}
                </button>
                <button 
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-4 border text-left flex items-center justify-between transition-colors rounded-lg ${paymentMethod === 'CREDIT_CARD' ? 'border-gold bg-gold/10' : 'border-gray-200 dark:border-gray-800'}`}
                >
                  <span className="font-bold">Cartão de Crédito</span>
                  {paymentMethod === 'CREDIT_CARD' && <CheckCircle size={18} className="text-gold" />}
                </button>
              </div>
            </div>

            {paymentMethod === 'PIX' && (
              <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 text-center rounded-lg mt-4">
                 <div className="flex flex-col items-center justify-center gap-2 mb-2">
                   <ShieldCheck className="text-green-500" size={32} />
                   <p className="text-sm font-medium">{t('pixApproval')}</p>
                 </div>
                 <p className="text-xs text-gray-500">O código QR será gerado na próxima tela.</p>
              </div>
            )}

            {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
              <div className="p-6 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 rounded-lg mt-4">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Lock size={14} /> {t('secure')}
                </div>
                <input type="text" placeholder="Número do Cartão" className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black" />
                <div className="flex gap-3">
                   <input type="text" placeholder="MM/AA" className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black" />
                   <input type="text" placeholder="CVV" className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black" />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex justify-center items-center bg-light-bg dark:bg-dark-bg text-black dark:text-white">
      <div className="w-full max-w-xl">
        {/* Progress Bar with Confidence Labels */}
        <div className="flex justify-between mb-8 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2"></div>
          {[{id: 1, label: t('cart')}, {id: 2, label: t('contactDetails')}, {id: 3, label: t('payment')}].map((s) => (
            <motion.div 
              key={s.id} 
              className="flex flex-col items-center gap-2 bg-light-bg dark:bg-dark-bg px-2"
              animate={{ opacity: step >= s.id ? 1 : 0.4 }}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                    {s.id}
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">{s.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#111] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-8 flex gap-4">
            {step > 1 && (
               <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white py-4 uppercase text-xs tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <ArrowLeft size={16} className="mx-auto" />
              </motion.button>
            )}
            
            {step < 3 ? (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(step + 1)}
                disabled={cart.length === 0}
                className="flex-[3] bg-black dark:bg-white text-white dark:text-black py-4 uppercase text-xs tracking-widest hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors disabled:opacity-50 rounded-lg shadow-lg"
              >
                {step === 1 ? t('continue') : t('goToPayment')}
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={finalizarCompra}
                disabled={loading}
                className="flex-[3] bg-black text-white py-4 uppercase text-sm tracking-widest hover:bg-gold transition-colors disabled:opacity-70 flex items-center justify-center gap-2 rounded-lg shadow-xl"
              >
                {loading ? 'Processando...' : (
                    <>
                        <Lock size={16} />
                        🔒 Finalizar compra com segurança
                    </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}