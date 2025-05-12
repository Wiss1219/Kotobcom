
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import BackToDashboardButton from '@/components/admin/BackToDashboardButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllOrders, updateOrderStatus, deleteOrder } from '@/services/orderService';
import { OrderItem } from '@/contexts/CartContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import {
  BookIcon,
  LayoutDashboardIcon,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the Order type to match what comes from the database
interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  shipping_method?: string;
  payment_method?: string;
}

// Check if service key is available
const hasServiceKey = !!import.meta.env.VITE_SUPABASE_SERVICE_KEY;

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      // Parse the JSON items field from each order
      const parsedOrders = data.map((order: any) => {
        let parsedItems = order.items;

        // Handle string format
        if (typeof order.items === 'string') {
          parsedItems = JSON.parse(order.items);
        }

        // Handle new format with products array
        if (parsedItems && parsedItems.products) {
          return {
            ...order,
            items: parsedItems.products,
            shipping_method: parsedItems.shipping_method,
            payment_method: parsedItems.payment_method
          };
        }

        return {
          ...order,
          items: parsedItems
        };
      }) as Order[];

      setOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh orders
  const handleRefresh = () => {
    toast.loading('Refreshing orders...');
    fetchOrders().then(() => {
      toast.dismiss();
      toast.success('Orders refreshed');
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // Don't do anything if the status is already the same or if we're already updating this order
    const currentOrder = orders.find(order => order.id === orderId);
    if (currentOrder?.status === newStatus || updatingOrderId === orderId) {
      return;
    }

    // Set the updating order ID to show loading state
    setUpdatingOrderId(orderId);

    // Update local state immediately for better UX
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Show loading toast
    const toastId = toast.loading(`Updating order status to ${newStatus}...`);

    try {
      // Update the order status in the database
      const updatedOrder = await updateOrderStatus(orderId, newStatus);

      if (!updatedOrder) {
        // If update failed, revert the local state
        setOrders(currentOrders =>
          currentOrders.map(order =>
            order.id === orderId ? { ...order, status: currentOrder?.status || 'pending' } : order
          )
        );

        toast.dismiss(toastId);
        toast.error('Failed to update order status');
        setUpdatingOrderId(null);
        return;
      }

      // Parse the items if needed
      let parsedItems = updatedOrder.items;
      if (typeof updatedOrder.items === 'string') {
        parsedItems = JSON.parse(updatedOrder.items);
      }

      // Handle new format with products array
      if (parsedItems && parsedItems.products) {
        updatedOrder.items = parsedItems.products;
        updatedOrder.shipping_method = parsedItems.shipping_method;
        updatedOrder.payment_method = parsedItems.payment_method;
      }

      // Update the specific order in state with the full updated order data
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? updatedOrder as Order : order
        )
      );

      // Dismiss loading toast and show success toast
      toast.dismiss(toastId);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);

      // If update failed, revert the local state
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? { ...order, status: currentOrder?.status || 'pending' } : order
        )
      );

      toast.dismiss(toastId);
      toast.error('Failed to update order status');
    } finally {
      // Clear the updating order ID
      setUpdatingOrderId(null);
    }
  };

  // Handle opening the delete confirmation dialog
  const openDeleteDialog = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  // Handle deleting an order
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading(`Deleting order #${orderToDelete.id.substring(0, 8)}...`);

    try {
      const result = await deleteOrder(orderToDelete.id);

      if (result.success) {
        // Remove the order from the local state
        setOrders(currentOrders =>
          currentOrders.filter(order => order.id !== orderToDelete.id)
        );

        toast.dismiss(toastId);
        toast.success(`Order #${orderToDelete.id.substring(0, 8)} deleted successfully`);
        setDeleteDialogOpen(false);
      } else {
        toast.dismiss(toastId);
        toast.error(`Failed to delete order: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.dismiss(toastId);
      toast.error('An unexpected error occurred while deleting the order');
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Reset to first page when filters change or orders are refreshed
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'processing': return 'bg-blue-500 text-white';
      case 'shipped': return 'bg-purple-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto pt-16 lg:pt-6">
        <div className="mb-6 lg:mb-8">
          <BackToDashboardButton className="mb-4" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Orders</h1>
              <p className="text-sm lg:text-base text-muted-foreground">Manage customer orders</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" className="flex items-center gap-1">
                <Link to="/admin/dashboard">
                  <LayoutDashboardIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="flex items-center gap-1">
                <Link to="/admin/books">
                  <BookIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Manage</span> Books
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {!hasServiceKey && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-md p-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Using Anonymous Key</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-500">
                  Using Supabase anonymous key for admin operations. For better security and permissions,
                  add VITE_SUPABASE_SERVICE_KEY to your .env file and restart the server.
                </p>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {/* Order count and pagination info */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
              </p>
            </div>

            {/* Orders list */}
            {currentOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2 p-4 lg:p-6">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-base lg:text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {updatingOrderId === order.id ? (
                        <Badge className="bg-gray-500 text-white flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Updating...
                        </Badge>
                      ) : (
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      )}

                      {/* Delete button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => openDeleteDialog(order)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete order</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-xs lg:text-sm font-medium mb-1 lg:mb-2">Customer Details</h3>
                      <p className="text-xs lg:text-sm">{order.customer_name}</p>
                      <p className="text-xs lg:text-sm">{order.customer_email}</p>
                      <p className="text-xs lg:text-sm">{order.customer_phone}</p>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-sm font-medium mb-1 lg:mb-2">Shipping Address</h3>
                      <p className="text-xs lg:text-sm">{order.customer_address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-xs lg:text-sm font-medium mb-1 lg:mb-2">Shipping Method</h3>
                      <p className="text-xs lg:text-sm capitalize">{order.shipping_method || 'Standard'}</p>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-sm font-medium mb-1 lg:mb-2">Payment Method</h3>
                      <p className="text-xs lg:text-sm capitalize">{order.payment_method || 'Cash on Delivery'}</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-2 lg:p-3 mb-4">
                    <h3 className="text-xs lg:text-sm font-medium mb-1 lg:mb-2">Order Items</h3>
                    <div className="space-y-1 lg:space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-xs lg:text-sm">
                          <span className="truncate pr-2">{item.title} × {item.quantity}</span>
                          <span className="whitespace-nowrap">{(item.price * item.quantity).toFixed(2)} TND</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-medium text-xs lg:text-sm">
                        <span>Total</span>
                        <span>{order.total_amount.toFixed(2)} TND</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs lg:text-sm font-medium mb-1 lg:mb-2">Update Status</h3>
                    <div className="flex flex-wrap gap-1 lg:gap-2">
                      {/* Status badges with loading state */}
                      {updatingOrderId === order.id ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Updating status...</span>
                        </div>
                      ) : (
                        <>
                          <Badge
                            onClick={() => handleStatusChange(order.id, 'pending')}
                            className={`cursor-pointer text-xs px-2 py-0.5 lg:px-3 lg:py-1 ${
                              order.status === 'pending'
                                ? 'bg-yellow-500 text-white font-bold ring-2 ring-yellow-300 ring-offset-1'
                                : 'bg-yellow-500/30 hover:bg-yellow-500 text-white'
                            }`}
                          >
                            Pending
                          </Badge>
                          <Badge
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            className={`cursor-pointer text-xs px-2 py-0.5 lg:px-3 lg:py-1 ${
                              order.status === 'processing'
                                ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-300 ring-offset-1'
                                : 'bg-blue-500/30 hover:bg-blue-500 text-white'
                            }`}
                          >
                            Processing
                          </Badge>
                          <Badge
                            onClick={() => handleStatusChange(order.id, 'shipped')}
                            className={`cursor-pointer text-xs px-2 py-0.5 lg:px-3 lg:py-1 ${
                              order.status === 'shipped'
                                ? 'bg-purple-500 text-white font-bold ring-2 ring-purple-300 ring-offset-1'
                                : 'bg-purple-500/30 hover:bg-purple-500 text-white'
                            }`}
                          >
                            Shipped
                          </Badge>
                          <Badge
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className={`cursor-pointer text-xs px-2 py-0.5 lg:px-3 lg:py-1 ${
                              order.status === 'completed'
                                ? 'bg-green-500 text-white font-bold ring-2 ring-green-300 ring-offset-1'
                                : 'bg-green-500/30 hover:bg-green-500 text-white'
                            }`}
                          >
                            Completed
                          </Badge>
                          <Badge
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className={`cursor-pointer text-xs px-2 py-0.5 lg:px-3 lg:py-1 ${
                              order.status === 'cancelled'
                                ? 'bg-red-500 text-white font-bold ring-2 ring-red-300 ring-offset-1'
                                : 'bg-red-500/30 hover:bg-red-500 text-white'
                            }`}
                          >
                            Cancelled
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className="h-8 w-8 p-0"
                    >
                      {number}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete order
              #{orderToDelete?.id.substring(0, 8)} and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteOrder();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Order'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrders;
