"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signInSchema } from "@/lib/zod";
import LoadingButton from "@/components/LoadingButton";
import { handleCredentialsSignin } from "@/app/actions/authActions";
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Home } from "lucide-react";
import { useSession } from "next-auth/react";
import { getSession } from "@/lib/getSession";

export default function SignIn() {
  const params = useSearchParams();
  const error = params.get("error");
  const router = useRouter();
  const { data: session } = useSession();
  const [globalError, setGlobalError] = useState<string>("");
  if (session?.user) {
    redirect(session.user.role === "tenant" ? "/tenant" : "/owner");
  }
  useEffect(() => {
    if (error) {
      setGlobalError("An unexpected error occurred. Please try again.");
    }
    router.replace("/auth/sign-in");
  }, [error, router]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialsSignin(values);
      // const session = await getSession();
      if (result?.message) {
        setGlobalError(result.message);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <Card className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800 flex justify-center">
            <Home className="h-8 w-auto text-green-700 px-4" />
            Login to MyRumah
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button will go here */}
              <LoadingButton pending={form.formState.isSubmitting}>
                Sign in
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
