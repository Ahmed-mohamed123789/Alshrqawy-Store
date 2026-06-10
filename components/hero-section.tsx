"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Compass } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      
      {/* Blurred Glowing Background Circles */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none"
      />
      <motion.div 
        animate={{ 
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 md:w-[28rem] md:h-[28rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 drop-shadow-sm">
              Shurqawy Store
            </span>
            <span className="ml-3 inline-block animate-bounce drop-shadow-2xl">🛒</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light text-slate-200/90 max-w-3xl mx-auto leading-relaxed">
            Discover the best products with amazing prices
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6"
        >
          <Link
            href="/auth/register"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <span className="relative flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 group-hover:-rotate-12 group-hover:scale-110 transition-all" />
              Shop Now
            </span>
          </Link>
          
          <Link
            href="/auth/login"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-100 bg-white/5 border border-blue-400/20 rounded-full backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-blue-400/40 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-95"
          >
            <span className="relative flex items-center">
              <Compass className="w-5 h-5 mr-2 group-hover:animate-pulse transition-all" />
              Explore
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
