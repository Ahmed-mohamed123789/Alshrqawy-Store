"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/lib/validators';
import { api, handleApiError } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgotPasswords', data);
      if (response.data.statusMsg === 'success' || response.status === 200) {
        toast.success('Reset code sent to your email.');
        // Navigate to verify code page
        router.push('/auth/verify-code');
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot Password</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your email to receive a reset code</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 text-black ${
                errors.email ? 'border-red-500 focus:ring-red-200 bg-red-50/50' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50/50 hover:bg-white'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 disabled:opacity-70 flex justify-center items-center shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
