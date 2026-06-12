"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, PenTool, CheckCircle2, Palette, Printer,
  Megaphone, Feather, UserCheck, Headphones, Newspaper, GraduationCap,
  FileText, Check, Star, Shield, Heart, Award, Crown, Rocket, Sparkles,
  Globe, Clock, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutCTAWaveTop } from "@/components/about-wave-separators";
import { FloatingBubbles } from "@/components/floating-bubbles";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  colorBg: string;
  heroGradient: string;
  gradientBorder: string;
  blurColor1: string;
  blurColor2: string;
  features: string[];
  process: { step: string; title: string; desc: string }[];
  benefits: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }[];
  faq: { q: string; a: string }[];
}> = {
  "book-publishing": {
    title: "Book Publishing",
    tagline: "From manuscript to bookstore shelves",
    description: "Our end-to-end publishing service handles everything from formatting to global distribution. Whether you're publishing an eBook, paperback, or hardcover, we ensure your book meets industry standards and reaches readers worldwide.",
    icon: BookOpen,
    color: "text-amber-700",
    colorBg: "bg-amber-100",
    heroGradient: "from-amber-50 to-orange-50",
    gradientBorder: "from-amber-300 via-amber-400 to-amber-500",
    blurColor1: "bg-amber-200/30",
    blurColor2: "bg-orange-200/20",
    features: ["ePub, MOBI, PDF formats", "Print-on-demand (paperback & hardcover)", "Global distribution to 100+ retailers", "ISBN & barcode registration", "Library distribution", "Amazon KDP, Apple Books, Kobo & more"],
    process: [
      { step: "1", title: "Submit Manuscript", desc: "Upload your manuscript in any common format (DOCX, PDF, or plain text)." },
      { step: "2", title: "Formatting & Conversion", desc: "We convert your manuscript into all required formats for print and digital." },
      { step: "3", title: "Distribution Setup", desc: "Your book is listed on major retailers and library networks worldwide." },
      { step: "4", title: "Go Live", desc: "Your book goes live and is available for purchase globally." },
    ],
    benefits: [
      { icon: Globe, title: "Global Reach", desc: "Available in 100+ countries and thousands of retailers." },
      { icon: Clock, title: "Fast Turnaround", desc: "eBooks live in 2-3 weeks, print in 4-6 weeks." },
      { icon: TrendingUp, title: "Track Sales", desc: "Real-time dashboard with sales analytics and royalties." },
    ],
    faq: [
      { q: "What file formats do you accept?", a: "We accept DOCX, PDF, RTF, and plain text files. We recommend DOCX for best results." },
      { q: "How long does publishing take?", a: "eBooks are typically live within 2-3 weeks. Print books take 4-6 weeks including proof approval." },
    ],
  },
  "book-editing": {
    title: "Book Editing",
    tagline: "Polish your manuscript to perfection",
    description: "Our professional editing team works with you to refine your manuscript. From developmental editing that shapes your story to copyediting that polishes every sentence, we ensure your book is the best it can be.",
    icon: PenTool,
    color: "text-[#8A6A4A]",
    colorBg: "bg-[#F2D8BE]/40",
    heroGradient: "from-[#FDF6EE] to-[#F2D8BE]/20",
    gradientBorder: "from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8]",
    blurColor1: "bg-[#EBC9A8]/30",
    blurColor2: "bg-[#D8B27A]/20",
    features: ["Developmental editing", "Line editing", "Copyediting", "Genre-specialist editors", "Track changes & comments", "Two rounds of revision"],
    process: [
      { step: "1", title: "Manuscript Review", desc: "Our editors read your full manuscript and provide a detailed assessment." },
      { step: "2", title: "Editing Pass", desc: "The editor works through your manuscript with tracked changes and suggestions." },
      { step: "3", title: "Author Review", desc: "You review all changes and accept or reject suggestions." },
      { step: "4", title: "Final Polish", desc: "A second pass ensures everything is polished and consistent." },
    ],
    benefits: [
      { icon: Star, title: "Expert Editors", desc: "Work with editors who specialize in your genre." },
      { icon: Shield, title: "Preserve Your Voice", desc: "Editing that enhances without changing your unique style." },
      { icon: Award, title: "Industry Standard", desc: "Manuscripts that meet traditional publishing standards." },
    ],
    faq: [
      { q: "How many rounds of editing are included?", a: "All editing packages include at least two rounds of revision." },
      { q: "Can I choose my editor?", a: "Yes, we'll match you with editors who specialize in your genre and you can request specific editors." },
    ],
  },
  "proofreading": {
    title: "Proofreading",
    tagline: "Catch every error before publication",
    description: "Our meticulous proofreading service catches every typo, grammatical error, and formatting inconsistency. This final-pass review ensures your book is polished and professional.",
    icon: CheckCircle2,
    color: "text-blue-700",
    colorBg: "bg-blue-100",
    heroGradient: "from-blue-50 to-indigo-50",
    gradientBorder: "from-blue-300 via-blue-400 to-blue-500",
    blurColor1: "bg-blue-200/30",
    blurColor2: "bg-indigo-200/20",
    features: ["Typo & spelling correction", "Grammar & punctuation fixes", "Consistency checks", "Formatting verification", "Final quality assurance", "Style guide compliance"],
    process: [
      { step: "1", title: "Initial Pass", desc: "Proofreader reads through the entire manuscript carefully." },
      { step: "2", title: "Error Correction", desc: "All errors are flagged and corrected with tracked changes." },
      { step: "3", title: "Formatting Check", desc: "Consistency of fonts, spacing, headings, and layout verified." },
      { step: "4", title: "Final Sign-off", desc: "Author reviews corrections and gives final approval." },
    ],
    benefits: [
      { icon: Check, title: "Error-Free", desc: "Zero typos guaranteed or we'll re-proofread for free." },
      { icon: Clock, title: "Quick Turnaround", desc: "Most proofreading completed within 5-7 business days." },
      { icon: Heart, title: "Reader-Ready", desc: "Your book will be polished and ready for readers." },
    ],
    faq: [
      { q: "What's the difference between editing and proofreading?", a: "Editing improves content, structure, and style. Proofreading is the final pass to catch surface-level errors." },
      { q: "Do you offer a satisfaction guarantee?", a: "Yes. If you're not satisfied, we'll re-proofread your manuscript at no extra cost." },
    ],
  },
  "isbn-registration": {
    title: "ISBN Registration",
    tagline: "Your book's unique identifier",
    description: "We handle the entire ISBN registration process, ensuring your book is properly identified for retail and library distribution. An ISBN is essential for bookstores, libraries, and online retailers.",
    icon: FileText,
    color: "text-rose-700",
    colorBg: "bg-rose-100",
    heroGradient: "from-rose-50 to-pink-50",
    gradientBorder: "from-rose-300 via-rose-400 to-rose-500",
    blurColor1: "bg-rose-200/30",
    blurColor2: "bg-pink-200/20",
    features: ["ISBN assignment", "Barcode generation", "Bowker registration", "Library of Congress info", "ISBN on cover & metadata", "Multi-format ISBNs"],
    process: [
      { step: "1", title: "Application", desc: "We complete the ISBN application on your behalf." },
      { step: "2", title: "Assignment", desc: "Your unique ISBN is assigned and registered in the national database." },
      { step: "3", title: "Barcode Creation", desc: "We generate the barcode for your book cover." },
      { step: "4", title: "Distribution Setup", desc: "ISBN is linked to your book across all retail channels." },
    ],
    benefits: [
      { icon: Shield, title: "Legitimate", desc: "Properly registered ISBNs recognized by all retailers." },
      { icon: Check, title: "Full Service", desc: "We handle all paperwork and registration." },
      { icon: Award, title: "Professional", desc: "ISBNs look professional and build reader trust." },
    ],
    faq: [
      { q: "Do I need an ISBN?", a: "Yes. An ISBN is required for distribution through bookstores, libraries, and most online retailers." },
      { q: "Can I use my own ISBN?", a: "Yes. If you already have an ISBN, you can provide it during the publishing process." },
    ],
  },
  "cover-design": {
    title: "Cover Design",
    tagline: "First impressions that sell books",
    description: "Our professional cover designers create eye-catching covers that capture your book's essence and attract readers. We understand genre trends and design covers that stand out on shelves and screens.",
    icon: Palette,
    color: "text-violet-700",
    colorBg: "bg-violet-100",
    heroGradient: "from-violet-50 to-purple-50",
    gradientBorder: "from-violet-300 via-violet-400 to-violet-500",
    blurColor1: "bg-violet-200/30",
    blurColor2: "bg-purple-200/20",
    features: ["Custom cover concepts", "Genre-specific design", "Typography expertise", "Print & digital formats", "Unlimited revisions", "High-resolution files"],
    process: [
      { step: "1", title: "Brief & Research", desc: "We discuss your vision and research trending covers in your genre." },
      { step: "2", title: "Concept Design", desc: "3 unique cover concepts are presented for your review." },
      { step: "3", title: "Refinement", desc: "We refine your chosen concept based on your feedback." },
      { step: "4", title: "Final Delivery", desc: "High-resolution files delivered for print and digital formats." },
    ],
    benefits: [
      { icon: Sparkles, title: "Eye-Catching", desc: "Covers designed to grab attention on any platform." },
      { icon: Star, title: "Genre-Savvy", desc: "Designers who know what works in your specific genre." },
      { icon: Heart, title: "Your Vision", desc: "We bring your creative vision to life professionally." },
    ],
    faq: [
      { q: "How many cover concepts do I get?", a: "All packages include 3 initial concepts. You can request additional concepts for a small fee." },
      { q: "Do I own the cover design?", a: "Yes. Once delivered, you own full rights to the cover design." },
    ],
  },
  "book-formatting": {
    title: "Book Formatting",
    tagline: "Perfect layout on every device",
    description: "We format your book's interior for flawless display on every device and in every print edition. From font selection to chapter breaks, every detail is handled.",
    icon: Printer,
    color: "text-teal-700",
    colorBg: "bg-teal-100",
    heroGradient: "from-teal-50 to-emerald-50",
    gradientBorder: "from-teal-300 via-teal-400 to-teal-500",
    blurColor1: "bg-teal-200/30",
    blurColor2: "bg-emerald-200/20",
    features: ["Interior layout design", "Print & eBook formatting", "Table of contents", "Chapter headings", "Font & spacing optimization", "KDP & IngramSpark ready"],
    process: [
      { step: "1", title: "Style Selection", desc: "Choose your preferred formatting style and layout options." },
      { step: "2", title: "Interior Design", desc: "Your manuscript is professionally formatted for all formats." },
      { step: "3", title: "Proof Review", desc: "You review the formatted interior and request any adjustments." },
      { step: "4", title: "Final Files", desc: "Print-ready PDF and eBook files delivered." },
    ],
    benefits: [
      { icon: Check, title: "Device-Ready", desc: "Formatted perfectly for Kindle, iPad, print, and more." },
      { icon: Clock, title: "Fast Delivery", desc: "Formatting typically completed within 3-5 business days." },
      { icon: Award, title: "Professional Look", desc: "Clean, readable formatting that meets industry standards." },
    ],
    faq: [
      { q: "What formats will my book be formatted for?", a: "ePub (for most eBook readers), MOBI (for Kindle), and print-ready PDF for paperbacks and hardcovers." },
      { q: "Can I request specific formatting styles?", a: "Yes. We work with you to achieve your desired look and feel." },
    ],
  },
  "marketing": {
    title: "Marketing Services",
    tagline: "Get your book noticed",
    description: "Our marketing team creates strategic campaigns to get your book in front of the right readers. From social media to book launches, we help you build buzz and drive sales.",
    icon: Megaphone,
    color: "text-orange-700",
    colorBg: "bg-orange-100",
    heroGradient: "from-orange-50 to-amber-50",
    gradientBorder: "from-orange-300 via-orange-400 to-orange-500",
    blurColor1: "bg-orange-200/30",
    blurColor2: "bg-amber-200/20",
    features: ["Social media campaigns", "Book launch planning", "Email marketing", "PR & press releases", "Book trailer production", "Advertising management"],
    process: [
      { step: "1", title: "Strategy Session", desc: "We develop a marketing plan tailored to your book and audience." },
      { step: "2", title: "Campaign Setup", desc: "Marketing materials and campaigns are created and configured." },
      { step: "3", title: "Launch & Promote", desc: "Campaigns go live and we actively manage and optimize them." },
      { step: "4", title: "Analyze & Adjust", desc: "We track results and adjust strategy for maximum impact." },
    ],
    benefits: [
      { icon: TrendingUp, title: "Data-Driven", desc: "Marketing decisions based on real analytics and trends." },
      { icon: Globe, title: "Multi-Channel", desc: "Reach readers across all major platforms and channels." },
      { icon: Rocket, title: "Results-Focused", desc: "Campaigns designed to drive real sales and engagement." },
    ],
    faq: [
      { q: "Do I need a marketing budget?", a: "We offer both organic and paid marketing options. We'll work within your budget to maximize results." },
      { q: "How do you measure success?", a: "We track impressions, engagement, click-through rates, and most importantly — book sales." },
    ],
  },
  "ghostwriting": {
    title: "Ghostwriting",
    tagline: "Your idea, professionally written",
    description: "Our skilled ghostwriters bring your ideas to life while maintaining your voice and vision. Whether you need a full manuscript or chapter assistance, we deliver professional writing that sounds like you.",
    icon: Feather,
    color: "text-pink-700",
    colorBg: "bg-pink-100",
    heroGradient: "from-pink-50 to-rose-50",
    gradientBorder: "from-pink-300 via-pink-400 to-pink-500",
    blurColor1: "bg-pink-200/30",
    blurColor2: "bg-rose-200/20",
    features: ["Full manuscript writing", "Chapter assistance", "Voice matching", "Research & interviews", "Confidential process", "Unlimited revisions"],
    process: [
      { step: "1", title: "Discovery", desc: "We learn about your idea, voice, and goals for the book." },
      { step: "2", title: "Outline", desc: "A detailed outline is created for your review and approval." },
      { step: "3", title: "Writing", desc: "Chapters are written and delivered for your feedback." },
      { step: "4", title: "Revision", desc: "Unlimited revisions until you're completely satisfied." },
    ],
    benefits: [
      { icon: Heart, title: "Your Voice", desc: "Writing that captures your unique style and perspective." },
      { icon: Shield, title: "100% Confidential", desc: "Your project remains completely private and confidential." },
      { icon: Star, title: "Expert Writers", desc: "Professional writers with published credits in your genre." },
    ],
    faq: [
      { q: "Will the book sound like me?", a: "Yes. Our ghostwriters are skilled at capturing your voice through interviews and sample texts." },
      { q: "Do I get credit as the author?", a: "Yes. You are credited as the author. The ghostwriter's identity is never disclosed." },
    ],
  },
  "author-branding": {
    title: "Author Branding",
    tagline: "Build your author identity",
    description: "Build a professional author brand that resonates with readers. From author bios to social media profiles, we help you create a cohesive, recognizable presence.",
    icon: UserCheck,
    color: "text-indigo-700",
    colorBg: "bg-indigo-100",
    heroGradient: "from-indigo-50 to-blue-50",
    gradientBorder: "from-indigo-300 via-indigo-400 to-indigo-500",
    blurColor1: "bg-indigo-200/30",
    blurColor2: "bg-blue-200/20",
    features: ["Author bio writing", "Professional headshots", "Social media profiles", "Author website design", "Brand guidelines", "Press kit creation"],
    process: [
      { step: "1", title: "Brand Discovery", desc: "We explore your unique story, voice, and target audience." },
      { step: "2", title: "Brand Creation", desc: "Visual and written brand elements are developed." },
      { step: "3", title: "Asset Delivery", desc: "All brand assets are delivered — bio, headshot, profiles." },
      { step: "4", title: "Launch", desc: "Your author brand goes live across all platforms." },
    ],
    benefits: [
      { icon: Award, title: "Professional", desc: "Stand out with a polished, cohesive author brand." },
      { icon: Heart, title: "Authentic", desc: "Branding that reflects who you really are." },
      { icon: Globe, title: "Consistent", desc: "Unified presence across all reader touchpoints." },
    ],
    faq: [
      { q: "Do I need a professional headshot?", a: "A professional headshot significantly increases reader trust and recognition. We include one in all branding packages." },
      { q: "Can you redesign my existing author brand?", a: "Yes. We offer brand refresh services for established authors looking to update their image." },
    ],
  },
  "audiobook": {
    title: "Audiobook Publishing",
    tagline: "Reach listeners everywhere",
    description: "Professional narration, studio-quality production, and distribution to all major audiobook platforms. Bring your book to life with expert voice talent and crystal-clear audio.",
    icon: Headphones,
    color: "text-cyan-700",
    colorBg: "bg-cyan-100",
    heroGradient: "from-cyan-50 to-teal-50",
    gradientBorder: "from-cyan-300 via-cyan-400 to-cyan-500",
    blurColor1: "bg-cyan-200/30",
    blurColor2: "bg-teal-200/20",
    features: ["Professional narration", "Studio-quality recording", "Audio editing & mastering", "ACX & Findaway ready", "Audible & Apple Books", "Unlimited narrator auditions"],
    process: [
      { step: "1", title: "Narrator Selection", desc: "Audition professional narrators until you find the perfect voice." },
      { step: "2", title: "Recording", desc: "Studio-quality narration is recorded and edited." },
      { step: "3", title: "Production", desc: "Audio is mastered, normalized, and quality-checked." },
      { step: "4", title: "Distribution", desc: "Your audiobook goes live on Audible, Apple Books, and more." },
    ],
    benefits: [
      { icon: Star, title: "Top Narrators", desc: "Access to award-winning voice talent." },
      { icon: Check, title: "Studio Quality", desc: "Professional recording and mastering standards." },
      { icon: Globe, title: "Wide Distribution", desc: "Available on all major audiobook platforms." },
    ],
    faq: [
      { q: "Can I choose the narrator?", a: "Yes. We provide samples from multiple professional narrators and you choose the one that fits best." },
      { q: "How long does audiobook production take?", a: "Typically 4-6 weeks from narrator selection to distribution." },
    ],
  },
  "academic": {
    title: "Academic Publishing",
    tagline: "Scholarly works, professionally published",
    description: "Specialized publishing for academic texts, dissertations, and scholarly works. We understand the unique requirements of academic publishing and ensure your work meets the highest standards.",
    icon: GraduationCap,
    color: "text-amber-700",
    colorBg: "bg-amber-100",
    heroGradient: "from-amber-50 to-yellow-50",
    gradientBorder: "from-amber-300 via-amber-400 to-amber-500",
    blurColor1: "bg-amber-200/30",
    blurColor2: "bg-yellow-200/20",
    features: ["Dissertation formatting", "Academic style guides", "Citation management", "Peer review support", "Journal submission", "Library distribution"],
    process: [
      { step: "1", title: "Academic Review", desc: "We review your manuscript against academic publishing standards." },
      { step: "2", title: "Formatting", desc: "Your work is formatted according to required style guides." },
      { step: "3", title: "Quality Check", desc: "Citations, references, and formatting are verified." },
      { step: "4", title: "Publication", desc: "Your academic work is published and distributed." },
    ],
    benefits: [
      { icon: Award, title: "Scholarly Standards", desc: "Meets the strictest academic publishing requirements." },
      { icon: Shield, title: "Peer Review", desc: "Support for the peer review process." },
      { icon: Globe, title: "Wide Distribution", desc: "Available through academic channels and libraries." },
    ],
    faq: [
      { q: "Do you support specific citation styles?", a: "Yes. We support APA, MLA, Chicago, Harvard, Vancouver, and other major citation styles." },
      { q: "Can you help with journal submissions?", a: "Yes. We offer journal submission support including manuscript preparation and submission assistance." },
    ],
  },
  "magazine": {
    title: "Magazine Publishing",
    tagline: "Your magazine, professionally produced",
    description: "Full-service magazine publishing from layout design to digital distribution. We handle every aspect of magazine production so you can focus on creating great content.",
    icon: Newspaper,
    color: "text-[#8A6A4A]",
    colorBg: "bg-[#F2D8BE]/40",
    heroGradient: "from-[#FDF6EE] to-[#F2D8BE]/20",
    gradientBorder: "from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8]",
    blurColor1: "bg-[#EBC9A8]/30",
    blurColor2: "bg-[#D8B27A]/20",
    features: ["Magazine layout design", "Cover design", "Article formatting", "Digital distribution", "Print-on-demand", "Subscription management"],
    process: [
      { step: "1", title: "Concept & Planning", desc: "We define the magazine's format, style, and distribution channels." },
      { step: "2", title: "Layout Design", desc: "Professional layouts are created for each issue." },
      { step: "3", title: "Production", desc: "Content is formatted, proofread, and finalized." },
      { step: "4", title: "Distribution", desc: "Your magazine goes live on digital platforms and print." },
    ],
    benefits: [
      { icon: Star, title: "Professional Layouts", desc: "Magazine-quality layouts designed by experts." },
      { icon: Globe, title: "Multi-Channel", desc: "Digital and print distribution to reach all readers." },
      { icon: TrendingUp, title: "Subscriber Growth", desc: "Strategies to grow and retain your subscriber base." },
    ],
    faq: [
      { q: "What magazine formats do you support?", a: "We support digital (PDF, flipbook), print-on-demand, and traditional print magazines." },
      { q: "How often can I publish?", a: "You can publish on any schedule — weekly, monthly, quarterly, or as needed." },
    ],
  },
};

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = serviceData[slug];

  if (!service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-charcoal mb-4">Service Not Found</h1>
          <p className="text-dark-gray/70 mb-8">The service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/services" className="inline-flex items-center gap-2 bg-[#EBC9A8] text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-[#D8B27A] transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className={cn("relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br to-white", service.heroGradient)}>
        <FloatingBubbles />
        <div className="absolute inset-0">
          <div className={cn("absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl", service.blurColor1)} />
          <div className={cn("absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl", service.blurColor2)} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-24">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-[#8A6A4A] hover:text-[#D8B27A] mb-8 transition-colors font-semibold">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to All Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className={cn("relative inline-flex mb-8 p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r", service.gradientBorder)}>
              <div className={cn("w-24 h-24 rounded-[14px] flex items-center justify-center shadow-lg", service.colorBg)}>
                <Icon className={cn("h-12 w-12", service.color)} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-charcoal mb-5" style={{ fontFamily: "var(--font-libre)" }}>
              {service.title}
            </h1>
            <p className="text-xl text-dark-gray/70 max-w-3xl leading-relaxed">{service.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Description + Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className={cn("p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r h-full", service.gradientBorder)}>
                <div className={cn("rounded-[14px] p-6 sm:p-8 h-full", service.colorBg)}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-6">What&apos;s Included</h2>
                  <p className="text-dark-gray/70 leading-relaxed mb-8">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-dark-gray/80">
                        <Check className={cn("h-5 w-5 shrink-0", service.color)} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-6">How It Works</h2>
              <div className="space-y-4">
                {service.process.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm", service.colorBg, service.color)}>
                      {step.step}
                    </div>
                    <div className="bg-white rounded-xl p-4 flex-1 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-charcoal">{step.title}</h3>
                      <p className="text-sm text-dark-gray/70 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center mb-10">Why Choose This Service</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {service.benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className={cn("p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r h-full hover:shadow-xxl transition-all duration-300 hover:scale-[1.02]", service.gradientBorder)}>
                  <div className="bg-white rounded-[14px] p-6 text-center h-full">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm", service.colorBg)}>
                      <b.icon className={cn("h-7 w-7", service.color)} />
                    </div>
                    <h3 className="font-bold text-charcoal mb-2">{b.title}</h3>
                    <p className="text-sm text-dark-gray/70">{b.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {service.faq.map((f, i) => (
              <div key={i} className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
                <div className="rounded-[10px] p-6 bg-white hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-charcoal mb-2">{f.q}</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Back to Services */}
      <div className="flex justify-center py-6 bg-white">
        <Link href="/services" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal/20 px-8 py-3.5 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.05]">
          <ArrowRight className="h-5 w-5 rotate-180" /> Back to All Services
        </Link>
      </div>

      {/* CTA */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <AboutCTAWaveTop />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">Ready To Get Started?</h2>
          <p className="mt-3 text-lg text-charcoal/80">Create an account and select this service to begin your publishing journey.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-dark-gray shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-xxl">
              Create Account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-charcoal/30 text-charcoal px-8 py-3.5 rounded-lg font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.05]">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
