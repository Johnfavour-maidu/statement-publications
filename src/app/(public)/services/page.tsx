"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BookOpen, PenTool, CheckCircle2, Palette, Printer,
  Megaphone, Feather, UserCheck, Headphones, Newspaper, GraduationCap,
  FileText, Check, HelpCircle, Star, ChevronDown, Globe, TrendingUp,
  Zap, Shield, Heart, Award, Crown, Rocket, Sparkles, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const services = [
  { icon: BookOpen, title: "Book Publishing", description: "End-to-end publishing for eBooks, paperbacks, and hardcovers with global distribution.", cardBg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100 text-amber-700", btnBg: "bg-amber-100 hover:bg-amber-200 text-amber-700", slug: "book-publishing" },
  { icon: PenTool, title: "Book Editing", description: "Professional developmental editing, copyediting, and line editing by genre specialists.", cardBg: "bg-[#FDF6EE] border-[#EBC9A8]", iconBg: "bg-[#F2D8BE]/60 text-[#8A6A4A]", btnBg: "bg-[#F2D8BE]/40 hover:bg-[#EBC9A8]/40 text-[#8A6A4A]", slug: "book-editing" },
  { icon: CheckCircle2, title: "Proofreading", description: "Meticulous final-pass proofreading to catch every typo and formatting inconsistency.", cardBg: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100 text-blue-700", btnBg: "bg-blue-100 hover:bg-blue-200 text-blue-700", slug: "proofreading" },
  { icon: FileText, title: "ISBN Registration", description: "We handle the entire ISBN registration process for retail and library distribution.", cardBg: "bg-rose-50 border-rose-200", iconBg: "bg-rose-100 text-rose-700", btnBg: "bg-rose-100 hover:bg-rose-200 text-rose-700", slug: "isbn-registration" },
  { icon: Palette, title: "Cover Design", description: "Custom cover designs by professional artists who understand genre trends.", cardBg: "bg-violet-50 border-violet-200", iconBg: "bg-violet-100 text-violet-700", btnBg: "bg-violet-100 hover:bg-violet-200 text-violet-700", slug: "cover-design" },
  { icon: Printer, title: "Book Formatting", description: "Interior formatting for print and digital formats on every device and edition.", cardBg: "bg-teal-50 border-teal-200", iconBg: "bg-teal-100 text-teal-700", btnBg: "bg-teal-100 hover:bg-teal-200 text-teal-700", slug: "book-formatting" },
  { icon: Megaphone, title: "Marketing Services", description: "Strategic marketing campaigns including social media, book launches, and advertising.", cardBg: "bg-orange-50 border-orange-200", iconBg: "bg-orange-100 text-orange-700", btnBg: "bg-orange-100 hover:bg-orange-200 text-orange-700", slug: "marketing" },
  { icon: Feather, title: "Ghostwriting", description: "Skilled ghostwriters who bring your ideas to life while maintaining your voice.", cardBg: "bg-pink-50 border-pink-200", iconBg: "bg-pink-100 text-pink-700", btnBg: "bg-pink-100 hover:bg-pink-200 text-pink-700", slug: "ghostwriting" },
  { icon: UserCheck, title: "Author Branding", description: "Build your author brand with professional headshots, bio, and social media strategy.", cardBg: "bg-indigo-50 border-indigo-200", iconBg: "bg-indigo-100 text-indigo-700", btnBg: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700", slug: "author-branding" },
  { icon: Headphones, title: "Audiobook Publishing", description: "Professional narration, production, and distribution to Audible and Apple Books.", cardBg: "bg-cyan-50 border-cyan-200", iconBg: "bg-cyan-100 text-cyan-700", btnBg: "bg-cyan-100 hover:bg-cyan-200 text-cyan-700", slug: "audiobook" },
  { icon: GraduationCap, title: "Academic Publishing", description: "Specialized publishing for academic texts, dissertations, and scholarly works.", cardBg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100 text-amber-700", btnBg: "bg-amber-100 hover:bg-amber-200 text-amber-700", slug: "academic" },
  { icon: Newspaper, title: "Magazine Publishing", description: "Full-service magazine publishing from layout design to digital distribution.", cardBg: "bg-[#FDF6EE] border-[#EBC9A8]", iconBg: "bg-[#F2D8BE]/60 text-[#8A6A4A]", btnBg: "bg-[#F2D8BE]/40 hover:bg-[#EBC9A8]/40 text-[#8A6A4A]", slug: "magazine" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for first-time authors ready to self-publish.",
    borderColor: "border-blue-200",
    accent: "bg-blue-100 text-blue-700",
    icon: BookOpen,
    features: ["eBook publishing", "Basic cover templates", "ISBN registration", "Author dashboard", "Standard royalties (up to 50%)", "Email support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Basic",
    price: "$99",
    period: "per book",
    description: "Essential services for authors who need a professional start.",
    borderColor: "border-amber-200",
    accent: "bg-amber-100 text-amber-700",
    icon: PenTool,
    features: ["Everything in Starter", "Professional formatting", "Cover design consultation", "Metadata optimization", "Enhanced royalties (up to 60%)", "Priority email support"],
    cta: "Get Basic",
    popular: false,
  },
  {
    name: "Professional",
    price: "$499",
    period: "per book",
    description: "Comprehensive publishing for serious authors.",
    borderColor: "border-[#EBC9A8]",
    accent: "bg-[#EBC9A8]/20 text-[#8A6A4A]",
    icon: Star,
    features: ["Everything in Basic", "Custom cover design", "Professional editing", "Print-on-demand setup", "Marketing consultation", "Audiobook production", "Priority support", "Enhanced royalties (up to 70%)"],
    cta: "Go Professional",
    popular: true,
  },
  {
    name: "Premium",
    price: "$999",
    period: "per book",
    description: "Premium publishing with full marketing and branding support.",
    borderColor: "border-orange-200",
    accent: "bg-orange-100 text-orange-700",
    icon: Award,
    features: ["Everything in Professional", "Author branding package", "Social media strategy", "Book launch campaign", "Press release distribution", "Dedicated editor", "Premium royalties (up to 75%)", "48-hour support"],
    cta: "Go Premium",
    popular: false,
  },
  {
    name: "Author Pro",
    price: "$1,999",
    period: "per book",
    description: "For established authors who want the complete package.",
    borderColor: "border-violet-200",
    accent: "bg-violet-100 text-violet-700",
    icon: Crown,
    features: ["Everything in Premium", "Multi-format publishing", "Global distribution setup", "Advanced marketing campaigns", "Author website design", "Newsletter setup", "Maximum royalties (up to 80%)", "Dedicated account manager"],
    cta: "Go Author Pro",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for publishers and large catalogs.",
    borderColor: "border-emerald-200",
    accent: "bg-emerald-100 text-emerald-700",
    icon: Rocket,
    features: ["Everything in Author Pro", "Bulk publishing tools", "Custom branding package", "Advanced analytics dashboard", "API access", "White-label options", "Negotiable royalties", "Dedicated support team"],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqCategories = [
  { id: "publishing", label: "Publishing" },
  { id: "royalties", label: "Royalties" },
  { id: "payments", label: "Payments" },
  { id: "authors", label: "Authors" },
  { id: "readers", label: "Readers" },
];

const faqs = [
  { category: "publishing", question: "What publishing formats do you support?", answer: "We support all major formats including eBooks (EPUB, MOBI, PDF), print books (paperback and hardcover), and audiobooks. Your book can be published in multiple formats simultaneously." },
  { category: "publishing", question: "How long does the publishing process take?", answer: "eBook publishing can take 2-3 weeks. Full-service publishing with editing, cover design, and formatting typically takes 8-12 weeks. We provide a detailed timeline during your consultation." },
  { category: "publishing", question: "Do I need to hire all your services?", answer: "Not at all. Our services are à la carte. You can choose exactly what you need — whether it's just ISBN registration or a complete publishing package." },
  { category: "royalties", question: "What royalty rates do you offer?", answer: "Royalty rates vary by tier. Starter accounts receive up to 50% on eBooks, Professional accounts get up to 70%, and Author Pro accounts can earn up to 80%." },
  { category: "royalties", question: "How often are royalties paid?", answer: "Royalties are calculated monthly and paid out within 30 days of the end of each month. You can track your earnings in real-time through your author dashboard." },
  { category: "payments", question: "What payment methods do you accept?", answer: "We accept all major credit cards, debit cards, and mobile money payments. Enterprise clients can also pay via bank transfer and invoicing." },
  { category: "payments", question: "Are there any hidden fees?", answer: "No hidden fees. The price you see is the price you pay. All our packages include transparent pricing with no surprise charges." },
  { category: "authors", question: "Can I publish in genres you don't list?", answer: "Absolutely. We publish books across all genres and categories. Contact us to discuss your specific project." },
  { category: "authors", question: "Do you offer marketing support?", answer: "Yes. Our Professional and above tiers include marketing consultation and campaign management. We also offer standalone marketing packages." },
  { category: "readers", question: "How do I find books on the platform?", answer: "You can browse by category, search by title or author, or explore our curated collections. Our recommendation engine also suggests books based on your reading preferences." },
];

export default function ServicesPage() {
  const [activeFaqCategory, setActiveFaqCategory] = useState("publishing");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((f) => f.category === activeFaqCategory);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#EBC9A8]/30 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm text-[#8A6A4A] mb-8">
            <Sparkles className="h-4 w-4" />
            Professional Publishing Solutions
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-charcoal"
            style={{ fontFamily: "var(--font-libre)" }}>
            Everything Authors Need
            <br />
            <span className="text-[#8A6A4A]">To Publish Successfully</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-dark-gray/70 max-w-3xl mx-auto leading-relaxed">
            From manuscript to marketplace, we provide every tool and service you need to bring your book to life and share it with the world.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#EBC9A8] px-8 py-4 text-base font-semibold text-charcoal hover:bg-[#D8B27A] hover:shadow-lg transition-all">
              Create Account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#pricing" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-8 py-4 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Services Grid ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Our Services</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Professional Publishing Solutions
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              Choose individual services or comprehensive publishing packages.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 0.05}>
                <Link href={`/services/${service.slug}`}>
                  <div className={cn(
                    "group p-6 rounded-2xl border-2 transition-all duration-300 h-full cursor-pointer",
                    "hover:shadow-xl hover:-translate-y-1",
                    service.cardBg
                  )}>
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-sm", service.iconBg)}>
                      <service.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-[#8A6A4A] transition-colors">{service.title}</h3>
                    <p className="text-sm text-dark-gray/70 leading-relaxed mb-5">{service.description}</p>
                    <div className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                      "shadow-sm group-hover:shadow-md group-hover:scale-105",
                      service.btnBg
                    )}>
                      Learn More <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="py-24 sm:py-32 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Pricing</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Publishing Packages
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              Choose the plan that fits your publishing journey.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <AnimatedSection key={tier.name} delay={index * 0.05}>
                <div className={cn(
                  "relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 h-full flex flex-col",
                  "hover:shadow-xl hover:-translate-y-1",
                  tier.borderColor,
                  tier.popular && "ring-2 ring-[#EBC9A8] scale-[1.02]"
                )}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#EBC9A8] text-charcoal text-xs font-bold rounded-full shadow-sm">
                      Most Popular
                    </div>
                  )}
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", tier.accent)}>
                    <tier.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{tier.name}</h3>
                  <div className="mt-2 mb-3">
                    <span className="text-3xl font-bold text-charcoal">{tier.price}</span>
                    {tier.period && <span className="text-sm text-dark-gray/50 ml-1">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-dark-gray/70 mb-4">{tier.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-dark-gray/70">
                        <Check className="h-4 w-4 text-[#D8B27A] mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className={cn(
                    "w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all",
                    tier.popular
                      ? "bg-[#EBC9A8] text-charcoal hover:bg-[#D8B27A] shadow-sm hover:shadow-md"
                      : "border-2 border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white"
                  )}>
                    {tier.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveFaqCategory(cat.id); setOpenFaq(0); }}
                className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", activeFaqCategory === cat.id ? "bg-[#EBC9A8] text-charcoal" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200")}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-charcoal pr-4">{faq.question}</span>
                  <ChevronDown className={cn("h-5 w-5 text-dark-gray/40 shrink-0 transition-transform", openFaq === index && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 text-sm text-dark-gray/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-32" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Ready To Share Your Story?
            </h2>
            <p className="mt-4 text-lg text-charcoal/70 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to bring their stories to the world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-8 py-4 text-base font-semibold text-white hover:bg-dark-gray shadow-lg transition-all">
                Create Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/books" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal/30 px-8 py-4 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all">
                Explore Books
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
