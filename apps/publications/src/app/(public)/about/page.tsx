"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Target, Eye, Sparkles, Lightbulb, Shield, Users, Palette, Globe,
  BookOpen, TrendingUp, Award, Rocket, Heart, ChevronRight, Star, Zap,
} from "lucide-react";
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

const coreValues = [
  { icon: Sparkles, title: "Excellence", description: "We hold ourselves to the highest standards in every manuscript we publish, every service we provide, and every interaction we have with authors.", borderColor: "border-amber-400", iconBg: "bg-amber-100 text-amber-700" },
  { icon: Lightbulb, title: "Innovation", description: "We continuously push the boundaries of publishing technology to give authors cutting-edge tools and global reach for their work.", borderColor: "border-[#D8B27A]", iconBg: "bg-[#F2D8BE]/40 text-[#8A6A4A]" },
  { icon: Shield, title: "Integrity", description: "Transparency and honesty are at the core of everything we do — from royalty structures to author contracts and communication.", borderColor: "border-blue-400", iconBg: "bg-blue-100 text-blue-700" },
  { icon: Users, title: "Community", description: "We believe in the power of connecting authors with readers, fostering a supportive network of storytellers and literary enthusiasts.", borderColor: "border-rose-400", iconBg: "bg-rose-100 text-rose-700" },
  { icon: Palette, title: "Creativity", description: "We celebrate the creative spirit in every author and provide tools that let their unique voice shine through in every published work.", borderColor: "border-violet-400", iconBg: "bg-violet-100 text-violet-700" },
  { icon: Globe, title: "Global Reach", description: "We empower authors to transcend borders, distributing their stories to readers across continents and cultures worldwide.", borderColor: "border-teal-400", iconBg: "bg-teal-100 text-teal-700" },
];

const whyChooseUs = [
  { icon: Globe, title: "Global Distribution", description: "Distribute your book to readers in 50+ countries through our worldwide network of retailers, libraries, and distributors.", bg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100 text-amber-700" },
  { icon: TrendingUp, title: "Higher Royalty Earnings", description: "Earn up to 70% royalties on every sale — among the highest in the industry. Weekly payouts with full transparency.", bg: "bg-[#FDF6EE] border-[#EBC9A8]", iconBg: "bg-[#F2D8BE]/60 text-[#8A6A4A]" },
  { icon: Zap, title: "Easy Publishing Tools", description: "Upload, format, and publish your book in minutes with our intuitive platform. No technical skills required.", bg: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100 text-blue-700" },
  { icon: Award, title: "Professional Support", description: "Get expert guidance from our team of publishing professionals at every step of your publishing journey.", bg: "bg-violet-50 border-violet-200", iconBg: "bg-violet-100 text-violet-700" },
  { icon: Rocket, title: "Marketing Opportunities", description: "Leverage our marketing tools, featured placements, and promotional campaigns to maximize your book's visibility.", bg: "bg-rose-50 border-rose-200", iconBg: "bg-rose-100 text-rose-700" },
  { icon: Heart, title: "Author Community", description: "Join a vibrant community of fellow authors. Share experiences, collaborate, and grow together in your publishing journey.", bg: "bg-teal-50 border-teal-200", iconBg: "bg-teal-100 text-teal-700" },
];

const testimonials = [
  { name: "Adwoa Serwaa", role: "Author of The Quiet Storm", quote: "Statement Publications made publishing my debut novel effortless. The platform is intuitive, the support team is incredible, and I earned my first royalty within the first month.", rating: 5, borderColor: "border-amber-300" },
  { name: "Kwame Poku", role: "Bestselling Author", quote: "I've tried other platforms, but none compare. The author dashboard gives me full visibility into my sales and royalties. The design tools are top-notch.", rating: 5, borderColor: "border-[#D8B27A]" },
  { name: "Efua Mensah", role: "Author of Roots of Gold", quote: "From manuscript upload to global distribution, everything was seamless. My book is now available in 30+ countries. I couldn't be happier with the results.", rating: 5, borderColor: "border-blue-300" },
];

const leadership = [
  {
    name: "Ama Serwaa",
    role: "Founder & Chief Executive Officer",
    bio: "A former literary agent with over 15 years in the publishing industry, Ama founded Statement Publications to democratize publishing for every author.",
    slug: "chief-executive-officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    expertise: ["Publishing Strategy", "Business Development", "Author Relations"],
  },
  {
    name: "Kwame Asante",
    role: "Chief Technology Officer",
    bio: "A tech visionary with a passion for digital publishing, Kwame leads the engineering team in building the most intuitive author platform in the industry.",
    slug: "chief-technology-officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    expertise: ["Platform Architecture", "AI & Machine Learning", "Product Innovation"],
  },
  {
    name: "Efua Mensah",
    role: "Head of Author Relations",
    bio: "With a background in creative writing and community building, Efua ensures every author receives personalized support and guidance throughout their journey.",
    slug: "head-of-author-relations",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    expertise: ["Community Building", "Author Support", "Creative Writing"],
  },
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
                <Link href="https://books-statement-publications.vercel.app" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-6 py-3 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all">
                  Explore Books
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#EBC9A8]/30 to-[#D8B27A]/30 rounded-3xl blur-2xl" />
                <div className="p-[3px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] shadow-2xl">
                  <div className="relative rounded-[13px] bg-white p-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
                        <div className="text-center p-4 rounded-[10px] bg-[#FDF6EE]">
                          <BookOpen className="h-6 w-6 mx-auto mb-2 text-[#8A6A4A]" />
                          <div className="text-2xl font-bold text-charcoal">10,000+</div>
                          <div className="text-xs text-dark-gray/60">Books Published</div>
                        </div>
                      </div>
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                        <div className="text-center p-4 rounded-[10px] bg-amber-50">
                          <Users className="h-6 w-6 mx-auto mb-2 text-amber-700" />
                          <div className="text-2xl font-bold text-charcoal">5,000+</div>
                          <div className="text-xs text-dark-gray/60">Active Authors</div>
                        </div>
                      </div>
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500">
                        <div className="text-center p-4 rounded-[10px] bg-emerald-50">
                          <Globe className="h-6 w-6 mx-auto mb-2 text-emerald-700" />
                          <div className="text-2xl font-bold text-charcoal">50+</div>
                          <div className="text-xs text-dark-gray/60">Countries</div>
                        </div>
                      </div>
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">
                        <div className="text-center p-4 rounded-[10px] bg-blue-50">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-700" />
                          <div className="text-2xl font-bold text-charcoal">$1M+</div>
                          <div className="text-xs text-dark-gray/60">Royalties Paid</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection>
              <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 h-full hover:shadow-lg transition-all duration-300">
                <div className="rounded-[14px] bg-gradient-to-br from-[#FDF6EE] to-amber-50 p-6 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-amber-800" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Our Mission</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">
                    To democratize publishing by providing independent authors with professional tools, global distribution, and fair royalties — making it possible for every voice to be heard and every story to find its readers.
                  </p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 h-full hover:shadow-lg transition-all duration-300">
                <div className="rounded-[14px] bg-gradient-to-br from-blue-50 to-indigo-50 p-6 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-blue-200 flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Our Vision</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">
                    To become the world&apos;s most trusted publishing platform for independent authors — a place where creativity thrives, stories connect, and every author has the opportunity to make a statement.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Core Values</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              What We Stand For
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.05}>
                <div className={cn(
                  "group p-6 rounded-2xl border-2 bg-white hover:shadow-lg transition-all duration-300 h-full",
                  value.borderColor
                )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", value.iconBg)}>
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
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Why Authors Choose Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              The Statement Difference
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.05}>
                <div className={cn(
                  "group p-6 rounded-2xl border-2 hover:shadow-lg transition-all duration-300 h-full",
                  item.bg
                )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", item.iconBg)}>
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

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              What Authors Say
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <AnimatedSection key={t.name} delay={index * 0.1}>
                <div className={cn(
                  "bg-white rounded-2xl p-8 shadow-sm border-2 h-full flex flex-col",
                  t.borderColor
                )}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-dark-gray/70 leading-relaxed mb-6 line-clamp-4 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#EBC9A8] to-[#D8B27A] flex items-center justify-center text-sm font-bold text-white">
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

      {/* ── Leadership Team ─────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Our Team</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Leadership
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leadership.map((person, index) => (
              <AnimatedSection key={person.name} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 group">
                  <div className="relative mx-auto mb-4 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{person.name}</h3>
                  <p className="text-sm text-[#8A6A4A] font-medium mt-1">{person.role}</p>
                  <p className="mt-3 text-sm text-dark-gray/70 leading-relaxed">{person.bio}</p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                    {person.expertise.map((skill) => (
                      <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FDF6EE] text-[#8A6A4A] border border-[#EBC9A8]/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/about/leadership/${person.slug}`}
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#8A6A4A] hover:text-[#D8B27A] transition-colors"
                  >
                    View Profile <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-8 sm:py-10" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Ready To Share Your Story?
            </h2>
            <p className="mt-3 text-lg text-charcoal/70 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to bring their stories to the world.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-8 py-4 text-base font-semibold text-white hover:bg-dark-gray shadow-lg transition-all">
                Create Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="https://books-statement-publications.vercel.app" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal/30 px-8 py-4 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all">
                Explore Books
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
