
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Get admin credentials from environment variables
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// Validate environment variables
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('Missing admin credentials in environment variables. Please check your .env file.');
}

// Admin authentication service
export const verifyAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Check against environment variables
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a token with expiration
      const tokenPayload = {
        username,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours expiration
        iat: Math.floor(Date.now() / 1000)
      };

      const token = btoa(JSON.stringify(tokenPayload));
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminTokenExpiry', tokenPayload.exp.toString());

      return true;
    }

    return false;
  } catch (error) {
    console.error('Admin verification error:', error);
    toast({
      title: 'Authentication error',
      description: 'Please try again later',
      variant: "destructive"
    });
    return false;
  }
};

// Logout function
export const logoutAdmin = (): void => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminTokenExpiry');
  // Clear any admin-related session data
  sessionStorage.removeItem('adminSessionData');
  toast({
    title: 'Successfully logged out of admin panel'
  });
};

// Check if admin is logged in with expiration check
export const isAdminLoggedIn = (): boolean => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    const expiryStr = localStorage.getItem('adminTokenExpiry');
    if (!expiryStr) return false;

    const expiry = parseInt(expiryStr, 10);
    const now = Math.floor(Date.now() / 1000);

    // If token is expired, clean up and return false
    if (now >= expiry) {
      logoutAdmin();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking admin login:', error);
    return false;
  }
};

// Refresh admin token to extend session
export const refreshAdminToken = (): void => {
  if (isAdminLoggedIn()) {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const tokenData = JSON.parse(atob(token));

      // Extend token expiration
      tokenData.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

      const newToken = btoa(JSON.stringify(tokenData));
      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminTokenExpiry', tokenData.exp.toString());
    } catch (error) {
      console.error('Error refreshing admin token:', error);
    }
  }
};
