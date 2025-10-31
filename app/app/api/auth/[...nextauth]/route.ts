import GoogleProvider from 'next-auth/providers/google';
import { prismaClient } from '@/app/lib/db';
import NextAuth, { NextAuthOptions } from 'next-auth';

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
      } catch (error) {
        console.error('Error creating user:', error);
      }

      return true;
    },

    // <-- Add this callback to include `id` in the session
    async session({ session, user }) {
      if (session.user && session.user.email) {
        const dbUser = await prismaClient.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id; // add id to session.user
        }
      }
      return session;
    },
  },
};

// Create the handler
const handler = NextAuth(authOptions);

// Export named methods
export { handler as GET, handler as POST };
