import { clsx, type ClassValue } from "clsx";
import { NextAuthOptions } from "next-auth";
import { twMerge } from "tailwind-merge";
import CredentialsProvider from "next-auth/providers/credentials";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userAgent: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${BASE_API}/api/v1/auth/sign-in`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-agent": credentials.userAgent,
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          console.log(data);
          if (data.data.token) {
            return {
              id: data.id?.toString() || "user-id", // Asegúrate de que `id` sea una string
              email: data.email || credentials.email,
              name: data.name || credentials.email,
              accessToken: data.data.token, // Usa `accessToken` en lugar de `token`
              // isAdmin: data.response.isAdmin,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Esto ocurre solo al login
        token.accessToken = user.accessToken;
        token.isAdmin = user.isAdmin;
        token.id = user.id;
        token.name = user.name;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
      }

      // En navegaciones o refresh, token ya tiene los datos previos
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name,
        isAdmin: token.isAdmin ?? false,
        lastName: typeof token.lastName === "string" ? token.lastName : "",
        phoneNumber:
          typeof token.phoneNumber === "string" ? token.phoneNumber : "",
      };
      session.accessToken = token.accessToken;
      session.isAdmin = token.isAdmin;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret",
};
