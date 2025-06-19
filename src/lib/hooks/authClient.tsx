// hooks/useApiClient.ts
"use client";

// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "./auth";

export const useApiClient = () => {
  const { session } = useAuth();
  const router = useRouter();

  const request = async <T,>(
    url: string,
    options?: RequestInit,
    loadingToastId?: string
  ): Promise<T> => {
    const token = session?.accessToken;
    console.log(session);

    console.log("token", token);
    const userAgent =
      typeof window !== "undefined" ? navigator.userAgent : "unknown";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": userAgent,
      ...(options?.headers || {}),
    };

    try {
      const res = await fetch(`${url}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData?.message || "Error en la respuesta";
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }
        toast.error(msg);
        if (msg === "No autenticado") router.push("/login");
        throw new Error(msg);
      }

      return res.json();
    } catch (error) {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      throw error;
    }
  };

  return { request };
};
