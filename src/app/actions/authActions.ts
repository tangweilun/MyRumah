'use server';

import { getSession } from '@/lib/getSession';
import { auth, signIn, signOut } from '../../../auth';
import { signUpSchema } from '@/lib/zod';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
// import prisma from "@/lib/prisma";

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirectTo: '/guest',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            message: 'Invalid credentials',
          };
        default:
          return {
            message: 'Something went wrong.',
          };
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  const result = await signOut({ redirectTo: '/' });
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
      return { success: false, message: 'Invalid data.' };
    }

    // check if the email is already taken
    // const existingUser = await prisma.user.findUnique({
    //     where: {
    //         email,
    //     },
    // });

    //replace false with exisitngUser
    if (false) {
      return {
        success: false,
        message: 'Email already exists. Login to continue.',
      };
    }

    // hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    // await prisma.user.create({
    //     data: {
    //         name,
    //         email,
    //         password: hashedPassword,
    //     },
    // });

    return { success: true, message: 'Account created successfully.' };
  } catch (error) {
    console.error('Error creating account:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
