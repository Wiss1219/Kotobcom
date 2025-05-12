import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck, Clock, Zap } from 'lucide-react';

interface ShippingMethodProps {
  selectedMethod: string;
  onMethodChange: (value: string) => void;
}

const ShippingMethod: React.FC<ShippingMethodProps> = ({ 
  selectedMethod, 
  onMethodChange 
}) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';
  
  const shippingMethods = [
    {
      id: 'standard',
      name: t('standardDelivery'),
      description: t('standardDeliveryDescription'),
      price: 7,
      icon: Truck,
      estimatedDelivery: '3-5 ' + t('businessDays')
    },
    {
      id: 'express',
      name: t('expressDelivery'),
      description: t('expressDeliveryDescription'),
      price: 15,
      icon: Zap,
      estimatedDelivery: '1-2 ' + t('businessDays')
    }
  ];
  
  return (
    <RadioGroup 
      value={selectedMethod} 
      onValueChange={onMethodChange}
      className="space-y-3"
    >
      {shippingMethods.map((method) => {
        const Icon = method.icon;
        return (
          <div 
            key={method.id}
            className={`
              relative flex items-start p-4 rounded-lg border
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
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1 inline" />
                    {method.estimatedDelivery}
                  </span>
                  <span className={`font-medium ${selectedMethod === method.id 
                    ? `${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`
                    : 'text-foreground'
                  }`}>
                    {method.price.toFixed(2)} TND
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default ShippingMethod;
