import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.points = (token as any).points ?? 0;

        session.user.badges = (token as any).badges ?? [];
        session.user.role = (token as any).role;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        include: { badges: { include: { badge: true } } },
      });

      if (dbUser) {
        token.sub = dbUser.id;
        (token as any).points = dbUser.points;
        (token as any).badges = dbUser?.badges.map((ub) => ub.badge) ?? [];
        (token as any).role = dbUser.role;
      }

      return token;
    },
  },
};
