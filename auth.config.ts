import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import prisma from "@/lib/prisma";
// import bcryptjs from 'bcryptjs';
import { NextAuthConfig } from "next-auth";

const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];
const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
const tenantRoutes = ["/tenant"];
const ownerRoutes = ["/owner"];
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
        // user = await prisma.user.findUnique({
        //   where: {
        //     email: credentials.email as string,
        //   },
        // });
        user = {
          id: "1", // Add an ID field
          email: "testing@gmail.com",
          password: "A123b123", // Example hashed password
          role: "owner", // Optional: Include any fields relevant to your app
        };

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        if (!user.password) {
          console.log(
            "User has no password. They probably signed up with an oauth provider."
          );
          return null;
        }
        const isPasswordValid = true;
        // const isPasswordValid = await bcryptjs.compare(
        //   credentials.password as string,
        //   user.password
        // );
        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
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
      // console.log("isLoggedin" + isLoggedIn);
      // console.log("pathname in callback auth.config" + pathname);
      // console.log("Auth state:", !!auth?.user);
      // console.log("Current pathname:", pathname);
      // console.log("User role:", auth?.user?.role);
      // // 1. Handle public routes
      // if (publicRoutes.includes(pathname)) {
      //   return true;
      // }

      // 2. Handle auth routes (sign-in, sign-up)
      // if (authRoutes.includes(pathname)) {
      //   // If user is logged in and trying to access auth routes,
      //   // redirect them based on their role
      //   if (isLoggedIn) {
      //     const role = auth.user.role;
      //     const baseUrl = new URL(nextUrl.origin);

      //     if (role === "tenant") {
      //       baseUrl.pathname = "/tenant";
      //       return Response.redirect(baseUrl);
      //     } else if (role === "owner") {
      //       baseUrl.pathname = "/owner";
      //       return Response.redirect(baseUrl);
      //     }
      //   }
      //   return true; // Allow access to auth pages if not logged in
      // }

      // 3. Handle protected routes
      // if (!isLoggedIn) {
      //   // Redirect to sign-in page if trying to access protected routes while not logged in
      //   const signInUrl = new URL("/auth/sign-in", nextUrl.origin);
      //   signInUrl.searchParams.set("callbackUrl", nextUrl.href);
      //   return Response.redirect(signInUrl);
      // }

      // 4. Allow access to other routes if logged in
      return true;
    },

    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
} satisfies NextAuthConfig;
