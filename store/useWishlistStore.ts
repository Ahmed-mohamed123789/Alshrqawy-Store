"use client";

import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import type { Product } from '@/lib/types';
import toast from 'react-hot-toast';

interface WishlistState {
  items: Product[];
  wishlistIds: Set<string>;
  loading: boolean;
  actionLoading: Set<string>;

  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  wishlistIds: new Set(),
  loading: false,
  actionLoading: new Set(),

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get('/wishlist');
      const ids = new Set<string>(data.data.map((p: Product) => p._id));
      set({ items: data.data, wishlistIds: ids });
    } catch {
      set({ items: [], wishlistIds: new Set() });
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    const { wishlistIds } = get();
    const isCurrentlyInWishlist = wishlistIds.has(productId);

    const current = new Set(get().actionLoading);
    current.add(productId);
    set({ actionLoading: current });

    try {
      if (isCurrentlyInWishlist) {
        const { data } = await axiosInstance.delete(`/wishlist/${productId}`);
        const newIds = new Set<string>(data.data);
        set({
          items: get().items.filter((p) => newIds.has(p._id)),
          wishlistIds: newIds,
          actionLoading: (() => { const s = new Set(get().actionLoading); s.delete(productId); return s; })(),
        });
        toast.success('Removed from wishlist');
      } else {
        const { data } = await axiosInstance.post('/wishlist', { productId });
        const newIds = new Set<string>(data.data);
        set({
          wishlistIds: newIds,
          actionLoading: (() => { const s = new Set(get().actionLoading); s.delete(productId); return s; })(),
        });
        toast.success('Added to wishlist');
      }
    } catch {
      set({ actionLoading: (() => { const s = new Set(get().actionLoading); s.delete(productId); return s; })() });
      toast.error('Failed to update wishlist');
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.has(productId);
  },
}));
