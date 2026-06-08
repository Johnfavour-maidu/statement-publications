"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-charcoal mb-6">
            <Mail className="h-4 w-4" />
            Newsletter
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4" style={{ fontFamily: "var(--font-libre)" }}>
            Stay Ahead in Publishing
          </h2>
          <p className="text-charcoal/70 mb-8 max-w-xl mx-auto">
            Get weekly insights on writing, publishing, and book marketing delivered straight to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold"
            >
              <CheckCircle className="h-5 w-5" />
              You're subscribed! Check your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 rounded-xl border-2 border-white/40 bg-white/60 backdrop-blur-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-white focus:bg-white/80 transition-all text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-charcoal text-white rounded-xl font-semibold hover:bg-dark-gray shadow-lg transition-all inline-flex items-center justify-center gap-2"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-charcoal/50 mt-4">Join 12,000+ authors and publishers. No spam, ever.</p>
        </motion.div>
      </div>
    </section>
  );
}
