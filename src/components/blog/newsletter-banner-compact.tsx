"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function NewsletterBannerCompact() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#EBC9A8]" style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #FAF8F5 100%)" }}>
      <div className="px-6 py-8 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 bg-[#EBC9A8]/20 px-3 py-1 rounded-full text-xs font-semibold text-[#8A6A4A] mb-4">
            <Mail className="h-3.5 w-3.5" />
            Newsletter
          </div>
          <h3 className="text-lg font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-libre)" }}>
            Stay Ahead in Publishing
          </h3>
          <p className="text-sm text-dark-gray/60 mb-5 max-w-sm mx-auto">
            Weekly insights on writing, publishing, and book marketing.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <CheckCircle className="h-4 w-4" />
              Subscribed! Check your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#EBC9A8] text-charcoal text-sm font-semibold rounded-lg hover:bg-[#D8B27A] transition-colors inline-flex items-center gap-1"
              >
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-dark-gray/40 mt-3">Join 12,000+ authors. No spam, ever.</p>
        </motion.div>
      </div>
    </div>
  );
}
