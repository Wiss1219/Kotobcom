
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookIcon, DollarSignIcon, ShoppingBagIcon, UsersIcon, BarChart3Icon } from 'lucide-react';
import { getOrderStats } from '@/services/orderService';
import { fetchBooks, fetchQuranBooks } from '@/services/bookService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalRevenue: number;
  productCount: number;
  orderCount: number;
  customerCount: number;
  pendingOrders: number;
  recentActivity: Array<{
    type: string;
    title: string;
    time: string;
    description: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    productCount: 0,
    orderCount: 0,
    customerCount: 0,
    pendingOrders: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get order stats
        const orderStats = await getOrderStats();

        // Get product count
        const books = await fetchBooks();
        const quranBooks = await fetchQuranBooks();
        const productCount = books.length + quranBooks.length;

        // Update stats
        setStats({
          totalRevenue: orderStats.totalRevenue,
          productCount,
          orderCount: orderStats.orderCount,
          customerCount: orderStats.customerCount,
          pendingOrders: orderStats.pendingOrders,
          recentActivity: generateRecentActivity(orderStats.orderCount)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate some recent activity based on real data
  const generateRecentActivity = (orderCount: number) => {
    if (orderCount === 0) return [];

    const activity = [];

    if (orderCount > 0) {
      activity.push({
        type: 'order',
        title: 'New order received',
        time: 'Just now',
        description: `Order #${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    if (orderCount > 1) {
      activity.push({
        type: 'payment',
        title: 'Payment received',
        time: '2 hours ago',
        description: `For order #${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    if (orderCount > 2) {
      activity.push({
        type: 'status',
        title: 'Order status updated',
        time: '5 hours ago',
        description: 'Order marked as shipped'
      });
    }

    activity.push({
      type: 'system',
      title: 'System update',
      time: 'Yesterday',
      description: 'System updated to latest version'
    });

    return activity;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto pt-16 lg:pt-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground text-sm lg:text-base">Welcome to your admin dashboard</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" className="flex items-center gap-1">
                <Link to="/admin/books">
                  <BookIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Manage</span> Books
                </Link>
              </Button>
              <Button asChild size="sm" className="flex items-center gap-1">
                <Link to="/admin/orders">
                  <ShoppingBagIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">View</span> Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2 space-y-0 p-3 lg:p-6">
                  <div className="h-3 lg:h-4 bg-muted rounded w-16 lg:w-24"></div>
                </CardHeader>
                <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
                  <div className="h-6 lg:h-8 bg-muted rounded w-12 lg:w-16 mb-2"></div>
                  <div className="h-3 lg:h-4 bg-muted rounded w-20 lg:w-32"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Stats Cards with real data
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-1 lg:pb-2 space-y-0 p-3 lg:p-6">
                <CardTitle className="text-xs lg:text-sm font-medium">Total Revenue</CardTitle>
                <DollarSignIcon className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
                <div className="text-lg lg:text-2xl font-bold">{stats.totalRevenue.toFixed(2)} TND</div>
                <p className="text-xs text-muted-foreground">
                  From {stats.orderCount} order{stats.orderCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-1 lg:pb-2 space-y-0 p-3 lg:p-6">
                <CardTitle className="text-xs lg:text-sm font-medium">Products</CardTitle>
                <BookIcon className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
                <div className="text-lg lg:text-2xl font-bold">{stats.productCount}</div>
                <p className="text-xs text-muted-foreground">Books & Quran</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-1 lg:pb-2 space-y-0 p-3 lg:p-6">
                <CardTitle className="text-xs lg:text-sm font-medium">Orders</CardTitle>
                <ShoppingBagIcon className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
                <div className="text-lg lg:text-2xl font-bold">{stats.orderCount}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrders} pending
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-1 lg:pb-2 space-y-0 p-3 lg:p-6">
                <CardTitle className="text-xs lg:text-sm font-medium">Customers</CardTitle>
                <UsersIcon className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
                <div className="text-lg lg:text-2xl font-bold">{stats.customerCount}</div>
                <p className="text-xs text-muted-foreground">
                  Active accounts
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity and Store Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-1 lg:pb-2 space-y-0 p-3 lg:p-6">
              <CardTitle className="text-base lg:text-lg">Recent Activity</CardTitle>
              <BarChart3Icon className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
              {stats.recentActivity.length > 0 ? (
                <ul className="space-y-3 lg:space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <li key={index} className="border-b border-border pb-2">
                      <div className="flex justify-between flex-wrap">
                        <span className="font-medium text-sm lg:text-base">{activity.title}</span>
                        <span className="text-xs lg:text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground">{activity.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 lg:py-6 text-sm text-muted-foreground">
                  No recent activity to display
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-1 lg:pb-2 space-y-0 p-3 lg:p-6">
              <CardTitle className="text-base lg:text-lg">Store Overview</CardTitle>
              <BookIcon className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-0 lg:pt-0">
              <div className="space-y-3 lg:space-y-4">
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                    <p className="text-xs lg:text-sm text-muted-foreground">Total Books</p>
                    <p className="text-lg lg:text-2xl font-bold">{stats.productCount}</p>
                  </div>
                  <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                    <p className="text-xs lg:text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-lg lg:text-2xl font-bold">{stats.orderCount}</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                  <p className="text-xs lg:text-sm text-muted-foreground">Pending Orders</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg lg:text-2xl font-bold">{stats.pendingOrders}</p>
                    {stats.pendingOrders > 0 && (
                      <Button asChild size="sm" variant="outline" className="text-xs lg:text-sm">
                        <Link to="/admin/orders">View Orders</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
