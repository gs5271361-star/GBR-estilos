import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Plus, LogOut, Trash2, Box, BarChart3, Settings, ShoppingBag, Save, Edit2, Check, Eye, EyeOff, Truck, Search, Upload, Camera, X, Users, DollarSign, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, AdminStats, Product, OrderStatus } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import OrderStatusSelect from './OrderStatusSelect';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SETTINGS'>('DASHBOARD');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [localSettings, setLocalSettings] = useState(settings);
  const [loading, setLoading] = useState(true);

  // Editing States
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<{name: string, price: string, stock: number, image: string}>({name: '', price: '', stock: 0, image: ''});
  
  // Logistics States
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // File Input Refs
  const productImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const loadData = async () => {
    setLoading(true);
    try {
        const [statsData, ordersData, productsData] = await Promise.all([
            api.admin.getStats(),
            api.admin.getAllOrders(),
            api.products.getAll()
        ]);
        setStats(statsData);
        setOrders(ordersData);
        setProducts(productsData);
    } catch (error) {
        console.error("Failed to load admin data", error);
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- HELPERS ---
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  // --- SETTINGS ---
  const handleSaveSettings = async () => {
      await updateSettings(localSettings);
      alert("Configurações salvas e aplicadas em tempo real!");
  };

  // --- PRODUCTS ---
  const handleAddProduct = async () => {
      const newProduct: Product = {
          id: Date.now(),
          name: t('newProduct'),
          price: "R$ 0,00",
          image: "https://picsum.photos/id/1/800/1000",
          description: "...",
          stock: 0,
          active: false
      };
      await api.products.create(newProduct);
      setProducts([newProduct, ...products]);
      startEditingProduct(newProduct);
  };

  const handleDeleteProduct = async (id: number) => {
      if (window.confirm("Confirm delete?")) {
          await api.products.delete(id);
          setProducts(products.filter(p => p.id !== id));
      }
  };

  const toggleProductActive = async (id: number) => {
    const product = products.find(p => p.id === id);
    if(product) {
        const updated = { ...product, active: !product.active };
        await api.products.update(updated);
        setProducts(products.map(p => p.id === id ? updated : p));
    }
  };

  const startEditingProduct = (product: Product) => {
      setEditingProductId(product.id);
      setEditProductData({ 
          name: product.name,
          price: product.price, 
          stock: product.stock, 
          image: product.image 
      });
  };

  const cancelEditingProduct = () => {
      setEditingProductId(null);
      setEditProductData({ name: '', price: '', stock: 0, image: '' });
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const base64 = await convertFileToBase64(e.target.files[0]);
          setEditProductData({ ...editProductData, image: base64 });
      }
  };

  const saveProductEdit = async (id: number) => {
      const product = products.find(p => p.id === id);
      if(product) {
          const updated = { 
              ...product, 
              name: editProductData.name,
              price: editProductData.price, 
              stock: editProductData.stock, 
              image: editProductData.image 
          };
          
          await api.products.update(updated);
          setProducts(products.map(p => p.id === id ? updated : p));
          setEditingProductId(null);
      }
  };

  // --- LOGISTICS & ORDERS ---
  const handleOrderUpdate = (updatedOrder: Order) => {
      setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      // Optionally refresh stats
  };

  const updateTracking = async (orderId: string) => {
      const code = trackingInputs[orderId];
      if(!code) return alert("Código obrigatório");
      
      try {
        const updated = await api.admin.updateOrderStatus(orderId, 'SHIPPED', code);
        handleOrderUpdate(updated);
        alert("Rastreio enviado e cliente notificado!");
      } catch (e) {
          alert("Erro ao enviar rastreio");
      }
  };

  if (!isAdmin) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-black text-gold">Carregando Painel...</div>;

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 bg-gray-50 dark:bg-black text-black dark:text-white flex flex-col md:flex-row gap-8">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0">
         <div className="mb-8 px-4">
             <h1 className="text-2xl font-serif font-bold">{t('admin')}</h1>
             <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{settings.siteName}</p>
         </div>
         
         {[
           { id: 'DASHBOARD', icon: BarChart3, label: t('dashboard') },
           { id: 'ORDERS', icon: ShoppingBag, label: t('logistics') },
           { id: 'PRODUCTS', icon: Box, label: t('products') },
           { id: 'SETTINGS', icon: Settings, label: t('settings') }
         ].map(item => (
            <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            >
                <item.icon size={18} /> {item.label}
            </button>
         ))}

         <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-auto text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={18} /> {t('logout')}
         </button>
      </aside>

      {/* Content */}
      <main className="flex-1 pb-12 w-full overflow-hidden">
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {activeTab === 'DASHBOARD' && stats && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{t('sales')}</p>
                                <p className="text-3xl font-serif text-black dark:text-white">{stats.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                <ShoppingBag size={24} />
                            </div>
                         </div>

                         <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{t('revenue')}</p>
                                <p className="text-3xl font-serif text-green-500">R$ {stats.totalRevenue.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                                <DollarSign size={24} />
                            </div>
                         </div>

                         <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Usuários</p>
                                <p className="text-3xl font-serif text-gold">{stats.totalUsers}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-gold">
                                <Users size={24} />
                            </div>
                         </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold mb-4">Pedidos Recentes</h3>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left text-sm">
                               <thead className="bg-gray-50 dark:bg-zinc-900">
                                   <tr>
                                       <th className="p-3 text-xs uppercase text-gray-500">ID</th>
                                       <th className="p-3 text-xs uppercase text-gray-500">Cliente</th>
                                       <th className="p-3 text-xs uppercase text-gray-500">Total</th>
                                       <th className="p-3 text-xs uppercase text-gray-500">Status</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {stats.recentOrders.map(order => (
                                       <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                                           <td className="p-3 font-mono">#{order.id.slice(-6)}</td>
                                           <td className="p-3">{order.customerName}</td>
                                           <td className="p-3 font-medium">R$ {order.total.toLocaleString('pt-BR')}</td>
                                           <td className="p-3"><span className="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">{order.status}</span></td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ORDERS' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{t('logistics')}</h2>
                        <button onClick={loadData} className="p-2 bg-gray-100 dark:bg-zinc-900 rounded hover:bg-gold hover:text-white"><RefreshCcw size={16}/></button>
                    </div>

                    <div className="bg-white dark:bg-[#111] rounded-lg border border-gray-100 dark:border-gray-800 overflow-x-auto shadow-sm">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="p-4 text-gray-500 uppercase text-xs">ID</th>
                                    <th className="p-4 text-gray-500 uppercase text-xs">{t('fullName')}</th>
                                    <th className="p-4 text-gray-500 uppercase text-xs">{t('total')}</th>
                                    <th className="p-4 text-gray-500 uppercase text-xs">Controle de Status</th>
                                    <th className="p-4 text-gray-500 uppercase text-xs">{t('tracking')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                                        <td className="p-4 font-bold font-mono">#{order.id.slice(0, 8)}...</td>
                                        <td className="p-4">
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4 font-serif">R$ {order.total.toLocaleString('pt-BR')}</td>
                                        <td className="p-4">
                                            <OrderStatusSelect order={order} onUpdate={handleOrderUpdate} />
                                        </td>
                                        <td className="p-4">
                                            {order.status === 'DELIVERED' || order.status === 'SHIPPED' ? (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <Truck size={16} />
                                                    <span className="font-mono text-xs">{order.trackingCode || 'Sem Código'}</span>
                                                    {order.status === 'SHIPPED' && (
                                                        <button onClick={() => setTrackingInputs(p => ({...p, [order.id]: order.trackingCode || ''}))} className="text-gray-400 hover:text-black">
                                                            <Edit2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Código..." 
                                                        className="w-24 p-1 text-xs border border-gray-300 dark:border-gray-700 rounded bg-transparent"
                                                        value={trackingInputs[order.id] || ''}
                                                        onChange={(e) => setTrackingInputs({...trackingInputs, [order.id]: e.target.value})}
                                                    />
                                                    <button 
                                                        onClick={() => updateTracking(order.id)}
                                                        className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs rounded hover:bg-gold transition-colors"
                                                    >
                                                        OK
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Products and Settings Tabs remain similar but integrated with real data */}
            {activeTab === 'PRODUCTS' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{t('products')}</h2>
                        <button onClick={handleAddProduct} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold transition-colors">
                            <Plus size={16} /> {t('newProduct')}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {products.map(p => (
                            <motion.div layout key={p.id} className={`flex items-center justify-between p-4 bg-white dark:bg-[#111] border ${p.active ? 'border-gray-100 dark:border-gray-800' : 'border-red-100 dark:border-red-900/30'} rounded-lg shadow-sm`}>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden relative group shrink-0">
                                        <img src={p.id === editingProductId ? editProductData.image : p.image} alt={p.name} className={`w-full h-full object-cover ${!p.active && 'grayscale opacity-50'}`} />
                                        {editingProductId === p.id && (
                                            <button 
                                              onClick={() => productImageInputRef.current?.click()}
                                              className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Camera size={20} />
                                                <input 
                                                  type="file" 
                                                  hidden 
                                                  ref={productImageInputRef}
                                                  onChange={handleProductImageUpload}
                                                />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {editingProductId === p.id ? (
                                            <div className="flex flex-col gap-2">
                                                <input 
                                                    type="text" 
                                                    value={editProductData.name} 
                                                    onChange={e => setEditProductData({...editProductData, name: e.target.value})} 
                                                    className="font-bold text-sm border-b border-gold bg-transparent outline-none w-full placeholder-gray-400"
                                                    placeholder="Nome do Produto"
                                                />
                                                <div className="flex gap-2">
                                                    <input type="text" value={editProductData.price} onChange={e => setEditProductData({...editProductData, price: e.target.value})} className="w-24 p-1 text-xs border border-gold rounded bg-transparent" placeholder="Preço" />
                                                    <input type="number" value={editProductData.stock} onChange={e => setEditProductData({...editProductData, stock: Number(e.target.value)})} className="w-20 p-1 text-xs border border-gold rounded bg-transparent" placeholder="Qtd" />
                                                    <button onClick={() => saveProductEdit(p.id)} className="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded"><Check size={16} /></button>
                                                    <button onClick={cancelEditingProduct} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"><X size={16} /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-bold text-sm">{p.name}</p>
                                                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                                    <span>{p.price}</span>
                                                    <span className="uppercase tracking-wide">{t('stock')}: {p.stock}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => toggleProductActive(p.id)} className={`p-2 rounded ${p.active ? 'bg-gray-100 dark:bg-zinc-900 text-gray-600' : 'bg-green-600 text-white'}`} title="Ativar/Desativar">
                                        {p.active ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button onClick={() => startEditingProduct(p)} className="p-2 bg-gray-100 dark:bg-zinc-900 text-gray-600 hover:text-gold rounded">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded hover:bg-red-600 hover:text-white">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'SETTINGS' && (
                <div className="max-w-2xl space-y-6">
                    <h2 className="text-xl font-bold">{t('siteSettings')}</h2>
                    <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-100 dark:border-gray-800 space-y-6">
                        
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nome do Site (Marca)</label>
                            <input 
                                type="text" 
                                value={localSettings.siteName} 
                                onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} 
                                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:border-gold outline-none"
                                placeholder="Ex: GBR ESTILOS"
                            />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t('whatsapp')}</label>
                                <input 
                                    type="text" 
                                    value={localSettings.whatsapp} 
                                    onChange={(e) => setLocalSettings({...localSettings, whatsapp: e.target.value})} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:border-gold outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t('email')}</label>
                                <input 
                                    type="email" 
                                    value={localSettings.email} 
                                    onChange={(e) => setLocalSettings({...localSettings, email: e.target.value})} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:border-gold outline-none"
                                />
                             </div>
                         </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded bg-gray-50 dark:bg-zinc-900/30">
                            <div><h3 className="font-bold text-sm">{t('heroVisibility')}</h3></div>
                            <button onClick={() => setLocalSettings({...localSettings, homeHeroVisible: !localSettings.homeHeroVisible})} className={`w-10 h-5 rounded-full relative ${localSettings.homeHeroVisible ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${localSettings.homeHeroVisible ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded bg-gray-50 dark:bg-zinc-900/30">
                            <div><h3 className="font-bold text-sm">{t('maintenanceMode')}</h3></div>
                            <button onClick={() => setLocalSettings({...localSettings, maintenanceMode: !localSettings.maintenanceMode})} className={`w-10 h-5 rounded-full relative ${localSettings.maintenanceMode ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${localSettings.maintenanceMode ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                        
                        <button onClick={handleSaveSettings} className="bg-green-600 text-white px-6 py-3 rounded text-xs uppercase tracking-widest hover:bg-green-700 flex items-center gap-2">
                            <Save size={16} /> {t('save')}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
      </main>
    </div>
  );
}
