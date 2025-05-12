
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Return null if book is null or undefined
  if (!book) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
    toast.success(`${book.title} added to cart!`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success(`${book.title} added to favorites!`);
    } else {
      toast.success(`${book.title} removed from favorites!`);
    }
  };

  // Safely determine the category path
  const category = book.category || 'books';
  const categoryPath = category.toLowerCase() === 'quran' ? 'quran' : 'books';

  // Format rating display
  const rating = book.rating || 0;
  const displayRating = rating.toFixed(1);

  return (
    <div
      className={`book-card bg-card rounded-xl border ${theme === 'light' ? 'border-[#dcd6c3]/50 hover:border-[#ded7ba]' : 'border-primary/20 hover:border-primary/40'} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/${categoryPath}/${book.id}`} className="block h-full">
        <div className="relative h-[280px] overflow-hidden">
          {/* Book Cover Image */}
          <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light' ? 'from-[#f3edda]/30 to-transparent' : 'from-card/30 to-transparent'}`}></div>
          <img
            src={book.coverImage}
            alt={book.title || 'Book cover'}
            className={`book-card-image w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            loading="lazy"
            onError={(e) => {
              // Fallback for broken image links
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=No+Image';
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {book.bestSeller && (
              <Badge variant="secondary" className={`${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary text-white'} px-2 py-1 text-xs font-medium rounded-md shadow-sm`}>
                {t('bestSeller')}
              </Badge>
            )}
            {book.newArrival && (
              <Badge variant="secondary" className={`${theme === 'light' ? 'bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-accent text-white'} px-2 py-1 text-xs font-medium rounded-md shadow-sm`}>
                {t('new')}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full ${theme === 'light' ? 'bg-white/80 text-[#5c5a4e] hover:bg-[#ded7ba]/80' : 'bg-card/80 text-white hover:bg-primary/80'} shadow-sm transition-all duration-300 z-10`}
            aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
          </button>

          {/* Rating */}
          {rating > 0 && (
            <div className={`absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md ${theme === 'light' ? 'bg-white/80 text-[#5c5a4e]' : 'bg-card/80 text-white'} text-xs font-medium shadow-sm`}>
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              <span>{displayRating}</span>
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light' ? 'from-[#ece7d5]/90 via-[#ece7d5]/50 to-transparent' : 'from-card/90 via-card/50 to-transparent'} flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className={`w-full ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e] hover:bg-[#dcd6c3]' : 'bg-primary text-white hover:bg-primary/90'} rounded-md shadow-md transition-all duration-300`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('addToCart')}
            </Button>
          </div>
        </div>

        {/* Book Details */}
        <div className="p-4">
          <h3 className={`font-serif text-base font-bold mb-1 line-clamp-2 ${language === 'ar' ? 'text-right' : ''} ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
            {book.title || 'Untitled Book'}
          </h3>
          <p className={`text-sm text-muted-foreground mb-3 ${language === 'ar' ? 'text-right' : ''}`}>
            {book.author || 'Unknown Author'}
          </p>
          <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className={`font-bold text-lg ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'}`}>{(book.price || 0).toFixed(2)} TND</span>
            <span
              className={`flex items-center text-xs font-medium ${theme === 'light' ? 'text-[#5c5a4e]/70 hover:text-[#5c5a4e]' : 'text-white/70 hover:text-white'} cursor-pointer`}
            >
              <Eye className="h-3 w-3 mr-1" />
              {t('details')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
