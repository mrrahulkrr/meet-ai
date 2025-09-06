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
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(50, {
        message: "Name must be less than 50 characters.",
      }),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    return { checks, score: passedChecks };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (pending) return; // Prevent double submission

    setError(null);
    setPending(true);

    try {
      const result = await authClient.signUp.email(
        {
          name: data.name,
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
            setError(error.message || "Failed to create account");
            setPending(false);
          },
        }
      );

      if (result?.error) {
        setError(result.error.message || "Failed to create account");
        setPending(false);
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setPending(false);
    }
  };

  const handleSocialSignUp = async (provider: "github" | "google") => {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: any) {
      console.error(`${provider} sign up error:`, err);
      setError(`Failed to sign up with ${provider}. Please try again.`);
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden">
          <CardContent className="p-0 grid md:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-8 md:p-10">
              <Form {...form}>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Create your account
                    </h1>
                    <p className="text-muted-foreground">
                      Join Meet.AI and start your journey
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your full name"
                              disabled={pending}
                              autoComplete="name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                disabled={pending}
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={pending}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>

                          {/* Password strength indicator */}
                          {password && (
                            <div className="space-y-2">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full ${
                                      passwordStrength.score >= level
                                        ? passwordStrength.score === 4
                                          ? "bg-green-500"
                                          : passwordStrength.score === 3
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                        : "bg-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center gap-2">
                                  {passwordStrength.checks.length ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span
                                    className={
                                      passwordStrength.checks.length
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    At least 8 characters
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {passwordStrength.checks.uppercase &&
                                  passwordStrength.checks.lowercase ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span
                                    className={
                                      passwordStrength.checks.uppercase &&
                                      passwordStrength.checks.lowercase
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    Upper & lowercase letters
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {passwordStrength.checks.number ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span
                                    className={
                                      passwordStrength.checks.number
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    At least one number
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                disabled={pending}
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                disabled={pending}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>

                          {/* Password match indicator */}
                          {confirmPassword && password && (
                            <div className="flex items-center gap-2 text-xs">
                              {password === confirmPassword ? (
                                <>
                                  <Check className="h-3 w-3 text-green-500" />
                                  <span className="text-green-600">
                                    Passwords match
                                  </span>
                                </>
                              ) : (
                                <>
                                  <X className="h-3 w-3 text-red-500" />
                                  <span className="text-red-600">
                                    Passwords don't match
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={pending}>
                      {pending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
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
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleSocialSignUp("google")}
                      className="w-full"
                    >
                      {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaGoogle className="mr-2 h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleSocialSignUp("github")}
                      className="w-full"
                    >
                      {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaGithub className="mr-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Sign in link */}
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </Form>
            </div>

            {/* Right side - Branding */}
            <div className="hidden md:flex bg-gradient-to-br from-sidebar-accent to-sidebar items-center justify-center p-10">
              <div className="text-center text-white space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="Meet.AI Logo"
                    className="h-12 w-12"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Meet.AI</h2>
                  <p className="text-green-100 max-w-sm">
                    Connect, collaborate, and innovate with the power of AI
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-green-100">
                      Smart AI-powered meetings
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-green-100">
                      Real-time collaboration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-green-100">Advanced analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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
