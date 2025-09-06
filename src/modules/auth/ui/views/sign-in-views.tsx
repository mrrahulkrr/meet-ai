"use client";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (pending) return; // Prevent double submission

    setError(null);
    setPending(true);

    try {
      const result = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/");
            setPending(false);
          },
          onError: ({ error }) => {
            setError(error.message || "Invalid email or password");
            setPending(false);
          },
        }
      );

      if (result?.error) {
        setError(result.error.message || "Invalid email or password");
        setPending(false);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setPending(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: any) {
      console.error(`${provider} sign in error:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden">
          <CardContent className="p-0 flex flex-col md:flex-row">
            {/* Left side - Form */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
              <Form {...form}>
                <div className="space-y-8 max-w-md mx-auto w-full">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Welcome back
                    </h1>
                    <p className="text-muted-foreground">
                      Sign in to your account to continue
                    </p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-sm font-medium">
                        {error}
                      </AlertTitle>
                    </Alert>
                  )}

                  {/* Form */}
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              disabled={pending}
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="/auth/forgot-password"
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              disabled={pending}
                              autoComplete="current-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={pending}>
                      {pending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Google */}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleSocialSignIn("google")}
                      className="w-full"
                    >
                      {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaGoogle className="mr-2 h-4 w-4" />
                      )}
                    </Button>

                    {/* GitHub */}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleSocialSignIn("github")}
                      className="w-full"
                    >
                      {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaGithub className="mr-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Sign up link */}
                  <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </Form>
            </div>

            {/* Right side - Branding */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-sidebar-accent to-sidebar items-center justify-center p-12">
              <div className="text-center text-white space-y-4 max-w-sm">
                <div className="mx-auto h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="Meet.AI Logo"
                    className="h-12 w-12"
                  />
                </div>
                <h2 className="text-3xl font-bold">Meet.AI</h2>
                <p className="text-green-100">
                  Connect, collaborate, and innovate with the power of AI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="hover:underline text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
