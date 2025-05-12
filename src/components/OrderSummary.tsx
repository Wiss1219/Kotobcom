import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CartItem } from '@/contexts/CartContext';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Package, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  isCheckoutButton?: boolean;
  onCheckout?: () => void;
  isSubmitting?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  subtotal, 
  shippingCost,
  isCheckoutButton = false,
  onCheckout,
  isSubmitting = false
}) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';
  
  const total = subtotal + shippingCost;
  
  return (
    <div className={`${theme === 'light' ? 'bg-[#f3edda]/50' : 'bg-card'} rounded-lg border p-5`}>
      <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>
      
      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="h-16 w-12 flex-shrink-0">
                <img 
                  src={item.coverImage} 
                  alt={item.title} 
                  className="h-full w-full object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <p className="font-medium line-clamp-1">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} x {item.price.toFixed(2)} TND</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(item.price * item.quantity).toFixed(2)} TND</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">{t('emptyCart')}</p>
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('subtotal')}</span>
          <span>{subtotal.toFixed(2)} TND</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('shipping')}</span>
          <span>{shippingCost.toFixed(2)} TND</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold text-lg">
          <span>{t('total')}</span>
          <span className={`${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`}>
            {total.toFixed(2)} TND
          </span>
        </div>
      </div>
      
      {isCheckoutButton ? (
        <Button 
          onClick={onCheckout}
          disabled={items.length === 0 || isSubmitting}
          className={`w-full mt-6 ${theme === 'light' ? 'bg-[#49ab81] hover:bg-[#398564] text-white' : ''}`}
        >
          {isSubmitting ? t('processing') : t('placeOrder')}
        </Button>
      ) : (
        <Button 
          asChild
          className={`w-full mt-6 ${theme === 'light' ? 'bg-[#49ab81] hover:bg-[#398564] text-white' : ''}`}
        >
          <Link to="/checkout">
            {t('proceedToCheckout')}
          </Link>
        </Button>
      )}
      
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{t('freeReturns')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>{t('secureCheckout')}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
