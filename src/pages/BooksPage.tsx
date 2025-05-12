
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import { BookData } from '@/data/books';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchBooks } from '@/services/bookService';
import { toast } from 'sonner';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import {
  BookOpen,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  BookText,
  BookMarked,
  Bookmark,
  SlidersHorizontal,
  X,
  Languages
} from 'lucide-react';

const BooksPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  // State for books and filters
  const [allBooks, setAllBooks] = useState<BookData[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Refs for scroll animations
  const popularRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        const books = await fetchBooks();

        // Filter out null books and books with Quran category
        const validBooks = (books || []).filter(book => book && book.category !== "Quran");

        setAllBooks(validBooks);
        setFilteredBooks(validBooks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        toast.error("Failed to load books. Please try again.");
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Get unique categories and languages with null checks
  const categories = [...new Set(allBooks
    .filter(book => book && book.category && book.category !== "Quran")
    .map(book => book.category))];

  const languages = [...new Set(allBooks
    .filter(book => book && book.language)
    .map(book => book.language))];

  // Get unique authors
  const authors = [...new Set(allBooks
    .filter(book => book && book.author)
    .map(book => book.author))];

  // Get min and max prices
  const prices = allBooks
    .filter(book => book && typeof book.price === 'number')
    .map(book => book.price as number);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  // Popular books
  const popularBooks = allBooks
    .filter(book => book && book.bestSeller)
    .slice(0, 4);

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, categoryFilter, languageFilter, authorFilter, priceRangeFilter, sortBy);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    applyFilters(searchQuery, value, languageFilter, authorFilter, priceRangeFilter, sortBy);
  };

  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value);
    applyFilters(searchQuery, categoryFilter, value, authorFilter, priceRangeFilter, sortBy);
  };

  const handleAuthorChange = (value: string) => {
    setAuthorFilter(value);
    applyFilters(searchQuery, categoryFilter, languageFilter, value, priceRangeFilter, sortBy);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRangeFilter(range);
    applyFilters(searchQuery, categoryFilter, languageFilter, authorFilter, range, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(searchQuery, categoryFilter, languageFilter, authorFilter, priceRangeFilter, value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setLanguageFilter('all');
    setAuthorFilter('all');
    setPriceRangeFilter([minPrice, maxPrice]);
    setSortBy('default');
    setFilteredBooks(allBooks);
    setShowMobileFilters(false);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, languageFilter, authorFilter, priceRangeFilter, sortBy]);

  // Apply all filters
  const applyFilters = (
    search: string,
    category: string,
    lang: string,
    author: string,
    priceRange: [number, number],
    sort: string
  ) => {
    if (!allBooks || allBooks.length === 0) {
      setFilteredBooks([]);
      return;
    }

    let result = [...allBooks];

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

    // Apply category filter
    if (category !== 'all') {
      result = result.filter(book => book && book.category === category);
    }

    // Apply language filter
    if (lang !== 'all') {
      result = result.filter(book => book && book.language === lang);
    }

    // Apply author filter
    if (author !== 'all') {
      result = result.filter(book => book && book.author === author);
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
        result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case 'priceDesc':
        result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case 'nameAsc':
        result.sort((a, b) => (a?.title || '').localeCompare(b?.title || ''));
        break;
      case 'nameDesc':
        result.sort((a, b) => (b?.title || '').localeCompare(a?.title || ''));
        break;
      case 'newest':
        result.sort((a, b) => (b?.publishDate || 0) - (a?.publishDate || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
        break;
      default:
        // Default sorting - keep as is
        break;
    }

    setFilteredBooks(result);
  };

  const breadcrumbItems = [
    { label: t('home'), path: '/' },
    { label: t('books') }
  ];

  return (
    <main className={`${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000"
            alt="Books Background"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${theme === 'light' ? 'bg-[#398564]/80' : 'bg-primary/80'}`}></div>
          <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'light' ? 'from-[#398564]/90 via-[#398564]/80 to-[#f3edda]' : 'from-primary/90 via-primary/80 to-background'}`}></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className={`max-w-3xl mx-auto text-center ${isRTL ? 'rtl' : ''}`}>
            <Badge className={`mb-4 px-3 py-1 text-sm ${theme === 'light' ? 'bg-white/90 text-[#398564]' : 'bg-white/20 text-white'}`}>
              {language === 'en' ? "Book Collection" :
               language === 'fr' ? "Collection de Livres" :
               "مجموعة الكتب"}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              {language === 'en' ? "Explore Our Book Collection" :
               language === 'fr' ? "Explorez Notre Collection de Livres" :
               "استكشف مجموعة كتبنا"}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {language === 'en' ? "Discover our extensive collection of books covering various topics, genres, and languages." :
               language === 'fr' ? "Découvrez notre vaste collection de livres couvrant divers sujets, genres et langues." :
               "اكتشف مجموعتنا الواسعة من الكتب التي تغطي مواضيع وأنواع ولغات مختلفة."}
            </p>

            {/* Search Bar */}
            <div className={`max-w-xl mx-auto relative ${theme === 'light' ? 'bg-white/90' : 'bg-card/90'} rounded-full shadow-lg p-1 backdrop-blur-sm`}>
              <form onSubmit={(e) => {
                e.preventDefault();

                // Apply filters first
                applyFilters(searchQuery, categoryFilter, languageFilter, authorFilter, priceRangeFilter, sortBy);

                // Check if there's only one result after filtering
                const results = allBooks.filter(book =>
                  book &&
                  (book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   book.description?.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                // If there's exactly one result, redirect to that book's detail page
                if (results.length === 1 && searchQuery.trim() !== '') {
                  window.location.href = `/books/${results[0].id}`;
                }
              }} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={language === 'en' ? "Search books..." :
                               language === 'fr' ? "Rechercher des livres..." :
                               "البحث عن الكتب..."}
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

      {/* Main Books Catalog */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8">
            <Badge className={`mb-2 ${theme === 'light' ? 'bg-[#e7e1c8] text-[#398564]' : 'bg-primary/20 text-primary'}`}>
              {language === 'en' ? "Browse" : language === 'fr' ? "Parcourir" : "تصفح"}
            </Badge>
            <h2 className={`text-2xl md:text-3xl font-serif font-bold ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {language === 'en' ? "Explore Our Book Collection" :
               language === 'fr' ? "Explorez notre collection de livres" :
               "استكشف مجموعة كتبنا"}
            </h2>
          </div>

          <div className={`flex flex-col md:flex-row gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Filters Sidebar */}
            <div className="w-full md:w-1/4">
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-card'} p-6 rounded-xl shadow-sm sticky top-4 border ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className={`h-5 w-5 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                    <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                      {t('filters')}
                    </h2>
                  </div>
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
                  {/* Category Filter */}
                  <div>
                    <Label htmlFor="category-filter" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'} ${isRTL ? 'text-right' : ''}`}>
                      {t('category')}
                    </Label>
                    <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category-filter" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                        <SelectValue placeholder={t('allCategories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Author Filter */}
                  {authors.length > 0 && (
                    <div>
                      <Label htmlFor="author-filter" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'} ${isRTL ? 'text-right' : ''}`}>
                        {t('author')}
                      </Label>
                      <Select value={authorFilter} onValueChange={handleAuthorChange}>
                        <SelectTrigger id="author-filter" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                          <SelectValue placeholder={t('allAuthors')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('allAuthors')}</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author} value={author}>{author}</SelectItem>
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

            {/* Books Grid */}
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
                            placeholder={language === 'en' ? "Search books..." :
                                         language === 'fr' ? "Rechercher des livres..." :
                                         "البحث عن الكتب..."}
                            className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/30' : 'border-primary/20 bg-card'}`}
                          />
                          <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <Label htmlFor="mobile-category-filter" className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                          {t('category')}
                        </Label>
                        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                          <SelectTrigger id="mobile-category-filter" className={`${theme === 'light' ? 'border-[#e7e1c8] bg-[#f3edda]/50' : 'border-primary/20 bg-card'}`}>
                            <SelectValue placeholder={t('allCategories')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t('allCategories')}</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
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
                  {filteredBooks.length} {language === 'en' ? "Books" : language === 'fr' ? "Livres" : "كتب"}
                  {filteredBooks.length > itemsPerPage && (
                    <span className={`ml-2 text-sm font-normal ${theme === 'light' ? 'text-[#5c5a4e]/70' : 'text-white/70'}`}>
                      {language === 'en'
                        ? `(Page ${currentPage} of ${Math.ceil(filteredBooks.length / itemsPerPage)})`
                        : language === 'fr'
                        ? `(Page ${currentPage} sur ${Math.ceil(filteredBooks.length / itemsPerPage)})`
                        : `(الصفحة ${currentPage} من ${Math.ceil(filteredBooks.length / itemsPerPage)})`}
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

              {/* Books Grid */}
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
              ) : filteredBooks.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBooks
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map(book => book && <BookCard key={book.id} book={book} />)}
                  </div>

                  {/* Pagination */}
                  {filteredBooks.length > itemsPerPage && (
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
                        {Array.from({ length: Math.ceil(filteredBooks.length / itemsPerPage) }, (_, i) => i + 1)
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
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredBooks.length / itemsPerPage)))}
                          disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}
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
                    {t('noBooks')}
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
    </main>
  );
};

export default BooksPage;
