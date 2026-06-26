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
          router.push("/books");
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
    signIn("google", { callbackUrl: "/books" });
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    setIsResending(true);
    setResendError("");
    setResendSuccess(false);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setResendSuccess(true);
      } else {
        setResendError(data.error || "Failed to resend verification email.");
      }
    } catch {
      setResendError("Failed to resend verification email. Please try again.");
    }
    setIsResending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px] mx-auto"
    >
      {/* Animated Gradient Border Card */}
      <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#8A6A4A] via-[#D8B27A] to-[#6B5238]">
        <div className="bg-white rounded-[14px] px-8 py-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="Statement Publications" className="h-10 w-auto mx-auto" />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1D1D1D] tracking-tight">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-2">Continue your reading journey with Statement Publications.</p>
          </div>

          {/* Alerts */}
          {registered && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200/60 text-[13px] text-green-700"
            >
              Account created successfully! Please sign in.
            </motion.div>
          )}

          {oauthError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/60 text-[13px] text-red-700"
            >
              This email is already associated with another sign-in method. Please use your original sign-in method.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/60 text-[13px] text-red-700 flex items-start gap-2"
            >
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 rounded-xl text-[13px] font-medium bg-white"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1.5"
            >
              <Label htmlFor="email" className="text-[13px] font-medium text-[#1D1D1D]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 text-[13px]"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-1.5"
            >
              <Label htmlFor="password" className="text-[13px] font-medium text-[#1D1D1D]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 text-[13px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#D8B27A] focus:ring-[#D8B27A]" />
                <span className="text-[13px] text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[13px] font-medium text-[#8A6A4A] hover:text-[#D8B27A] transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#D8B27A] hover:bg-[#8A6A4A] text-[#1D1D1D] hover:text-white font-semibold rounded-xl transition-all duration-200 text-[13px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Resend Verification */}
          {showResendVerification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200/60"
            >
              <p className="text-[13px] text-blue-700 mb-2 font-medium">Need a new verification email?</p>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 text-[13px] border-blue-200 focus:border-[#D8B27A] h-9 rounded-lg"
                />
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || !resendEmail}
                  variant="outline"
                  className="text-[13px] border-[#D8B27A] text-[#8A6A4A] hover:bg-[#D8B27A]/10 h-9 rounded-lg"
                >
                  {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Resend"}
                </Button>
              </div>
              {resendSuccess && <p className="text-xs text-green-600 mt-2">Verification email sent! Check your inbox.</p>}
              {resendError && <p className="text-xs text-red-600 mt-2">{resendError}</p>}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-[13px] text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#8A6A4A] hover:text-[#D8B27A] transition-colors">
            Create Account
          </Link>
        </p>
        <p className="text-[11px] text-gray-400 mt-3">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[#8A6A4A]">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-[#8A6A4A]">Privacy Policy</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #ffffff 50%, #F5E6D3 100%)" }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#D8B27A]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
