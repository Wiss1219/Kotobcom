import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TruckIcon, BadgeCheck, HeartHandshake } from 'lucide-react';

const WhyChooseUs = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const features = [
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: {
        en: "Curated Selection",
        fr: "Sélection Soignée",
        ar: "اختيار منسق"
      },
      description: {
        en: "Handpicked books and Quran editions chosen for quality and authenticity.",
        fr: "Livres et éditions du Coran sélectionnés à la main pour leur qualité et leur authenticité.",
        ar: "كتب وإصدارات قرآن مختارة يدويًا للجودة والأصالة."
      }
    },
    {
      icon: <TruckIcon className="h-10 w-10" />,
      title: {
        en: "Fast Delivery",
        fr: "Livraison Rapide",
        ar: "توصيل سريع"
      },
      description: {
        en: "Quick and reliable shipping to your doorstep across Tunisia.",
        fr: "Expédition rapide et fiable à votre porte partout en Tunisie.",
        ar: "شحن سريع وموثوق به إلى باب منزلك في جميع أنحاء تونس."
      }
    },
    {
      icon: <BadgeCheck className="h-10 w-10" />,
      title: {
        en: "Quality Guaranteed",
        fr: "Qualité Garantie",
        ar: "جودة مضمونة"
      },
      description: {
        en: "We ensure all our products meet the highest standards of quality.",
        fr: "Nous veillons à ce que tous nos produits répondent aux normes de qualité les plus élevées.",
        ar: "نحن نضمن أن جميع منتجاتنا تلبي أعلى معايير الجودة."
      }
    },
    {
      icon: <HeartHandshake className="h-10 w-10" />,
      title: {
        en: "Customer Support",
        fr: "Service Client",
        ar: "دعم العملاء"
      },
      description: {
        en: "Dedicated support team ready to assist you with any questions.",
        fr: "Équipe de support dédiée prête à vous aider pour toute question.",
        ar: "فريق دعم مخصص جاهز لمساعدتك في أي أسئلة."
      }
    }
  ];

  return (
    <section className={`py-16 ${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'}`}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
            {language === 'en' ? "Why Choose Us" : 
             language === 'fr' ? "Pourquoi Nous Choisir" : 
             "لماذا تختارنا"}
          </h2>
          <p className={`max-w-2xl mx-auto ${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
            {language === 'en' ? "Discover the benefits of shopping with Msaken Bookstore Hub" : 
             language === 'fr' ? "Découvrez les avantages de faire vos achats avec Msaken Bookstore Hub" : 
             "اكتشف مزايا التسوق مع مركز مكتبة مساكن"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`border-none ${theme === 'light' ? 'bg-[#ece7d5]/70 hover:bg-[#ece7d5]' : 'bg-card/50 hover:bg-card/80'} transition-all duration-300 hover:shadow-md group`}
            >
              <CardContent className="p-6 text-center">
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${theme === 'light' ? 'bg-[#ded7ba]/50 text-[#5c5a4e]' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                  {feature.title[language as keyof typeof feature.title]}
                </h3>
                <p className={`${theme === 'light' ? 'text-[#6b6a5c]' : 'text-muted-foreground'}`}>
                  {feature.description[language as keyof typeof feature.description]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
