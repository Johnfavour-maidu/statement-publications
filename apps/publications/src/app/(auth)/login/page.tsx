"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const oauthError = searchParams.get("error") === "OAuthAccountNotLinked";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const lowerError = result.error.toLowerCase();
        if (lowerError.includes("no account") || lowerError.includes("not found")) {
          setError("Account not found. Please check your email address or create a new account.");
        } else if (lowerError.includes("incorrect password") || lowerError.includes("wrong password")) {
          setError("Incorrect password. Please try again.");
        } else if (lowerError.includes("not verified") || lowerError.includes("verify")) {
          setError("Please verify your email address before signing in. Check your inbox for the verification email.");
          setShowResendVerification(true);
          setResendEmail(email);
        } else if (lowerError.includes("suspended") || lowerError.includes("deactivated")) {
          setError("Your account has been temporarily suspended. Please contact support.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        setIsLoading(false);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;
        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/author/dashboard");
        }
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/author/dashboard" });
  };

  const handleFacebookSignIn = () => {
    setIsFacebookLoading(true);
    signIn("facebook", { callbackUrl: "/author/dashboard" });
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResending(true);
    setResendSuccess(false);
    setResendError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendSuccess(true);
      } else {
        setResendError(data.message || "Failed to resend verification email.");
      }
    } catch {
      setResendError("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const showSocial = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" || process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-black hover:text-[#1D1D1D] mb-4 transition-colors">
        ← Back to home
      </Link>

      <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#8A6A4A] via-[#D8B27A] to-[#6B5238]">
        <div className="bg-white rounded-[14px] p-6 space-y-6">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="Statement Publications"
              className="h-8 lg:h-10 w-auto mx-auto"
            />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your author dashboard
            </p>
          </div>

          {registered && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              Account created! Please sign in.
            </div>
          )}
          {oauthError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              Email already associated with another provider.
            </div>
          )}

          {showSocial && (
            <div className="space-y-3">
              {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
                <Button
                  variant="outline"
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isFacebookLoading || isLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                </Button>
              )}

              {process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true" && (
                <Button
                  variant="outline"
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50"
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={isGoogleLoading || isFacebookLoading || isLoading}
                >
                  {isFacebookLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {isFacebookLoading ? "Signing in..." : "Continue with Facebook"}
                </Button>
              )}
            </div>
          )}

          {showSocial && (
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs text-muted-foreground bg-white">
                or continue with email
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {showResendVerification && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              {resendSuccess ? (
                <div className="text-sm text-amber-700">
                  <p className="font-medium mb-1">Verification email sent!</p>
                  <p>Please check your inbox and click the verification link.</p>
                </div>
              ) : (
                <form onSubmit={handleResendVerification} className="space-y-3">
                  <p className="text-sm text-amber-700 font-medium">Need another email?</p>
                  {resendError && (
                    <p className="text-xs text-red-600">{resendError}</p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="text-sm flex-1 focus-visible:ring-[#D8B27A]"
                      required
                      disabled={isResending}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90"
                      disabled={isResending}
                    >
                      {isResending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Resend"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 focus-visible:ring-[#D8B27A]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#8A6A4A] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 focus-visible:ring-[#D8B27A]"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#EBC9A8]/40 bg-white/60 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-[#8A6A4A]" />
          <h3 className="text-sm font-semibold text-[#1D1D1D]">
            Demo Credentials
          </h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#1D1D1D] font-medium">Admin</span>
            <code className="font-mono text-[#1D1D1D] bg-white/80 px-1.5 py-0.5 rounded">
              admin@statementpublications.com / admin123
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#1D1D1D] font-medium">Author</span>
            <code className="font-mono text-[#1D1D1D] bg-white/80 px-1.5 py-0.5 rounded">
              sarah.chen@statementpub.com / author123
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#1D1D1D] font-medium">Ame Author</span>
            <code className="font-mono text-[#1D1D1D] bg-white/80 px-1.5 py-0.5 rounded">
              ame.okafor@statementpub.com / author123
            </code>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8A6A4A]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
