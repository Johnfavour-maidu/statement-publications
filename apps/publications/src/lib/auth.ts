import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

function getAdapter() {
  return PrismaAdapter(prisma);
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: getAdapter(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTHOR_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.AUTHOR_GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("No account found with this email address");
        }

        if (user.role !== "AUTHOR" && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
          throw new Error("This account is not an author account. Please use the Reader platform to sign in.");
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated. Please contact support.");
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified. Please verify your email before signing in.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          if (existingUser.role !== "AUTHOR" && existingUser.role !== "ADMIN" && existingUser.role !== "SUPER_ADMIN") {
            return false;
          }
          return true;
        }

        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: "AUTHOR",
            emailVerified: new Date(),
            isVerified: true,
          },
        });
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }

      if (trigger === "update" && session) {
        token.name = session.user?.name ?? token.name;
        token.image = session.user?.image ?? token.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }

      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
});
