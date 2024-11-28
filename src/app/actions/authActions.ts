"use server";

import { getSession } from "@/lib/getSession";
import { auth, signIn, signOut } from "../../../auth";
import { signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const isUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: "/guest",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };
        default:
          return {
            message: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  const result = await signOut({ redirectTo: "/" });
}

export async function handleSignUp({
  username,
  email,
  password,
  confirmPassword,
  role,
  phoneNumber,
}: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phoneNumber: string;
}) {
  try {
    const parsedCredentials = signUpSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
      role,
      phoneNumber,
    });
    if (!parsedCredentials.success) {
      return { success: false, message: "Invalid data." };
    }

    if (!isUserRole(role)) {
      return { success: false, message: "Invalid data." };
    }

    // const accExist = await checkAccExist(email, role);
    const accExist = await checkAccExist(email);

    //replace false with exisitngUser
    // if (false) {
    //   return {
    //     success: false,
    //     message: "Email already exists. Login to continue.",
    //   };
    // }
    if (accExist && !accExist.exist) {
      // return { status: "success", data: "sss" };
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.userInfo.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          phone_number: phoneNumber,
          role: UserRole[role as keyof typeof UserRole],
          wallet_amount: 1000,
        },
      });
      console.log(22222);
      return {
        success: true,
        message: "Account created successfully.",
        // newUser: newUser,
      };
    }
    console.log(2777);
    return { success: false, message: "Account is already exist." };

    // return { success: true, message: "Account created successfully." };
  } catch (error) {
    // console.error("Error creating account:", error);
    // return {
    //   success: false,
    //   message: "An unexpected error occurred. Please try again.",
    // };
    console.error("Error creating account in database:", error);
    return { success: false, message: "Something went wrong." };
  }
}

// async function checkAccExist(email: string, role: UserRole) {
async function checkAccExist(email: string) {
  try {
    // const count = await prisma.userInfo.count({
    //   where: { email: email, role: role },
    // });
    const count = await prisma.userInfo.count({
      where: { email: email },
    });
    return count > 0 ? { exist: true } : { exist: false };
  } catch (error) {
    // console.error('Database error');
    // throw new Error('Database error');
    console.error("Database error");
    return { status: 500 };
  }
}
