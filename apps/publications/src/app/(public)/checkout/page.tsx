"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, BookOpen, PenTool, Star, Award, Crown, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingBubbles } from "@/components/floating-bubbles";

const packageDetails: Record<string, {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}> = {
  starter: {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for first-time authors ready to self-publish.",
    icon: BookOpen,
    features: ["eBook publishing", "Basic cover templates", "ISBN registration", "Author dashboard", "Standard royalties (up to 50%)", "Email support"],
  },
  basic: {
    name: "Basic",
    price: "$99",
    period: "per book",
    description: "Essential services for authors who need a professional start.",
    icon: PenTool,
    features: ["Everything in Starter", "Professional formatting", "Cover design consultation", "Metadata optimization", "Enhanced royalties (up to 60%)", "Priority email support"],
  },
  professional: {
    name: "Professional",
    price: "$499",
    period: "per book",
    description: "Comprehensive publishing for serious authors.",
    icon: Star,
    features: ["Everything in Basic", "Custom cover design", "Professional editing", "Print-on-demand setup", "Marketing consultation", "Audiobook production", "Priority support", "Enhanced royalties (up to 70%)"],
  },
  premium: {
    name: "Premium",
    price: "$999",
    period: "per book",
    description: "Premium publishing with full marketing and branding support.",
    icon: Award,
    features: ["Everything in Professional", "Author branding package", "Social media strategy", "Book launch campaign", "Press release distribution", "Dedicated editor", "Premium royalties (up to 75%)", "48-hour support"],
  },
  "author pro": {
    name: "Author Pro",
    price: "$1,999",
    period: "per book",
    description: "For established authors who want the complete package.",
    icon: Crown,
    features: ["Everything in Premium", "Multi-format publishing", "Global distribution setup", "Advanced marketing campaigns", "Author website design", "Newsletter setup", "Maximum royalties (up to 80%)", "Dedicated account manager"],
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for publishers and large catalogs.",
    icon: Rocket,
    features: ["Everything in Author Pro", "Bulk publishing tools", "Custom branding package", "Advanced analytics dashboard", "API access", "White-label options", "Negotiable royalties", "Dedicated support team"],
  },
};

export default function CheckoutPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const { package: pkg } = use(searchParams);
  const pkgKey = (pkg || "professional").toLowerCase();
  const details = packageDetails[pkgKey] || packageDetails.professional;
  const Icon = details.icon;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDF6EE] px-5 pt-[64px] lg:pt-[116px] relative overflow-hidden">
      <FloatingBubbles className="opacity-60" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8]">
          <div className="bg-white rounded-[14px] p-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm bg-[#EDE0D0]">
              <Icon className="h-7 w-7 text-[#8A6A4A]" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal mb-2">{details.name} Package</h1>
            <p className="text-dark-gray/70 mb-6">{details.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-charcoal">{details.price}</span>
              {details.period && <span className="text-sm text-dark-gray/50 ml-1">{details.period}</span>}
            </div>
            <ul className="space-y-2.5 mb-8">
              {details.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-dark-gray/70">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 text-[#8A6A4A]" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-charcoal px-6 py-3.5 text-sm font-semibold text-white hover:bg-dark-gray shadow-lg transition-all duration-300 hover:scale-[1.05]"
            >
              Create Account to Continue <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-center text-xs text-dark-gray/50">
              You&apos;ll be redirected to create your account and complete checkout.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="/services" className="text-sm text-[#8A6A4A] hover:text-[#D8B27A] font-semibold transition-colors">
            ← Back to Services
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
