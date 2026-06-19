"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Target, Eye, Sparkles, Lightbulb, Shield, Users, Palette, Globe,
  BookOpen, TrendingUp, Award, Rocket, Heart, ChevronRight, Star, Zap,
} from "lucide-react";
import { CountUp } from "@/components/count-up";
import { FloatingBubbles } from "@/components/floating-bubbles";
import { AboutHeroWaveBottom, AboutCoreValuesWaveTop, AboutCoreValuesWaveBottom, AboutTestimonialsWaveTop, AboutTestimonialsWaveBottom, AboutCTAWaveTop } from "@/components/about-wave-separators";

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

const coreValues = [
  { icon: Sparkles, title: "Excellence", description: "We hold ourselves to the highest standards in every manuscript we publish, every service we provide, and every interaction we have with authors.", bg: "bg-[#F5EDE3]", iconColor: "text-[#8A6A4A]", iconBg: "bg-[#E0CDB4]", gradientBorder: "from-[#E0CDB4] via-[#C4976F] to-[#B68C5A]" },
  { icon: Lightbulb, title: "Innovation", description: "We continuously push the boundaries of publishing technology to give authors cutting-edge tools and global reach for their work.", bg: "bg-[#EDE0D0]", iconColor: "text-[#8A6A4A]", iconBg: "bg-[#D4B896]", gradientBorder: "from-[#D4B896] via-[#C79A6B] to-[#A57D4A]" },
  { icon: Shield, title: "Integrity", description: "Transparency and honesty are at the core of everything we do — from royalty structures to author contracts and communication.", bg: "bg-[#E5D5C1]", iconColor: "text-[#8A6A4A]", iconBg: "bg-[#C79A6B]", gradientBorder: "from-[#C79A6B] via-[#B68C5A] to-[#9A7545]" },
  { icon: Users, title: "Community", description: "We believe in the power of connecting authors with readers, fostering a supportive network of storytellers and literary enthusiasts.", bg: "bg-[#DED0BE]", iconColor: "text-[#6A4E37]", iconBg: "bg-[#C4976F]", gradientBorder: "from-[#C4976F] via-[#9A7545] to-[#8B5E34]" },
  { icon: Palette, title: "Creativity", description: "We celebrate the creative spirit in every author and provide tools that let their unique voice shine through in every published work.", bg: "bg-[#D4C0AA]", iconColor: "text-[#6A4E37]", iconBg: "bg-[#B68C5A]", gradientBorder: "from-[#B68C5A] via-[#8B5E34] to-[#7A5230]" },
  { icon: Globe, title: "Global Reach", description: "We empower authors to transcend borders, distributing their stories to readers across continents and cultures worldwide.", bg: "bg-[#C9B49A]", iconColor: "text-[#FFFFFF]", iconBg: "bg-[#8A6A4A]", gradientBorder: "from-[#8A6A4A] via-[#7A5230] to-[#6A3F26]" },
];

const whyChooseUs = [
  { icon: Globe, title: "Global Distribution", description: "Distribute your book to readers in 50+ countries through our worldwide network of retailers, libraries, and distributors.", bg: "bg-[#F5EDE3]", iconColor: "text-[#8A6A4A]", iconBg: "bg-[#E0CDB4]", gradientBorder: "from-[#E0CDB4] via-[#C4976F] to-[#B68C5A]" },
  { icon: TrendingUp, title: "Higher Royalty Earnings", description: "Earn up to 70% royalties on every sale — among the highest in the industry. Weekly payouts with full transparency.", bg: "bg-[#EDE0D0]", iconColor: "text-[#8A6A4A]", iconBg: "bg-[#D4B896]", gradientBorder: "from-[#D4B896] via-[#C79A6B] to-[#A57D4A]" },
  { icon: Zap, title: "Easy Publishing Tools", description: "Upload, format, and publish your book in minutes with our intuitive platform. No technical skills required.", bg: "bg-[#E5D5C1]", iconColor: "text-[#8A6A4A]", iconBg: "bg-[#C79A6B]", gradientBorder: "from-[#C79A6B] via-[#B68C5A] to-[#9A7545]" },
  { icon: Award, title: "Professional Support", description: "Get expert guidance from our team of publishing professionals at every step of your publishing journey.", bg: "bg-[#DED0BE]", iconColor: "text-[#6A4E37]", iconBg: "bg-[#C4976F]", gradientBorder: "from-[#C4976F] via-[#9A7545] to-[#8B5E34]" },
  { icon: Rocket, title: "Marketing Opportunities", description: "Leverage our marketing tools, featured placements, and promotional campaigns to maximize your book's visibility.", bg: "bg-[#D4C0AA]", iconColor: "text-[#6A4E37]", iconBg: "bg-[#B68C5A]", gradientBorder: "from-[#B68C5A] via-[#8B5E34] to-[#7A5230]" },
  { icon: Heart, title: "Author Community", description: "Join a vibrant community of fellow authors. Share experiences, collaborate, and grow together in your publishing journey.", bg: "bg-[#C9B49A]", iconColor: "text-[#FFFFFF]", iconBg: "bg-[#8A6A4A]", gradientBorder: "from-[#8A6A4A] via-[#7A5230] to-[#6A3F26]" },
];

const testimonials = [
  { name: "Kofi Asante", role: "Independent Author", quote: "Statement Publications gave me complete creative control over my work. The publishing process was straightforward, and I had my book live within a week. The royalty structure is the fairest I've seen.", rating: 5, bg: "bg-[#F5EDE3]", gradientBorder: "from-[#E0CDB4] via-[#C4976F] to-[#B68C5A]", separatorColor: "border-[#C4976F]" },
  { name: "Abena Osei", role: "Business Author", quote: "As a business consultant, I needed a professional platform to publish my leadership book. Statement delivered exceptional quality — from formatting to global distribution across 40+ countries.", rating: 5, bg: "bg-[#EDE0D0]", gradientBorder: "from-[#D4B896] via-[#C79A6B] to-[#A57D4A]", separatorColor: "border-[#C79A6B]" },
  { name: "Dr. Emmanuel Mensah", role: "Academic Researcher", quote: "Publishing my research through Statement was seamless. The platform handled complex formatting with ease, and my academic work is now accessible to readers and institutions worldwide.", rating: 5, bg: "bg-[#E5D5C1]", gradientBorder: "from-[#C79A6B] via-[#B68C5A] to-[#9A7545]", separatorColor: "border-[#B68C5A]" },
  { name: "Nana Ama Brown", role: "Children's Book Author", quote: "My children's picture book needed special attention to illustrations. Statement's tools made it easy to showcase vibrant artwork, and the response has been overwhelming.", rating: 5, bg: "bg-[#DED0BE]", gradientBorder: "from-[#C4976F] via-[#9A7545] to-[#8B5E34]", separatorColor: "border-[#9A7545]" },
  { name: "Pastor Samuel Koomson", role: "Faith-Based Author", quote: "Statement Publications understood my vision for reaching a global faith community. My devotional book is now available in bookstores across three continents.", rating: 5, bg: "bg-[#D4C0AA]", gradientBorder: "from-[#B68C5A] via-[#8B5E34] to-[#7A5230]", separatorColor: "border-[#8B5E34]" },
  { name: "Esi Kyere", role: "Poet & Creative Writer", quote: "Poetry is often overlooked in publishing, but Statement treated my collection with the same care as any bestseller. The formatting preserved every line break, and sales have exceeded my expectations.", rating: 5, bg: "bg-[#C9B49A]", gradientBorder: "from-[#8A6A4A] via-[#7A5230] to-[#6A3F26]", separatorColor: "border-[#7A5230]" },
];

const leadership = [
  {
    name: "Ama Serwaa",
    role: "Founder & Chief Executive Officer",
    bio: "A former literary agent with over 15 years in the publishing industry, Ama founded Statement Publications to democratize publishing for every author.",
    slug: "chief-executive-officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    expertise: ["Publishing Strategy", "Business Development", "Author Relations"],
    accent: "blue",
    gradientBorder: "from-blue-300 via-blue-400 to-blue-500",
    imageBorder: "border-blue-400",
    imageGlow: "shadow-[0_0_20px_rgba(96,165,250,0.35)]",
    buttonBorder: "border-blue-400 text-blue-600 hover:bg-blue-50",
  },
  {
    name: "Kwame Asante",
    role: "Chief Technology Officer",
    bio: "A tech visionary with a passion for digital publishing, Kwame leads the engineering team in building the most intuitive author platform in the industry.",
    slug: "chief-technology-officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    expertise: ["Platform Architecture", "AI & Machine Learning", "Product Innovation"],
    accent: "emerald",
    gradientBorder: "from-emerald-300 via-emerald-400 to-emerald-500",
    imageBorder: "border-emerald-400",
    imageGlow: "shadow-[0_0_20px_rgba(52,211,153,0.35)]",
    buttonBorder: "border-emerald-400 text-emerald-600 hover:bg-emerald-50",
  },
  {
    name: "Efua Mensah",
    role: "Head of Author Relations",
    bio: "With a background in creative writing and community building, Efua ensures every author receives personalized support and guidance throughout their journey.",
    slug: "head-of-author-relations",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    expertise: ["Community Building", "Author Support", "Creative Writing"],
    accent: "amber",
    gradientBorder: "from-amber-300 via-amber-400 to-amber-500",
    imageBorder: "border-amber-400",
    imageGlow: "shadow-[0_0_20px_rgba(251,191,36,0.35)]",
    buttonBorder: "border-amber-400 text-amber-600 hover:bg-amber-50",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white">
        <FloatingBubbles />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-widest">About Us</span>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
                Don&apos;t Just Publish,<br />
                <span className="text-[#8A6A4A]">Make A Statement</span>
              </h1>
              <p className="mt-6 text-lg text-dark-gray/90 leading-relaxed max-w-lg">
                Statement Publications empowers independent authors to publish, distribute, and monetize their work globally. We provide the tools, support, and reach you need to share your voice with millions of readers across the globe.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#EBC9A8] px-6 py-3 text-base font-semibold text-charcoal hover:bg-[#D8B27A] hover:shadow-lg transition-all duration-300 hover:scale-[1.05]">
                  Create Account <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="https://books-statement-publications.vercel.app" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-6 py-3 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.05]">
                  Explore Books
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#EBC9A8]/30 to-[#D8B27A]/30 rounded-3xl blur-2xl" />
                <div className="p-[3px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] shadow-2xl">
                  <div className="relative rounded-[13px] bg-white p-6 sm:p-8">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
                        <div className="text-center p-4 rounded-[10px] bg-[#FDF6EE]">
                          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-[#8A6A4A]" />
                          <div className="text-xl sm:text-2xl font-bold text-charcoal"><CountUp end={10000} suffix="+" /></div>
                          <div className="text-[11px] sm:text-xs text-dark-gray/70">Books Published</div>
                        </div>
                      </div>
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#D4B896] via-[#C79A6B] to-[#A57D4A]">
                        <div className="text-center p-4 rounded-[10px] bg-[#EDE0D0]">
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-[#8A6A4A]" />
                          <div className="text-xl sm:text-2xl font-bold text-charcoal"><CountUp end={5000} suffix="+" /></div>
                          <div className="text-[11px] sm:text-xs text-dark-gray/70">Active Authors</div>
                        </div>
                      </div>
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#C79A6B] via-[#B68C5A] to-[#9A7545]">
                        <div className="text-center p-4 rounded-[10px] bg-[#E5D5C1]">
                          <Globe className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-[#8A6A4A]" />
                          <div className="text-xl sm:text-2xl font-bold text-charcoal"><CountUp end={50} suffix="+" /></div>
                          <div className="text-[11px] sm:text-xs text-dark-gray/70">Countries</div>
                        </div>
                      </div>
                      <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#B68C5A] via-[#8B5E34] to-[#7A5230]">
                        <div className="text-center p-4 rounded-[10px] bg-[#DED0BE]">
                          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-[#6A4E37]" />
                          <div className="text-xl sm:text-2xl font-bold text-charcoal">$1M+</div>
                          <div className="text-[11px] sm:text-xs text-dark-gray/70">Royalties Paid</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <AboutHeroWaveBottom />
      </section>
      <section className="relative py-14 sm:py-18 bg-white">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection>
              <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#E0CDB4] via-[#C4976F] to-[#B68C5A] h-full hover:shadow-xxl transition-all duration-300 hover:scale-[1.02]">
                <div className="rounded-[14px] bg-gradient-to-br from-[#F5EDE3] to-[#EDE0D0] p-6 sm:p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#E0CDB4] flex items-center justify-center mb-5 shadow-sm">
                    <Target className="h-6 w-6 text-[#8A6A4A]" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Our Mission</h3>
                  <p className="text-[15px] text-dark-gray/90 leading-relaxed">
                    To democratize publishing by providing independent authors with professional tools, global distribution, and fair royalties — making it possible for every voice to be heard and every story to find its readers.
                  </p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#C79A6B] via-[#B68C5A] to-[#9A7545] h-full hover:shadow-xxl transition-all duration-300 hover:scale-[1.02]">
                <div className="rounded-[14px] bg-gradient-to-br from-[#EDE0D0] to-[#E5D5C1] p-6 sm:p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4B896] flex items-center justify-center mb-5 shadow-sm">
                    <Eye className="h-6 w-6 text-[#8A6A4A]" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Our Vision</h3>
                  <p className="text-[15px] text-dark-gray/90 leading-relaxed">
                    To become the world&apos;s most trusted publishing platform for independent authors — a place where creativity thrives, stories connect, and every author has the opportunity to make a statement.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────── */}
      <section className="relative py-14 sm:py-18 overflow-hidden" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #F2D8BE 50%, #D8B27A 100%)" }}>
        <AboutCoreValuesWaveTop />
        <FloatingBubbles />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">Core Values</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              What We Stand For
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreValues.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.05}>
                <div className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${value.gradientBorder} hover:shadow-xxl transition-all duration-300 hover:scale-[1.05]`}>
                  <div className={`group rounded-[14px] p-5 sm:p-6 ${value.bg} flex flex-col transition-all duration-300`}>
                    <div className={`mb-3 inline-flex items-center justify-center rounded-xl ${value.iconBg} p-2.5 self-start shadow-sm`}>
                      <value.icon className={`h-5 w-5 ${value.iconColor}`} />
                    </div>
                    <h3 className="text-base font-semibold mb-2 text-charcoal">{value.title}</h3>
                    <p className="text-sm text-dark-gray/90 leading-relaxed mt-auto">{value.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        <AboutCoreValuesWaveBottom />
      </section>
      <section className="relative py-14 sm:py-18 bg-white">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">Why Authors Choose Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              The Statement Difference
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChooseUs.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.05} className="h-full">
                <div className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${item.gradientBorder} hover:shadow-xxl transition-all duration-300 h-full hover:scale-[1.05]`}>
                  <div className={`group rounded-[14px] p-5 sm:p-6 ${item.bg} flex flex-col transition-all duration-300 h-full`}>
                    <div className={`mb-3 inline-flex items-center justify-center rounded-xl ${item.iconBg} p-2.5 self-start shadow-sm`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-base font-semibold mb-1.5 text-charcoal">{item.title}</h3>
                    <p className="text-sm text-dark-gray/90 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="relative py-14 sm:py-18 overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <AboutTestimonialsWaveTop />
        <FloatingBubbles />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              What Authors Say
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, index) => (
              <AnimatedSection key={t.name} delay={index * 0.08}>
                <div className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${t.gradientBorder} hover:shadow-xxl transition-all duration-300 hover:scale-[1.05]`}>
                  <div className={`rounded-[14px] p-5 ${t.bg} flex flex-col h-full`}>
                    <p className="text-[15px] text-dark-gray/90 leading-relaxed mb-4 flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className={`flex items-center gap-3 pt-3 border-t-2 ${t.separatorColor}`}>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8A6A4A] to-[#6A3F26] flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">{t.name}</p>
                        <p className="text-xs text-dark-gray/70">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mt-2">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        <AboutTestimonialsWaveBottom />
      </section>

      {/* ── Leadership Team ─────────────────────────────── */}
      <section className="relative py-14 sm:py-18 bg-white">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#8A6A4A]">Our Team</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Leadership
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {leadership.map((person, index) => (
              <AnimatedSection key={person.name} delay={index * 0.1}>
                <div className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${person.gradientBorder} hover:shadow-xxl transition-all duration-300 h-full hover:scale-[1.05]`}>
                  <div className="text-center rounded-[14px] p-6 bg-white group flex flex-col h-full">
                    <div className={`relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden border-4 ${person.imageBorder} ${person.imageGlow} group-hover:scale-105 transition-all duration-300`}>
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-base font-bold text-charcoal">{person.name}</h3>
                    <p className="text-xs text-[#8A6A4A] font-medium mt-1">{person.role}</p>
                    <p className="mt-2.5 text-xs text-dark-gray/90 leading-relaxed">{person.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center mt-3 max-w-[220px] mx-auto">
                      {person.expertise.map((skill) => (
                        <span key={skill} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#FDF6EE] text-[#8A6A4A] border border-[#EBC9A8]/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/about/leadership/${person.slug}`}
                      className={`inline-flex items-center gap-1 mt-4 text-xs font-semibold border rounded-lg px-3 py-1.5 ${person.buttonBorder} transition-colors self-center`}
                    >
                      View Profile <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
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
