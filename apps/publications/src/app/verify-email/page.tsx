"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
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
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-[#1D1D1D] text-2xl font-bold">
              Email Verified!
            </h1>
            <p className="text-[#8A6A4A]">{message}</p>
            <Link
              href="/login"
              className="mt-4 inline-block bg-[#D8B27A] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#D8B27A]/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-[#1D1D1D] text-2xl font-bold">
              Verification Failed
            </h1>
            <p className="text-[#8A6A4A]">{message}</p>
            <Link
              href="/login"
              className="mt-4 inline-block bg-[#D8B27A] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#D8B27A]/90 transition-colors"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #F5E6D3 0%, #F2D8BE 40%, #EBC9A8 100%)" }}
      >
        <Loader2 className="w-12 h-12 text-[#8A6A4A] animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
