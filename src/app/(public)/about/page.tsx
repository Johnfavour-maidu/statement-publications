"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Target, Eye, Sparkles, Lightbulb, Shield, Users, Palette, Globe,
  CheckCircle2, BookOpen, PenTool, Rocket, Star, Quote, ChevronRight, Heart,
  TrendingUp, Award, Zap, Clock, ArrowUpRight,
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

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

const values = [
  { icon: Sparkles, title: "Excellence", description: "We hold ourselves to the highest standards in every manuscript we publish, every service we provide, and every interaction we have with authors.", color: "bg-amber-100 text-amber-700" },
  { icon: Lightbulb, title: "Innovation", description: "We continuously push the boundaries of publishing technology to give authors cutting-edge tools and global reach for their work.", color: "bg-emerald-100 text-emerald-700" },
  { icon: Shield, title: "Integrity", description: "Transparency and honesty are at the core of everything we do — from royalty structures to author contracts and communication.", color: "bg-blue-100 text-blue-700" },
  { icon: Users, title: "Community", description: "We believe in the power of connecting authors with readers, fostering a supportive network of storytellers and literary enthusiasts.", color: "bg-rose-100 text-rose-700" },
  { icon: Palette, title: "Creativity", description: "We celebrate the creative spirit in every author and provide tools that let their unique voice shine through in every published work.", color: "bg-violet-100 text-violet-700" },
  { icon: Globe, title: "Global Reach", description: "We empower authors to transcend borders, distributing their stories to readers across continents and cultures worldwide.", color: "bg-teal-100 text-teal-700" },
];

const whyChooseUs = [
  { icon: Globe, title: "Global Reach", description: "Distribute your book to readers in 50+ countries through our worldwide network.", color: "bg-amber-100 text-amber-700" },
  { icon: TrendingUp, title: "Higher Royalties", description: "Earn up to 70% royalties on every sale — among the highest in the industry.", color: "bg-emerald-100 text-emerald-700" },
  { icon: Zap, title: "Easy Publishing", description: "Upload, format, and publish your book in minutes with our intuitive platform.", color: "bg-blue-100 text-blue-700" },
  { icon: Heart, title: "Author Ownership", description: "You retain full rights to your work. Always. No hidden contracts or fine print.", color: "bg-rose-100 text-rose-700" },
  { icon: Award, title: "Professional Support", description: "Get expert guidance from our team of publishing professionals at every step.", color: "bg-violet-100 text-violet-700" },
];

const timeline = [
  { year: "Vision", title: "The Idea", description: "Statement Publications was born from a simple belief: every author deserves a fair chance to share their story with the world." },
  { year: "Building", title: "The Platform", description: "We built a world-class publishing platform designed to empower independent authors with professional tools and global distribution." },
  { year: "Launch", title: "Going Live", description: "Statement Publications launched, connecting authors with readers across continents and cultures." },
  { year: "Growth", title: "Global Impact", description: "Thousands of authors trust Statement Publications to publish, distribute, and monetize their work worldwide." },
];

const processSteps = [
  { icon: BookOpen, title: "Create Account", description: "Sign up for free and set up your author profile in minutes." },
  { icon: PenTool, title: "Upload Manuscript", description: "Upload your manuscript in any standard format. We accept DOCX, PDF, and more." },
  { icon: CheckCircle2, title: "Review & Publish", description: "Review, preview, and hit publish. Your book goes live within 24 hours." },
  { icon: Rocket, title: "Reach Readers", description: "Your book is distributed globally through our extensive partner network." },
  { icon: Star, title: "Earn Royalties", description: "Start earning competitive royalties on every sale with weekly payouts." },
];

const testimonials = [
  { name: "Adwoa Serwaa", role: "Author of The Quiet Storm", quote: "Statement Publications made publishing my debut novel effortless. The platform is intuitive, the support team is incredible, and I earned my first royalty within the first month.", rating: 5, color: "from-amber-500 to-orange-600" },
  { name: "Kwame Poku", role: "Bestselling Author", quote: "I've tried other platforms, but none compare. The author dashboard gives me full visibility into my sales and royalties. The design tools are top-notch.", rating: 5, color: "from-emerald-500 to-teal-600" },
  { name: "Efua Mensah", role: "Author of Roots of Gold", quote: "From manuscript upload to global distribution, everything was seamless. My book is now available in 30+ countries. I couldn't be happier with the results.", rating: 5, color: "from-blue-500 to-indigo-600" },
];

const leadership = [
  { name: "Ama Serwaa", role: "Founder & CEO", bio: "A former literary agent with over 15 years in the publishing industry, Ama founded Statement Publications to democratize publishing for every author.", color: "from-amber-500 to-orange-600" },
  { name: "Kwame Asante", role: "Chief Technology Officer", bio: "A tech visionary with a passion for digital publishing, Kwame leads the engineering team in building the most intuitive author platform.", color: "from-emerald-500 to-teal-600" },
  { name: "Efua Mensah", role: "Head of Author Relations", bio: "With a background in creative writing and community building, Efua ensures every author receives personalized support.", color: "from-blue-500 to-indigo-600" },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">About Us</span>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
                Don&apos;t Just Publish,<br />
                <span className="text-[#8A6A4A]">Make A Statement</span>
              </h1>
              <p className="mt-6 text-lg text-dark-gray/70 leading-relaxed max-w-lg">
                Statement Publications empowers independent authors to publish, distribute, and monetize their work globally. We provide the tools, support, and reach you need to share your voice with millions of readers across the globe.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#EBC9A8] px-6 py-3 text-base font-semibold text-charcoal hover:bg-[#D8B27A] hover:shadow-lg transition-all">
                  Create Account <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/books" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-6 py-3 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all">
                  Explore Books
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#EBC9A8]/30 to-[#D8B27A]/30 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-[#EBC9A8]/20">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: BookOpen, label: "Books Published", value: "10,000+" },
                      { icon: Users, label: "Active Authors", value: "5,000+" },
                      { icon: Globe, label: "Countries", value: "50+" },
                      { icon: TrendingUp, label: "Royalties Paid", value: "$1M+" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-4 rounded-xl bg-[#FDF6EE]">
                        <stat.icon className="h-6 w-6 mx-auto mb-2 text-[#8A6A4A]" />
                        <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
                        <div className="text-xs text-dark-gray/60">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Our Story</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              A Platform Built for Authors
            </h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#EBC9A8] via-[#D8B27A] to-[#EBC9A8]" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 0.1}>
                  <div className={cn("flex items-center gap-8", index % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
                    <div className="flex-1 text-right">
                      <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-[#EBC9A8]/20 inline-block", index % 2 === 0 ? "ml-auto" : "mr-auto")}>
                        <span className="text-xs font-bold text-[#8A6A4A] uppercase tracking-wider">{item.year}</span>
                        <h3 className="text-xl font-bold text-charcoal mt-1">{item.title}</h3>
                        <p className="text-sm text-dark-gray/70 mt-2 max-w-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10 w-4 h-4 rounded-full bg-[#EBC9A8] border-4 border-white shadow" />
                    <div className="flex-1" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#EBC9A8]/20 h-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-amber-700" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">Our Mission</h3>
                <p className="text-dark-gray/70 leading-relaxed">
                  To democratize publishing by providing independent authors with professional tools, global distribution, and fair royalties — making it possible for every voice to be heard and every story to find its readers.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#EBC9A8]/20 h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">Our Vision</h3>
                <p className="text-dark-gray/70 leading-relaxed">
                  To become the world&apos;s most trusted publishing platform for independent authors — a place where creativity thrives, stories connect, and every author has the opportunity to make a statement.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Core Values ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Core Values</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              What We Stand For
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.05}>
                <div className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 hover:border-[#EBC9A8]/30 h-full">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", value.color)}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{value.title}</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Authors Choose Us ────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Why Authors Choose Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              The Statement Difference
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.05}>
                <div className="group bg-white p-6 rounded-2xl shadow-sm border border-[#EBC9A8]/20 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", item.color)}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics ──────────────────────────────────── */}
      <section className="py-24 sm:py-32" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Trusted by Authors Worldwide
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, value: 10000, suffix: "+", label: "Books Published" },
              { icon: Users, value: 5000, suffix: "+", label: "Active Authors" },
              { icon: Globe, value: 50, suffix: "+", label: "Countries Reached" },
              { icon: TrendingUp, value: 1, prefix: "$", suffix: "M+", label: "Royalties Paid" },
            ].map((stat) => (
              <AnimatedSection key={stat.label}>
                <div className="text-center rounded-2xl bg-white/30 backdrop-blur-sm p-6 shadow-sm">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-white/40 p-3 mb-4">
                    <stat.icon className="h-6 w-6 text-charcoal" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-charcoal">
                    {stat.prefix || ""}<CountUp target={stat.value} />{stat.suffix}
                  </div>
                  <p className="mt-1 text-sm text-charcoal/60">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Publishing Journey ──────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">How It Works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Your Publishing Journey
            </h2>
          </AnimatedSection>
          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#EBC9A8]/20 via-[#D8B27A]/50 to-[#EBC9A8]/20" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
              {processSteps.map((step, index) => (
                <AnimatedSection key={step.title} delay={index * 0.1}>
                  <div className="relative text-center">
                    <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D8B27A] bg-white text-[#8A6A4A] font-bold text-lg shadow-sm">
                      {index + 1}
                    </div>
                    <div className="mb-3 flex justify-center">
                      <step.icon className="h-6 w-6 text-[#8A6A4A]" />
                    </div>
                    <h3 className="text-base font-semibold mb-1 text-charcoal">{step.title}</h3>
                    <p className="text-sm text-dark-gray/70 leading-relaxed">{step.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              What Authors Say
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <AnimatedSection key={t.name} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#EBC9A8]/20 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-dark-gray/70 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white", t.color)}>
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                      <p className="text-xs text-dark-gray/60">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Our Team</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Leadership
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadership.map((person, index) => (
              <AnimatedSection key={person.name} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
                  <div className={cn("mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white", person.color)}>
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{person.name}</h3>
                  <p className="text-sm text-[#8A6A4A] font-medium">{person.role}</p>
                  <p className="mt-3 text-sm text-dark-gray/70 leading-relaxed">{person.bio}</p>
                </div>
              </AnimatedSection>
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
