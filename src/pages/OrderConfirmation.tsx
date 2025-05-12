
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const OrderConfirmation = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <div className="container py-16 max-w-3xl mx-auto">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center ${theme === 'light' ? 'bg-primary/20' : 'bg-secondary/10'} p-6 rounded-full mb-6`}>
          <CheckCircle className={`h-16 w-16 ${theme === 'light' ? 'text-accent-foreground' : 'text-secondary'}`} />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{t('orderConfirmed')}</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          {t('thankYouOrder')}
        </p>
        
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('orderStatus')}</h3>
              <p className="font-medium">{t('processing')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('paymentMethod')}</h3>
              <p className="font-medium">{t('cashOnDelivery')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('estimatedDelivery')}</h3>
              <p className="font-medium">3-5 {t('businessDays')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('trackOrder')}</h3>
              <p className="font-medium">{t('emailSent')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className={`flex items-center gap-2 ${theme === 'light' ? 'border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10' : ''}`}>
            <Link to="/">
              {language === 'ar' ? <ArrowRight className="h-4 w-4 rotate-180" /> : null}
              {t('backToHome')}
              {language !== 'ar' ? <ArrowRight className="h-4 w-4" /> : null}
            </Link>
          </Button>
          <Button asChild className={`${theme === 'light' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/90'} flex items-center gap-2`}>
            <Link to="/books">
              <ShoppingBag className="h-4 w-4" />
              {t('continueShopping')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
