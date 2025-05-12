import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ShoppingCart, Truck, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: 'cart' | 'shipping' | 'payment' | 'confirmation';
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  const steps = [
    { id: 'cart', label: t('cart'), icon: ShoppingCart },
    { id: 'shipping', label: t('shipping'), icon: Truck },
    { id: 'payment', label: t('payment'), icon: CreditCard },
    { id: 'confirmation', label: t('confirmation'), icon: CheckCircle },
  ];

  // If RTL, reverse the steps
  const displaySteps = isRTL ? [...steps].reverse() : steps;

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {displaySteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${status === 'completed'
                      ? `${theme === 'light' ? 'bg-[#49ab81] text-white' : 'bg-primary text-white'}`
                      : status === 'current'
                        ? `${theme === 'light' ? 'bg-[#ded7ba] text-[#5c5a4e]' : 'bg-primary/20 text-primary'} ring-2 ring-offset-2 ${theme === 'light' ? 'ring-[#49ab81]' : 'ring-primary'}`
                        : `${theme === 'light' ? 'bg-[#f3edda] text-[#6b6a5c]' : 'bg-card text-muted-foreground'}`
                    }
                    transition-all duration-200
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`
                    text-xs font-medium
                    ${status === 'completed'
                      ? `${theme === 'light' ? 'text-[#49ab81]' : 'text-primary'}`
                      : status === 'current'
                        ? `${theme === 'light' ? 'text-[#5c5a4e]' : 'text-foreground'}`
                        : 'text-muted-foreground'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {index < displaySteps.length - 1 && (
                <div
                  className={`
                    flex-grow h-0.5 mx-2
                    ${getStepStatus(displaySteps[index + 1].id) === 'upcoming' && getStepStatus(step.id) === 'upcoming'
                      ? `${theme === 'light' ? 'bg-[#f3edda]' : 'bg-muted'}`
                      : getStepStatus(displaySteps[index + 1].id) === 'upcoming'
                        ? `${theme === 'light' ? 'bg-[#ded7ba]' : 'bg-primary/20'}`
                        : `${theme === 'light' ? 'bg-[#49ab81]' : 'bg-primary'}`
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;
