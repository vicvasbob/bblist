'use client';

import { useCallback, useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserByToken, loginUser } from '@/lib/fetch';
import { getDictionary } from '@/lib/i18n';
import { useRouter, usePathname } from 'next/navigation';

export default function UserLogin() {
  const dict = getDictionary();
  const { user, login, logout, setUser } = useUserStore();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Define routes that require authentication
  const protectedRoutes = ['/products', '/admin'];
  const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route));

  // Reset loading state when user changes or component mounts
  useEffect(() => {
    setIsLoggingIn(false);
    setError('');
  }, [user?.id]);

  // Remove the problematic useEffect and getCurrentUser
  // Token validation will be handled elsewhere or on-demand

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !email.trim()) return;

    setIsLoggingIn(true);
    setError(''); // Clear any previous errors
    
    // Safety timeout to reset loading state after 10 seconds
    const timeout = setTimeout(() => {
      setIsLoggingIn(false);
    }, 10000);
    
    try {
      const { data } = await loginUser(email, password);
      clearTimeout(timeout);
      
      if (data && data.id) {
        login(data);
        // Don't reset isLoggingIn here, let the component unmount naturally
      } else {
        setError(dict.login.error);
        setIsLoggingIn(false);
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error('Login error:', error);
      setError(dict.login.error);
      setIsLoggingIn(false);
    }
  };

  // Only show login modal if user is not logged in AND we're on a protected route
  if (user?.isLoggedIn || !requiresAuth) {
    return null;
  }

  // If no user exists and we're on a protected route, show login modal
  return (
    <div className="fixed inset-0 bg-fuchsia-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {/* No close button - modal cannot be closed */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🍼</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{dict.login.title}</h2>
          <p className="text-gray-600">{dict.login.description}</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder={dict.login.email_placeholder}
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Password *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder={dict.login.password_placeholder}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoggingIn || !password || !email.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoggingIn ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Joining Baby Shower...
              </>
            ) : (
              dict.login.button
            )}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>{dict.login.ask}</p>
        </div>
        
        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
