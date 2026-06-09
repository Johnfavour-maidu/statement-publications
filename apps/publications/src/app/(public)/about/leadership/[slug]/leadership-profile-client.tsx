"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Quote, CheckCircle2, Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Leader } from "@/lib/leadership-data";
import { leaders } from "@/lib/leadership-data";

export default function LeadershipProfileClient({ leader }: { leader: Leader }) {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-[#FDF6EE] via-white to-white">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A6A4A] hover:text-[#D8B27A] transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-[#8A6A4A] uppercase tracking-wider">Leadership</span>
                <ChevronRight className="h-4 w-4 text-dark-gray/40" />
                <span className="text-sm text-dark-gray/60">{leader.role}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
                {leader.name}
              </h1>
              <p className="mt-2 text-xl text-[#8A6A4A] font-medium">{leader.role}</p>
              <p className="mt-6 text-lg text-dark-gray/70 leading-relaxed max-w-2xl">
                {leader.shortBio}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className={cn("absolute -inset-4 bg-gradient-to-r rounded-3xl blur-2xl opacity-30", leader.color)} />
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-6">About {leader.name.split(" ")[0]}</h2>
                <div className="space-y-4">
                  {leader.fullBio.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-dark-gray/70 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="bg-[#FDF6EE] rounded-2xl p-8 border border-[#EBC9A8]/20">
                <div className="flex items-start gap-4">
                  <Quote className="h-8 w-8 text-[#D8B27A] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">Leadership Philosophy</h3>
                    <p className="text-dark-gray/70 italic leading-relaxed">&ldquo;{leader.philosophy}&rdquo;</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-charcoal mb-6">Key Achievements</h3>
                <div className="space-y-4">
                  {leader.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#D8B27A] flex-shrink-0 mt-0.5" />
                      <p className="text-dark-gray/70">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-charcoal mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {leader.expertise.map((skill) => (
                    <span key={skill} className="text-sm font-medium px-3 py-1.5 rounded-full bg-[#FDF6EE] text-[#8A6A4A] border border-[#EBC9A8]/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {leader.social && leader.social.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-charcoal mb-4">Connect</h3>
                  <div className="space-y-3">
                    {leader.social.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-dark-gray/70 hover:text-[#8A6A4A] transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        {link.platform}
                        <ArrowUpRight className="h-3 w-3 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-charcoal mb-4">Other Leaders</h3>
                <div className="space-y-3">
                  {leaders
                    .filter((l) => l.slug !== leader.slug)
                    .map((l) => (
                      <Link
                        key={l.slug}
                        href={`/about/leadership/${l.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FDF6EE] transition-colors group"
                      >
                        <img src={l.image} alt={l.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-charcoal truncate">{l.name}</p>
                          <p className="text-xs text-dark-gray/60 truncate">{l.role}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-dark-gray/30 group-hover:text-[#8A6A4A] transition-colors" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
