'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { clerkClient } from '@clerk/nextjs/server';
import { Home } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/lib/data';
import router, { useRouter } from 'next/router';
import createUser from '@/lib/action';
export default function SignUpPage() {
  // const route = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // const formData = new FormData(event.target as HTMLFormElement);
    // const user: User = {
    //   email: formData.get('emailAddress') as string,
    //   username: formData.get('username') as string,
    //   password: formData.get('password') as string,
    //   phoneNumber: formData.get('phoneNumber') as string,
    // };
    //  createUser(user);
    // Redirect to sign-in page after successful user creation
  };

  return (
    <div className="h-screen flex items-center justify-center bg-stone-50">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          onSubmit={handleSubmit}
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <header className="text-center">
            <div className="flex justify-center">
              <Home className="h-8 w-auto text-green-700" />
            </div>
          </header>
          <h1 className="mt-4 text-xl fonx`t-medium tracking-tight text-zinc-950">
            Create an account
          </h1>

          <Clerk.GlobalError className="text-sm text-red-400" />
          {/* {error && <span className="text-red-400">{error}</span>} */}

          <Clerk.Field name="username" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-stone-600">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-stone-200"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-stone-600">Email</Clerk.Label>
            <Clerk.Input
              type="email"
              required
              className="p-2 rounded-md ring-1 ring-stone-200"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-stone-600" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              required
              className="p-2 rounded-md ring-1 ring-stone-200"
              placeholder="e.g. +1234567890"
            />
            <span className="text-xs text-red-400" id="phoneError"></span>
          </div>

          <Clerk.Field name="role" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-stone-600">Role</Clerk.Label>
            <select required className="p-2 rounded-md ring-1 ring-stone-200">
              <option value="">Select a role</option>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-stone-600">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-stone-200"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <SignUp.Captcha />

          <SignUp.Action
            submit
            className="bg-green-700 hover:bg-green-800 text-white my-1 rounded-md text-sm p-[10px]"
          >
            Sign Up
          </SignUp.Action>

          <p className="text-sm text-stone-600">
            Already have an account?{' '}
            <a href="/sign-in" className="text-green-700 hover:underline">
              Login here
            </a>
            .
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}
