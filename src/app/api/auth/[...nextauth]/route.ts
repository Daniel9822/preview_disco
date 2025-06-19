import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const BASE_API = process.env.NEXT_PUBLIC_BASE_URL

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userAgent: { label: "Password", type: "password" },
        phoneNumber: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${BASE_API}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-agent": credentials.userAgent,
            },
            body: JSON.stringify({
              phoneNumber: credentials.phoneNumber,
              password: credentials.password,
            }),
          });


          const data = await response.json();
          console.log('res',data);
          if (data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set("user-agent", credentials.userAgent, {
              httpOnly: false,
              sameSite: "lax",
              // secure: process.env.NODE_ENV === "production",
              path: "/",
            });
            return {
              id: data.user.id?.toString() || "user-id", // Asegúrate de que `id` sea una string
            //   email: data.email || credentials.email,
              name: data.user.name || credentials.email,
              accessToken: data.access_token, // Usa `accessToken` en lugar de `token`
              // isAdmin: data.response.isAdmin,
              lastName: data.user.lastName || "",
              phoneNumber: data.user.phoneNumber || "",
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
        phoneNumber: typeof token.phoneNumber === "string" ? token.phoneNumber : "",
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

// ✅ Exporta el handler correctamente
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // ✅ Esto es correcto en la App Router
