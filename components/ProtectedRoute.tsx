import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isDemoMode } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // This will show the splash screen while loading
  }

  // Show children if authenticated or in demo mode
  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}; 