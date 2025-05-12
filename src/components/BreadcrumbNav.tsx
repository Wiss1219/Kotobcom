
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  const { language } = useLanguage();
  
  // Handle RTL layout for Arabic
  const isRTL = language === 'ar';
  const Separator = isRTL ? 
    <ChevronRight className="h-4 w-4 rotate-180 text-muted-foreground mx-1" /> : 
    <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />;
  
  return (
    <nav aria-label="breadcrumbs" className="breadcrumb-container">
      <ol className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} flex-wrap items-center text-sm`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  {item.path ? (
                    <Link 
                      to={item.path} 
                      className="breadcrumb-item hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="breadcrumb-item">{item.label}</span>
                  )}
                  {isRTL ? (
                    index > 0 && Separator
                  ) : (
                    index < items.length - 1 && Separator
                  )}
                </>
              ) : (
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;
