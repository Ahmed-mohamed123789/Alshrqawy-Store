"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Trash2,
  ShoppingCart,
  Loader2,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/skeletons';

export default function WishlistPage() {
  const { items, loading, actionLoading: wishlistLoading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, actionLoading: cartLoading, isInCart: checkInCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-2 mb-8">
            <div className="h-8 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <ProductGridSkeleton count={4} />
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
          <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-red-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Save your favorite items here to shop later
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''} saved
          </p>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((product, i) => {
              const isRemovingWishlist = wishlistLoading.has(product._id);
              const isAddingToCart = cartLoading.has(product._id);
              const isInCart = checkInCart(product._id);

              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    disabled={isRemovingWishlist}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all"
                  >
                    {isRemovingWishlist ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-400" />
                    )}
                  </button>

                  {/* Image */}
                  <Link href={`/product/${product._id}`} className="block relative">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={product.imageCover}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <Link href={`/product/${product._id}`}>
                      <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider">
                        {product.category?.name}
                      </p>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[2.5rem]">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-gray-700">
                        {product.ratingsAverage}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({product.ratingsQuantity})
                      </span>
                    </div>

                    {/* Price & Cart */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg font-bold text-gray-900">
                        {(product.priceAfterDiscount || product.price).toLocaleString()} EGP
                      </span>

                      <button
                        onClick={() => !isInCart && addToCart(product._id)}
                        disabled={isAddingToCart || isInCart}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${
                          isInCart
                            ? 'bg-emerald-100 text-emerald-600 cursor-default'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isAddingToCart ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isInCart ? (
                          <span className="text-xs font-bold px-1">✓</span>
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
