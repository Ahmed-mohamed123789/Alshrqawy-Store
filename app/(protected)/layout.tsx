"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading, isStripeReturn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isStripeReturn) {
      router.replace("/cart");
    } else if (!loading && !token) {
      router.replace("/auth/login");
    }
  }, [token, loading, isStripeReturn, router]);

  if (loading || !token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Verifying session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}