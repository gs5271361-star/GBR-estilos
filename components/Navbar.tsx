import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Moon, Sun, User as UserIcon, Globe } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useSound } from '../hooks/useSound';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { settings } = useSettings();
  const { playClick, playHover } = useSound();

  // Scroll logic for Animation
  const { scrollY } = useScroll();
  
  // Transform values based on scroll position (0px to 120px)
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.85]);
  const logoOpacity = useTransform(scrollY, [0, 120], [1, 0.9]);
  
  // Background logic
  const [scrolled, setScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showBackground = scrolled || location.pathname !== '/';

  const handleInteraction = () => {
    playClick();
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 transition-all duration-500 ${showBackground ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm' : 'bg-transparent'} text-black dark:text-white`}>
      {/* BRANDING: Dynamic Typography with Scroll Animation */}
      <Link to="/" className="flex items-center group" onMouseEnter={playHover} onClick={handleInteraction}>
        <motion.span 
          style={{ scale: logoScale, opacity: logoOpacity }}
          className={`text-2xl md:text-3xl font-serif font-bold tracking-[0.2em] uppercase transition-colors duration-300 origin-left ${!showBackground ? 'text-white' : 'text-black dark:text-white'}`}
        >
          {settings.siteName}
        </motion.span>
      </Link>
      
      <div className={`flex gap-6 items-center ${!showBackground ? 'text-white' : ''}`}>
        <Link to="/" onMouseEnter={playHover} onClick={handleInteraction} className="hidden md:block uppercase text-xs tracking-widest hover:text-gold transition-colors font-bold">
          {language === 'pt' ? 'Início' : 'Home'}
        </Link>
        
        {user ? (
           <Link to={user.role === 'ADMIN' ? "/admin" : "/account"} onMouseEnter={playHover} onClick={handleInteraction} className="flex items-center gap-1 uppercase text-xs tracking-widest hover:text-gold transition-colors font-bold">
             <UserIcon size={14} />
             {user.name.split(' ')[0]}
           </Link>
        ) : (
           <Link to="/login" onMouseEnter={playHover} onClick={handleInteraction} className="hidden md:block uppercase text-xs tracking-widest hover:text-gold transition-colors font-bold">
             Login
           </Link>
        )}
        
        <button onClick={() => { toggleLanguage(); handleInteraction(); }} onMouseEnter={playHover} className="hover:text-gold transition-colors flex items-center gap-1 uppercase text-xs font-bold">
          <Globe size={18} />
          {language}
        </button>
        
        <button onClick={() => { toggleTheme(); handleInteraction(); }} onMouseEnter={playHover} className="hover:text-gold transition-colors">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <Link to="/cart" onMouseEnter={playHover} onClick={handleInteraction} className="relative hover:text-gold transition-colors">
          <ShoppingBag size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
