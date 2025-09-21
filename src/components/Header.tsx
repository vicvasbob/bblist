'use client';

import { useUserStore } from '@/store/userStore';
import { getDictionary } from '@/lib/i18n';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useUserStore();
  const dict = getDictionary();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };


  return (
    <header className="bg-white shadow-sm border-b border-gray-200 absolute top-0 left-0 right-0 fixed">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🍼</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{dict.header.title}</h1>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {
              user && user?.is_admin && <Link 
                href="/admin/products"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
              >
                Products
              </Link>
            }
            {
              user && user?.is_admin && <Link 
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
              >
                Users
              </Link>
            }
            {
              user && user?.is_admin && <Link 
                href="/admin/settings"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
              >
                Settings
              </Link>
            }
          </nav>

          {/* User Info */}
          {user?.isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title={dict.auth?.logout || 'Tancar sessió'}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">{dict.auth?.logout || 'Tancar sessió'}</span>
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Not logged in
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="flex items-center justify-between">
            <div className="flex space-x-6">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Gift List
              </Link>
            </div>
            {user?.isLoggedIn && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {dict.auth?.logout || 'Tancar sessió'}
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}