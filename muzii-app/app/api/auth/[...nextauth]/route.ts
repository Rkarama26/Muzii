import GoogleProvider from 'next-auth/providers/google';
import { prismaClient } from '@/app/lib/db';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

// Extend  Session type to include id
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? 'secret',
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await prismaClient.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            provider: 'Google',
          },
        });

        const dbUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          user.id = dbUser.id;
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// Create the handler
const handler = NextAuth(authOptions);

// Export named methods
export { handler as GET, handler as POST };
