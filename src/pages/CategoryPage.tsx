import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BookData } from '@/data/books';
import { fetchBooksByCategory } from '@/services/bookService';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Filter, SlidersHorizontal, ChevronRight, ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Define category metadata
interface CategoryMetadata {
  [key: string]: {
    title: {
      en: string;
      fr: string;
      ar: string;
    };
    description: {
      en: string;
      fr: string;
      ar: string;
    };
    image: string;
  };
}

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  const [books, setBooks] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Category metadata
  const categoryMetadata: CategoryMetadata = {
    'islamic-studies': {
      title: {
        en: 'Islamic Studies',
        fr: 'Études Islamiques',
        ar: 'الدراسات الإسلامية'
      },
      description: {
        en: 'Explore our collection of books on Islamic theology, jurisprudence, and principles of faith.',
        fr: 'Explorez notre collection de livres sur la théologie islamique, la jurisprudence et les principes de la foi.',
        ar: 'استكشف مجموعتنا من الكتب في العقيدة الإسلامية والفقه وأصول الدين.'
      },
      image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1200'
    },
    'history': {
      title: {
        en: 'Islamic History',
        fr: 'Histoire Islamique',
        ar: 'التاريخ الإسلامي'
      },
      description: {
        en: 'Discover books on Islamic history, civilizations, and historical events.',
        fr: 'Découvrez des livres sur l\'histoire islamique, les civilisations et les événements historiques.',
        ar: 'اكتشف كتبًا عن التاريخ الإسلامي والحضارات والأحداث التاريخية.'
      },
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200'
    },
    'biography': {
      title: {
        en: 'Biography',
        fr: 'Biographie',
        ar: 'السيرة الذاتية'
      },
      description: {
        en: 'Read biographies of prophets, companions, scholars, and important Islamic figures.',
        fr: 'Lisez des biographies de prophètes, de compagnons, de savants et de figures islamiques importantes.',
        ar: 'اقرأ سير الأنبياء والصحابة والعلماء والشخصيات الإسلامية المهمة.'
      },
      image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1200'
    },
    'children': {
      title: {
        en: 'Children\'s Books',
        fr: 'Livres pour Enfants',
        ar: 'كتب الأطفال'
      },
      description: {
        en: 'Islamic books for children and young readers to learn about Islam in an engaging way.',
        fr: 'Livres islamiques pour enfants et jeunes lecteurs pour apprendre l\'Islam de manière attrayante.',
        ar: 'كتب إسلامية للأطفال والقراء الصغار لتعلم الإسلام بطريقة جذابة.'
      },
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200'
    },
    'education': {
      title: {
        en: 'Islamic Education',
        fr: 'Éducation Islamique',
        ar: 'التعليم الإسلامي'
      },
      description: {
        en: 'Resources for Islamic education, teaching methods, and learning materials.',
        fr: 'Ressources pour l\'éducation islamique, les méthodes d\'enseignement et le matériel d\'apprentissage.',
        ar: 'موارد للتعليم الإسلامي وطرق التدريس ومواد التعلم.'
      },
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200'
    },
    'literature': {
      title: {
        en: 'Islamic Literature',
        fr: 'Littérature Islamique',
        ar: 'الأدب الإسلامي'
      },
      description: {
        en: 'Islamic literature, poetry, and fiction with Islamic themes.',
        fr: 'Littérature islamique, poésie et fiction à thèmes islamiques.',
        ar: 'الأدب الإسلامي والشعر والقصص ذات المواضيع الإسلامية.'
      },
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200'
    },
    'spirituality': {
      title: {
        en: 'Islamic Spirituality',
        fr: 'Spiritualité Islamique',
        ar: 'الروحانية الإسلامية'
      },
      description: {
        en: 'Books on Islamic spirituality, Sufism, and personal development.',
        fr: 'Livres sur la spiritualité islamique, le soufisme et le développement personnel.',
        ar: 'كتب عن الروحانية الإسلامية والتصوف والتنمية الشخصية.'
      },
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200'
    },
    'other': {
      title: {
        en: 'Other Categories',
        fr: 'Autres Catégories',
        ar: 'فئات أخرى'
      },
      description: {
        en: 'Various other Islamic books and resources.',
        fr: 'Divers autres livres et ressources islamiques.',
        ar: 'كتب وموارد إسلامية متنوعة أخرى.'
      },
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200'
    }
  };

  // Get current category metadata
  const currentCategory = categoryId && categoryMetadata[categoryId]
    ? categoryMetadata[categoryId]
    : {
        title: {
          en: 'Category',
          fr: 'Catégorie',
          ar: 'الفئة'
        },
        description: {
          en: 'Books in this category',
          fr: 'Livres dans cette catégorie',
          ar: 'الكتب في هذه الفئة'
        },
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200'
      };

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalBooks, setTotalBooks] = useState<BookData[]>([]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  // Load books for the selected category
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);

        // Fetch books for the selected category
        const categoryBooks = await fetchBooksByCategory(categoryId || '');

        // Store all books for pagination
        setTotalBooks(categoryBooks);

        // Sort books based on sortBy value
        let sortedBooks = [...categoryBooks];
        if (sortBy === 'newest') {
          sortedBooks.sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0));
        } else if (sortBy === 'price-low') {
          sortedBooks.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'price-high') {
          sortedBooks.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === 'popular') {
          sortedBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setTotalBooks(sortedBooks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        toast.error("Failed to load books. Please try again.");
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadBooks();
    }
  }, [categoryId, sortBy]);

  // Update books based on pagination
  useEffect(() => {
    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    setBooks(totalBooks.slice(indexOfFirstBook, indexOfLastBook));
  }, [totalBooks, currentPage]);

  return (
    <main className={`${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'}`}>
      {/* Category Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light' ? 'from-[#f3edda]/95' : 'from-background/95'} to-transparent z-10`}></div>
        <img
          src={currentCategory.image}
          alt={currentCategory.title[language as keyof typeof currentCategory.title]}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="container relative z-20 pt-16 pb-8 md:pt-24 md:pb-12">
          <Link
            to="/categories"
            className={`inline-flex items-center mb-4 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]/80 hover:text-[#5c5a4e]' : 'text-white/80 hover:text-white'} transition-colors`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'en' ? "Back to Categories" :
             language === 'fr' ? "Retour aux Catégories" :
             "العودة إلى الفئات"}
          </Link>
          <h1 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'} ${isRTL ? 'text-right' : ''}`}>
            {currentCategory.title[language as keyof typeof currentCategory.title]}
          </h1>
          <p className={`max-w-2xl ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-white/80'} ${isRTL ? 'text-right' : ''}`}>
            {currentCategory.description[language as keyof typeof currentCategory.description]}
          </p>
        </div>
      </div>

      {/* Books Section */}
      <div className="container py-8 md:py-12">
        {/* Filters and Sorting */}
        <div className={`flex flex-wrap items-center justify-between mb-8 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className={`text-xl font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {totalBooks.length} {language === 'en' ? "Books" : language === 'fr' ? "Livres" : "كتاب"}
              {totalBooks.length > itemsPerPage && (
                <span className={`ml-2 text-sm font-normal ${theme === 'light' ? 'text-[#5c5a4e]/70' : 'text-white/70'}`}>
                  {language === 'en'
                    ? `(Page ${currentPage} of ${Math.ceil(totalBooks.length / itemsPerPage)})`
                    : language === 'fr'
                    ? `(Page ${currentPage} sur ${Math.ceil(totalBooks.length / itemsPerPage)})`
                    : `(الصفحة ${currentPage} من ${Math.ceil(totalBooks.length / itemsPerPage)})`}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className={`md:hidden ${theme === 'light' ? 'border-[#dcd6c3]' : 'border-primary/20'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === 'en' ? "Filters" : language === 'fr' ? "Filtres" : "تصفية"}
            </Button>

            <div className="hidden md:flex items-center gap-2">
              <span className={`text-sm ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                {language === 'en' ? "Sort by:" : language === 'fr' ? "Trier par:" : "ترتيب حسب:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`text-sm p-2 rounded-md ${theme === 'light' ? 'bg-white border-[#dcd6c3] text-[#5c5a4e]' : 'bg-card border-primary/20 text-white'} border focus:outline-none focus:ring-1 ${theme === 'light' ? 'focus:ring-[#ded7ba]' : 'focus:ring-primary'}`}
              >
                <option value="newest">{language === 'en' ? "Newest" : language === 'fr' ? "Plus récent" : "الأحدث"}</option>
                <option value="popular">{language === 'en' ? "Most Popular" : language === 'fr' ? "Plus populaire" : "الأكثر شعبية"}</option>
                <option value="price-low">{language === 'en' ? "Price: Low to High" : language === 'fr' ? "Prix: croissant" : "السعر: من الأقل إلى الأعلى"}</option>
                <option value="price-high">{language === 'en' ? "Price: High to Low" : language === 'fr' ? "Prix: décroissant" : "السعر: من الأعلى إلى الأقل"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden mb-6 p-4 rounded-lg border bg-card">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">
                {language === 'en' ? "Sort by" : language === 'fr' ? "Trier par" : "ترتيب حسب"}
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full text-sm p-2 rounded-md ${theme === 'light' ? 'bg-white border-[#dcd6c3] text-[#5c5a4e]' : 'bg-card border-primary/20 text-white'} border focus:outline-none focus:ring-1 ${theme === 'light' ? 'focus:ring-[#ded7ba]' : 'focus:ring-primary'}`}
              >
                <option value="newest">{language === 'en' ? "Newest" : language === 'fr' ? "Plus récent" : "الأحدث"}</option>
                <option value="popular">{language === 'en' ? "Most Popular" : language === 'fr' ? "Plus populaire" : "الأكثر شعبية"}</option>
                <option value="price-low">{language === 'en' ? "Price: Low to High" : language === 'fr' ? "Prix: croissant" : "السعر: من الأقل إلى الأعلى"}</option>
                <option value="price-high">{language === 'en' ? "Price: High to Low" : language === 'fr' ? "Prix: décroissant" : "السعر: من الأعلى إلى الأقل"}</option>
              </select>
            </div>

            <Button
              className="w-full"
              onClick={() => setShowFilters(false)}
            >
              {language === 'en' ? "Apply Filters" : language === 'fr' ? "Appliquer les filtres" : "تطبيق الفلاتر"}
            </Button>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading state with skeleton cards
            Array(6).fill(0).map((_, index) => (
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
              <p className={`text-lg ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                {language === 'en' ? "No books available in this category." :
                 language === 'fr' ? "Aucun livre disponible dans cette catégorie." :
                 "لا توجد كتب متاحة في هذه الفئة."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalBooks.length > itemsPerPage && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}
              >
                {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
                <span className="ml-1">
                  {language === 'en' ? "Previous" : language === 'fr' ? "Précédent" : "السابق"}
                </span>
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: Math.ceil(totalBooks.length / itemsPerPage) }, (_, i) => i + 1)
                .map(pageNum => (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    className={`${pageNum === currentPage
                      ? (theme === 'light'
                        ? 'bg-[#f3edda] border-[#e7e1c8] text-[#398564]'
                        : 'bg-primary/10 border-primary/20 text-primary')
                      : (theme === 'light'
                        ? 'border-[#e7e1c8]'
                        : 'border-primary/20')}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))
              }

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalBooks.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(totalBooks.length / itemsPerPage)}
                className={`${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}
              >
                <span className="mr-1">
                  {language === 'en' ? "Next" : language === 'fr' ? "Suivant" : "التالي"}
                </span>
                {isRTL ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;
