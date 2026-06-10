"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useEffect, useState } from 'react';
import {
  LogOut,
  Home,
  LogIn,
  UserPlus,
  ShoppingCart,
  Heart,
  Package,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const { token, loading, logout } = useAuth();
  const pathname = usePathname();
  const { numOfCartItems, fetchCart } = useCartStore();
  const { fetchWishlist, wishlistIds } = useWishlistStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch cart & wishlist when authenticated
  useEffect(() => {
    if (token && !loading) {
      fetchCart();
      fetchWishlist();
    }
  }, [token, loading, fetchCart, fetchWishlist]);

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={token ? "/home" : "/"}
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
              Shurqawy Store
            </Link>
          </div>

          {/* Desktop Nav Links */}
          {token && !loading && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/home" className={navLinkClass('/home')}>
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link href="/products" className={navLinkClass('/products')}>
                <Package className="w-4 h-4" />
                Products
              </Link>
              <Link href="/wishlist" className={navLinkClass('/wishlist')}>
                <div className="relative">
                  <Heart className="w-4 h-4" />
                  {wishlistIds.size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlistIds.size}
                    </span>
                  )}
                </div>
                Wishlist
              </Link>
              <Link href="/cart" className={navLinkClass('/cart')}>
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {numOfCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {numOfCartItems}
                    </span>
                  )}
                </div>
                Cart
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {token ? (
                  <>
                    <button
                      onClick={logout}
                      className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setMobileOpen(!mobileOpen)}
                      className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && token && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <Link href="/home" className={`${navLinkClass('/home')} w-full`} onClick={() => setMobileOpen(false)}>
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link href="/products" className={`${navLinkClass('/products')} w-full`} onClick={() => setMobileOpen(false)}>
              <Package className="w-4 h-4" /> Products
            </Link>
            <Link href="/wishlist" className={`${navLinkClass('/wishlist')} w-full`} onClick={() => setMobileOpen(false)}>
              <Heart className="w-4 h-4" /> Wishlist
              {wishlistIds.size > 0 && (
                <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistIds.size}
                </span>
              )}
            </Link>
            <Link href="/cart" className={`${navLinkClass('/cart')} w-full`} onClick={() => setMobileOpen(false)}>
              <ShoppingCart className="w-4 h-4" /> Cart
              {numOfCartItems > 0 && (
                <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {numOfCartItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => { setMobileOpen(false); logout(); }}
              className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
