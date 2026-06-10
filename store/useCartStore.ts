"use client";

import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import type { CartProduct } from "@/lib/types";
import toast from "react-hot-toast";

interface CartState {
  items: CartProduct[];
  cartIds: Set<string>;
  totalPrice: number;
  cartId: string | null;
  numOfCartItems: number;
  loading: boolean;
  actionLoading: Set<string>;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;

  resetLoading: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartIds: new Set(),
  totalPrice: 0,
  cartId: null,
  numOfCartItems: 0,
  loading: false,
  actionLoading: new Set(),

  // 🟢 Reset helper
  resetLoading: () => {
    set({
      loading: false,
      actionLoading: new Set(),
    });
  },

  // 🟢 Fetch Cart
  fetchCart: async () => {
    set({ loading: true });

    try {
      const { data } = await axiosInstance.get("/cart");

      const ids = new Set<string>(
        data.data.products.map((p: any) => p.product?._id || p.product)
      );

      set({
        items: data.data.products,
        cartIds: ids,
        totalPrice: data.data.totalCartPrice,
        cartId: data.cartId,
        numOfCartItems: data.numOfCartItems,
      });
    } catch {
      set({
        items: [],
        cartIds: new Set(),
        totalPrice: 0,
        numOfCartItems: 0,
      });

      toast.error("Failed to fetch cart");
    } finally {
      get().resetLoading();
    }
  },

  // 🟢 Add to cart
  addToCart: async (productId: string) => {
    const { actionLoading, cartIds, numOfCartItems } = get();

    const optimisticIds = new Set(cartIds);
    optimisticIds.add(productId);

    set({
      cartIds: optimisticIds,
      numOfCartItems: numOfCartItems + 1,
    });

    const updatedLoading = new Set(actionLoading);
    updatedLoading.add(productId);
    set({ actionLoading: updatedLoading });

    try {
      const { data } = await axiosInstance.post("/cart", { productId });

      const newIds = new Set<string>(
        data.data.products.map((p: any) => p.product?._id || p.product)
      );

      set({
        items: data.data.products,
        cartIds: newIds,
        totalPrice: data.data.totalCartPrice,
        cartId: data.cartId,
        numOfCartItems: data.numOfCartItems,
      });

      toast.success("Added to cart");
    } catch {
      set({ cartIds, numOfCartItems });
      toast.error("Failed to add to cart");
    } finally {
      const s = new Set(get().actionLoading);
      s.delete(productId);
      set({ actionLoading: s });
    }
  },

  // 🟢 Remove from cart
  removeFromCart: async (productId: string) => {
    const { actionLoading, cartIds, numOfCartItems } = get();

    const optimisticIds = new Set(cartIds);
    optimisticIds.delete(productId);

    set({
      cartIds: optimisticIds,
      numOfCartItems: Math.max(0, numOfCartItems - 1),
    });

    const updatedLoading = new Set(actionLoading);
    updatedLoading.add(productId);
    set({ actionLoading: updatedLoading });

    try {
      const { data } = await axiosInstance.delete(`/cart/${productId}`);

      const newIds = new Set<string>(
        data.data.products.map((p: any) => p.product?._id || p.product)
      );

      set({
        items: data.data.products,
        cartIds: newIds,
        totalPrice: data.data.totalCartPrice,
        numOfCartItems: data.numOfCartItems,
      });

      toast.success("Removed from cart");
    } catch {
      set({ cartIds, numOfCartItems });
      toast.error("Failed to remove item");
    } finally {
      const s = new Set(get().actionLoading);
      s.delete(productId);
      set({ actionLoading: s });
    }
  },

  // 🟢 Update quantity
  updateQuantity: async (productId: string, count: number) => {
    if (count < 1) return;

    const updatedLoading = new Set(get().actionLoading);
    updatedLoading.add(productId);
    set({ actionLoading: updatedLoading });

    try {
      const { data } = await axiosInstance.put(`/cart/${productId}`, {
        count,
      });

      const newIds = new Set<string>(
        data.data.products.map((p: any) => p.product?._id || p.product)
      );

      set({
        items: data.data.products,
        cartIds: newIds,
        totalPrice: data.data.totalCartPrice,
        numOfCartItems: data.numOfCartItems,
      });
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      const s = new Set(get().actionLoading);
      s.delete(productId);
      set({ actionLoading: s });
    }
  },

  // 🟢 Clear cart
  clearCart: async () => {
    set({ loading: true });

    try {
      await axiosInstance.delete("/cart");

      set({
        items: [],
        cartIds: new Set(),
        totalPrice: 0,
        numOfCartItems: 0,
        cartId: null,
      });

      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      get().resetLoading();
    }
  },

  // 🟢 Check item
  isInCart: (productId: string) => {
    return get().cartIds.has(productId);
  },
}));