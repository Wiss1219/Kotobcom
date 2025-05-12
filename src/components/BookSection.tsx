import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BookData } from '@/data/books';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookSectionProps {
  title: string;
  books: BookData[];
  linkTo: string;
  icon: React.ReactNode;
  isLoading: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

const BookSection: React.FC<BookSectionProps> = React.forwardRef<HTMLDivElement, BookSectionProps>(
  ({ title, books, linkTo, icon, isLoading }, ref) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const isRTL = language === 'ar';

    return (
      <section ref={ref} className={`py-16 ${theme === 'light' ? 'bg-[#f3edda]/50' : 'bg-background'} reveal`}>
        <div className="container">
          <div className={`flex justify-between items-center mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center">
              <div className={`${theme === 'light' ? 'bg-[#ded7ba]/30' : 'bg-brand-creamLight/10'} p-3 rounded-full mr-4`}>
                {icon}
              </div>
              <h2 className="section-title">{t(title)}</h2>
            </div>
            <Link to={linkTo}>
              <Button variant="ghost" className="group">
                <span className="mr-2">{t('viewAll')}</span>
                <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading state with attractive skeleton
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card/50 rounded-lg shadow-sm h-64 mb-4"></div>
                  <div className="h-4 bg-card/50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-card/50 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-card/50 rounded w-1/4"></div>
                </div>
              ))
            ) : books.length > 0 ? (
              books.map(book => book && <BookCard key={book.id} book={book} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-muted-foreground">
                  {language === 'en' ? "No books available in this category." : 
                   language === 'fr' ? "Aucun livre disponible dans cette catégorie." : 
                   "لا توجد كتب متاحة في هذه الفئة."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

BookSection.displayName = 'BookSection';

export default BookSection;
