"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { CartItemSkeleton } from '@/components/ui/skeletons';

export default function CartPage() {
  const {
    items,
    totalPrice,
    loading,
    numOfCartItems,
    actionLoading,
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-2 mb-8">
            <div className="h-8 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-indigo-50 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-indigo-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Start shopping now!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">
              {numOfCartItems} item{numOfCartItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => {
                const isUpdating = actionLoading.has(item.product._id);
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <Link
                        href={`/product/${item.product._id}`}
                        className="relative w-28 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0"
                      >
                        {item.product.imageCover ? (
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product._id}`}>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.product.category?.name}
                        </p>
                        <p className="text-sm font-bold text-indigo-600 mt-2">
                          {item.price.toLocaleString()} EGP
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                item.count > 1
                                  ? updateQuantity(item.product._id, item.count - 1)
                                  : removeFromCart(item.product._id)
                              }
                              disabled={isUpdating}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-gray-900">
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.count
                              )}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product._id, item.count + 1)
                              }
                              disabled={isUpdating}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            disabled={isUpdating}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right self-center hidden sm:block">
                        <p className="text-lg font-bold text-gray-900">
                          {(item.price * item.count).toLocaleString()} EGP
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal ({numOfCartItems} items)
                  </span>
                  <span className="font-medium text-gray-900">
                    {totalPrice.toLocaleString()} EGP
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-gray-900">
                    {totalPrice.toLocaleString()} EGP
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all active:scale-[0.98]"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products"
                className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
