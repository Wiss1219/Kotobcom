
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Search,
  ShoppingCart,
  Sun,
  Moon,
  ChevronDown,
  X,
  Globe,
  MessageSquare,
  Home,
  BookOpen,
  BookMarked,
  Phone,
  Bookmark,
  Award
} from 'lucide-react';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  // Language names for display
  const languageNames = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية'
  };

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar') => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  // Close language menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLangMenuOpen && !(event.target as Element).closest('.lang-menu-container')) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangMenuOpen]);

  // Check if a nav link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="relative z-30">


      {/* Main header with logo and navigation */}
      <div className={`py-4 ${theme === 'light' ? 'bg-[#f3edda]' : 'bg-background'} border-b ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/10'}`}>
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="flex items-center">
                <span className="font-serif text-2xl md:text-3xl font-bold">
                  <span className={`${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'} group-hover:text-primary transition-colors`}>Kotob</span>
                  <span className={`${theme === 'light' ? 'text-[#398564]' : 'text-accent'} group-hover:opacity-80 transition-colors`}>com</span>
                </span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-md ${theme === 'light' ? 'bg-[#e7e1c8] text-[#5c5a4e]' : 'bg-primary/20 text-brand-creamLight'} hidden sm:inline-block`}>
                  {language === 'en' ? "Islamic Bookstore" : language === 'fr' ? "Librairie Islamique" : "مكتبة إسلامية"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`font-medium transition-colors relative py-2 ${
                  isActive('/')
                    ? (theme === 'light' ? 'text-[#398564] font-semibold' : 'text-primary')
                    : (theme === 'light' ? 'text-[#5c5a4e] hover:text-[#398564]' : 'text-brand-creamLight hover:text-primary')
                }`}
              >
                <span>{t('home')}</span>
                {isActive('/') && <span className={`absolute bottom-0 left-0 w-full h-0.5 ${theme === 'light' ? 'bg-[#398564]' : 'bg-primary'}`}></span>}
              </Link>

              <Link
                to="/books"
                className={`font-medium transition-colors relative py-2 ${
                  isActive('/books')
                    ? (theme === 'light' ? 'text-[#398564] font-semibold' : 'text-primary')
                    : (theme === 'light' ? 'text-[#5c5a4e] hover:text-[#398564]' : 'text-brand-creamLight hover:text-primary')
                }`}
              >
                <span>{t('books')}</span>
                {isActive('/books') && <span className={`absolute bottom-0 left-0 w-full h-0.5 ${theme === 'light' ? 'bg-[#398564]' : 'bg-primary'}`}></span>}
              </Link>

              <Link
                to="/quran"
                className={`font-medium transition-colors relative py-2 ${
                  isActive('/quran')
                    ? (theme === 'light' ? 'text-[#398564] font-semibold' : 'text-primary')
                    : (theme === 'light' ? 'text-[#5c5a4e] hover:text-[#398564]' : 'text-brand-creamLight hover:text-primary')
                }`}
              >
                <span>{t('quran')}</span>
                {isActive('/quran') && <span className={`absolute bottom-0 left-0 w-full h-0.5 ${theme === 'light' ? 'bg-[#398564]' : 'bg-primary'}`}></span>}
              </Link>

              <Link
                to="/categories"
                className={`font-medium transition-colors relative py-2 ${
                  isActive('/categories')
                    ? (theme === 'light' ? 'text-[#398564] font-semibold' : 'text-primary')
                    : (theme === 'light' ? 'text-[#5c5a4e] hover:text-[#398564]' : 'text-brand-creamLight hover:text-primary')
                }`}
              >
                <span>{t('categories')}</span>
                {isActive('/categories') && <span className={`absolute bottom-0 left-0 w-full h-0.5 ${theme === 'light' ? 'bg-[#398564]' : 'bg-primary'}`}></span>}
              </Link>
            </nav>

            {/* Right Side: Cart, Language & Theme */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative lang-menu-container hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${theme === 'light' ? 'text-[#5c5a4e] hover:bg-[#e7e1c8]' : 'text-brand-creamLight hover:bg-primary/20'} flex items-center gap-1 rounded-full px-2 py-1 text-xs`}
                  onClick={toggleLangMenu}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isLangMenuOpen && (
                  <div className={`absolute top-full right-0 mt-1 ${theme === 'light' ? 'bg-white' : 'bg-card'} rounded-lg shadow-lg border ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'} z-50 min-w-[130px] overflow-hidden`}>
                    <div className="py-1">
                      {Object.keys(languageNames).map((lang) => (
                        <button
                          key={lang}
                          className={`w-full text-left px-4 py-2 text-sm ${language === lang ?
                            `${theme === 'light' ? 'bg-[#f3edda] text-[#398564] font-medium' : 'bg-primary/20 text-primary font-medium'}` :
                            `hover:${theme === 'light' ? 'bg-[#f3edda]' : 'bg-primary/10'}`}`}
                          onClick={() => handleLanguageChange(lang as 'en' | 'fr' | 'ar')}
                        >
                          {languageNames[lang as keyof typeof languageNames]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={`hidden md:flex ${theme === 'light' ? 'text-[#5c5a4e] hover:bg-[#e7e1c8]' : 'text-brand-creamLight hover:bg-primary/20'} rounded-full p-2`}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <div className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'hover:bg-[#e7e1c8]' : 'hover:bg-primary/20'}`}>
                  <ShoppingCart className={`h-5 w-5 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'} group-hover:text-primary transition-colors duration-200`} />
                  {totalItems > 0 && (
                    <span className={`absolute -top-1 -right-1 ${theme === 'light' ? 'bg-[#398564] text-white' : 'bg-primary text-white'} text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden rounded-full ${theme === 'light' ? 'text-[#5c5a4e] hover:bg-[#e7e1c8]' : 'text-brand-creamLight hover:bg-primary/20'}`}
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>



      {/* Mobile menu - Enhanced */}
      {isMenuOpen && (
        <div className="md:hidden bg-card absolute w-full shadow-lg z-40 animate-fade-in border-b border-border">
          <div className="container py-4">
            {/* Mobile menu header */}
            <div className={`flex items-center justify-between py-2 mb-4 border-b ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/10'}`}>
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'}`}>
                {language === 'en' ? "Menu" : language === 'fr' ? "Menu" : "القائمة"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full p-1 ${theme === 'light' ? 'hover:bg-[#e7e1c8]' : 'hover:bg-primary/20'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Main navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'} hover:${theme === 'light' ? 'text-[#398564]' : 'text-primary'} font-medium py-3 px-4 rounded-md ${isActive('/') ? (theme === 'light' ? 'bg-[#f3edda] text-[#398564]' : 'bg-primary/10') : ''} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5 mr-3" />
                {t('home')}
              </Link>

              <Link
                to="/books"
                className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'} hover:${theme === 'light' ? 'text-[#398564]' : 'text-primary'} font-medium py-3 px-4 rounded-md ${isActive('/books') ? (theme === 'light' ? 'bg-[#f3edda] text-[#398564]' : 'bg-primary/10') : ''} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5 mr-3" />
                {t('books')}
              </Link>

              <Link
                to="/quran"
                className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'} hover:${theme === 'light' ? 'text-[#398564]' : 'text-primary'} font-medium py-3 px-4 rounded-md ${isActive('/quran') ? (theme === 'light' ? 'bg-[#f3edda] text-[#398564]' : 'bg-primary/10') : ''} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookMarked className="h-5 w-5 mr-3" />
                {t('quran')}
              </Link>

              <Link
                to="/categories"
                className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'} hover:${theme === 'light' ? 'text-[#398564]' : 'text-primary'} font-medium py-3 px-4 rounded-md ${isActive('/categories') ? (theme === 'light' ? 'bg-[#f3edda] text-[#398564]' : 'bg-primary/10') : ''} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark className="h-5 w-5 mr-3" />
                {t('categories')}
              </Link>
            </nav>

            {/* Language & Theme toggles */}
            <div className={`mt-6 pt-4 border-t ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/10'}`}>
              {/* Language Selector */}
              <div className="mb-3">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'}`}>
                  {language === 'en' ? "Language" : language === 'fr' ? "Langue" : "اللغة"}
                </label>
                <div className="flex gap-2">
                  {Object.keys(languageNames).map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        language === lang
                          ? `${theme === 'light' ? 'bg-[#e7e1c8] text-[#398564]' : 'bg-primary text-white'}`
                          : `${theme === 'light' ? 'border border-[#e7e1c8] text-[#5c5a4e]' : 'border border-primary/20 text-brand-creamLight'}`
                      }`}
                      onClick={() => {
                        handleLanguageChange(lang as 'en' | 'fr' | 'ar');
                        setIsMenuOpen(false);
                      }}
                    >
                      {languageNames[lang as keyof typeof languageNames]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                className={`w-full justify-start ${theme === 'light' ? 'border-[#e7e1c8] text-[#5c5a4e]' : 'border-primary/20 text-brand-creamLight'}`}
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {theme === 'dark' ? t('lightMode') : t('darkMode')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
