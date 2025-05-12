import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, ShoppingCart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  // Hero content
  const heroContent = {
    tag: language === 'en' ? "Islamic Literature" : language === 'fr' ? "Littérature Islamique" : "الأدب الإسلامي",
    title: language === 'en' ? "Discover a World of Knowledge" : language === 'fr' ? "Découvrir un Monde de Connaissances" : "اكتشف عالماً من المعرفة",
    description: language === 'en' ? "Explore our curated collection of books and Quran editions, bringing wisdom and knowledge to your life." :
                language === 'fr' ? "Explorez notre collection de livres et d'éditions du Coran, apportant sagesse et connaissance à votre vie." :
                "استكشف مجموعتنا المختارة من الكتب وإصدارات القرآن، لتضيف الحكمة والمعرفة إلى حياتك.",
    image: "/kotobcom.png"
  };

  return (
    <div className="relative kotob-pattern overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className={`absolute top-20 left-[10%] w-64 h-64 rounded-full ${theme === 'light' ? 'bg-[#ded7ba]/20' : 'bg-primary/10'} blur-3xl`}></div>
        <div className={`absolute bottom-20 right-[10%] w-80 h-80 rounded-full ${theme === 'light' ? 'bg-[#dcd6c3]/30' : 'bg-primary/15'} blur-3xl`}></div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-[#317256]/95 to-[#49ab81]/90' : 'bg-gradient-to-r from-[#ded7ba]/95 to-[#e7e1c8]/90'} py-16 md:py-24 lg:py-32 relative z-10`}>
        <div className="container">
          {/* Decorative element for spacing */}
          <div className="hidden md:block h-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
            {/* 3D Enhanced Image - Desktop and Mobile - on the left */}
            <div className="relative flex items-center justify-center md:col-span-2 order-2 md:order-1">
              {/* Decorative elements */}
              <div className={`absolute -top-10 -left-10 w-40 h-40 ${theme === 'light' ? 'bg-[#ded7ba]/30' : 'bg-brand-creamLight/10'} rounded-full blur-3xl`}></div>
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme === 'light' ? 'bg-[#dcd6c3]/40' : 'bg-brand-creamLight/10'} rounded-full blur-3xl`}></div>

              {/* Floating circular elements */}
              <div className={`absolute top-0 left-0 w-16 h-16 ${theme === 'light' ? 'bg-[#e7e1c8]' : 'bg-[#49ab81]/30'} rounded-full opacity-30 animate-float-slow`}></div>
              <div className={`absolute bottom-20 right-10 w-12 h-12 ${theme === 'light' ? 'bg-[#dcd6c3]' : 'bg-[#317256]/40'} rounded-full opacity-40 animate-float-medium`}></div>
              <div className={`absolute top-1/3 right-1/4 w-8 h-8 ${theme === 'light' ? 'bg-[#ded7ba]' : 'bg-[#398564]/50'} rounded-full opacity-50 animate-float-fast`}></div>

              {/* Additional circular decorative elements */}
              <div className={`absolute top-1/4 left-1/3 w-4 h-4 ${theme === 'light' ? 'bg-[#ded7ba]' : 'bg-[#49ab81]/40'} rounded-full opacity-60 animate-float-fast`}></div>
              <div className={`absolute bottom-1/3 left-1/4 w-6 h-6 ${theme === 'light' ? 'bg-[#e7e1c8]' : 'bg-[#317256]/30'} rounded-full opacity-50 animate-float-medium`}></div>
              <div className={`absolute -top-4 right-1/3 w-10 h-10 ${theme === 'light' ? 'border-2 border-[#dcd6c3]' : 'border-2 border-[#398564]/40'} rounded-full opacity-40`}></div>
              <div className={`absolute bottom-10 left-10 w-14 h-14 ${theme === 'light' ? 'border border-[#e7e1c8]' : 'border border-[#49ab81]/20'} rounded-full opacity-30`}></div>

              {/* 3D Image container - circular */}
              <div className="relative max-w-xs mx-auto">
                {/* Circular shadow layers for 3D effect */}
                <div className={`absolute inset-0 rounded-full ${theme === 'light' ? 'bg-[#dcd6c3]/40' : 'bg-[#317256]/20'} blur-xl transform translate-x-4 translate-y-4 scale-95 z-0`}></div>
                <div className={`absolute inset-0 rounded-full ${theme === 'light' ? 'bg-[#e7e1c8]/60' : 'bg-[#398564]/30'} blur-md transform translate-x-2 translate-y-2 scale-95 z-0`}></div>

                {/* Floating circular image with perspective */}
                <div className="relative z-10 transform perspective-1000 rotate-y-6 rotate-x-3 transition-all duration-500 hover:rotate-y-0 hover:rotate-x-0">
                  {/* Circular container for the image */}
                  <div className={`relative rounded-full overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-card'} p-2 border-8 ${theme === 'light' ? 'border-[#f3edda]' : 'border-[#317256]/30'}`}>
                    {/* Inner glow ring */}
                    <div className={`absolute inset-0 rounded-full ${theme === 'light' ? 'bg-gradient-to-br from-[#e7e1c8] to-[#ded7ba]' : 'bg-gradient-to-br from-[#49ab81]/30 to-[#317256]/40'} blur-sm`}></div>

                    {/* Circular image */}
                    <div className="relative rounded-full overflow-hidden aspect-square">
                      <img
                        src={heroContent.image}
                        alt="Kotobcom Logo"
                        className={`w-full h-full object-cover filter ${theme === 'light' ? 'drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]' : 'drop-shadow-[0_5px_15px_rgba(73,171,129,0.3)]'}`}
                        style={{
                          transformStyle: 'preserve-3d',
                          animation: 'float-medium 6s ease-in-out infinite'
                        }}
                        loading="eager"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Kotobcom';
                        }}
                      />
                    </div>

                    {/* Shine effect */}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-white/50 to-transparent opacity-70 pointer-events-none"></div>
                  </div>

                  {/* Circular shadow beneath */}
                  <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-8 ${theme === 'light' ? 'bg-[#5c5a4e]/20' : 'bg-black/30'} rounded-full blur-md`}></div>
                </div>

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 ${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-[#49ab81]/10'} blur-2xl -z-10 animate-pulse`} style={{ animationDuration: '4s' }}></div>
              </div>
            </div>

            {/* Text Content - spans 3 columns - on the right */}
            <div className={`${isRTL ? 'text-right' : ''} animate-fade-in md:col-span-3 order-1 md:order-2`}>
              <Badge className={`mb-4 px-4 py-1.5 text-sm font-medium ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary/80 text-white'}`}>
                {heroContent.tag}
              </Badge>

              <h1 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-brand-creamLight'}`}>
                {heroContent.title}
              </h1>

              <p className={`text-lg mb-8 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-brand-creamMedium'} max-w-lg`}>
                {heroContent.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8 md:mb-0">
                <Button asChild size="lg" className={`${theme === 'light' ? 'bg-[#ded7ba] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-[#49ab81] hover:bg-[#49ab81]/90 text-white'} font-medium rounded-md shadow-md`}>
                  <Link to="/books" className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {t('exploreBooks')}
                    {!isRTL ? <ChevronRight className="ml-1 h-4 w-4" /> : <ChevronRight className="mr-1 h-4 w-4 rotate-180" />}
                  </Link>
                </Button>
                <Button asChild size="lg" className={`${theme === 'light' ? 'bg-white/80 border border-[#dcd6c3] text-[#5c5a4e] hover:bg-[#f3edda]/50' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'}`}>
                  <Link to="/cart" className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {t('viewCart')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
