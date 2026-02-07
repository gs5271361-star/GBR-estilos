import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, Heart, Settings, ChevronDown, ChevronUp, Trash2, Lock, User as UserIcon, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Order } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [activeSection, setActiveSection] = useState<'orders' | 'favorites' | 'settings' | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Change Password States
  const [passData, setPassData] = useState({ old: '', new: '' });
  const [loadingPass, setLoadingPass] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSection = async (section: 'orders' | 'favorites' | 'settings') => {
    if (activeSection === section) {
      setActiveSection(null);
      return;
    }
    
    setActiveSection(section);

    if (section === 'orders' && orders.length === 0) {
      setLoadingOrders(true);
      try {
        const myOrders = await api.orders.getMyOrders();
        setOrders(myOrders);
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    }
  };

  const handleChangePassword = async () => {
    if (!passData.old || !passData.new) return alert("Preencha todos os campos.");
    setLoadingPass(true);
    try {
      const userId = user?.id || 0; 
      await api.auth.changePassword(userId, { oldPassword: passData.old, newPassword: passData.new });
      alert("Senha alterada com sucesso!");
      setPassData({ old: '', new: '' });
    } catch (error) {
      alert("Erro ao alterar senha. Verifique a senha atual.");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 bg-light-bg dark:bg-dark-bg text-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-serif">Minha Conta</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest hover:underline">
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white dark:bg-[#111] p-6 border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-serif">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{user?.role}</p>
            
            <div className="space-y-2 text-xs text-gray-500 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <UserIcon size={12} /> @{user?.username}
                </div>
                <div className="flex items-center gap-2">
                    <Mail size={12} /> {user?.email}
                </div>
                {user?.phone && (
                    <div className="flex items-center gap-2">
                        <Phone size={12} /> {user?.phone}
                    </div>
                )}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="col-span-2 bg-white dark:bg-[#111] p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Status Recente</h3>
            <div className="flex items-center gap-4 text-green-600 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium">Sua conta está ativa e verificada.</p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          {/* ORDERS SECTION */}
          <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111]">
            <button 
              onClick={() => toggleSection('orders')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Package className={`transition-colors ${activeSection === 'orders' ? 'text-gold' : 'text-gray-400'}`} />
                <span className="font-medium">Meus Pedidos</span>
              </div>
              {activeSection === 'orders' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'orders' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                    {loadingOrders ? (
                      <p className="text-sm text-gray-500 py-4">Carregando pedidos...</p>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4 mt-4">
                        {orders.map(order => (
                          <div key={order.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded bg-gray-50 dark:bg-zinc-900/30">
                             <div className="flex justify-between items-start mb-2">
                               <span className="font-bold text-sm">Pedido #{order.id}</span>
                               <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                 {order.status}
                               </span>
                             </div>
                             <p className="text-xs text-gray-500 mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                             <div className="flex justify-between items-center">
                               <span className="text-sm">{order.items.length} item(s)</span>
                               <span className="font-serif font-bold">R$ {order.total.toLocaleString('pt-BR')}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4">Você ainda não fez nenhum pedido.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FAVORITES SECTION */}
          <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111]">
            <button 
              onClick={() => toggleSection('favorites')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Heart className={`transition-colors ${activeSection === 'favorites' ? 'text-gold' : 'text-gray-400'}`} />
                <span className="font-medium">{t('favorites')}</span>
              </div>
              {activeSection === 'favorites' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
              {activeSection === 'favorites' && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                   <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                     {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {favorites.map(product => (
                            <div key={product.id} className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/30">
                               <img src={product.image} alt={product.name} className="w-16 h-20 object-cover bg-gray-200" />
                               <div className="flex flex-col justify-between flex-1">
                                  <div>
                                    <h4 className="font-bold text-sm line-clamp-1">{product.name}</h4>
                                    <p className="text-xs text-gray-500">{product.price}</p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <Link to={`/product/${product.id}`} className="text-[10px] uppercase font-bold text-gold hover:underline">Ver Produto</Link>
                                     <button onClick={() => toggleFavorite(product)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                     </button>
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>
                     ) : (
                        <div className="p-6 text-sm text-gray-500 text-center">{t('emptyFavorites')}</div>
                     )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SETTINGS SECTION (Change Password) */}
          <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111]">
            <button 
              onClick={() => toggleSection('settings')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Settings className={`transition-colors ${activeSection === 'settings' ? 'text-gold' : 'text-gray-400'}`} />
                <span className="font-medium">Configurações</span>
              </div>
              {activeSection === 'settings' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
               {activeSection === 'settings' && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                   <div className="p-6 pt-0 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800 mt-2">
                      <div className="max-w-md pt-6">
                        <h4 className="flex items-center gap-2 font-bold text-black dark:text-white mb-4">
                          <Lock size={16} /> Alterar Senha
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <input 
                              type="password" 
                              placeholder="Senha atual" 
                              value={passData.old}
                              onChange={(e) => setPassData({...passData, old: e.target.value})}
                              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent rounded outline-none focus:border-gold transition-colors"
                            />
                          </div>
                          <div>
                            <input 
                              type="password" 
                              placeholder="Nova senha" 
                              value={passData.new}
                              onChange={(e) => setPassData({...passData, new: e.target.value})}
                              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent rounded outline-none focus:border-gold transition-colors"
                            />
                          </div>
                          <button 
                            onClick={handleChangePassword}
                            disabled={loadingPass}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 uppercase text-xs tracking-widest hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors disabled:opacity-50"
                          >
                            {loadingPass ? 'Alterando...' : 'Confirmar Alteração'}
                          </button>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}