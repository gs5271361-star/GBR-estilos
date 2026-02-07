import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import HeroVideo from './components/HeroVideo';
import EditorialSection from './components/EditorialSection';
import ProductGrid from './components/ProductGrid';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import WhatsAppButton from './components/WhatsAppButton';
import PageTransition from './components/PageTransition';
import ScrollMotionWrapper from './components/ScrollMotionWrapper';
import VelocityText from './components/VelocityText';
import VelocityImage from './components/VelocityImage';
import MouseParallax from './components/MouseParallax';
import CinematicSection from './components/CinematicSection';
import Preloader from './components/Preloader';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';

const Home = () => {
  const { settings } = useSettings();
  
  return (
    <>
      <AnimatePresence>
        {settings.homeHeroVisible && (
          <HeroVideo />
        )}
      </AnimatePresence>
      
      <div className={!settings.homeHeroVisible ? "pt-32" : ""}>
        <ScrollMotionWrapper>
          
          <CinematicSection>
             <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <MouseParallax intensity={40}>
                   <div className="py-12 md:py-20">
                      <VelocityText>{settings.siteName}</VelocityText>
                   </div>
                </MouseParallax>
             </div>
          </CinematicSection>

          <CinematicSection>
            <EditorialSection 
                title="Luxo é uma atitude." 
                text={`${settings.siteName} representa o auge do artesanato moderno. Uma marca global desenhada para aqueles que falam a linguagem da elegância sem dizer uma palavra. Cada peça conta uma história de exclusividade.`}
                image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            />
          </CinematicSection>

          <CinematicSection>
             <div className="px-6 md:px-12 max-w-7xl mx-auto">
                <MouseParallax intensity={15}>
                   <VelocityImage src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" alt="Lookbook" />
                </MouseParallax>
             </div>
          </CinematicSection>

          <div className="py-20">
             <VelocityText>NOVA COLEÇÃO</VelocityText>
          </div>

          <CinematicSection>
            <ProductGrid />
          </CinematicSection>
        
        </ScrollMotionWrapper>
      </div>

      <footer className="py-12 text-center text-xs uppercase tracking-widest text-gray-400 bg-white dark:bg-[#111]">
        <div className="mb-4">
          <p className="mb-1">{settings.email}</p>
        </div>
        © {new Date().getFullYear()} {settings.siteName}. Todos os direitos reservados.
      </footer>
    </>
  );
};

// Wrapper for scrolling to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Router>
                  <ScrollToTop />
                  <Preloader />
                  <Cursor />
                  <Navbar />
                  <WhatsAppButton />
                  <AnimatedRoutes />
                </Router>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}