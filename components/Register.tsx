import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    name: '', 
    email: '', 
    phone: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.auth.register(formData);
      login(response.user, response.token);
      navigate('/account');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white dark:bg-[#111] shadow-xl border border-gray-100 dark:border-gray-800"
      >
        <div className="mb-6">
            <Link to="/login" className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-gold">
                <ArrowLeft size={14} /> Voltar
            </Link>
        </div>

        <h2 className="text-3xl font-serif text-center mb-2 text-black dark:text-white">Junte-se a nós</h2>
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-8">Crie sua conta {settings.siteName}</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Nome Completo</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white focus:border-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Usuário (Login)</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white focus:border-gold outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Email</label>
                <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white focus:border-gold outline-none"
                />
            </div>
            <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">WhatsApp</label>
                <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: 11999999999"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white focus:border-gold outline-none"
                />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Senha</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white focus:border-gold outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black uppercase text-xs tracking-widest hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Processando...' : 'Cadastrar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
