import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import BookCard from '@/components/BookCard';
import { BookData } from '@/data/books';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchQuranBooks } from '@/services/bookService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  BookMarked,
  ChevronDown,
  ChevronRight,
  X,
  SlidersHorizontal,
  Languages,
  BookText,
  Bookmark
} from 'lucide-react';
const QuranPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  // State for Quran books and filters
  const [allQuranBooks, setAllQuranBooks] = useState<BookData[]>([]);
  const [filteredQuran, setFilteredQuran] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load Quran books
  useEffect(() => {
    const loadQuranBooks = async () => {
      try {
        setIsLoading(true);
        const quranBooks = await fetchQuranBooks();
        setAllQuranBooks(quranBooks);
        setFilteredQuran(quranBooks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading quran books:', error);
        toast.error("Failed to load Quran books. Please try again.");
        setIsLoading(false);
      }
    };
    loadQuranBooks();
  }, []);

  // Get unique languages for Quran with null check
  const languages = [...new Set(allQuranBooks
    .filter(book => book && book.language) // Filter out null/undefined values
    .map(book => book.language))];

  // Get unique types for Quran
  const types = [...new Set(allQuranBooks
    .filter(book => book && book.type)
    .map(book => book.type))];

  // Get min and max prices
  const prices = allQuranBooks
    .filter(book => book && typeof book.price === 'number')
    .map(book => book.price as number);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;



  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, languageFilter, typeFilter, priceRangeFilter, sortBy);
  };

  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value);
    applyFilters(searchQuery, value, typeFilter, priceRangeFilter, sortBy);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    applyFilters(searchQuery, languageFilter, value, priceRangeFilter, sortBy);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRangeFilter(range);
    applyFilters(searchQuery, languageFilter, typeFilter, range, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(searchQuery, languageFilter, typeFilter, priceRangeFilter, value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLanguageFilter('all');
    setTypeFilter('all');
    setPriceRangeFilter([minPrice, maxPrice]);
    setSortBy('default');
    setFilteredQuran(allQuranBooks);
    setShowMobileFilters(false);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, languageFilter, typeFilter, priceRangeFilter, sortBy]);

  // Apply all filters
  const applyFilters = (
    search: string,
    lang: string,
    type: string,
    priceRange: [number, number],
    sort: string
  ) => {
    if (!allQuranBooks || allQuranBooks.length === 0) {
      setFilteredQuran([]);
      return;
    }

    let result = [...allQuranBooks];

    // Apply search filter
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      result = result.filter(book =>
        book &&
        (
          (book.title && book.title.toLowerCase().includes(searchLower)) ||
          (book.author && book.author.toLowerCase().includes(searchLower)) ||
          (book.description && book.description.toLowerCase().includes(searchLower))
        )
      );
    }

    // Apply language filter
    if (lang !== 'all') {
      result = result.filter(book => book && book.language === lang);
    }

    // Apply type filter
    if (type !== 'all') {
      result = result.filter(book => book && book.type === type);
    }

    // Apply price range filter
    result = result.filter(book =>
      book &&
      typeof book.price === 'number' &&
      book.price >= priceRange[0] &&
      book.price <= priceRange[1]
    );

    // Apply sorting
    switch (sort) {
      case 'priceAsc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceDesc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'nameAsc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'nameDesc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'newest':
        result.sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default sorting - keep as is
        break;
    }

    setFilteredQuran(result);
  };
  return (
    <main className={`${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2000"
            alt="Quran Background"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${theme === 'light' ? 'bg-[#398564]/80' : 'bg-primary/80'}`}></div>
          <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'light' ? 'from-[#398564]/90 via-[#398564]/80 to-[#f3edda]' : 'from-primary/90 via-primary/80 to-background'}`}></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className={`max-w-3xl mx-auto text-center ${isRTL ? 'rtl' : ''}`}>
            <Badge className={`mb-4 px-3 py-1 text-sm ${theme === 'light' ? 'bg-white/90 text-[#398564]' : 'bg-white/20 text-white'}`}>
              {language === 'en' ? "Holy Quran Collection" :
               language === 'fr' ? "Collection du Saint Coran" :
               "مجموعة القرآن الكريم"}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              {language === 'en' ? "Explore the Holy Quran" :
               language === 'fr' ? "Explorez le Saint Coran" :
               "استكشف القرآن الكريم"}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {language === 'en' ? "Discover our collection of beautifully crafted Quran editions in various languages, styles, and formats." :
               language === 'fr' ? "Découvrez notre collection d'éditions du Coran magnifiquement conçues en différentes langues, styles et formats." :
               "اكتشف مجموعتنا من إصدارات القرآن المصممة بشكل جميل بلغات وأساليب وتنسيقات مختلفة."}
            </p>

            {/* Search Bar */}
            <div className={`max-w-xl mx-auto relative ${theme === 'light' ? 'bg-white/90' : 'bg-card/90'} rounded-full shadow-lg p-1 backdrop-blur-sm`}>
              <form onSubmit={(e) => {
                e.preventDefault();

                // Apply filters first
                applyFilters(searchQuery, languageFilter, typeFilter, priceRangeFilter, sortBy);

                // Check if there's only one result after filtering
                const results = allQuranBooks.filter(book =>
                  book &&
                  (book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   book.description?.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                // If there's exactly one result, redirect to that Quran's detail page
                if (results.length === 1 && searchQuery.trim() !== '') {
                  window.location.href = `/quran/${results[0].id}`;
                }
              }} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={language === 'en' ? "Search Quran editions..." :
                               language === 'fr' ? "Rechercher des éditions du Coran..." :
                               "البحث عن إصدارات القرآن..."}
                  className={`flex-grow px-5 py-3 bg-transparent border-none focus:outline-none text-sm ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}
                />
                <button
                  type="submit"
                  className={`px-5 py-3 rounded-full ${theme === 'light' ? 'bg-[#398564] text-white' : 'bg-primary text-white'} flex items-center justify-center transition-colors hover:opacity-90`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('search')}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>



      {/* Main Quran Catalog */}
      <section className="py-16">
        <div className="container">
          <div className={`flex flex-col md:flex-row gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Filters Sidebar */}
            <div className="w-full md:w-1/4">
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-card'} p-6 rounded-xl shadow-sm sticky top-4`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                    {t('filters')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs ${theme === 'light' ? 'text-[#398564] hover:bg-[#f3edda]' : 'text-primary hover:bg-primary/10'}`}
                    onClick={clearFilters}
                  >
                    {t('clearAll')}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Language Filter */}
                  <div>
                    <Label htmlFor="language-filter" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'} ${isRTL ? 'text-right' : ''}`}>
                      {t('language')}
                    </Label>
                    <Select value={languageFilter} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language-filter" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                        <SelectValue placeholder={t('allLanguages')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('allLanguages')}</SelectItem>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  {types.length > 0 && (
                    <div>
                      <Label htmlFor="type-filter" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'} ${isRTL ? 'text-right' : ''}`}>
                        {language === 'en' ? "Type" : language === 'fr' ? "Type" : "النوع"}
                      </Label>
                      <Select value={typeFilter} onValueChange={handleTypeChange}>
                        <SelectTrigger id="type-filter" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                          <SelectValue placeholder={language === 'en' ? "All Types" : language === 'fr' ? "Tous les types" : "جميع الأنواع"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{language === 'en' ? "All Types" : language === 'fr' ? "Tous les types" : "جميع الأنواع"}</SelectItem>
                          {types.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Sort By */}
                  <div>
                    <Label htmlFor="sort-by" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'} ${isRTL ? 'text-right' : ''}`}>
                      {t('sortBy')}
                    </Label>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger id="sort-by" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                        <SelectValue placeholder={t('default')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">{t('default')}</SelectItem>
                        <SelectItem value="newest">{language === 'en' ? "Newest" : language === 'fr' ? "Plus récent" : "الأحدث"}</SelectItem>
                        <SelectItem value="popular">{language === 'en' ? "Most Popular" : language === 'fr' ? "Plus populaire" : "الأكثر شعبية"}</SelectItem>
                        <SelectItem value="priceAsc">{t('priceLowToHigh')}</SelectItem>
                        <SelectItem value="priceDesc">{t('priceHighToLow')}</SelectItem>
                        <SelectItem value="nameAsc">{t('nameAZ')}</SelectItem>
                        <SelectItem value="nameDesc">{t('nameZA')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Quran Books Grid */}
            <div className="w-full md:w-3/4">
              {/* Mobile Filters Toggle */}
              <div className="md:hidden mb-6">
                <Button
                  variant="outline"
                  className={`w-full ${theme === 'light' ? 'border-[#e7e1c8] text-[#5c5a4e]' : 'border-primary/20 text-white'}`}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters')}
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </Button>

                {showMobileFilters && (
                  <div className={`mt-4 p-4 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-card'} border ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}>
                    <div className="space-y-4">
                      {/* Search */}
                      <div>
                        <Label htmlFor="mobile-search" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                          {t('search')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="mobile-search"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={language === 'en' ? "Search Quran editions..." :
                                         language === 'fr' ? "Rechercher des éditions du Coran..." :
                                         "البحث عن إصدارات القرآن..."}
                            className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/30' : 'border-primary/20 bg-card'}`}
                          />
                          <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                        </div>
                      </div>

                      {/* Language Filter */}
                      <div>
                        <Label htmlFor="mobile-language-filter" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                          {t('language')}
                        </Label>
                        <Select value={languageFilter} onValueChange={handleLanguageChange}>
                          <SelectTrigger id="mobile-language-filter" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                            <SelectValue placeholder={t('allLanguages')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t('allLanguages')}</SelectItem>
                            {languages.map(lang => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort By */}
                      <div>
                        <Label htmlFor="mobile-sort-by" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                          {t('sortBy')}
                        </Label>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                          <SelectTrigger id="mobile-sort-by" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                            <SelectValue placeholder={t('default')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">{t('default')}</SelectItem>
                            <SelectItem value="newest">{language === 'en' ? "Newest" : language === 'fr' ? "Plus récent" : "الأحدث"}</SelectItem>
                            <SelectItem value="popular">{language === 'en' ? "Most Popular" : language === 'fr' ? "Plus populaire" : "الأكثر شعبية"}</SelectItem>
                            <SelectItem value="priceAsc">{t('priceLowToHigh')}</SelectItem>
                            <SelectItem value="priceDesc">{t('priceHighToLow')}</SelectItem>
                            <SelectItem value="nameAsc">{t('nameAZ')}</SelectItem>
                            <SelectItem value="nameDesc">{t('nameZA')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${theme === 'light' ? 'border-[#e7e1c8] text-[#5c5a4e]' : 'border-primary/20 text-white'}`}
                          onClick={clearFilters}
                        >
                          {t('clearAll')}
                        </Button>
                        <Button
                          size="sm"
                          className={`${theme === 'light' ? 'bg-[#398564] text-white' : 'bg-primary text-white'}`}
                          onClick={() => setShowMobileFilters(false)}
                        >
                          {language === 'en' ? "Apply" : language === 'fr' ? "Appliquer" : "تطبيق"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                  {filteredQuran.length} {language === 'en' ? "Quran Editions" : language === 'fr' ? "Éditions du Coran" : "إصدارات القرآن"}
                  {filteredQuran.length > itemsPerPage && (
                    <span className={`ml-2 text-sm font-normal ${theme === 'light' ? 'text-[#5c5a4e]/70' : 'text-white/70'}`}>
                      {language === 'en'
                        ? `(Page ${currentPage} of ${Math.ceil(filteredQuran.length / itemsPerPage)})`
                        : language === 'fr'
                        ? `(Page ${currentPage} sur ${Math.ceil(filteredQuran.length / itemsPerPage)})`
                        : `(الصفحة ${currentPage} من ${Math.ceil(filteredQuran.length / itemsPerPage)})`}
                    </span>
                  )}
                </h2>

                {searchQuery && (
                  <div className={`text-sm ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white/70'}`}>
                    {language === 'en' ? `Search results for "${searchQuery}"` :
                     language === 'fr' ? `Résultats de recherche pour "${searchQuery}"` :
                     `نتائج البحث عن "${searchQuery}"`}
                  </div>
                )}
              </div>

              {/* Quran Books Grid */}
              {isLoading ? (
                // Loading state with skeleton cards
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className={`${theme === 'light' ? 'bg-[#e7e1c8]/50' : 'bg-card/50'} rounded-lg shadow-sm h-64 mb-4`}></div>
                      <div className={`h-4 ${theme === 'light' ? 'bg-[#e7e1c8]/50' : 'bg-card/50'} rounded w-3/4 mb-2`}></div>
                      <div className={`h-3 ${theme === 'light' ? 'bg-[#e7e1c8]/50' : 'bg-card/50'} rounded w-1/2 mb-2`}></div>
                      <div className={`h-4 ${theme === 'light' ? 'bg-[#e7e1c8]/50' : 'bg-card/50'} rounded w-1/4`}></div>
                    </div>
                  ))}
                </div>
              ) : filteredQuran.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuran
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map(book => book && <BookCard key={book.id} book={book} />)}
                  </div>

                  {/* Pagination */}
                  {filteredQuran.length > itemsPerPage && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          {language === 'en' ? "Previous" : language === 'fr' ? "Précédent" : "السابق"}
                        </Button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.ceil(filteredQuran.length / itemsPerPage) }, (_, i) => i + 1)
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
                          className={`${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredQuran.length / itemsPerPage)))}
                          disabled={currentPage === Math.ceil(filteredQuran.length / itemsPerPage)}
                        >
                          {language === 'en' ? "Next" : language === 'fr' ? "Suivant" : "التالي"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-card'} p-8 rounded-lg text-center border ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}>
                  <BookText className={`h-12 w-12 mx-auto mb-4 ${theme === 'light' ? 'text-[#398564]/50' : 'text-primary/50'}`} />
                  <p className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                    {t('noQuranFound')}
                  </p>
                  <p className={`text-sm ${theme === 'light' ? 'text-[#5c5a4e]/70' : 'text-white/70'} mb-4`}>
                    {t('tryDifferentFilters')}
                  </p>
                  <Button
                    variant="outline"
                    className={`${theme === 'light' ? 'border-[#e7e1c8] text-[#398564]' : 'border-primary/20 text-primary'}`}
                    onClick={clearFilters}
                  >
                    {t('clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className={`py-16 ${theme === 'light' ? 'bg-[#f3edda]/50' : 'bg-card/5'}`}>
        <div className="container">
          <div className={`max-w-3xl mx-auto text-center ${isRTL ? 'rtl' : ''}`}>
            <Badge className={`mb-4 ${theme === 'light' ? 'bg-[#e7e1c8] text-[#398564]' : 'bg-primary/20 text-primary'}`}>
              {language === 'en' ? "About Our Collection" :
               language === 'fr' ? "À propos de notre collection" :
               "حول مجموعتنا"}
            </Badge>

            <h2 className={`text-2xl md:text-3xl font-serif font-bold mb-6 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "The Holy Quran: Guidance for Humanity" :
               language === 'fr' ? "Le Saint Coran : Guide pour l'humanité" :
               "القرآن الكريم: هداية للبشرية"}
            </h2>

            <p className={`mb-6 ${theme === 'light' ? 'text-[#5c5a4e]/90' : 'text-white/80'}`}>
              {language === 'en' ?
                "Our collection features a wide range of Quran editions, including different translations, tafsirs (interpretations), and beautiful print formats. We carefully select each edition to ensure quality and authenticity." :
               language === 'fr' ?
                "Notre collection comprend une large gamme d'éditions du Coran, y compris différentes traductions, tafsirs (interprétations) et de beaux formats d'impression. Nous sélectionnons soigneusement chaque édition pour garantir la qualité et l'authenticité." :
                "تضم مجموعتنا مجموعة واسعة من إصدارات القرآن، بما في ذلك الترجمات المختلفة والتفاسير وتنسيقات الطباعة الجميلة. نحن نختار بعناية كل إصدار لضمان الجودة والأصالة."}
            </p>

            <p className={`${theme === 'light' ? 'text-[#5c5a4e]/90' : 'text-white/80'}`}>
              {language === 'en' ?
                "Whether you're looking for a study Quran with detailed commentary, a beautifully illustrated edition for gifts, or a simple translation for daily reading, you'll find it in our collection." :
               language === 'fr' ?
                "Que vous recherchiez un Coran d'étude avec des commentaires détaillés, une édition magnifiquement illustrée pour des cadeaux ou une simple traduction pour la lecture quotidienne, vous le trouverez dans notre collection." :
                "سواء كنت تبحث عن قرآن للدراسة مع تعليقات مفصلة، أو إصدار مزين بالرسوم التوضيحية للهدايا، أو ترجمة بسيطة للقراءة اليومية، ستجده في مجموعتنا."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
export default QuranPage;