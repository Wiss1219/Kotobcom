
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, refreshAdminToken } from '@/services/adminService';
import { toast } from '@/hooks/use-toast';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!isAdminLoggedIn()) {
          toast({
            title: 'Admin session expired or invalid',
            description: 'Please login again',
            variant: "destructive"
          });
          navigate('/admin');
          return;
        }
        
        // Refresh admin token to extend session
        refreshAdminToken();
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying admin access:', error);
        toast({
          title: 'Error verifying admin access',
          description: 'Please try logging in again',
          variant: "destructive"
        });
        navigate('/admin');
      }
    };
    
    checkAdmin();
    
    // Set up an interval to periodically check admin login status
    const checkInterval = setInterval(() => {
      if (!isAdminLoggedIn()) {
        toast({
          title: 'Admin session expired',
          description: 'Please login again',
          variant: "destructive"
        });
        navigate('/admin');
        clearInterval(checkInterval);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
