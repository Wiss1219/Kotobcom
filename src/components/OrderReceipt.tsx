
import React, { forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';

interface OrderReceiptProps {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod?: string;
  paymentMethod?: string;
}

const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(({
  orderNumber,
  orderDate,
  customerName,
  customerEmail,
  customerAddress,
  items,
  subtotal,
  shipping,
  total,
  shippingMethod = 'standard',
  paymentMethod = 'cash'
}, ref) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  return (
    <div
      ref={ref}
      className={`bg-white text-black p-8 max-w-2xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="text-center mb-6">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#5F3DD9]' : 'text-[#3b5998]'}`}>
          Kotob Bookstore
        </h1>
        <p className="text-sm text-gray-600">Your Islamic Book Destination</p>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between mb-4">
        <div>
          <p className="font-medium">{t('orderNumber')}:</p>
          <p className="text-sm">{orderNumber}</p>
        </div>
        <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
          <p className="font-medium">{t('orderDate')}:</p>
          <p className="text-sm">{orderDate}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-medium mb-2">{t('customerInformation')}:</h2>
        <p className="text-sm">{customerName}</p>
        <p className="text-sm">{customerEmail}</p>
        <p className="text-sm">{customerAddress}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-medium mb-2">{t('orderDetails')}:</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">{t('shippingMethod')}:</span>{' '}
            {shippingMethod === 'express' ? t('expressDelivery') : t('standardDelivery')}
          </div>
          <div>
            <span className="font-medium">{t('paymentMethod')}:</span>{' '}
            {paymentMethod === 'cash' ? t('cashOnDelivery') :
             paymentMethod === 'card' ? t('creditCard') : t('digitalWallet')}
          </div>
          <div>
            <span className="font-medium">{t('estimatedDelivery')}:</span>{' '}
            {shippingMethod === 'express' ? '1-2 ' : '3-5 '}{t('businessDays')}
          </div>
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className={`py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('item')}</th>
            <th className="py-2 text-center">{t('quantity')}</th>
            <th className={`py-2 ${isRTL ? 'text-left' : 'text-right'}`}>{t('price')}</th>
            <th className={`py-2 ${isRTL ? 'text-left' : 'text-right'}`}>{t('total')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.title}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className={`py-2 ${isRTL ? 'text-left' : 'text-right'}`}>{item.price.toFixed(2)} TND</td>
              <td className={`py-2 ${isRTL ? 'text-left' : 'text-right'}`}>{(item.price * item.quantity).toFixed(2)} TND</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={`${isRTL ? 'text-left' : 'text-right'} mb-6`}>
        <div className="flex justify-between mb-2">
          <span className="font-medium">{t('subtotal')}:</span>
          <span>{subtotal.toFixed(2)} TND</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">{t('shipping')}:</span>
          <span>{shipping.toFixed(2)} TND</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold">
          <span>{t('total')}:</span>
          <span>{total.toFixed(2)} TND</span>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-600">
        <p>{t('thankYouOrder')}</p>
        <p className="mt-1">{t('questions')}: support@kotobbookstore.com</p>
        <p className="mt-4">*** {t('endOfReceipt')} ***</p>
      </div>
    </div>
  );
});

OrderReceipt.displayName = 'OrderReceipt';

export default OrderReceipt;
