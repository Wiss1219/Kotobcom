import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Wallet } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (value: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ 
  selectedMethod, 
  onMethodChange 
}) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';
  
  const paymentMethods = [
    {
      id: 'cash',
      name: t('cashOnDelivery'),
      description: t('payWhenReceive'),
      icon: Banknote
    },
    {
      id: 'card',
      name: t('creditCard'),
      description: t('securePayment'),
      icon: CreditCard,
      disabled: true
    },
    {
      id: 'wallet',
      name: t('digitalWallet'),
      description: t('fastAndSecure'),
      icon: Wallet,
      disabled: true
    }
  ];
  
  return (
    <RadioGroup 
      value={selectedMethod} 
      onValueChange={onMethodChange}
      className="space-y-3"
    >
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        return (
          <div 
            key={method.id}
            className={`
              relative flex items-start p-4 rounded-lg border
              ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedMethod === method.id 
                ? `${theme === 'light' ? 'border-[#49ab81] bg-[#f3edda]/50' : 'border-primary bg-primary/5'}`
                : `${theme === 'light' ? 'border-[#dcd6c3]' : 'border-border'}`
              }
              transition-all duration-200 hover:border-primary/50
            `}
          >
            <RadioGroupItem 
              value={method.id} 
              id={method.id}
              className={`${isRTL ? 'ml-3' : 'mr-3'} mt-1`}
              disabled={method.disabled}
            />
            <div className={`flex flex-1 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              <div className={`${isRTL ? 'ml-4' : 'mr-4'} flex-shrink-0`}>
                <div className={`
                  p-2 rounded-full
                  ${selectedMethod === method.id 
                    ? `${theme === 'light' ? 'bg-[#ded7ba]' : 'bg-primary/20'}`
                    : `${theme === 'light' ? 'bg-[#f3edda]' : 'bg-muted'}`
                  }
                `}>
                  <Icon className={`h-5 w-5 ${selectedMethod === method.id 
                    ? `${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`
                    : 'text-muted-foreground'
                  }`} />
                </div>
              </div>
              <div className="flex-grow">
                <Label 
                  htmlFor={method.id}
                  className={`text-base font-medium ${selectedMethod === method.id 
                    ? `${theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}`
                    : 'text-muted-foreground'
                  }`}
                >
                  {method.name}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {method.description}
                </p>
                {method.disabled && (
                  <span className="text-xs text-muted-foreground italic mt-2 block">
                    {t('comingSoon')}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default PaymentMethod;
