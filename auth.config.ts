import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import prisma from "@/lib/prisma";
import { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];
const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
// Define role-specific routes
const tenantRoutes = ["/tenant", "/tenant/"];
const ownerRoutes = ["/owner", "/owner/"];
const firstPageRoute = ["/"];
export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        let user = null;
        // validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }
        const pw = credentials.password as string;
        user = await prisma.userInfo.findFirst({
          // unique key name is defined in prisma.schema
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        if (pw && user.password) {
          const passwordMatches = await bcrypt.compare(pw, user.password);

          if (!passwordMatches) {
            console.log("Invalid password");
            return null;
          }
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const userRole = auth?.user?.role;

      // 1. Handle first page route specifically
      if (firstPageRoute.includes(pathname)) {
        // If logged in, redirect to respective dashboard
        if (isLoggedIn) {
          const baseUrl = new URL(nextUrl.origin);

          if (userRole === "tenant") {
            baseUrl.pathname = "/tenant";
            return Response.redirect(baseUrl);
          } else if (userRole === "owner") {
            baseUrl.pathname = "/owner";
            return Response.redirect(baseUrl);
          }
        }
        // Allow access to first page route only if not logged in
        return !isLoggedIn;
      }

      // 2. Handle auth routes (sign-in, sign-up)
      if (authRoutes.includes(pathname)) {
        // If user is logged in and trying to access auth routes,
        // redirect them based on their role
        if (isLoggedIn) {
          const baseUrl = new URL(nextUrl.origin);

          if (userRole === "tenant") {
            baseUrl.pathname = "/tenant";
            return Response.redirect(baseUrl);
          } else if (userRole === "owner") {
            baseUrl.pathname = "/owner";
            return Response.redirect(baseUrl);
          }
        }
        return true; // Allow access to auth pages if not logged in
      }

      // 3. Restrict role-specific routes
      if (tenantRoutes.some((route) => pathname.startsWith(route))) {
        // Only allow tenants to access tenant routes
        return isLoggedIn && userRole === "tenant";
      }

      if (ownerRoutes.some((route) => pathname.startsWith(route))) {
        // Only allow owners to access owner routes
        return isLoggedIn && userRole === "owner";
      }

      // 4. Redirect to sign-in if not logged in
      if (!isLoggedIn) {
        const signInUrl = new URL("/auth/sign-in", nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(signInUrl);
      }

      // 5. Allow access to other routes if logged in
      return true;
    },

    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.user_id = user.user_id as number;
        token.role = user.role as string;
        token.iat = Date.now();
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.user_id = token.user_id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
} satisfies NextAuthConfig;
