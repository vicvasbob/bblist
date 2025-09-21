'use client';

import { useUserStore, useHydration } from '@/store/userStore';
import NotAuthorized from './NotAuthorized';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export default function AdminAuthWrapper({ 
  children
}: AdminAuthWrapperProps) {
  const { user } = useUserStore();
  const isHydrated = useHydration();

  // Show loading state while hydrating to prevent flashing
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[76px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check authorization after hydration is complete
  if (!user || !user?.is_admin) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}