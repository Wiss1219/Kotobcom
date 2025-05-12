
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Check, ShoppingBag, Printer, MapPin, Phone, Mail, User, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { createOrder } from '@/services/orderService';
import OrderReceipt from '@/components/OrderReceipt';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useReactToPrint } from 'react-to-print';
import { useTheme } from '@/contexts/ThemeContext';
import CheckoutProgress from '@/components/CheckoutProgress';
import ShippingMethod from '@/components/ShippingMethod';
import PaymentMethod from '@/components/PaymentMethod';
import OrderSummary from '@/components/OrderSummary';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

const CheckoutPage = () => {

  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Shipping and payment methods
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Calculate shipping cost based on selected method
  const shippingCost = shippingMethod === 'express' ? 15 : 7;

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Order Receipt - ${orderData?.orderNumber || 'New Order'}`,
    onAfterPrint: () => toast.success(t('receiptPrinted'))
  });

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `KTB-${year}${month}${day}-${random}`;
  };

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await processOrder();
  };

  // Process the order (can be called from button click or form submit)
  const processOrder = async () => {

    if (items.length === 0) {
      toast.error(t('emptyCart'));
      navigate('/cart');
      return;
    }

    // Validate form data
    if (!formData.fullName || !formData.email || !formData.phone ||
        !formData.address || !formData.city || !formData.postalCode) {
      toast.error(t('pleaseCompleteForm'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the address
      const formattedAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}`;

      // Create the order with proper parameter names
      const orderPayload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formattedAddress,
        items: items,
        totalAmount: totalPrice + shippingCost, // Include shipping cost based on selected method
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod
      };

      // Create the order in the database
      const orderResult = await createOrder(orderPayload);

      if (!orderResult) {
        throw new Error('Failed to create order');
      }

      // Generate order information for the receipt
      const orderNumber = orderResult?.id || generateOrderNumber();
      const orderDate = new Date().toLocaleDateString();

      // Extract items from the order result
      const orderItems = orderResult?.items?.products || items;

      // Store order info for receipt
      setOrderData({
        orderNumber: orderNumber,
        orderDate: orderDate,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerAddress: formattedAddress,
        items: orderItems,
        subtotal: totalPrice,
        shipping: shippingCost,
        total: totalPrice + shippingCost,
        shippingMethod: orderResult?.items?.shipping_method || shippingMethod,
        paymentMethod: orderResult?.items?.payment_method || paymentMethod
      });

      toast.success(t('orderPlaced'), {
        description: t('orderSuccess')
      });

      setShowReceipt(true);
      clearCart();

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(t('errorOccurred'), {
        description: t('orderError')
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container py-8">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('back')}
      </Button>

      <h1 className={`text-3xl font-bold mb-4 ${language === 'ar' ? 'text-right' : ''}`}>
        {t('checkout')}
      </h1>

      {/* Checkout Progress */}
      <CheckoutProgress currentStep="shipping" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className={`h-5 w-5 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('customerInformation')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center text-sm font-medium">
                      {t('fullName')} <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="pl-10"
                        placeholder={t('enterFullName')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-sm font-medium">
                      {t('email')} <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10"
                        placeholder={t('enterEmail')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                      {t('phone')} <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="pl-10"
                        placeholder={t('enterPhone')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className={`h-5 w-5 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('shippingInformation')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address" className="flex items-center text-sm font-medium">
                      {t('address')} <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enterAddress')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center text-sm font-medium">
                      {t('city')} <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enterCity')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="flex items-center text-sm font-medium">
                      {t('postalCode')} <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enterPostalCode')}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      {t('orderNotes')}
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t('enterOrderNotes')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Truck className={`h-5 w-5 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('shippingMethod')}
                </h2>

                <ShippingMethod
                  selectedMethod={shippingMethod}
                  onMethodChange={setShippingMethod}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CreditCard className={`h-5 w-5 ${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'} ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('paymentMethod')}
                </h2>

                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
              </CardContent>
            </Card>

            <div className="mt-8 lg:hidden">
              <Button
                type="submit"
                className={`w-full ${theme === 'light' ? 'bg-[#49ab81] hover:bg-[#398564] text-white' : ''}`}
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? t('processing') : t('placeOrder')}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <OrderSummary
            items={items}
            subtotal={totalPrice}
            shippingCost={shippingCost}
            isCheckoutButton={true}
            onCheckout={processOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('orderReceipt')}</DialogTitle>
            <DialogDescription>
              {t('orderReceiptDescription')}
            </DialogDescription>
          </DialogHeader>

          {orderData && (
            <>
              <div className="mt-4">
                <OrderReceipt
                  ref={receiptRef}
                  orderNumber={orderData.orderNumber}
                  orderDate={orderData.orderDate}
                  customerName={orderData.customerName}
                  customerEmail={orderData.customerEmail}
                  customerAddress={orderData.customerAddress}
                  items={orderData.items}
                  subtotal={orderData.subtotal}
                  shipping={orderData.shipping}
                  total={orderData.total}
                  shippingMethod={orderData.shippingMethod}
                  paymentMethod={orderData.paymentMethod}
                />
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setShowReceipt(false)}>
                  {t('close')}
                </Button>
                <Button onClick={handlePrintReceipt} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                  <Printer className="h-4 w-4" />
                  {t('printReceipt')}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => {
                    setShowReceipt(false);
                    navigate('/order-confirmation');
                  }}
                >
                  {t('backToHome')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
