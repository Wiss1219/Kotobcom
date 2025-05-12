import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { BookOpen, BookMarked, Bookmark, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FeaturedCategories = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  return (
    <section className={`py-16 ${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'}`}>
      <div className="container">
        <div className="text-center mb-12">
          <Badge className={`mb-2 ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary text-white'}`}>
            {t('categories')}
          </Badge>
          <h2 className={`text-3xl font-serif font-bold ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
            {language === 'en' ? "Browse by categories" : language === 'fr' ? "Parcourir par catégories" : "تصفح حسب الفئات"}
          </h2>
          <p className={`mt-3 max-w-2xl mx-auto ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
            {language === 'en'
              ? "Explore our diverse collection of books across various Islamic categories."
              : language === 'fr'
                ? "Explorez notre collection diversifiée de livres dans diverses catégories islamiques."
                : "استكشف مجموعتنا المتنوعة من الكتب عبر مختلف الفئات الإسلامية."}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {/* Islamic Studies */}
          <Link to="/categories/islamic-studies" className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card'} p-4 flex flex-col items-center justify-center text-center h-40 transition-all hover:shadow-md`}>
            <div className={`absolute inset-0 opacity-10 bg-cover bg-center transition-opacity group-hover:opacity-20`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=200)'}}></div>
            <BookOpen className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:scale-110 transition-transform`} />
            <h3 className={`font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "Islamic Studies" : language === 'fr' ? "Études Islamiques" : "الدراسات الإسلامية"}
            </h3>
            <span className={`text-xs mt-1 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
              {language === 'en' ? "42 Books" : language === 'fr' ? "42 Livres" : "42 كتاب"}
            </span>
          </Link>

          {/* Quran */}
          <Link to="/quran" className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card'} p-4 flex flex-col items-center justify-center text-center h-40 transition-all hover:shadow-md`}>
            <div className={`absolute inset-0 opacity-10 bg-cover bg-center transition-opacity group-hover:opacity-20`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=200)'}}></div>
            <BookMarked className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:scale-110 transition-transform`} />
            <h3 className={`font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "Quran" : language === 'fr' ? "Coran" : "القرآن"}
            </h3>
            <span className={`text-xs mt-1 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
              {language === 'en' ? "28 Editions" : language === 'fr' ? "28 Éditions" : "28 إصدار"}
            </span>
          </Link>

          {/* History */}
          <Link to="/categories/history" className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card'} p-4 flex flex-col items-center justify-center text-center h-40 transition-all hover:shadow-md`}>
            <div className={`absolute inset-0 opacity-10 bg-cover bg-center transition-opacity group-hover:opacity-20`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=200)'}}></div>
            <Bookmark className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:scale-110 transition-transform`} />
            <h3 className={`font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "History" : language === 'fr' ? "Histoire" : "التاريخ"}
            </h3>
            <span className={`text-xs mt-1 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
              {language === 'en' ? "35 Books" : language === 'fr' ? "35 Livres" : "35 كتاب"}
            </span>
          </Link>

          {/* Biography */}
          <Link to="/categories/biography" className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card'} p-4 flex flex-col items-center justify-center text-center h-40 transition-all hover:shadow-md`}>
            <div className={`absolute inset-0 opacity-10 bg-cover bg-center transition-opacity group-hover:opacity-20`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=200)'}}></div>
            <Users className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:scale-110 transition-transform`} />
            <h3 className={`font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "Biography" : language === 'fr' ? "Biographie" : "السيرة الذاتية"}
            </h3>
            <span className={`text-xs mt-1 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
              {language === 'en' ? "24 Books" : language === 'fr' ? "24 Livres" : "24 كتاب"}
            </span>
          </Link>

          {/* Children */}
          <Link to="/categories/children" className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-[#ece7d5]' : 'bg-card'} p-4 flex flex-col items-center justify-center text-center h-40 transition-all hover:shadow-md`}>
            <div className={`absolute inset-0 opacity-10 bg-cover bg-center transition-opacity group-hover:opacity-20`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200)'}}></div>
            <BookOpen className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:scale-110 transition-transform`} />
            <h3 className={`font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "Children" : language === 'fr' ? "Enfants" : "الأطفال"}
            </h3>

          </Link>

          {/* All Categories */}
          <Link to="/categories" className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-[#ded7ba]/70' : 'bg-primary/20'} p-4 flex flex-col items-center justify-center text-center h-40 transition-all hover:shadow-md`}>
            <ArrowRight className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:translate-x-1 transition-transform`} />
            <h3 className={`font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "All categories" : language === 'fr' ? "Toutes les catégories" : "جميع الفئات"}
            </h3>
            <span className={`text-xs mt-1 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
              {language === 'en' ? "View All" : language === 'fr' ? "Voir Tout" : "عرض الكل"}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
