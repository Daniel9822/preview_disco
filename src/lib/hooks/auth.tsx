"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";
// import { useRouter } from "next/navigation";

type AuthHook = {
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
  signIn: (phoneNumber: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthHook {
  const { data: session, status } = useSession();
  // const router = useRouter();

  // Create a signIn helper that uses our credentials provider
  const handleSignIn = useCallback(
    async (phoneNumber: string, password: string): Promise<boolean> => {
      const userAgent =
        typeof window !== "undefined" ? window.navigator.userAgent : "";
      try {
        const response = await signIn("credentials", {
          phoneNumber,
          password,
          userAgent,
          redirect: false,
          callbackUrl: "/",
        });

        return response?.ok || false;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    []
  );

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     if (session?.isAdmin) {
  //       router.replace("/admin/dashboard");
  //       return // o la ruta que corresponda a tu dashboard admin
  //     }
  //     router.push("/account/dashboard");
  //   }
  // }, [status, session, router]);

  // Create an axios instance with auth headers

  return {
    session,
    status,
    signIn: handleSignIn,
    signOut,
  };
}
