
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, User as UserIcon, Mail, Phone, KeyRound, ChevronLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

type LoginView = 'LOGIN' | 'RECOVER_METHOD' | 'RECOVER_CODE' | 'RECOVER_NEW_PASS';

export default function Login() {
  const [view, setView] = useState<LoginView>('LOGIN');
  
  // Login State
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  
  // Recovery State
  const [recoverIdentifier, setRecoverIdentifier] = useState('');
  const [recoverMethod, setRecoverMethod] = useState<'email' | 'whatsapp'>('email');
  const [recoverCode, setRecoverCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();

  // --- ACTIONS ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.auth.login(identifier, password);
      login(response.user, response.token);
      
      if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const sendRecoveryCode = async () => {
    if (!recoverIdentifier) {
        alert("Informe seu usuário ou e-mail.");
        return;
    }
    setLoading(true);
    try {
        await api.auth.recoverPassword(recoverIdentifier, recoverMethod);
        alert(`Código enviado via ${recoverMethod === 'email' ? 'E-mail' : 'WhatsApp'}! Verifique sua caixa de entrada.`);
        setView('RECOVER_CODE');
    } catch (e) {
        alert((e as Error).message);
    } finally {
        setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!recoverCode || !newPassword) return alert("Preencha todos os campos");
    setLoading(true);
    try {
        await api.auth.resetPassword(recoverCode, newPassword);
        alert("Senha redefinida com sucesso! Faça login.");
        setView('LOGIN');
    } catch (e) {
        alert((e as Error).message);
    } finally {
        setLoading(false);
    }
  };

  // --- RENDERERS ---

  const renderLoginForm = () => (
    <motion.form 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 20 }}
        onSubmit={handleLogin} 
        className="space-y-4"
    >
        <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
            type="text"
            placeholder="Usuário ou E-mail"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 pl-10 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 outline-none focus:border-gold transition-colors"
            />
        </div>

        <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 outline-none focus:border-gold transition-colors"
            />
        </div>

        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {loading ? 'Autenticando...' : (
                <>
                    Entrar <ArrowRight size={14} />
                </>
            )}
        </motion.button>
        
        <button 
            type="button"
            onClick={() => setView('RECOVER_METHOD')}
            className="block w-full text-center text-xs text-gray-500 hover:text-white underline mt-4"
        >
            Esqueci minha senha
        </button>
    </motion.form>
  );

  const renderRecoverMethod = () => (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <button onClick={() => setView('LOGIN')} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white mb-4"><ChevronLeft size={14}/> Voltar</button>
          
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg mb-1">Recuperar Acesso</h3>
            <p className="text-xs text-gray-400">Identifique-se para receber o código de segurança.</p>
          </div>
          
          <div className="relative mb-6">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
                type="text"
                placeholder="Digite seu usuário ou e-mail"
                value={recoverIdentifier}
                onChange={(e) => setRecoverIdentifier(e.target.value)}
                className="w-full p-4 pl-10 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Enviar código via:</p>
              <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRecoverMethod('email')}
                    className={`p-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        recoverMethod === 'email' 
                        ? 'border-gold bg-gold/5 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                        : 'border-zinc-800 bg-zinc-900/50 text-gray-500 hover:border-zinc-700'
                    }`}
                  >
                      <Mail size={20} className={recoverMethod === 'email' ? "text-gold" : "text-gray-600"} /> 
                      <span className={recoverMethod === 'email' ? "text-white" : "text-gray-500"}>Email</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecoverMethod('whatsapp')}
                    className={`p-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        recoverMethod === 'whatsapp' 
                        ? 'border-gold bg-gold/5 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                        : 'border-zinc-800 bg-zinc-900/50 text-gray-500 hover:border-zinc-700'
                    }`}
                  >
                      <Phone size={20} className={recoverMethod === 'whatsapp' ? "text-gold" : "text-gray-600"} /> 
                      <span className={recoverMethod === 'whatsapp' ? "text-white" : "text-gray-500"}>WhatsApp</span>
                  </button>
              </div>
          </div>

          <button 
             onClick={sendRecoveryCode}
             disabled={loading}
             className="w-full mt-4 bg-white text-black py-4 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gold transition-colors disabled:opacity-50 shadow-lg"
          >
              {loading ? 'Enviando...' : 'Enviar Código de Segurança'}
          </button>
      </motion.div>
  );

  const renderRecoverCode = () => (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
           <button onClick={() => setView('RECOVER_METHOD')} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white mb-4"><ChevronLeft size={14}/> Voltar</button>
           <h3 className="text-white font-bold text-lg">Código Enviado</h3>
           <p className="text-xs text-gray-400 mb-4">
               Insira o código de 6 dígitos que enviamos para {recoverMethod === 'email' ? 'seu e-mail' : 'seu WhatsApp'}.
           </p>
           
           <input
            type="text"
            placeholder="000000"
            value={recoverCode}
            onChange={(e) => setRecoverCode(e.target.value.replace(/\D/g, ''))}
            className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-2xl text-white outline-none focus:border-gold text-center tracking-[0.5em] font-mono placeholder-zinc-800 transition-colors"
            maxLength={6}
           />

           <div className="relative mt-4">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
                type="password"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 pl-10 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white outline-none focus:border-gold transition-colors"
            />
           </div>

           <button 
             onClick={resetPassword}
             disabled={loading}
             className="w-full mt-4 bg-white text-black py-4 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gold transition-colors shadow-lg"
          >
              {loading ? 'Salvando...' : 'Redefinir Senha'}
          </button>
      </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
      
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm p-8 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
            <h2 className="text-xl font-serif tracking-[0.2em] uppercase text-white mb-2">{settings.siteName}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Acesso Seguro</p>
        </div>

        <AnimatePresence mode="wait">
            {view === 'LOGIN' && renderLoginForm()}
            {view === 'RECOVER_METHOD' && renderRecoverMethod()}
            {view === 'RECOVER_CODE' && renderRecoverCode()}
        </AnimatePresence>

        {view === 'LOGIN' && (
            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <p className="text-xs text-gray-500 mb-2">Novo por aqui?</p>
                <Link to="/register" className="text-xs text-white hover:text-gold uppercase tracking-widest font-bold">
                    Criar conta de cliente
                </Link>
            </div>
        )}
      </motion.div>
    </div>
  );
}
