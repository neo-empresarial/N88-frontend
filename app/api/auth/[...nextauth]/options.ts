import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    googleAccessToken?: string;
  }

  interface JWT {
    googleAccessToken?: string;
  }

}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    // newUser: null
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, account }) {
      if (account && account.provider === 'google') {
        token.googleAccessToken = account.access_token; // Save the Google token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.googleAccessToken) {
        session.googleAccessToken = token.googleAccessToken as string;
        return session;
      }
      console.log("No Google access token found in session");
      return session;
    },
  },
}