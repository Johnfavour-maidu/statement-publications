"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Target,
  Eye,
  Sparkles,
  Lightbulb,
  Shield,
  Users,
  Palette,
  Globe,
  CheckCircle2,
  BookOpen,
  PenTool,
  Rocket,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const values = [
  {
    icon: Sparkles,
    title: "Excellence",
    description:
      "We hold ourselves to the highest standards in every manuscript we publish, every service we provide, and every interaction we have with authors.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously push the boundaries of publishing technology to give authors cutting-edge tools and global reach for their work.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Transparency and honesty are at the core of everything we do — from royalty structures to author contracts and communication.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We believe in the power of connecting authors with readers, fostering a supportive network of storytellers and literary enthusiasts.",
  },
  {
    icon: Palette,
    title: "Creativity",
    description:
      "We celebrate the creative spirit in every author and provide tools that let their unique voice shine through in every published work.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "We empower authors to transcend borders, distributing their stories to readers across continents and cultures worldwide.",
  },
];

const leadership = [
  {
    name: "Ama Serwaa",
    role: "Founder & CEO",
    bio: "A former literary agent with over 15 years in the publishing industry, Ama founded Statement Publications to democratize publishing for every author with a story to tell.",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Kwame Asante",
    role: "Chief Technology Officer",
    bio: "A tech visionary with a passion for digital publishing, Kwame leads the engineering team in building the most intuitive and powerful author platform in the industry.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Efua Mensah",
    role: "Head of Author Relations",
    bio: "With a background in creative writing and community building, Efua ensures every author receives personalized support and guidance throughout their publishing journey.",
    color: "from-blue-500 to-indigo-600",
  },
];

const processSteps = [
  {
    icon: BookOpen,
    title: "Consultation",
    description:
      "We begin with a thorough consultation to understand your vision, genre, and goals for your book.",
  },
  {
    icon: PenTool,
    title: "Development",
    description:
      "Our expert editors and designers work with you to refine your manuscript and create a professional package.",
  },
  {
    icon: CheckCircle2,
    title: "Quality Review",
    description:
      "Every book undergoes rigorous quality checks — from copyediting and proofreading to cover design validation.",
  },
  {
    icon: Rocket,
    title: "Publication",
    description:
      "Your book is published across multiple formats and distributed globally through our extensive partner network.",
  },
  {
    icon: Star,
    title: "Marketing",
    description:
      "We provide ongoing marketing support to ensure your book reaches its target audience and achieves its potential.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Founded in 2020
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Our <span className="text-gradient">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Statement Publications was born from a simple belief: every author
            deserves access to professional publishing tools, regardless of their
            background or connections.
          </motion.p>
        </div>
      </section>

      {/* ── Company Story ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Publishing for Everyone
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In 2020, we saw a gap in the publishing world. Talented authors
                  were being turned away by traditional publishers, while
                  self-publishing platforms offered little more than basic tools and
                  no real support.
                </p>
                <p>
                  We built Statement Publications to bridge that gap — a platform
                  that combines the prestige and quality of traditional publishing
                  with the accessibility and freedom of self-publishing. Our team
                  of editors, designers, and publishing experts work alongside
                  authors to bring their stories to life with the professionalism
                  they deserve.
                </p>
                <p>
                  Today, we&apos;ve helped thousands of authors publish over 10,000 books,
                  reaching readers in more than 50 countries. But we&apos;re just getting
                  started. Our mission is to empower a million authors to share
                  their stories with the world.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl border bg-card p-8 sm:p-10">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: "10,000+", label: "Books Published" },
                      { value: "5,000+", label: "Active Authors" },
                      { value: "50+", label: "Countries Reached" },
                      { value: "$1M+", label: "Royalties Paid" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/50">
                        <div className="text-2xl sm:text-3xl font-bold text-gradient">
                          {stat.value}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Purpose
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Mission & Vision
            </h2>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="group relative rounded-2xl border bg-card p-8 sm:p-10 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-primary/10 p-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To democratize the publishing industry by providing every author
                with professional-grade tools, expert guidance, and global
                distribution channels. We believe that the quality of a story
                should determine its success — not the author&apos;s connections or
                budget.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group relative rounded-2xl border bg-card p-8 sm:p-10 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-accent/10 p-4">
                <Eye className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the world&apos;s most trusted publishing platform, where
                every author — from debut writers to seasoned storytellers — can
                publish, distribute, and monetize their work with ease. We envision
                a future where no great story goes untold.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Core Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              These principles guide every decision we make and every service we provide.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Leadership Team ──────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Meet the Team
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Leadership Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The passionate people behind Statement Publications.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {leadership.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border bg-card p-8 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20"
              >
                <div
                  className={cn(
                    "mx-auto mb-5 h-24 w-24 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white",
                    member.color
                  )}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">
                  {member.role}
                </p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Publishing Process ────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              How We Work
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Our Publishing Process
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A streamlined approach that takes your manuscript from draft to
              published book.
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-background text-primary font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-primary/10 p-2.5">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-charcoal to-dark-gray text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Ready to Write Your Chapter?
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to bring their stories
              to the world. Start your publishing journey today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="text-base px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/auth/signup">
                  Get Started for Free
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 h-14 border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
