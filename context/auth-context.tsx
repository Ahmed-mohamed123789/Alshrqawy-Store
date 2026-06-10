"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setAuthState: (token: string | null, user: User | null) => void;
  isStripeReturn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStripeReturn, setIsStripeReturn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const redirectingRef = useRef(false);

  const isAuthRoute = pathname?.startsWith("/auth");

  // =========================
  // INIT AUTH & STRIPE DETECTION
  // =========================
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const storedToken = Cookies.get("token");

      if (storedToken) {
        setToken(storedToken);
        setUser({
          name: "User",
          email: "user@example.com",
          role: "user",
        });
      }

      // Check Stripe return inside client-only useEffect to prevent hydration mismatch
      const isReturn = typeof window !== "undefined" && sessionStorage.getItem("stripe_return") === "1";
      if (isReturn) {
        setIsStripeReturn(true);
        sessionStorage.removeItem("stripe_return");
        redirectingRef.current = false;
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // =========================
  // ROUTE GUARD
  // =========================
  useEffect(() => {
    if (loading) return;

    // 🚨 DON'T RUN ANY GUARD DURING STRIPE RETURN
    if (isStripeReturn) return;

    if (redirectingRef.current) return;

    // NOT LOGGED IN
    if (!token && !isAuthRoute && pathname !== "/") {
      redirectingRef.current = true;
      router.replace("/auth/login");
      return;
    }

    // LOGGED IN BUT ON AUTH PAGE
    if (token && isAuthRoute) {
      redirectingRef.current = true;
      router.replace("/home");
      return;
    }

    redirectingRef.current = false;
  }, [token, pathname, loading, router, isStripeReturn]);

  // =========================
  // LOGIN
  // =========================
  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);

    Cookies.set("token", newToken, {
      expires: 7,
      secure: true,
      sameSite: "lax",
    });

    router.replace("/home");
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");

    router.replace("/auth/login");
  };

  // =========================
  // SET AUTH
  // =========================
  const setAuthState = (newToken: string | null, userData: User | null) => {
    setToken(newToken);
    setUser(userData);

    if (newToken) {
      Cookies.set("token", newToken, {
        expires: 7,
        secure: true,
        sameSite: "lax",
      });
    } else {
      Cookies.remove("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setAuthState, isStripeReturn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// HOOK
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};