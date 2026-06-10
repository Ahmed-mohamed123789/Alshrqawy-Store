"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { Loader2, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  details: z.string().min(1, "Address details are required"),
  city: z.string().min(1, "City is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartId, numOfCartItems } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // =========================
  // FIX 1: Reset state after Stripe return
  // =========================
  useEffect(() => {
    const stripeReturn = sessionStorage.getItem("stripe_return");

    // if (stripeReturn === "1") {
    //   sessionStorage.removeItem("stripe_return");

    //   setIsSubmitting(false);

    //   router.refresh();
    // }
  }, [router]);

  // =========================
  // FIX 2: Handle back/forward cache
  // =========================
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsSubmitting(false);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cartId) {
      toast.error("Your cart is empty or cart ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        `/orders/checkout-session/${cartId}?url=${window.location.origin}`,
        {
          shippingAddress: {
            details: data.details,
            phone: data.phone,
            city: data.city,
          },
        }
      );

      if (response.data.status === "success" && response.data.session?.url) {
        // =========================
        // FIX 3: Mark stripe navigation
        // =========================
        sessionStorage.setItem("stripe_return", "1");

        // Set a timeout to clear the flag after 5 minutes (as a safety net)
        const stripeReturnTimeout = window.setTimeout(() => {
          sessionStorage.removeItem("stripe_return");
        }, 300000); // 5 minutes

        window.location.replace(response.data.session.url);
      } else {
        toast.error("Failed to create checkout session");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Checkout failed. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  if (numOfCartItems === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add some products to your cart before checking out.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Checkout Details
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Please enter your shipping information below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="01012345678"
                className="w-full pl-10 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Address Details
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register("details")}
                rows={3}
                className="w-full pl-10 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.details && (
              <p className="text-red-600 text-sm">
                {errors.details.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                {...register("city")}
                type="text"
                placeholder="Cairo"
                className="w-full pl-10 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.city && (
              <p className="text-red-600 text-sm">{errors.city.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}