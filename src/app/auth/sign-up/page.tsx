"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingButton from "@/components/LoadingButton";
import ErrorMessage from "@/components/ErrorMessage";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import {
  handleCredentialsSignin,
  handleSignUp,
} from "@/app/actions/authActions";
import { Home } from "lucide-react";

export default function SignUp() {
  const [globalError, setGlobalError] = useState("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: undefined,
      phoneNumber: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleSignUp(values);
      if (result.success) {
        console.log("Account created successfully.");
        console.log(values);
        const valuesForSignin = {
          email: values.email,
          password: values.password,
        };
        await handleCredentialsSignin(valuesForSignin);
      } else {
        setGlobalError(result.message);
      }
    } catch (error) {
      setGlobalError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 p-4">
      <Card className="w-full max-w-4xl space-y-8 rounded-xl bg-white/80 backdrop-blur-sm px-6 py-8 shadow-lg ring-1 ring-black/5 sm:px-8 animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3">
            <Home className="h-8 w-auto text-green-700 px-4" />
            Create an account to rent a house or lease yours!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                {["username", "email", "password"].map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as keyof z.infer<typeof signUpSchema>}
                    render={({ field: fieldProps }) => (
                      <FormItem className="transition-all duration-200 focus-within:scale-[1.02]">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={
                              field === "password"
                                ? "password"
                                : field === "email"
                                ? "email"
                                : "text"
                            }
                            placeholder={`Enter your ${field}`}
                            {...fieldProps}
                            autoComplete="off"
                            className="h-11 px-4 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 focus-within:scale-[1.02]">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                          autoComplete="off"
                          className="h-11 px-4 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 focus-within:scale-[1.02]">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number (e.g. +6012345678)"
                          {...field}
                          autoComplete="off"
                          className="h-11 px-4 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Role
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {["tenant", "owner"].map((role) => (
                            <FormItem
                              key={role}
                              className="flex items-center space-x-2"
                            >
                              <FormControl>
                                <RadioGroupItem value={role} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <LoadingButton pending={form.formState.isSubmitting}>
                  Sign up
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
