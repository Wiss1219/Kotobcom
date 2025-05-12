
import { supabase, adminSupabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { Json } from '@/integrations/supabase/types';

export const createOrder = async (orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  shippingMethod?: string;
  paymentMethod?: string;
}) => {
  try {
    // Convert the cart items to a format that can be stored in the jsonb column
    const itemsForDb = orderData.items.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      coverImage: item.coverImage
    }));

    // Create the order - no need for service role client now that we have proper RLS policies
    // Store shipping and payment method in the items field since we don't have dedicated columns
    const itemsWithMeta = {
      products: itemsForDb,
      shipping_method: orderData.shippingMethod || 'standard',
      payment_method: orderData.paymentMethod || 'cash'
    };

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        items: itemsWithMeta as Json,
        total_amount: orderData.totalAmount,
        status: 'pending'
      })
      .select();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    // Use the admin client to ensure we can access all orders
    const { data, error } = await adminSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    console.log(`Updating order ${orderId} status to ${status}`);

    // First, check if we can access the order
    const { data: orderCheck, error: checkError } = await adminSupabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (checkError) {
      console.error('Error checking order before update:', checkError);
      return null;
    }

    if (!orderCheck) {
      console.error('Order not found for update:', orderId);
      return null;
    }

    console.log('Current order status before update:', orderCheck.status);

    // Use a direct SQL update to ensure it works regardless of RLS policies
    const updateResult = await adminSupabase
      .from('orders')
      .update({
        status: status,
        updated_at: new Date().toISOString() // Force an update to the updated_at field
      })
      .eq('id', orderId);

    console.log('Update operation result:', updateResult);

    if (updateResult.error) {
      console.error('Error updating order status:', updateResult.error);
      return null;
    }

    // Verify the update by fetching the order again
    const { data: updatedOrder, error: fetchError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Error fetching updated order:', fetchError);
      return null;
    }

    if (!updatedOrder) {
      console.error('Order not found after update:', orderId);
      return null;
    }

    console.log('Order fetched after update. New status:', updatedOrder.status);

    // Verify the status was actually updated
    if (updatedOrder.status !== status) {
      console.error('Status was not updated correctly. Expected:', status, 'Got:', updatedOrder.status);

      // Try one more time with a direct update as a last resort
      const finalUpdateResult = await adminSupabase.rpc('admin_update_order_status', {
        order_id: orderId,
        new_status: status
      });

      if (finalUpdateResult.error) {
        console.error('Final attempt to update status failed:', finalUpdateResult.error);
        return null;
      }

      // Fetch the order one more time
      const { data: finalOrder } = await adminSupabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (finalOrder && finalOrder.status === status) {
        console.log('Order status updated successfully on final attempt:', finalOrder);
        return finalOrder;
      }

      return null;
    }

    console.log('Order status updated successfully:', updatedOrder);

    // Return the updated order
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    console.log(`Deleting order ${orderId}`);

    // Delete the order
    const { error } = await adminSupabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      return { success: false, error };
    }

    console.log('Order deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error };
  }
};

export const getOrderStats = async () => {
  try {
    // Get all orders to calculate stats
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) throw error;

    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        orderCount: 0,
        pendingOrders: 0,
        customerCount: 0
      };
    }

    // Calculate total revenue from all orders
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = parseFloat(String(order.total_amount || 0));
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

    // Count orders
    const orderCount = orders.length;

    // Calculate pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    // Count distinct customers (using email as unique identifier)
    const uniqueCustomers = new Set(orders.map(order => order.customer_email));
    const customerCount = uniqueCustomers.size;

    return {
      totalRevenue,
      orderCount,
      pendingOrders,
      customerCount
    };
  } catch (error) {
    console.error('Error getting order stats:', error);
    // Return default values if there's an error
    return {
      totalRevenue: 0,
      orderCount: 0,
      pendingOrders: 0,
      customerCount: 0
    };
  }
};
