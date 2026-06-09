"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  MessageCircle,
  Camera,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const officeInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["123 Publishing Lane", "Accra, Ghana", "GA-123-4567"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+233 (0) 30 123 4567", "+1 (555) 987-6543"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@statementpub.com", "support@statementpub.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: [
      "Monday - Friday: 9am - 6pm",
      "Saturday: 10am - 2pm",
      "Sunday: Closed",
    ],
  },
];

const socialLinks = [
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Briefcase, label: "LinkedIn", href: "#" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-[#D8B27A] animate-pulse" />
            We&apos;d Love to Hear from You
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Get in <span className="text-gradient">Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Have a question, proposal, or just want to say hello? We&apos;re here
            to help you with your publishing journey.
          </motion.p>
        </div>
      </section>

      {/* ── Contact Form & Info ──────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Form */}
            <AnimatedSection className="lg:col-span-3">
              <div className="rounded-2xl border bg-card p-8 sm:p-10">
                <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none"
                      >
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project or question..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="min-h-[160px] resize-none"
                      required
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 rounded-xl bg-[#F2D8BE]/40 border border-[#EBC9A8]/20 p-4"
                      >
                        <CheckCircle2 className="h-5 w-5 text-[#D8B27A] shrink-0" />
                        <p className="text-sm font-medium text-[#8A6A4A]">
                          Message sent successfully! We&apos;ll get back to you
                          within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="button">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full sm:w-auto text-base px-8 h-12"
                        >
                          Send Message
                          <Send className="h-4 w-4 ml-1" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </AnimatedSection>

            {/* Office Info */}
            <AnimatedSection delay={0.2} className="lg:col-span-2">
              <div className="space-y-6">
                {officeInfo.map((info) => (
                  <div
                    key={info.title}
                    className="flex gap-4 p-5 rounded-xl border bg-card transition-all duration-300 hover:shadow-md hover:border-primary/20"
                  >
                    <div className="shrink-0 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 h-fit">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.lines.map((line) => (
                        <p key={line} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Social Links */}
                <div className="p-5 rounded-xl border bg-card">
                  <h3 className="font-semibold mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="inline-flex items-center justify-center rounded-xl bg-muted p-3 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Map Placeholder ──────────────────────────────── */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="aspect-[21/9] bg-muted flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold">Our Headquarters</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    123 Publishing Lane, Accra, Ghana
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
