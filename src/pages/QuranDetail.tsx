
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Book } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { fetchQuranBooks } from '@/services/bookService';
import { toast } from 'sonner';
import BreadcrumbNav from '@/components/BreadcrumbNav';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookCard from '@/components/BookCard';
import BookCover3D from '@/components/BookCover3D';

// Icons
import {
  MinusIcon,
  PlusIcon,
  ShoppingCart,
  ArrowLeft,
  BookOpen,
  Share,
  Bookmark
} from 'lucide-react';

const QuranDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [quran, setQuran] = useState<Book | null>(null);
  const [relatedQurans, setRelatedQurans] = useState<Book[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchQuranDetails = async () => {
      if (id) {
        try {
          setIsLoading(true);

          // Fetch the specific quran book
          const { data, error } = await supabase
            .from('quran_books')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching quran details:', error);
            setIsLoading(false);
            return;
          }

          if (!data) {
            setIsLoading(false);
            return;
          }

          const quranData: Book = {
            id: data.id,
            title: data.title,
            author: data.author,
            description: data.description,
            price: parseFloat(data.price as unknown as string),
            coverImage: data.cover_image,
            language: data.language,
            category: 'Quran',
            publisher: data.publisher,
            inStock: data.in_stock,
            rating: parseFloat(data.rating as unknown as string),
            reviews: [],
            featured: data.featured,
            newArrival: data.new_arrival,
            bestSeller: data.best_seller
          };

          setQuran(quranData);

          // Fetch related quran books (same language)
          const allQuranBooks = await fetchQuranBooks();
          const related = allQuranBooks
            .filter(b => b.language === quranData.language && b.id !== id)
            .slice(0, 4);

          setRelatedQurans(related);
          setIsLoading(false);
        } catch (error) {
          console.error('Error in fetching quran details:', error);
          toast.error("Failed to load Quran details. Please try again.");
          setIsLoading(false);
        }
      }
    };

    fetchQuranDetails();
  }, [id]);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (quran) {
      addToCart(quran, quantity);
      toast.success(`${quantity} × ${quran.title} added to cart!`);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded-md w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-muted aspect-[3/4] rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded-md w-3/4"></div>
              <div className="h-6 bg-muted rounded-md w-1/2"></div>
              <div className="h-24 bg-muted rounded-md w-full"></div>
              <div className="h-10 bg-muted rounded-md w-1/4"></div>
              <div className="h-10 bg-muted rounded-md w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quran) {
    return (
      <div className="container py-12 text-center">
        <div className="max-w-md mx-auto">
          <Card className="border border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-4">{t('quranNotFound')}</h1>
              <p className="mb-6 text-muted-foreground">{t('quranNotFoundDesc')}</p>
              <Button onClick={() => navigate('/quran')} className="w-full">
                {t('returnToQuran')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), path: '/' },
    { label: t('quran'), path: '/quran' },
    { label: quran.title }
  ];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6">
        <BreadcrumbNav items={breadcrumbItems} />
      </div>

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-accent group flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t('back')}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-12">
        {/* Quran Image Column with Advanced 3D Effect - Responsive */}
        <div className="flex flex-col justify-between">
          <div className="relative">
            <Card className="bg-card overflow-visible shadow-lg border border-primary/20">
              <div className="p-4 sm:p-6 md:p-8 flex justify-center items-center bg-gradient-to-b from-accent/40 to-transparent rounded-md">
                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] max-w-[280px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[350px] mx-auto">
                  <BookCover3D
                    coverImage={quran.coverImage}
                    title={quran.title}
                    isQuran={true}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>
            {quran.bestSeller && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-secondary text-secondary-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                {t('bestSeller')}
              </div>
            )}
            {quran.newArrival && (
              <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                {t('newArrival')}
              </div>
            )}
          </div>

          {/* Action Buttons - Mobile Only */}
          <div className="md:hidden flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1 max-w-[120px]">
              <Share className="h-4 w-4 mr-2" />
              {t('share')}
            </Button>
            <Button variant="outline" size="sm" className="flex-1 max-w-[120px]">
              <Bookmark className="h-4 w-4 mr-2" />
              {t('save')}
            </Button>
          </div>
        </div>

        {/* Quran Details Column - Responsive */}
        <div className={`space-y-4 sm:space-y-6 ${language === 'ar' ? 'text-right' : ''}`}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">{quran.title}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{quran.author || t('holyQuran')}</p>
          </div>

          {/* Price & Stock - Responsive */}
          <Card className="border border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{t('price')}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{quran.price.toFixed(2)} TND</p>
                </div>
                <div>
                  <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
                    quran.inStock
                      ? 'bg-primary/20 text-foreground'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {quran.inStock ? t('inStock') : t('outOfStock')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantity & Add to Cart - Responsive */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm mb-1 sm:mb-2">{t('quantity')}:</p>
                <div className="flex items-center border border-border rounded-md overflow-hidden shadow-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="px-2 sm:px-3 py-0 h-8 sm:h-10 rounded-none hover:bg-accent"
                  >
                    <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="px-2 sm:px-4 py-1 sm:py-2 min-w-6 sm:min-w-8 text-center text-sm sm:text-base font-medium">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleQuantityIncrease}
                    className="px-2 sm:px-3 py-0 h-8 sm:h-10 rounded-none hover:bg-accent"
                  >
                    <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons - Desktop Only - Responsive */}
              <div className="hidden md:flex gap-2 ml-auto">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                  <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t('share')}
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                  <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t('save')}
                </Button>
              </div>
            </div>

            <Button
              disabled={!quran.inStock}
              onClick={handleAddToCart}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-300 text-sm sm:text-base"
              size="default"
              style={{ height: 'auto', padding: '0.5rem 1rem' }}
            >
              <ShoppingCart className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {t('addToCart')}
            </Button>
          </div>

          {/* Quran Information Tabs - Responsive */}
          <div className="mt-6 sm:mt-8">
            <Tabs
              defaultValue="description"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="description" className="text-xs sm:text-sm py-1.5 sm:py-2">{t('description')}</TabsTrigger>
                <TabsTrigger value="details" className="text-xs sm:text-sm py-1.5 sm:py-2">{t('details')}</TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs sm:text-sm py-1.5 sm:py-2">{t('shipping')}</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-2 sm:mt-4">
                <Card className="border border-primary/20">
                  <CardContent className="p-3 sm:p-4 prose-sm sm:prose dark:prose-invert max-w-none prose-p:text-foreground prose-headings:text-foreground">
                    <p className="text-foreground leading-relaxed text-sm sm:text-base">{quran.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-2 sm:mt-4">
                <Card className="border border-primary/20">
                  <CardContent className="p-3 sm:p-4">
                    <table className={`w-full ${language === 'ar' ? 'text-right' : ''} text-sm sm:text-base`}>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-1.5 sm:py-2 text-muted-foreground">{t('language')}</td>
                          <td className="py-1.5 sm:py-2 font-medium">{quran.language}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-1.5 sm:py-2 text-muted-foreground">{t('publisher')}</td>
                          <td className="py-1.5 sm:py-2 font-medium">{quran.publisher}</td>
                        </tr>
                        {quran.author && (
                          <tr>
                            <td className="py-1.5 sm:py-2 text-muted-foreground">{t('translator')}</td>
                            <td className="py-1.5 sm:py-2 font-medium">{quran.author}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-2 sm:mt-4">
                <Card className="border border-primary/20">
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">{t('specialHandling')}</h3>
                    <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
                      {t('quranSpecialHandlingDesc')}
                    </p>
                    <div className="bg-accent p-2 sm:p-3 rounded-md text-xs sm:text-sm mb-2 sm:mb-3">
                      <p className="font-medium">{t('deliveryTime')}: 3-5 {t('days')}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('reverentPackaging')}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Related Qurans Section */}
      {relatedQurans.length > 0 && (
        <section className="mt-16 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${language === 'ar' ? 'text-right' : ''}`}>
              {t('relatedQurans')}
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/quran')}
              className="text-sm"
            >
              {t('viewAllQurans')}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedQurans.map(relatedQuran => (
              <BookCard key={relatedQuran.id} book={relatedQuran} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default QuranDetail;
