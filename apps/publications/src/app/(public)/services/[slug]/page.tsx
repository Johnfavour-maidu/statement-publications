"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BookOpen, PenTool, CheckCircle2, Palette, Printer,
  Megaphone, Feather, UserCheck, Headphones, Newspaper, GraduationCap,
  FileText, Check, Star, Shield, Heart, Award, Crown, Rocket, Sparkles,
  Globe, Clock, TrendingUp, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutCTAWaveTop } from "@/components/about-wave-separators";
import { FloatingBubbles } from "@/components/floating-bubbles";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#D7C0A1] via-[#C4976F] to-[#B88259]",
    blurColor1: "bg-[#D7C0A1]/30",
    blurColor2: "bg-[#B88259]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#B88259] via-[#A56D45] to-[#7B4A2D]",
    blurColor1: "bg-[#B88259]/30",
    blurColor2: "bg-[#7B4A2D]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#A56D45] via-[#7B4A2D] to-[#6A3F26]",
    blurColor1: "bg-[#A56D45]/30",
    blurColor2: "bg-[#6A3F26]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#C4976F] via-[#B88259] to-[#A56D45]",
    blurColor1: "bg-[#C4976F]/30",
    blurColor2: "bg-[#A56D45]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#C4976F] via-[#B88259] to-[#A56D45]",
    blurColor1: "bg-[#C4976F]/30",
    blurColor2: "bg-[#A56D45]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#D7C0A1] via-[#C4976F] to-[#B88259]",
    blurColor1: "bg-[#D7C0A1]/30",
    blurColor2: "bg-[#B88259]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#D7C0A1] via-[#C4976F] to-[#B88259]",
    blurColor1: "bg-[#D7C0A1]/30",
    blurColor2: "bg-[#B88259]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#C4976F] via-[#B88259] to-[#A56D45]",
    blurColor1: "bg-[#C4976F]/30",
    blurColor2: "bg-[#A56D45]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#A56D45] via-[#7B4A2D] to-[#6A3F26]",
    blurColor1: "bg-[#A56D45]/30",
    blurColor2: "bg-[#6A3F26]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#A56D45] via-[#7B4A2D] to-[#6A3F26]",
    blurColor1: "bg-[#A56D45]/30",
    blurColor2: "bg-[#6A3F26]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#B88259] via-[#A56D45] to-[#7B4A2D]",
    blurColor1: "bg-[#B88259]/30",
    blurColor2: "bg-[#7B4A2D]/20",
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
    heroGradient: "from-[#FDF6EE] via-[#EDE0D0]/30 to-white",
    gradientBorder: "from-[#D7C0A1] via-[#C4976F] to-[#B88259]",
    blurColor1: "bg-[#D7C0A1]/30",
    blurColor2: "bg-[#B88259]/20",
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

function ServiceFaqItem({ faq, index, gradientBorder }: { faq: { q: string; a: string }; index: number; gradientBorder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn("p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r", gradientBorder)}>
      <div className="rounded-[10px] overflow-hidden bg-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-[#FDF6EE]/40 transition-colors duration-200"
        >
          <span className="text-sm font-semibold text-charcoal pr-4">{faq.q}</span>
          <ChevronDown className={cn("h-5 w-5 text-dark-gray/40 shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="px-5 pb-5 text-sm text-dark-gray/70 leading-relaxed border-t border-gray-100 pt-4">
                {faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = serviceData[slug];

  if (!service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-[64px] lg:pt-[116px]">
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
      <section className={cn("relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br", service.heroGradient)}>
        <FloatingBubbles />
        <div className="absolute inset-0">
          <div className={cn("absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]", service.blurColor1)} />
          <div className={cn("absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px]", service.blurColor2)} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-[80px] lg:pt-[120px] pb-12">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-[#8A6A4A] hover:text-[#D8B27A] mb-6 transition-colors font-semibold group">
            <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to All Services
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6 bg-[#EDE0D0] text-[#8A6A4A]">
                <Icon className="h-3.5 w-3.5" />
                {service.title}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-charcoal mb-6 leading-[1.08]" style={{ fontFamily: "var(--font-libre)" }}>
                {service.tagline}
              </h1>
              <p className="text-lg text-dark-gray/70 max-w-xl leading-relaxed mb-8">{service.description}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className={cn("inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl", service.gradientBorder.includes("amber") || service.gradientBorder.includes("[#D8B27A]") ? "bg-charcoal text-white hover:bg-dark-gray" : "bg-charcoal text-white hover:bg-dark-gray")}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal/15 px-7 py-3.5 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.03]">
                  Contact Us
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }} className="hidden lg:flex justify-center">
              <div className={cn("relative p-[3px] rounded-3xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r", service.gradientBorder)}>
                <div className="w-48 h-48 rounded-[22px] flex items-center justify-center bg-[#EDE0D0]">
                  <Icon className="h-24 w-24 text-[#8A6A4A]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features + Process */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Features */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A6A4A]">What&apos;s Included</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal mb-8">Everything you need</h2>
              <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#A56D45] via-[#B88259] to-[#C4976F]">
                <div className="rounded-[14px] p-6 sm:p-8 bg-[#EDE0D0]">
                  <ul className="space-y-4">
                    {service.features.map((f, i) => (
                      <motion.li key={f} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 text-dark-gray/80">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#A56D45] border border-[#7B4A2D]">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{f}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Process */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.1 }}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A6A4A]">How It Works</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal mb-8">Simple 4-step process</h2>
              <div className="space-y-0">
                {service.process.map((step, i) => (
                  <motion.div key={step.step} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-white bg-[#EDE0D0] text-[#8A6A4A]">
                        {step.step}
                      </div>
                      {i < service.process.length - 1 && (
                        <div className="w-px flex-1 min-h-[24px] my-1 bg-[#EDE0D0]" />
                      )}
                    </div>
                    <div className={cn("pb-8 flex-1 rounded-xl p-5 border transition-all duration-200 hover:shadow-md", i === service.process.length - 1 ? "pb-0" : "", "bg-white border-gray-100")}>
                      <h3 className="font-bold text-charcoal text-base mb-1">{step.title}</h3>
                      <p className="text-sm text-dark-gray/70 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6A4A]">Why Choose Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal">Why choose this service</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {service.benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <div className={cn("p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r h-full hover:shadow-xxl transition-all duration-300 hover:scale-[1.02]", service.gradientBorder)}>
                  <div className="bg-white rounded-[14px] p-7 text-center h-full flex flex-col">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm bg-[#EDE0D0]">
                      <b.icon className="h-8 w-8 text-[#8A6A4A]" />
                    </div>
                    <h3 className="font-bold text-charcoal text-lg mb-2">{b.title}</h3>
                    <p className="text-sm text-dark-gray/70 leading-relaxed mt-auto">{b.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6A4A]">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-charcoal">Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-2">
            {service.faq.map((f, i) => (
              <ServiceFaqItem key={i} faq={f} index={i} gradientBorder={service.gradientBorder} />
            ))}
          </div>
        </div>
      </section>

      {/* Back to Services */}
      <div className="flex justify-center py-6 bg-white">
        <Link href="/services" className="inline-flex items-center gap-2.5 rounded-xl border-2 border-charcoal/15 px-8 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg group">
          <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to All Services
        </Link>
      </div>

      {/* CTA */}
      <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <AboutCTAWaveTop />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">Ready to get started?</h2>
          <p className="mt-4 text-lg text-charcoal/80 max-w-2xl mx-auto">Create an account and select this service to begin your publishing journey with Statement.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 bg-charcoal text-white px-10 py-4 rounded-xl font-semibold hover:bg-dark-gray shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl text-sm">
              Create Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-charcoal/25 text-charcoal px-10 py-4 rounded-xl font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.03] text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
