"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  PenTool,
  CheckCircle2,
  Palette,
  Printer,
  Megaphone,
  Feather,
  UserCheck,
  Headphones,
  Newspaper,
  GraduationCap,
  FileText,
  Check,
  HelpCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const services = [
  {
    icon: BookOpen,
    title: "Book Publishing",
    description:
      "End-to-end publishing services for eBooks, paperbacks, and hardcovers with global distribution to major retailers.",
  },
  {
    icon: PenTool,
    title: "Book Editing",
    description:
      "Professional developmental editing, copyediting, and line editing by experienced editors who specialize in your genre.",
  },
  {
    icon: CheckCircle2,
    title: "Proofreading",
    description:
      "Meticulous final-pass proofreading to catch every typo, grammatical error, and formatting inconsistency before publication.",
  },
  {
    icon: FileText,
    title: "ISBN Registration",
    description:
      "We handle the entire ISBN registration process, ensuring your book is properly cataloged for retail and library distribution.",
  },
  {
    icon: Palette,
    title: "Book Cover Design",
    description:
      "Custom cover designs by professional artists who understand genre trends and create covers that captivate readers.",
  },
  {
    icon: Printer,
    title: "Book Formatting",
    description:
      "Interior formatting for print and digital formats, ensuring your book looks polished on every device and in every edition.",
  },
  {
    icon: BookOpen,
    title: "Print-on-Demand",
    description:
      "No upfront inventory costs. Books are printed and shipped as orders come in, reducing waste and financial risk.",
  },
  {
    icon: Megaphone,
    title: "Marketing Services",
    description:
      "Strategic marketing campaigns including social media promotion, book launches, and targeted advertising to boost visibility.",
  },
  {
    icon: Feather,
    title: "Ghostwriting",
    description:
      "Skilled ghostwriters who bring your ideas to life while maintaining your unique voice and storytelling style.",
  },
  {
    icon: UserCheck,
    title: "Author Branding",
    description:
      "Build your author brand with professional headshots, bio writing, website design, and social media strategy.",
  },
  {
    icon: Headphones,
    title: "Audiobook Publishing",
    description:
      "Professional narration, production, and distribution of your audiobook to Audible, Apple Books, and other platforms.",
  },
  {
    icon: Newspaper,
    title: "Magazine Publishing",
    description:
      "Full-service magazine publishing from layout design to digital distribution for independent and niche publications.",
  },
  {
    icon: GraduationCap,
    title: "Academic Publishing",
    description:
      "Specialized publishing for academic texts, dissertations, and scholarly works with peer review support.",
  },
  {
    icon: FileText,
    title: "Research Publishing",
    description:
      "Publication support for research papers, journals, and technical documents with proper citation formatting.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for first-time authors ready to self-publish.",
    features: [
      "eBook publishing",
      "Basic cover templates",
      "ISBN registration",
      "Author dashboard",
      "Standard royalties",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$499",
    period: "per book",
    description: "Comprehensive publishing for serious authors.",
    features: [
      "Everything in Starter",
      "Custom cover design",
      "Professional editing",
      "Print-on-demand setup",
      "Marketing consultation",
      "Audiobook production",
      "Priority support",
      "Enhanced royalties",
    ],
    cta: "Go Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for publishers and large catalogs.",
    features: [
      "Everything in Professional",
      "Bulk publishing tools",
      "Dedicated account manager",
      "Custom branding package",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Negotiable royalties",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "What publishing formats do you support?",
    answer:
      "We support all major formats including eBooks (EPUB, MOBI, PDF), print books (paperback and hardcover), and audiobooks. Your book can be published in multiple formats simultaneously for maximum reach.",
  },
  {
    question: "How long does the publishing process take?",
    answer:
      "Timelines vary by service. eBook publishing can take as little as 2-3 weeks. Full-service publishing with editing, cover design, and formatting typically takes 8-12 weeks. We'll provide a detailed timeline during your consultation.",
  },
  {
    question: "Do I need to hire all your services?",
    answer:
      "Not at all. Our services are à la carte. You can choose exactly what you need — whether it's just ISBN registration or a complete publishing package. Many authors start with one service and add more as needed.",
  },
  {
    question: "What royalty rates do you offer?",
    answer:
      "Royalty rates vary by tier. Starter accounts receive standard rates (up to 70% on eBooks), Professional accounts get enhanced rates, and Enterprise accounts can negotiate custom terms. Contact us for specific details.",
  },
  {
    question: "Can I publish in genres you don't list?",
    answer:
      "Absolutely. We publish books across all genres and categories. The genres listed on our site are simply our most popular areas of expertise. Contact us to discuss your specific project.",
  },
  {
    question: "Do you offer marketing support?",
    answer:
      "Yes. Our Professional and Enterprise tiers include marketing consultation and campaign management. We also offer standalone marketing packages for authors who need targeted promotional support.",
  },
];

export default function ServicesPage() {
  const [activeTier, setActiveTier] = useState("Professional");

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            14 Professional Services
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Professional Publishing
            <br />
            <span className="text-gradient">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            From manuscript to marketplace, we offer everything you need to
            publish a professional book. Choose individual services or full
            publishing packages.
          </motion.p>
        </div>
      </section>

      {/* ── Services Grid ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive publishing solutions tailored to your needs.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary p-0 h-auto font-medium"
                  asChild
                >
                  <Link href="/contact">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Tiers ────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Publishing Tiers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the tier that fits your publishing goals.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {tiers.map((tier) => (
              <motion.div
                key={tier.name}
                variants={fadeInUp}
                className={cn(
                  "relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg",
                  tier.popular
                    ? "border-primary shadow-md scale-[1.02]"
                    : "hover:border-primary/20"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">
                      /{tier.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full mt-8",
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : ""
                  )}
                  variant={tier.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={tier.name === "Enterprise" ? "/contact" : "/auth/signup"}>
                    {tier.cta}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border bg-card px-5 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium py-5 hover:no-underline hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
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
              Ready to Get Started?
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              Whether you need a single service or a complete publishing
              package, our team is ready to help you bring your book to life.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="text-base px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/auth/signup">
                  Start Publishing
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
