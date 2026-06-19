"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BookOpen, PenTool, CheckCircle2, Palette, Printer,
  Megaphone, Feather, UserCheck, Headphones, Newspaper, GraduationCap,
  FileText, Check, Star, ChevronDown, Globe, TrendingUp,
  Zap, Shield, Heart, Award, Crown, Rocket, Sparkles, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroWaveBottom, ServicesGridWaveBottom, PricingWaveBottom, FAQWaveTop } from "@/components/wave-separators";
import { AboutCTAWaveTop } from "@/components/about-wave-separators";
import { FloatingBubbles } from "@/components/floating-bubbles";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const services = [
  { icon: Megaphone, title: "Marketing Services", description: "Strategic marketing campaigns including social media, book launches, and advertising.", slug: "marketing", row: 1 },
  { icon: Newspaper, title: "Magazine Publishing", description: "Full-service magazine publishing from layout design to digital distribution.", slug: "magazine", row: 1 },
  { icon: Printer, title: "Book Formatting", description: "Interior formatting for print and digital formats on every device and edition.", slug: "book-formatting", row: 1 },
  { icon: FileText, title: "ISBN Registration", description: "We handle the entire ISBN registration process for retail and library distribution.", slug: "isbn-registration", row: 2 },
  { icon: Palette, title: "Cover Design", description: "Custom cover designs by professional artists who understand genre trends.", slug: "cover-design", row: 2 },
  { icon: Feather, title: "Ghostwriting", description: "Skilled ghostwriters who bring your ideas to life while maintaining your voice.", slug: "ghostwriting", row: 2 },
  { icon: BookOpen, title: "Book Publishing", description: "End-to-end publishing for eBooks, paperbacks, and hardcovers with global distribution.", slug: "book-publishing", row: 3 },
  { icon: GraduationCap, title: "Academic Publishing", description: "Specialized publishing for academic texts, dissertations, and scholarly works.", slug: "academic", row: 3 },
  { icon: PenTool, title: "Book Editing", description: "Professional developmental editing, copyediting, and line editing by genre specialists.", slug: "book-editing", row: 3 },
  { icon: CheckCircle2, title: "Proofreading", description: "Meticulous final-pass proofreading to catch every typo and formatting inconsistency.", slug: "proofreading", row: 4 },
  { icon: UserCheck, title: "Author Branding", description: "Build your author brand with professional headshots, bio, and social media strategy.", slug: "author-branding", row: 4 },
  { icon: Headphones, title: "Audiobook Publishing", description: "Professional narration, production, and distribution to Audible and Apple Books.", slug: "audiobook", row: 4 },
];

const rowStyles: Record<number, { cardBg: string; border: string; heading: string; body: string; btnBg: string; iconBg: string; iconColor: string }> = {
  1: { cardBg: "bg-[#D7C0A1]", border: "border-[#A56D45]", heading: "text-[#1E1E1E]", body: "text-[#5C4A3D]", btnBg: "bg-[#A56D45] text-white", iconBg: "bg-[#A56D45]", iconColor: "text-white" },
  2: { cardBg: "bg-[#C4976F]", border: "border-[#8E5A36]", heading: "text-[#1E1E1E]", body: "text-[#5C4A3D]", btnBg: "bg-[#A56D45] text-white", iconBg: "bg-[#8E5A36]", iconColor: "text-white" },
  3: { cardBg: "bg-[#B88259]", border: "border-[#8E5A36]", heading: "text-white", body: "text-[#F5EDE3]", btnBg: "bg-[#F5EDE3] text-[#A56D45]", iconBg: "bg-[#8E5A36]", iconColor: "text-white" },
  4: { cardBg: "bg-[#A56D45]", border: "border-[#7B4A2D]", heading: "text-white", body: "text-[#F5EDE3]", btnBg: "bg-[#F5EDE3] text-[#A56D45]", iconBg: "bg-[#7B4A2D]", iconColor: "text-white" },
};

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for first-time authors ready to self-publish.",
    icon: BookOpen,
    checkColor: "text-[#8A6A4A]",
    features: ["eBook publishing", "Basic cover templates", "ISBN registration", "Author dashboard", "Standard royalties (up to 50%)", "Email support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Basic",
    price: "$99",
    period: "per book",
    description: "Essential services for authors who need a professional start.",
    icon: PenTool,
    checkColor: "text-[#8A6A4A]",
    features: ["Everything in Starter", "Professional formatting", "Cover design consultation", "Metadata optimization", "Enhanced royalties (up to 60%)", "Priority email support"],
    cta: "Get Basic",
    popular: false,
  },
  {
    name: "Professional",
    price: "$499",
    period: "per book",
    description: "Comprehensive publishing for serious authors.",
    accent: "bg-[#EBC9A8]/20 text-[#8A6A4A]",
    icon: Star,
    gradientBorder: "from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8]",
    btnBg: "bg-[#EBC9A8] hover:bg-[#D8B27A] text-charcoal",
    checkColor: "text-[#D8B27A]",
    features: ["Everything in Basic", "Custom cover design", "Professional editing", "Print-on-demand setup", "Marketing consultation", "Audiobook production", "Priority support", "Enhanced royalties (up to 70%)"],
    cta: "Go Professional",
    popular: true,
  },
  {
    name: "Premium",
    price: "$999",
    period: "per book",
    description: "Premium publishing with full marketing and branding support.",
    icon: Award,
    checkColor: "text-[#8A6A4A]",
    features: ["Everything in Professional", "Author branding package", "Social media strategy", "Book launch campaign", "Press release distribution", "Dedicated editor", "Premium royalties (up to 75%)", "48-hour support"],
    cta: "Go Premium",
    popular: false,
  },
  {
    name: "Author Pro",
    price: "$1,999",
    period: "per book",
    description: "For established authors who want the complete package.",
    icon: Crown,
    checkColor: "text-[#8A6A4A]",
    features: ["Everything in Premium", "Multi-format publishing", "Global distribution setup", "Advanced marketing campaigns", "Author website design", "Newsletter setup", "Maximum royalties (up to 80%)", "Dedicated account manager"],
    cta: "Go Author Pro",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for publishers and large catalogs.",
    icon: Rocket,
    checkColor: "text-[#8A6A4A]",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((f) => f.category === activeFaqCategory);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white">
        <FloatingBubbles />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="relative inline-flex mb-6 p-[2px] rounded-full bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm text-[#8A6A4A]">
              <Sparkles className="h-4 w-4" />
              Professional Publishing Solutions
            </div>
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
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#EBC9A8] px-8 py-3.5 text-base font-semibold text-charcoal hover:bg-[#D8B27A] hover:shadow-lg transition-all duration-300 hover:scale-[1.05]">
              Create Account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#pricing" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-8 py-3.5 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.05]">
              View Pricing
            </Link>
          </motion.div>
        </div>
        <HeroWaveBottom />
      </section>

      {/* ── Services Grid ────────────────────────────────── */}
      <section className="relative py-10 sm:py-14 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">Our Services</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Professional Publishing Solutions
            </h2>
            <p className="mt-3 text-base text-dark-gray/70">
              Choose individual services or comprehensive publishing packages.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const rs = rowStyles[service.row];
              return (
              <AnimatedSection key={service.title} delay={index * 0.04}>
                <Link href={`/services/${service.slug}`}>
                  <div className={cn(
                    "group p-[2.5px] rounded-2xl border-2 transition-all duration-300 h-full cursor-pointer hover:scale-[1.02]",
                    rs.border,
                    rs.cardBg,
                    "hover:shadow-xxl"
                  )}>
                    <div className={cn(
                      "rounded-[14px] p-4 flex flex-col h-full transition-all duration-300",
                      rs.cardBg
                    )}>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm", rs.iconBg)}>
                        <service.icon className={cn("h-5 w-5", rs.iconColor)} />
                      </div>
                      <h3 className={cn("text-sm font-bold mb-1 transition-colors", rs.heading)}>{service.title}</h3>
                      <p className={cn("text-xs leading-relaxed mb-3 flex-1", rs.body)}>{service.description}</p>
                      <div className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 self-start",
                        "shadow-sm group-hover:shadow-md",
                        rs.btnBg
                      )}>
                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
              );
            })}
          </div>
        </div>
        <ServicesGridWaveBottom />
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="relative py-14 sm:py-18 bg-gradient-to-b from-[#FDF6EE] to-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">Pricing</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Publishing Packages
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              Choose the plan that fits your publishing journey.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingTiers.map((tier, index) => (
              <AnimatedSection key={tier.name} delay={index * 0.05}>
                <div className={cn(
                  "relative rounded-2xl border-2 transition-all duration-300 h-full flex flex-col hover:scale-[1.02]",
                  tier.popular
                    ? "p-[2px] bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8] hover:shadow-xxl ring-2 ring-[#EBC9A8] scale-[1.02]"
                    : "border-[#1E1E1E] bg-white hover:shadow-lg"
                )}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#EBC9A8] text-charcoal text-xs font-bold rounded-full shadow-sm z-10">
                      Most Popular
                    </div>
                  )}
                  <div className={cn("rounded-[14px] p-5 flex flex-col h-full", tier.popular ? "bg-white" : "bg-white")}>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", tier.popular ? tier.accent : "bg-[#F5EDE3] text-[#8A6A4A]")}>
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
                          <Check className={cn("h-4 w-4 mt-0.5 shrink-0", tier.checkColor)} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/checkout?package=${tier.name.toLowerCase()}`} className={cn(
                      "w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md",
                      tier.popular
                        ? tier.btnBg
                        : "bg-[#1E1E1E] text-white hover:bg-[#2a2a2a]"
                    )}>
                      {tier.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        <PricingWaveBottom />
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="relative py-10 sm:py-14 bg-white">
        <FAQWaveTop />
        <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-6">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveFaqCategory(cat.id); setOpenFaq(null); }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border",
                  activeFaqCategory === cat.id
                    ? "bg-[#D8B27A] text-white border-[#D8B27A] shadow-sm"
                    : "bg-white text-dark-gray/60 border-gray-200 hover:bg-[#FDF6EE] hover:text-[#D8B27A] hover:border-[#EBC9A8]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
                <div className="border-0 rounded-[10px] overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FDF6EE]/50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-charcoal pr-4">{faq.question}</span>
                    <ChevronDown className={cn("h-5 w-5 text-dark-gray/40 shrink-0 transition-transform duration-300", openFaq === index && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-4 pb-4 text-sm text-dark-gray/70 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <AboutCTAWaveTop />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Ready To Share Your Story?
            </h2>
            <p className="mt-3 text-lg text-charcoal/80 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to bring their stories to the world.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-8 py-3.5 text-base font-semibold text-white hover:bg-dark-gray shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-xxl">
                Create Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="https://books-statement-publications.vercel.app" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal/30 px-8 py-3.5 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.05]">
                Explore Books
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
