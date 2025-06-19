// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    isAdmin?: boolean;
    user: {
      id?: string;
      name?: string | null;
      phoneNumber?: string ;
      image?: string | null;
      isAdmin?: boolean;
      lastName?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string;
    phoneNumber?: string;
    accessToken?: string;
    isAdmin?: boolean;
    lastName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    isAdmin?: boolean;
  }
}
