import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { BookOpen, BookMarked, Bookmark, Users, History, GraduationCap, BookText, Layers, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchBooks, fetchQuranBooks } from '@/services/bookService';
import { BookData } from '@/data/books';

// Define category type
interface Category {
  id: string;
  icon: React.ReactNode;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  count: number;
  image: string;
}

const Categories = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  const [allBooks, setAllBooks] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Load all books to count by category
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        const [books, quranBooks] = await Promise.all([fetchBooks(), fetchQuranBooks()]);
        const combinedBooks = [...books, ...quranBooks].filter(Boolean);
        setAllBooks(combinedBooks);

        // Count books by category
        const counts: Record<string, number> = {};
        combinedBooks.forEach(book => {
          if (book.category) {
            const categoryId = book.category.toLowerCase().replace(/\s+/g, '-');
            counts[categoryId] = (counts[categoryId] || 0) + 1;
          }

          // Special case for Quran
          if (book.category === 'Quran') {
            counts['quran'] = (counts['quran'] || 0) + 1;
          }
        });

        setCategoryCounts(counts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Categories data
  const categories: Category[] = [
    {
      id: 'islamic-studies',
      icon: <BookOpen className="h-6 w-6" />,
      name: {
        en: 'Islamic Studies',
        fr: 'Études Islamiques',
        ar: 'الدراسات الإسلامية'
      },
      description: {
        en: 'Books on Islamic theology, jurisprudence, and principles of faith.',
        fr: 'Livres sur la théologie islamique, la jurisprudence et les principes de la foi.',
        ar: 'كتب في العقيدة الإسلامية والفقه وأصول الدين.'
      },
      count: 42,
      image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400'
    },
    {
      id: 'quran',
      icon: <BookMarked className="h-6 w-6" />,
      name: {
        en: 'Quran',
        fr: 'Coran',
        ar: 'القرآن'
      },
      description: {
        en: 'Various editions of the Holy Quran, including translations and tafsir.',
        fr: 'Différentes éditions du Saint Coran, y compris des traductions et des tafsirs.',
        ar: 'إصدارات مختلفة من القرآن الكريم، بما في ذلك الترجمات والتفاسير.'
      },
      count: 28,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=400'
    },
    {
      id: 'history',
      icon: <History className="h-6 w-6" />,
      name: {
        en: 'History',
        fr: 'Histoire',
        ar: 'التاريخ'
      },
      description: {
        en: 'Books on Islamic history, civilizations, and historical events.',
        fr: 'Livres sur l\'histoire islamique, les civilisations et les événements historiques.',
        ar: 'كتب عن التاريخ الإسلامي والحضارات والأحداث التاريخية.'
      },
      count: 35,
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400'
    },
    {
      id: 'biography',
      icon: <Users className="h-6 w-6" />,
      name: {
        en: 'Biography',
        fr: 'Biographie',
        ar: 'السيرة الذاتية'
      },
      description: {
        en: 'Biographies of prophets, companions, scholars, and important Islamic figures.',
        fr: 'Biographies des prophètes, des compagnons, des savants et des figures islamiques importantes.',
        ar: 'سير الأنبياء والصحابة والعلماء والشخصيات الإسلامية المهمة.'
      },
      count: 24,
      image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=400'
    },
    {
      id: 'children',
      icon: <BookOpen className="h-6 w-6" />,
      name: {
        en: 'Children',
        fr: 'Enfants',
        ar: 'الأطفال'
      },
      description: {
        en: 'Islamic books for children and young readers.',
        fr: 'Livres islamiques pour enfants et jeunes lecteurs.',
        ar: 'كتب إسلامية للأطفال والقراء الصغار.'
      },
      count: 19,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400'
    },
    {
      id: 'education',
      icon: <GraduationCap className="h-6 w-6" />,
      name: {
        en: 'Education',
        fr: 'Éducation',
        ar: 'التعليم'
      },
      description: {
        en: 'Books on Islamic education, teaching methods, and learning resources.',
        fr: 'Livres sur l\'éducation islamique, les méthodes d\'enseignement et les ressources d\'apprentissage.',
        ar: 'كتب عن التعليم الإسلامي وطرق التدريس وموارد التعلم.'
      },
      count: 15,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400'
    },
    {
      id: 'literature',
      icon: <BookText className="h-6 w-6" />,
      name: {
        en: 'Literature',
        fr: 'Littérature',
        ar: 'الأدب'
      },
      description: {
        en: 'Islamic literature, poetry, and fiction with Islamic themes.',
        fr: 'Littérature islamique, poésie et fiction à thèmes islamiques.',
        ar: 'الأدب الإسلامي والشعر والقصص ذات المواضيع الإسلامية.'
      },
      count: 22,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400'
    },
    {
      id: 'spirituality',
      icon: <Bookmark className="h-6 w-6" />,
      name: {
        en: 'Spirituality',
        fr: 'Spiritualité',
        ar: 'الروحانية'
      },
      description: {
        en: 'Books on Islamic spirituality, Sufism, and personal development.',
        fr: 'Livres sur la spiritualité islamique, le soufisme et le développement personnel.',
        ar: 'كتب عن الروحانية الإسلامية والتصوف والتنمية الشخصية.'
      },
      count: 31,
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=400'
    },
    {
      id: 'other',
      icon: <Layers className="h-6 w-6" />,
      name: {
        en: 'Other Categories',
        fr: 'Autres Catégories',
        ar: 'فئات أخرى'
      },
      description: {
        en: 'Various other Islamic books and resources.',
        fr: 'Divers autres livres et ressources islamiques.',
        ar: 'كتب وموارد إسلامية متنوعة أخرى.'
      },
      count: 17,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400'
    }
  ];

  // Filter categories based on search
  const filteredCategories = searchQuery.trim() === ''
    ? categories
    : categories.filter(category => {
        const nameEn = category.name.en.toLowerCase();
        const nameFr = category.name.fr.toLowerCase();
        const nameAr = category.name.ar.toLowerCase();
        const descEn = category.description.en.toLowerCase();
        const descFr = category.description.fr.toLowerCase();
        const descAr = category.description.ar.toLowerCase();
        const query = searchQuery.toLowerCase();

        return nameEn.includes(query) || nameFr.includes(query) || nameAr.includes(query) ||
               descEn.includes(query) || descFr.includes(query) || descAr.includes(query);
      });

  // Get actual book count for a category
  const getBookCount = (categoryId: string): number => {
    return categoryCounts[categoryId] || 0;
  };

  return (
    <main className={`py-8 md:py-12 ${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'}`}>
      <div className="container">
        {/* Page Header */}
        <div className={`text-center mb-8 ${isRTL ? 'rtl' : ''}`}>
          <Badge className={`mb-2 ${theme === 'light' ? 'bg-[#e7e1c8] text-[#398564]' : 'bg-primary/20 text-primary'}`}>
            {language === 'en' ? "Categories" : language === 'fr' ? "Catégories" : "الفئات"}
          </Badge>
          <h1 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
            {language === 'en' ? "Browse by categories" :
             language === 'fr' ? "Parcourir par catégories" :
             "تصفح حسب الفئات"}
          </h1>
          <p className={`max-w-2xl mx-auto ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
            {language === 'en' ? "Explore our wide range of books organized by categories to find exactly what you're looking for." :
             language === 'fr' ? "Explorez notre large gamme de livres organisés par catégories pour trouver exactement ce que vous cherchez." :
             "استكشف مجموعتنا الواسعة من الكتب المنظمة حسب الفئات للعثور على ما تبحث عنه بالضبط."}
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto mt-6">
            <div className={`relative ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={
                  language === 'en' ? "Search categories..." :
                  language === 'fr' ? "Rechercher des catégories..." :
                  "البحث في الفئات..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${theme === 'light' ? 'bg-white border-[#dcd6c3] focus-visible:ring-[#398564]' : 'bg-card border-primary/20 focus-visible:ring-primary'}`}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className={`animate-pulse rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-card'} shadow-md h-80`}>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          // Categories Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={category.id === 'quran' ? '/quran' : `/categories/${category.id}`}
                className={`group relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-card'} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border ${theme === 'light' ? 'border-[#dcd6c3]' : 'border-primary/20'}`}
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light' ? 'from-[#ded7ba]/50 to-transparent' : 'from-primary/50 to-transparent'}`}></div>
                  <img
                    src={category.image}
                    alt={category.name[language as keyof typeof category.name]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full ${theme === 'light' ? 'bg-white/80 text-[#5c5a4e]' : 'bg-card/80 text-white'} text-xs font-medium`}>
                    <span>{getBookCount(category.id)}</span>
                    <span>{language === 'en' ? "Books" : language === 'fr' ? "Livres" : "كتاب"}</span>
                  </div>
                </div>

                {/* Category Content */}
                <div className={`p-6 flex-grow flex flex-col ${isRTL ? 'rtl text-right' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-[#ded7ba]/20 text-[#5c5a4e]' : 'bg-primary/20 text-primary'}`}>
                      {category.icon}
                    </div>
                    <h2 className={`text-xl font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                      {category.name[language as keyof typeof category.name]}
                    </h2>
                  </div>

                  <p className={`mb-4 text-sm ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                    {category.description[language as keyof typeof category.description]}
                  </p>

                  <div className={`mt-auto pt-4 border-t ${theme === 'light' ? 'border-[#dcd6c3]' : 'border-primary/10'}`}>
                    <span className={`text-sm font-medium flex items-center ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-primary'} group-hover:underline`}>
                      {language === 'en' ? "Browse Category" :
                       language === 'fr' ? "Parcourir la Catégorie" :
                       "تصفح الفئة"}
                      {!isRTL ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // No results
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "No categories found matching your search." :
               language === 'fr' ? "Aucune catégorie trouvée correspondant à votre recherche." :
               "لم يتم العثور على فئات تطابق بحثك."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Categories;
