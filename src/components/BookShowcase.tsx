import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BookData } from '@/data/books';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, BookOpen } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface BookShowcaseProps {
  books: BookData[];
}

const BookShowcase: React.FC<BookShowcaseProps> = ({ books }) => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [activeBook, setActiveBook] = useState<number>(0);
  const isRTL = language === 'ar';

  // Auto-rotate books
  useEffect(() => {
    if (books.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveBook((prev) => (prev + 1) % books.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [books.length]);

  if (!books.length) return null;

  const currentBook = books[activeBook];

  const handleAddToCart = () => {
    addToCart({
      id: currentBook.id,
      title: currentBook.title,
      price: currentBook.price,
      coverImage: currentBook.coverImage,
      quantity: 1,
      type: currentBook.type || 'book'
    });
    toast.success(t('addedToCart'));
  };

  return (
    <section className={`py-16 ${theme === 'light' ? 'bg-[#ece7d5]/70' : 'bg-card/10'}`}>
      <div className="container">
        <div className="text-center mb-12">
          <Badge className={`mb-2 ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary/20 text-primary'}`}>
            {language === 'en' ? "Featured Book" : language === 'fr' ? "Livre en Vedette" : "كتاب مميز"}
          </Badge>
          <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
            {language === 'en' ? "Book of the Week" : 
             language === 'fr' ? "Livre de la Semaine" : 
             "كتاب الأسبوع"}
          </h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {/* Book Image */}
          <div className="relative">
            <div className={`absolute -top-10 -left-10 w-40 h-40 ${theme === 'light' ? 'bg-[#ded7ba]/30' : 'bg-primary/10'} rounded-full blur-3xl`}></div>
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme === 'light' ? 'bg-[#dcd6c3]/40' : 'bg-primary/15'} rounded-full blur-3xl`}></div>
            
            <div className="relative z-10 flex justify-center">
              <div className={`relative w-64 h-80 md:w-80 md:h-96 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 ${theme === 'light' ? 'shadow-[#dcd6c3]/50' : 'shadow-primary/20'}`}>
                <img 
                  src={currentBook.coverImage || 'https://placehold.co/400x600?text=Book+Cover'} 
                  alt={currentBook.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Book+Cover';
                  }}
                />
                <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${theme === 'light' ? 'from-[#5c5a4e]/80' : 'from-black/80'} to-transparent`}></div>
              </div>
            </div>
            
            {/* Book selector dots */}
            {books.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {books.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveBook(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeBook === index ?
                      (theme === 'light' ? 'bg-[#5c5a4e] w-8' : 'bg-primary w-8') :
                      (theme === 'light' ? 'bg-[#dcd6c3]' : 'bg-primary/30')}`}
                    aria-label={`View book ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Book Details */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-4">
              <div>
                <Badge className={`${theme === 'light' ? 'bg-[#ded7ba]/80 text-[#5c5a4e]' : 'bg-primary/20 text-primary'}`}>
                  {currentBook.category || (language === 'en' ? "Featured" : language === 'fr' ? "En vedette" : "مميز")}
                </Badge>
                <h3 className={`text-2xl md:text-3xl font-bold mt-2 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                  {currentBook.title}
                </h3>
              </div>
              
              <p className={`text-lg ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                {language === 'en' ? "By" : language === 'fr' ? "Par" : "بواسطة"} <span className="font-medium">{currentBook.author}</span>
              </p>
              
              <p className={`text-xl font-bold ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                ${currentBook.price.toFixed(2)}
              </p>
              
              <p className={`${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                {currentBook.description || (language === 'en' 
                  ? "Discover this exceptional book from our curated collection. Perfect for expanding your knowledge and enriching your library."
                  : language === 'fr'
                  ? "Découvrez ce livre exceptionnel de notre collection soignée. Parfait pour élargir vos connaissances et enrichir votre bibliothèque."
                  : "اكتشف هذا الكتاب الاستثنائي من مجموعتنا المختارة. مثالي لتوسيع معرفتك وإثراء مكتبتك."
                )}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <Button 
                  onClick={handleAddToCart}
                  className={`${theme === 'light' ? 'bg-[#ded7ba] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-primary hover:bg-primary/90 text-white'}`}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('addToCart')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className={`${theme === 'light' ? 'border-[#ded7ba] text-[#5c5a4e] hover:bg-[#ded7ba]/20' : 'border-primary text-primary hover:bg-primary/10'}`}
                  asChild
                >
                  <Link to={`/books/${currentBook.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t('viewDetails')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className={`${theme === 'light' ? 'border-[#ded7ba] text-[#5c5a4e] hover:bg-[#ded7ba]/20' : 'border-primary text-primary hover:bg-primary/10'}`}
            asChild
          >
            <Link to="/books" className="flex items-center">
              {!isRTL && (
                <>
                  {language === 'en' ? "Explore All Books" : language === 'fr' ? "Explorer Tous les Livres" : "استكشف جميع الكتب"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
              {isRTL && (
                <>
                  <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                  {language === 'en' ? "Explore All Books" : language === 'fr' ? "Explorer Tous les Livres" : "استكشف جميع الكتب"}
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookShowcase;
