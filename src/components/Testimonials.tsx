import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: {
        en: "Ahmed Ben Ali",
        fr: "Ahmed Ben Ali",
        ar: "أحمد بن علي"
      },
      role: {
        en: "Regular Customer",
        fr: "Client Régulier",
        ar: "عميل منتظم"
      },
      content: {
        en: "I've been shopping at Msaken Bookstore for years. Their collection of Islamic literature is unmatched, and the quality of their books is exceptional. The staff is always helpful and knowledgeable.",
        fr: "Je fais mes achats à la librairie Msaken depuis des années. Leur collection de littérature islamique est inégalée, et la qualité de leurs livres est exceptionnelle. Le personnel est toujours serviable et compétent.",
        ar: "أتسوق في مكتبة مساكن منذ سنوات. مجموعتهم من الأدب الإسلامي لا مثيل لها، وجودة كتبهم استثنائية. الموظفون دائمًا متعاونون ومطلعون."
      },
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: {
        en: "Fatima Zahra",
        fr: "Fatima Zahra",
        ar: "فاطمة الزهراء"
      },
      role: {
        en: "Teacher",
        fr: "Enseignante",
        ar: "مدرّسة"
      },
      content: {
        en: "As a teacher, I often recommend Msaken Bookstore to my students. Their Quran editions are beautiful and accurate, and they offer educational discounts. The online ordering process is smooth and delivery is always on time.",
        fr: "En tant qu'enseignante, je recommande souvent la librairie Msaken à mes élèves. Leurs éditions du Coran sont belles et précises, et ils offrent des réductions éducatives. Le processus de commande en ligne est fluide et la livraison est toujours à l'heure.",
        ar: "بصفتي مدرّسة، غالبًا ما أوصي طلابي بمكتبة مساكن. إصدارات القرآن لديهم جميلة ودقيقة، ويقدمون خصومات تعليمية. عملية الطلب عبر الإنترنت سلسة والتسليم دائمًا في الوقت المحدد."
      },
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: {
        en: "Youssef Mansour",
        fr: "Youssef Mansour",
        ar: "يوسف منصور"
      },
      role: {
        en: "Scholar",
        fr: "Érudit",
        ar: "باحث"
      },
      content: {
        en: "The selection of rare and scholarly books at Msaken Bookstore is impressive. I've found texts here that I couldn't find anywhere else in Tunisia. Their commitment to preserving and sharing Islamic knowledge is commendable.",
        fr: "La sélection de livres rares et académiques à la librairie Msaken est impressionnante. J'ai trouvé ici des textes que je ne pouvais trouver nulle part ailleurs en Tunisie. Leur engagement à préserver et à partager le savoir islamique est louable.",
        ar: "مجموعة الكتب النادرة والعلمية في مكتبة مساكن مثيرة للإعجاب. لقد وجدت هنا نصوصًا لم أتمكن من العثور عليها في أي مكان آخر في تونس. التزامهم بالحفاظ على المعرفة الإسلامية ومشاركتها جدير بالثناء."
      },
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className={`py-16 ${theme === 'light' ? 'bg-[#f3edda]/50' : 'bg-card/5'}`}>
      <div className="container">
        <div className="text-center mb-12">
          <Badge className={`mb-2 ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary/20 text-primary'}`}>
            {language === 'en' ? "Testimonials" : language === 'fr' ? "Témoignages" : "شهادات"}
          </Badge>
          <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
            {language === 'en' ? "What Our Customers Say" : 
             language === 'fr' ? "Ce Que Disent Nos Clients" : 
             "ما يقوله عملاؤنا"}
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className={`border-none ${theme === 'light' ? 'bg-[#ece7d5]/70' : 'bg-card/50'} shadow-md`}>
            <CardContent className="p-8 relative">
              <div className={`absolute -top-6 ${language === 'ar' ? 'right-8' : 'left-8'} w-12 h-12 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary/20 text-primary'}`}>
                <Quote className="h-6 w-6" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={currentTestimonial.image} 
                    alt={currentTestimonial.name[language as keyof typeof currentTestimonial.name]} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < currentTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className={`text-lg mb-4 italic ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                    "{currentTestimonial.content[language as keyof typeof currentTestimonial.content]}"
                  </p>
                  
                  <div>
                    <h4 className={`font-bold text-lg ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                      {currentTestimonial.name[language as keyof typeof currentTestimonial.name]}
                    </h4>
                    <p className={`${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                      {currentTestimonial.role[language as keyof typeof currentTestimonial.role]}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-6 gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className={`rounded-full ${theme === 'light' ? 'border-[#ded7ba] text-[#5c5a4e] hover:bg-[#ded7ba]/20' : 'border-primary/20 text-primary hover:bg-primary/10'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${activeIndex === index ?
                    (theme === 'light' ? 'bg-[#5c5a4e] w-8' : 'bg-primary w-8') :
                    (theme === 'light' ? 'bg-[#dcd6c3]' : 'bg-primary/30')}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className={`rounded-full ${theme === 'light' ? 'border-[#ded7ba] text-[#5c5a4e] hover:bg-[#ded7ba]/20' : 'border-primary/20 text-primary hover:bg-primary/10'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
