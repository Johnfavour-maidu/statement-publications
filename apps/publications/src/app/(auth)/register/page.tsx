"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Check, X, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRules = useMemo(() => {
    const rules = [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
      { label: "At least 1 lowercase letter", met: /[a-z]/.test(password) },
      { label: "At least 1 number", met: /[0-9]/.test(password) },
    ];
    const metCount = rules.filter((r) => r.met).length;
    let strength: "Weak" | "Moderate" | "Strong" = "Weak";
    let color = "#EF4444";
    if (metCount === 4) {
      strength = "Strong";
      color = "#22C55E";
    } else if (metCount >= 2) {
      strength = "Moderate";
      color = "#F97316";
    }
    return { rules, metCount, strength, color };
  }, [password]);

  const passwordsMatch = password === confirmPassword;
  const isFormValid = name && email && password && confirmPassword && passwordsMatch && agreed && isHuman && passwordRules.metCount === 4;

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/author/dashboard" });
  };

  const handleFacebookSignIn = () => {
    setIsFacebookLoading(true);
    signIn("facebook", { callbackUrl: "/author/dashboard" });
  };

  const showSocial = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" || process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

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
            <Link href="/" className="inline-flex justify-center mb-4">
              <img src="/logo.png" alt="Statement Publications" className="h-8 lg:h-10 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">
              Create Your Author Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start your publishing journey with Statement Publications
            </p>
          </div>

          {showSocial && (
            <div className="space-y-3">
              {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
                <Button
                  variant="outline"
                  className="w-full border border-gray-200 bg-white text-[#1D1D1D] hover:bg-gray-50"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading || isFacebookLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  {isGoogleLoading ? "Signing in..." : "Sign up with Google"}
                </Button>
              )}

              {process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true" && (
                <Button
                  variant="outline"
                  className="w-full border border-gray-200 bg-white text-[#1D1D1D] hover:bg-gray-50"
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={isLoading || isGoogleLoading || isFacebookLoading}
                >
                  {isFacebookLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {isFacebookLoading ? "Signing in..." : "Sign up with Facebook"}
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
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#1D1D1D]">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 rounded-lg focus:ring-[#D8B27A] focus:border-[#D8B27A]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1D1D1D]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 rounded-lg focus:ring-[#D8B27A] focus:border-[#D8B27A]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1D1D1D]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 rounded-lg focus:ring-[#D8B27A] focus:border-[#D8B27A]"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password.length > 0 && passwordRules.metCount < 4 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className="text-xs font-medium" style={{ color: passwordRules.color }}>
                      {passwordRules.strength}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordRules.metCount / 4) * 100}%`,
                        backgroundColor: passwordRules.color,
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    {passwordRules.rules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-1.5">
                        {rule.met ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-xs ${rule.met ? "text-green-600" : "text-muted-foreground"}`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#1D1D1D]">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-9 rounded-lg focus:ring-[#D8B27A] focus:border-[#D8B27A]"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v as boolean)}
                className="mt-0.5"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-[#8A6A4A] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#8A6A4A] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-medium text-[#1D1D1D]">Verify you are human</span>
              </div>
              <Checkbox
                id="captcha"
                checked={isHuman}
                onCheckedChange={(v) => setIsHuman(v as boolean)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-lg bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] font-medium"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Author Account"
              )}
            </Button>
          </form>

        </div>
      </div>
    </motion.div>
  );
}
