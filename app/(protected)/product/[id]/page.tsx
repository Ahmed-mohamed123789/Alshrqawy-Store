"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  Heart,
  ShoppingCart,
  Star,
  Loader2,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, actionLoading: cartLoading } = useCartStore();
  const cartIds = useCartStore(state => state.cartIds);
  const { toggleWishlist, actionLoading: wishlistLoading } = useWishlistStore();
  const wishlistIds = useWishlistStore(state => state.wishlistIds);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data.data);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4 py-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6" />
              <div className="flex gap-3 mt-6">
                <div className="h-12 bg-gray-200 rounded-xl flex-1" />
                <div className="h-12 bg-gray-200 rounded-xl w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link href="/products" className="text-indigo-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = wishlistIds.has(product._id);
  const isAddingToCart = cartLoading.has(product._id);
  const isTogglingWishlist = wishlistLoading.has(product._id);
  const isInCart = cartIds.has(product._id);
  const allImages = [product.imageCover, ...product.images];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group"
          >
            <Swiper
              spaceBetween={0}
              centeredSlides={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              loop={true}
              className="w-full h-full"
            >
              {allImages.map((img, idx) => (
                <SwiperSlide key={idx} className="w-full h-full relative">
                  <Image
                    src={img}
                    alt={`${product.title} - ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {product.priceAfterDiscount && (
              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                -{Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}% OFF
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6 w-full"
          >
            {/* Category & Brand */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {product.category?.name}
              </span>
              {product.brand && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {product.brand.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-700">
                  {product.ratingsAverage}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                ({product.ratingsQuantity} reviews)
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-emerald-600 font-medium">
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {(product.priceAfterDiscount || product.price).toLocaleString()} EGP
              </span>
              {product.priceAfterDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {product.price.toLocaleString()} EGP
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => !isInCart && addToCart(product._id)}
                disabled={isAddingToCart || isInCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                  isInCart
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300'
                } disabled:opacity-70`}
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isInCart ? (
                  <>
                    <span>Added ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={isTogglingWishlist}
                className={`p-3.5 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                  inWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-400'
                }`}
              >
                {isTogglingWishlist ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-gray-100">
              <div className="text-center space-y-1">
                <Truck className="w-5 h-5 mx-auto text-indigo-500" />
                <p className="text-xs text-gray-500 font-medium">Free Shipping</p>
              </div>
              <div className="text-center space-y-1">
                <Shield className="w-5 h-5 mx-auto text-emerald-500" />
                <p className="text-xs text-gray-500 font-medium">Secure Payment</p>
              </div>
              <div className="text-center space-y-1">
                <RotateCcw className="w-5 h-5 mx-auto text-amber-500" />
                <p className="text-xs text-gray-500 font-medium">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
