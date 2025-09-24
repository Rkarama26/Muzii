import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/app/lib/db";
import { NextAuthOptions } from "next-auth";

// Define auth options
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
        async signIn(params) {
            if (!params.user.email) return false;

            try {
                await prismaClient.user.create({
                    data: {
                        email: params.user.email,
                        provider: "Google",
                    },
                });
            } catch (error) {
                // User may already exist
            }

            return true;
        },
    },
};

// Create the handler
const handler = NextAuth(authOptions);

// Export named methods
export { handler as GET, handler as POST };
