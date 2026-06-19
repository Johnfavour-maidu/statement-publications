"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
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

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #F5E6D3 0%, #F2D8BE 40%, #EBC9A8 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#8A6A4A] animate-spin" />
            <p className="text-[#1D1D1D] text-lg font-medium">
              Verifying your email...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-[#1D1D1D] text-2xl font-bold">
              Email Verified Successfully
            </h1>
            <p className="text-[#5C4A3D] text-sm leading-relaxed">
              Your account has been activated and you can now access all Statement Publications services.
            </p>
            <div className="flex flex-col gap-3 w-full mt-2">
              <Link href="/author/dashboard" className="w-full">
                <Button className="w-full bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90">
                  Go To Dashboard
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-[#1D1D1D] text-2xl font-bold">
              Verification Link Invalid or Expired
            </h1>
            <p className="text-[#5C4A3D] text-sm leading-relaxed">
              {message || "The verification link you clicked is invalid or has expired. Please request a new one."}
            </p>

            <div className="w-full mt-4">
              <h3 className="text-sm font-semibold text-[#1D1D1D] mb-3">Resend Verification Email</h3>
              {resendSuccess ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 mb-3">
                  Verification email sent! Please check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  {resendError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {resendError}
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="pl-9 focus-visible:ring-[#D8B27A]"
                      required
                      disabled={isResending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Verification Email"
                    )}
                  </Button>
                </form>
              )}
            </div>

            <Link href="/login" className="mt-2">
              <Button variant="outline">
                Return To Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #F5E6D3 0%, #F2D8BE 40%, #EBC9A8 100%)" }}
        >
          <Loader2 className="w-12 h-12 text-[#8A6A4A] animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
