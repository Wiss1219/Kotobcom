
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Send,
  Youtube,
  Linkedin,
  CreditCard,
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Truck,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Footer = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(t('invalidEmail'));
      return;
    }

    toast.success(t('subscribeSuccess'), {
      description: t('subscribeMessage')
    });
    setEmail('');
  };

  return (
    <footer className={`${theme === 'light' ? 'bg-[#f3edda]' : 'bg-background'} border-t ${theme === 'light' ? 'border-[#dcd6c3]' : 'border-primary/10'}`}>
      {/* Newsletter Section */}
      <div className={`py-12 ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card/30'}`}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className={`max-w-md ${isRTL ? 'md:text-right' : ''}`}>
              <h3 className={`text-2xl font-serif font-bold mb-2 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}`}>
                {language === 'en' ? 'Subscribe to our newsletter' :
                 language === 'fr' ? 'Abonnez-vous à notre newsletter' :
                 'اشترك في نشرتنا الإخبارية'}
              </h3>
              <p className={`${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                {language === 'en' ? 'Stay updated with our latest releases and promotions' :
                 language === 'fr' ? 'Restez informé de nos dernières sorties et promotions' :
                 'ابق على اطلاع بأحدث إصداراتنا وعروضنا الترويجية'}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full max-w-md flex gap-2">
              <div className="relative flex-grow">
                <Input
                  type="email"
                  placeholder={language === 'en' ? 'Your email address' :
                               language === 'fr' ? 'Votre adresse e-mail' :
                               'عنوان بريدك الإلكتروني'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pr-10 ${theme === 'light' ? 'bg-white border-[#dcd6c3]' : ''}`}
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                type="submit"
                className={theme === 'light' ? 'bg-[#49ab81] hover:bg-[#398564] text-white' : ''}
              >
                {language === 'en' ? 'Subscribe' :
                 language === 'fr' ? 'S\'abonner' :
                 'اشترك'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className={isRTL ? 'text-right' : ''}>
              <Link to="/" className="inline-block mb-6">
                <span className="font-serif text-2xl font-bold">
                  <span className={theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}>Kotob</span>
                  <span className={theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}>com</span>
                </span>
              </Link>
              <p className={`mb-6 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                {language === 'en' ? 'Your trusted source for Islamic books and Quran editions in Tunisia.' :
                 language === 'fr' ? 'Votre source de confiance pour les livres islamiques et les éditions du Coran en Tunisie.' :
                 'مصدرك الموثوق للكتب الإسلامية وإصدارات القرآن في تونس.'}
              </p>
              <div className="space-y-3">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className={`h-4 w-4 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className={theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}>+216 73 123 456</span>
                </div>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className={`h-4 w-4 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className={theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}>info@kotobcom.tn</span>
                </div>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className={`h-4 w-4 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className={theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}>Msaken, Sousse, Tunisia</span>
                </div>
              </div>
            </div>

            {/* Shop */}
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className={`text-lg font-serif font-bold mb-6 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`}>
                {language === 'en' ? 'Shop' :
                 language === 'fr' ? 'Boutique' :
                 'تسوق'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/books"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'All Books' :
                     language === 'fr' ? 'Tous les livres' :
                     'جميع الكتب'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quran"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'Quran Editions' :
                     language === 'fr' ? 'Éditions du Coran' :
                     'إصدارات القرآن'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'Categories' :
                     language === 'fr' ? 'Catégories' :
                     'التصنيفات'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bestsellers"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'Best Sellers' :
                     language === 'fr' ? 'Meilleures ventes' :
                     'الأكثر مبيعًا'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className={`text-lg font-serif font-bold mb-6 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`}>
                {language === 'en' ? 'Customer Service' :
                 language === 'fr' ? 'Service Client' :
                 'خدمة العملاء'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/cart"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <ShoppingBag className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'My Cart' :
                     language === 'fr' ? 'Mon panier' :
                     'سلة التسوق'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <Truck className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'Shipping Policy' :
                     language === 'fr' ? 'Politique d\'expédition' :
                     'سياسة الشحن'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'Contact Us' :
                     language === 'fr' ? 'Contactez-nous' :
                     'اتصل بنا'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className={`flex items-center ${theme === 'light' ? 'text-[#5c5a4e] hover:text-[#49ab81]' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    <HelpCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    {language === 'en' ? 'FAQ' :
                     language === 'fr' ? 'FAQ' :
                     'الأسئلة الشائعة'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className={`text-lg font-serif font-bold mb-6 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`}>
                {language === 'en' ? 'Connect With Us' :
                 language === 'fr' ? 'Connectez-vous avec nous' :
                 'تواصل معنا'}
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-2 rounded-md ${theme === 'light' ? 'bg-[#ece7d5] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-card hover:bg-card/80 text-foreground'} transition-colors`}
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-2 rounded-md ${theme === 'light' ? 'bg-[#ece7d5] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-card hover:bg-card/80 text-foreground'} transition-colors`}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-2 rounded-md ${theme === 'light' ? 'bg-[#ece7d5] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-card hover:bg-card/80 text-foreground'} transition-colors`}
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-2 rounded-md ${theme === 'light' ? 'bg-[#ece7d5] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-card hover:bg-card/80 text-foreground'} transition-colors`}
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-2 rounded-md ${theme === 'light' ? 'bg-[#ece7d5] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-card hover:bg-card/80 text-foreground'} transition-colors`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>

              <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}`}>
                {language === 'en' ? 'Payment Methods' :
                 language === 'fr' ? 'Méthodes de paiement' :
                 'طرق الدفع'}
              </h4>
              <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card'}`}>
                <div className="flex items-center justify-between">
                  <CreditCard className={`h-6 w-6 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`} />
                  <span className={`text-xs ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                    {language === 'en' ? 'Cash on Delivery' :
                     language === 'fr' ? 'Paiement à la livraison' :
                     'الدفع عند الاستلام'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className={theme === 'light' ? 'bg-[#dcd6c3]' : 'bg-border'} />

          {/* Copyright and Bottom Links */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className={`text-sm ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'} flex items-center mb-4 md:mb-0`}>
              © 2025 Kotobcom. {language === 'en' ? 'All rights reserved' :
                               language === 'fr' ? 'Tous droits réservés' :
                               'جميع الحقوق محفوظة'}.
              <Heart className={`h-4 w-4 mx-1 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} animate-pulse`} />
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/privacy" className={`${theme === 'light' ? 'text-[#6b6a5c] hover:text-[#49ab81]' : 'text-muted-foreground hover:text-primary'} transition-colors`}>
                {language === 'en' ? 'Privacy Policy' :
                 language === 'fr' ? 'Politique de confidentialité' :
                 'سياسة الخصوصية'}
              </Link>
              <Link to="/terms" className={`${theme === 'light' ? 'text-[#6b6a5c] hover:text-[#49ab81]' : 'text-muted-foreground hover:text-primary'} transition-colors`}>
                {language === 'en' ? 'Terms of Service' :
                 language === 'fr' ? 'Conditions d\'utilisation' :
                 'شروط الخدمة'}
              </Link>
              <Link to="/sitemap" className={`${theme === 'light' ? 'text-[#6b6a5c] hover:text-[#49ab81]' : 'text-muted-foreground hover:text-primary'} transition-colors`}>
                {language === 'en' ? 'Sitemap' :
                 language === 'fr' ? 'Plan du site' :
                 'خريطة الموقع'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
