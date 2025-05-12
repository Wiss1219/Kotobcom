
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboardIcon } from 'lucide-react';

interface BackToDashboardButtonProps {
  className?: string;
}

const BackToDashboardButton: React.FC<BackToDashboardButtonProps> = ({ className = '' }) => {
  return (
    <Link to="/admin/dashboard">
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 hover:bg-muted/50 ${className}`}
      >
        <LayoutDashboardIcon className="h-4 w-4" />
        Return to Dashboard
      </Button>
    </Link>
  );
};

export default BackToDashboardButton;
