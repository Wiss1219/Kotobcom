import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, Award, Clock, Mail } from 'lucide-react';
import Hero from '@/components/Hero';
import { BookData } from '@/data/books';
import { fetchBooks, fetchQuranBooks } from '@/services/bookService';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FeaturedCategories from '@/components/FeaturedCategories';
import BookSection from '@/components/BookSection';
const Home = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [featuredBooks, setFeaturedBooks] = useState<BookData[]>([]);
  const [newArrivals, setNewArrivals] = useState<BookData[]>([]);
  const [bestSellers, setBestSellers] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for scroll reveal animation
  const featuredRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        const [books, quranBooks] = await Promise.all([fetchBooks(), fetchQuranBooks()]);

        // Combine all books
        const allBooks = [...books, ...quranBooks].filter(Boolean); // Filter out any null values

        // Filter books by category
        setFeaturedBooks(allBooks.filter(book => book?.featured).slice(0, 4));
        setNewArrivals(allBooks.filter(book => book?.newArrival).slice(0, 4));
        setBestSellers(allBooks.filter(book => book?.bestSeller).slice(0, 4));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        toast.error("Failed to load books. Please try again.");
        setIsLoading(false);
      }
    };
    loadBooks();
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1
    });
    const refs = [featuredRef, newArrivalsRef, bestSellersRef];
    refs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    return () => {
      refs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return <main>
      <Hero />

      {/* Featured Categories Section */}
      <FeaturedCategories />

      {/* Featured Books Section */}
      <BookSection
        title="featured"
        books={featuredBooks}
        linkTo="/books"
        icon={<Award className={`h-6 w-6 ${theme === 'light' ? 'text-[#ded7ba]' : 'text-brand-creamLight'}`} />}
        isLoading={isLoading}
        ref={featuredRef}
      />

      {/* New Arrivals Section */}
      <BookSection
        title="newArrivals"
        books={newArrivals}
        linkTo="/books"
        icon={<Clock className={`h-6 w-6 ${theme === 'light' ? 'text-[#ded7ba]' : 'text-brand-creamLight'}`} />}
        isLoading={isLoading}
        ref={newArrivalsRef}
      />

      {/* Visual separator between sections */}
      <div className="container">
        <Separator className="my-8" />
      </div>

      {/* Best Sellers Section */}
      <BookSection
        title="bestSellers"
        books={bestSellers}
        linkTo="/books"
        icon={<Gift className={`h-6 w-6 ${theme === 'light' ? 'text-[#ded7ba]' : 'text-brand-creamLight'}`} />}
        isLoading={isLoading}
        ref={bestSellersRef}
      />

      {/* Newsletter Section */}
      <section className={`py-16 ${theme === 'light' ? 'bg-[#ece7d5]/50' : 'bg-card/30'}`}>
        <div className="container">
          <div className={`rounded-2xl overflow-hidden shadow-lg ${theme === 'light' ? 'bg-[#ded7ba]/30' : 'bg-primary/10'}`}>
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&auto=format&fit=crop&q=80"
                  alt="Books on shelf"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-r from-[#ded7ba]/80 to-transparent' : 'bg-gradient-to-r from-primary/80 to-transparent'} md:bg-none`}></div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <Badge className={`mb-4 self-start ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary text-white'}`}>
                  {language === 'en' ? "Stay Updated" : language === 'fr' ? "Restez Informé" : "ابق على اطلاع"}
                </Badge>

                <h2 className={`text-2xl md:text-3xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                  {language === 'en' ? "Subscribe to Our Newsletter" :
                   language === 'fr' ? "Abonnez-vous à Notre Newsletter" :
                   "اشترك في نشرتنا الإخبارية"}
                </h2>

                <p className={`mb-6 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                  {language === 'en' ? "Get notified about new arrivals, special offers, and exclusive events. Join our community of book lovers." :
                   language === 'fr' ? "Soyez informé des nouveautés, des offres spéciales et des événements exclusifs. Rejoignez notre communauté d'amoureux des livres." :
                   "احصل على إشعارات حول الوصول الجديد والعروض الخاصة والأحداث الحصرية. انضم إلى مجتمعنا من محبي الكتب."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`} />
                    <input
                      type="email"
                      placeholder={language === 'en' ? "Your email address" : language === 'fr' ? "Votre adresse email" : "عنوان بريدك الإلكتروني"}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg ${theme === 'light' ? 'bg-white border-[#dcd6c3] text-[#5c5a4e]' : 'bg-card border-primary/30 text-white'} border focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-[#ded7ba]' : 'focus:ring-primary'}`}
                    />
                  </div>
                  <Button className={`${theme === 'light' ? 'bg-[#ded7ba] hover:bg-[#dcd6c3] text-[#5c5a4e]' : 'bg-primary hover:bg-primary/90 text-white'} py-3 px-6 rounded-lg font-medium`}>
                    {language === 'en' ? "Subscribe" : language === 'fr' ? "S'abonner" : "اشترك"}
                  </Button>
                </div>

                <p className={`mt-4 text-xs ${theme === 'light' ? 'text-[#6b6a5c]/80' : 'text-muted-foreground'}`}>
                  {language === 'en' ? "By subscribing, you agree to our Privacy Policy and consent to receive updates from our company." :
                   language === 'fr' ? "En vous abonnant, vous acceptez notre politique de confidentialité et consentez à recevoir des mises à jour de notre entreprise." :
                   "بالاشتراك، فإنك توافق على سياسة الخصوصية الخاصة بنا وتوافق على تلقي تحديثات من شركتنا."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>;
};
export default Home;