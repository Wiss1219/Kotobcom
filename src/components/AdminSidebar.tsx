
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  BookIcon,
  HomeIcon,
  LogOutIcon,
  ShoppingBagIcon,
  LayoutDashboardIcon,
  Menu,
  X
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/admin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Mobile menu toggle button
  const MobileMenuToggle = () => (
    <div className="lg:hidden fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMobileMenu}
        className="h-10 w-10 rounded-full bg-card shadow-md"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
    </div>
  );

  return (
    <>
      <MobileMenuToggle />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-full w-64 bg-card border-r border-border flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">
            Kotob<span className="text-secondary">com</span> <span className="text-sm font-normal">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          <Link to="/admin/dashboard">
            <Button
              variant={isActive('/admin/dashboard') ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link to="/admin/books">
            <Button
              variant={isActive('/admin/books') ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <BookIcon className="mr-2 h-4 w-4" />
              Books & Quran
            </Button>
          </Link>

          <Link to="/admin/orders">
            <Button
              variant={isActive('/admin/orders') ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <ShoppingBagIcon className="mr-2 h-4 w-4" />
              Orders
            </Button>
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar (overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={closeMobileMenu}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-card shadow-xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 mb-4">
              <h1 className="text-xl font-bold text-primary">
                Kotob<span className="text-secondary">com</span> <span className="text-sm font-normal">Admin</span>
              </h1>
            </div>

            <nav className="flex-1 py-2 space-y-1">
              <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                <Button
                  variant={isActive('/admin/dashboard') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <Link to="/admin/books" onClick={closeMobileMenu}>
                <Button
                  variant={isActive('/admin/books') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <BookIcon className="mr-2 h-4 w-4" />
                  Books & Quran
                </Button>
              </Link>

              <Link to="/admin/orders" onClick={closeMobileMenu}>
                <Button
                  variant={isActive('/admin/orders') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <ShoppingBagIcon className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              </Link>
            </nav>

            <div className="p-2 mt-auto border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
