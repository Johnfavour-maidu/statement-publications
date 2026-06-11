"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Quote, CheckCircle2, Globe, ArrowUpRight, Award, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Leader } from "@/lib/leadership-data";
import { leaders } from "@/lib/leadership-data";

const accentMap: Record<string, { border: string; glow: string; bg: string; text: string; icon: string; gradientBorder: string; badge: string }> = {
  blue: { border: "border-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.35)]", bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600", gradientBorder: "from-blue-300 via-blue-400 to-blue-500", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  emerald: { border: "border-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.35)]", bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-600", gradientBorder: "from-emerald-300 via-emerald-400 to-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  amber: { border: "border-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.35)]", bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-600", gradientBorder: "from-amber-300 via-amber-400 to-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function LeadershipProfileClient({ leader }: { leader: Leader }) {
  const accent = leader.accentBorder.includes("blue") ? "blue" : leader.accentBorder.includes("emerald") ? "emerald" : "amber";
  const theme = accentMap[accent];

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
            <ArrowLeft className="h-4 w-4" /> Back to Leadership
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
              <p className={cn("mt-2 text-xl font-medium", theme.text)}>{leader.role}</p>
              <p className="mt-6 text-lg text-dark-gray/70 leading-relaxed max-w-2xl">
                {leader.shortBio}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {leader.expertise.slice(0, 3).map((skill) => (
                  <span key={skill} className={cn("text-xs font-medium px-3 py-1.5 rounded-full border", theme.badge)}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className={cn("absolute -inset-4 bg-gradient-to-r rounded-3xl blur-2xl opacity-30", theme.gradientBorder)} />
                <div className={cn("relative w-52 h-52 rounded-full overflow-hidden border-[5px]", theme.border, theme.glow)}>
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", theme.bg)}>
                    <Users className={cn("h-5 w-5", theme.icon)} />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">About {leader.name.split(" ")[0]}</h2>
                </div>
                <div className="space-y-4">
                  {leader.fullBio.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-dark-gray/70 leading-relaxed text-[15px]">{paragraph}</p>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className={cn("p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r", theme.gradientBorder)}>
                  <div className={cn("rounded-[14px] p-8", theme.bg)}>
                    <div className="flex items-start gap-4">
                      <Quote className={cn("h-8 w-8 flex-shrink-0 mt-1", theme.icon)} />
                      <div>
                        <h3 className="text-lg font-bold text-charcoal mb-2">Leadership Philosophy</h3>
                        <p className="text-dark-gray/70 italic leading-relaxed">&ldquo;{leader.philosophy}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", theme.bg)}>
                    <Award className={cn("h-5 w-5", theme.icon)} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal">Key Achievements</h3>
                </div>
                <div className="space-y-3">
                  {leader.achievements.map((achievement, i) => (
                    <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl", i % 2 === 0 ? theme.bg : "bg-white")}>
                      <CheckCircle2 className={cn("h-5 w-5 flex-shrink-0 mt-0.5", theme.icon)} />
                      <p className="text-dark-gray/70 text-[15px]">{achievement}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className={cn("p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r", theme.gradientBorder)}>
                  <div className="bg-white rounded-[14px] p-6">
                    <h3 className="text-lg font-bold text-charcoal mb-4">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((skill) => (
                        <span key={skill} className={cn("text-sm font-medium px-3 py-1.5 rounded-full border", theme.badge)}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {leader.social && leader.social.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
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
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-charcoal mb-4">Other Leaders</h3>
                  <div className="space-y-3">
                    {leaders
                      .filter((l) => l.slug !== leader.slug)
                      .map((l) => {
                        const lAccent = l.accentBorder.includes("blue") ? "blue" : l.accentBorder.includes("emerald") ? "emerald" : "amber";
                        const lTheme = accentMap[lAccent];
                        return (
                          <Link
                            key={l.slug}
                            href={`/about/leadership/${l.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FDF6EE] transition-colors group"
                          >
                            <div className={cn("w-10 h-10 rounded-full overflow-hidden border-2", lTheme.border)}>
                              <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-charcoal truncate">{l.name}</p>
                              <p className="text-xs text-dark-gray/60 truncate">{l.role}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-dark-gray/30 group-hover:text-[#8A6A4A] transition-colors" />
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
