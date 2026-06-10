"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';
import ProductCard from '@/components/product-card';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import type { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Package } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products?limit=8');
        setProducts(data.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Shopper'}! 
              <span className="inline-block ml-2 animate-bounce">👋</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Discover amazing deals and trending products curated just for you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 p-5 flex items-center gap-4 border border-gray-50">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Products</p>
              <p className="text-2xl font-bold text-gray-900">10K+</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 p-5 flex items-center gap-4 border border-gray-50">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl text-white shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Trending</p>
              <p className="text-2xl font-bold text-gray-900">500+</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 p-5 flex items-center gap-4 border border-gray-50">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Deals</p>
              <p className="text-2xl font-bold text-gray-900">Today</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked products for you</p>
            </div>
            <a
              href="/products"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              View all →
            </a>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
