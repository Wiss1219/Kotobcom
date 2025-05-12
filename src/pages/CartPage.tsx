
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ShoppingCart,
  Trash2,
  MinusIcon,
  PlusIcon,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  PackageCheck,
  CreditCard,
  TruckIcon,
  ShieldCheck,
  Gift,
  BadgePercent,
  BookOpen,
  BookMarked
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const CartPage = () => {
  const { t, language } = useLanguage();
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleUpdateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleRemoveItem = (bookId: string, title: string) => {
    removeFromCart(bookId);
    toast.success(`${title} removed from cart!`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate('/checkout');
  };

  return (
    <main className={`${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-background'} min-h-screen py-12 animate-fade-in`}>
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={`mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-[#398564] hover:bg-[#f3edda]/50' : 'text-primary hover:bg-primary/10'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className={`h-6 w-6 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
            <h1 className={`text-3xl font-serif font-bold ${language === 'ar' ? 'text-right' : ''} ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
              {t('cart')}
            </h1>
          </div>

          <p className={`text-muted-foreground max-w-2xl ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'en' ? "Review your items and proceed to checkout when you're ready." :
             language === 'fr' ? "Vérifiez vos articles et procédez au paiement quand vous êtes prêt." :
             "راجع العناصر الخاصة بك وانتقل إلى الدفع عندما تكون جاهزًا."}
          </p>
        </div>

        {items.length === 0 ? (
          <Card className={`py-16 text-center ${theme === 'light' ? 'bg-white border-[#e7e1c8]' : 'bg-card border-primary/20'}`}>
            <CardContent className="flex flex-col items-center">
              <div className={`w-24 h-24 ${theme === 'light' ? 'bg-[#f3edda]' : 'bg-primary/10'} rounded-full flex items-center justify-center mb-6`}>
                <ShoppingCart className={`h-12 w-12 ${theme === 'light' ? 'text-[#398564]/70' : 'text-primary/70'}`} />
              </div>
              <h2 className={`text-2xl font-serif font-bold mb-4 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                {t('emptyCart')}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {language === 'en' ? "Your shopping cart is empty. Add some books to your cart and come back here to check out." :
                 language === 'fr' ? "Votre panier est vide. Ajoutez des livres à votre panier et revenez ici pour passer à la caisse." :
                 "سلة التسوق الخاصة بك فارغة. أضف بعض الكتب إلى سلتك وعد هنا للتحقق."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/books">
                  <Button className={`gap-2 ${theme === 'light' ? 'bg-[#398564] hover:bg-[#317256]' : 'bg-primary hover:bg-primary/90'}`}>
                    <BookOpen className="h-4 w-4" />
                    {language === 'en' ? "Browse Books" : language === 'fr' ? "Parcourir les livres" : "تصفح الكتب"}
                  </Button>
                </Link>
                <Link to="/quran">
                  <Button variant="outline" className={`gap-2 ${theme === 'light' ? 'border-[#e7e1c8] text-[#398564]' : 'border-primary/20 text-primary'}`}>
                    <BookMarked className="h-4 w-4" />
                    {language === 'en' ? "Browse Quran" : language === 'fr' ? "Parcourir le Coran" : "تصفح القرآن"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className={`overflow-hidden ${theme === 'light' ? 'bg-white border-[#e7e1c8]' : 'bg-card border-primary/20'}`}>
                <CardHeader className={`${theme === 'light' ? 'bg-[#f3edda]/50' : 'bg-primary/5'} pb-4`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                      {language === 'en' ? "Your Items" : language === 'fr' ? "Vos articles" : "العناصر الخاصة بك"} ({items.length})
                    </CardTitle>
                    <Badge className={`${theme === 'light' ? 'bg-[#398564] text-white' : 'bg-primary text-white'}`}>
                      {items.reduce((sum, item) => sum + item.quantity, 0)} {language === 'en' ? "items" : language === 'fr' ? "articles" : "عناصر"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {items.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors hover:bg-muted/5">
                        <div className="w-20 h-28 sm:w-24 sm:h-32 overflow-hidden rounded-md shadow-sm flex-shrink-0 border border-border">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <Link
                                to={`/${item.category === 'Quran' ? 'quran' : 'books'}/${item.id}`}
                                className={`font-medium text-lg hover:underline line-clamp-1 ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}
                              >
                                {item.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">{item.author}</p>
                              {item.category && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {item.category}
                                </Badge>
                              )}
                            </div>
                            <div className={`font-bold text-lg ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`}>
                              {item.price.toFixed(2)} TND
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                            <div className="flex items-center">
                              <Button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                variant="outline"
                                size="icon"
                                className={`h-8 w-8 rounded-l-md rounded-r-none ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </Button>
                              <div className={`h-8 px-4 flex items-center justify-center border-y ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}>
                                <span className="w-6 text-center font-medium">{item.quantity}</span>
                              </div>
                              <Button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                variant="outline"
                                size="icon"
                                className={`h-8 w-8 rounded-r-md rounded-l-none ${theme === 'light' ? 'border-[#e7e1c8]' : 'border-primary/20'}`}
                              >
                                <PlusIcon className="h-3 w-3" />
                              </Button>
                              <div className="ml-4 text-sm text-muted-foreground">
                                {language === 'en' ? "Subtotal:" : language === 'fr' ? "Sous-total:" : "المجموع الفرعي:"}
                                <span className="font-medium ml-1">
                                  {(item.price * item.quantity).toFixed(2)} TND
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleRemoveItem(item.id, item.title)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('removeItem')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className={`flex justify-between pt-6 ${theme === 'light' ? 'bg-[#f3edda]/30' : 'bg-primary/5'}`}>
                  <Link to="/books">
                    <Button
                      variant="outline"
                      className={`gap-2 ${theme === 'light' ? 'border-[#e7e1c8] text-[#398564] hover:bg-[#f3edda]/50' : 'border-primary/20 text-primary hover:bg-primary/10'}`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('continueShopping')}
                    </Button>
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} {language === 'en' ? "items" : language === 'fr' ? "articles" : "عناصر"}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-4">
                {/* Order Summary Card */}
                <Card className={`${theme === 'light' ? 'bg-white border-[#e7e1c8]' : 'bg-card border-primary/20'}`}>
                  <CardHeader className={`${theme === 'light' ? 'bg-[#f3edda]/50' : 'bg-primary/5'} pb-4`}>
                    <CardTitle className={`${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                      {language === 'en' ? "Order Summary" : language === 'fr' ? "Récapitulatif de la commande" : "ملخص الطلب"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className={`flex justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">
                        {language === 'en' ? "Subtotal" : language === 'fr' ? "Sous-total" : "المجموع الفرعي"}:
                      </span>
                      <span className={`${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                        {totalPrice.toFixed(2)} TND
                      </span>
                    </div>

                    <div className={`flex justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-muted-foreground">
                        {language === 'en' ? "Shipping" : language === 'fr' ? "Livraison" : "الشحن"}:
                      </span>
                      <span className={`${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                        {totalPrice >= 150 ? (
                          <span className="flex items-center">
                            <span className="line-through mr-2 text-muted-foreground">7.00 TND</span>
                            <Badge variant="outline" className={`${theme === 'light' ? 'border-[#398564] text-[#398564]' : 'border-primary text-primary'}`}>
                              {language === 'en' ? "FREE" : language === 'fr' ? "GRATUIT" : "مجاني"}
                            </Badge>
                          </span>
                        ) : (
                          "7.00 TND"
                        )}
                      </span>
                    </div>

                    {totalPrice < 150 && (
                      <div className={`text-xs ${theme === 'light' ? 'bg-[#f3edda]/70' : 'bg-primary/10'} p-2 rounded-md`}>
                        <div className="flex items-center gap-1">
                          <Gift className={`h-3 w-3 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                          <span className={`${theme === 'light' ? 'text-[#398564]' : 'text-primary'} font-medium`}>
                            {language === 'en' ? "Free Shipping" : language === 'fr' ? "Livraison Gratuite" : "شحن مجاني"}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          {language === 'en'
                            ? `Add ${(150 - totalPrice).toFixed(2)} TND more to qualify for free shipping!`
                            : language === 'fr'
                            ? `Ajoutez ${(150 - totalPrice).toFixed(2)} TND de plus pour bénéficier de la livraison gratuite !`
                            : `أضف ${(150 - totalPrice).toFixed(2)} دينار تونسي أخرى للتأهل للشحن المجاني!`}
                        </p>
                      </div>
                    )}

                    <Separator className={`${theme === 'light' ? 'bg-[#e7e1c8]' : 'bg-primary/20'}`} />

                    <div className={`flex justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className={`font-bold text-lg ${theme === 'light' ? 'text-[#5c5a4e]' : 'text-white'}`}>
                        {t('total')}
                      </span>
                      <span className={`font-bold text-lg ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`}>
                        {(totalPrice >= 150 ? totalPrice : totalPrice + 7).toFixed(2)} TND
                      </span>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleCheckout}
                        className={`w-full gap-2 text-white ${theme === 'light' ? 'bg-[#398564] hover:bg-[#317256]' : 'bg-primary hover:bg-primary/90'}`}
                        size="lg"
                      >
                        <CreditCard className="h-4 w-4" />
                        {t('checkout')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <Card className={`${theme === 'light' ? 'bg-white border-[#e7e1c8]' : 'bg-card border-primary/20'}`}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center text-center">
                        <ShieldCheck className={`h-8 w-8 mb-2 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                        <span className="text-xs font-medium">
                          {language === 'en' ? "Secure Payment" : language === 'fr' ? "Paiement Sécurisé" : "دفع آمن"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <TruckIcon className={`h-8 w-8 mb-2 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                        <span className="text-xs font-medium">
                          {language === 'en' ? "Fast Delivery" : language === 'fr' ? "Livraison Rapide" : "توصيل سريع"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <BadgePercent className={`h-8 w-8 mb-2 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                        <span className="text-xs font-medium">
                          {language === 'en' ? "Special Discounts" : language === 'fr' ? "Remises Spéciales" : "خصومات خاصة"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <Gift className={`h-8 w-8 mb-2 ${theme === 'light' ? 'text-[#398564]' : 'text-primary'}`} />
                        <span className="text-xs font-medium">
                          {language === 'en' ? "Gift Wrapping" : language === 'fr' ? "Emballage Cadeau" : "تغليف الهدايا"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
