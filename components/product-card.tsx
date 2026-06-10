"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, actionLoading: cartLoading } = useCartStore();
  const cartIds = useCartStore(state => state.cartIds);
  
  const { toggleWishlist, actionLoading: wishlistLoading } = useWishlistStore();
  const wishlistIds = useWishlistStore(state => state.wishlistIds);

  const inWishlist = wishlistIds.has(product._id);
  const isAddingToCart = cartLoading.has(product._id);
  const isTogglingWishlist = wishlistLoading.has(product._id);
  const isInCart = cartIds.has(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        disabled={isTogglingWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all duration-200 disabled:opacity-50"
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isTogglingWishlist ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
          />
        )}
      </button>

      {/* Discount Badge */}
      {product.priceAfterDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          -{Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}%
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product._id}`} className="block">
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
          <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">{product.ratingsAverage}</span>
          </div>
          <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {product.priceAfterDiscount
                ? `${product.priceAfterDiscount.toLocaleString()} EGP`
                : `${product.price.toLocaleString()} EGP`}
            </span>
            {product.priceAfterDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isInCart) addToCart(product._id);
            }}
            disabled={isAddingToCart || isInCart}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isInCart
                ? 'bg-emerald-100 text-emerald-600 cursor-default'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95'
            } disabled:opacity-70`}
            aria-label={isInCart ? 'Already in cart' : 'Add to cart'}
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
}
