"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Headphones,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  TrendingUp,
  DollarSign,
  Bell,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const faqs = [
  { question: "How do I upload a new book?", answer: "Go to All Books and click the Upload New Book button. You can upload your manuscript in PDF, DOCX, or EPUB format." },
  { question: "When do I receive my royalties?", answer: "Statement Publications pays royalties monthly on the 1st of each month. Payments are processed for the previous month's sales." },
  { question: "How do I track my book sales?", answer: "Visit the Earnings page to see detailed analytics including sales, revenue, views, and reader engagement metrics." },
  { question: "Can I edit my book after publishing?", answer: "Yes, you can update your book details, cover, and metadata at any time from the All Books page." },
  { question: "How do I order publishing services?", answer: "Visit the Services page and click Browse Service Marketplace to explore editing, cover design, marketing, and other services." },
  { question: "What file formats are supported?", answer: "We accept PDF, DOCX, EPUB, and MOBI for manuscripts. Cover images should be JPG or PNG at 300 DPI." },
];

const announcements = [
  { title: "New Analytics Dashboard", description: "We've launched a completely redesigned Earnings page with enhanced analytics and royalty tracking.", date: "Jun 20, 2026", type: "feature" },
  { title: "Summer Publishing Promotional", description: "Get 20% off all publishing services from July 1-31. Use code SUMMER2026 at checkout.", date: "Jun 15, 2026", type: "promotion" },
  { title: "Platform Maintenance Complete", description: "Scheduled maintenance has been completed. All systems are fully operational.", date: "Jun 10, 2026", type: "update" },
];

const resources = [
  { title: "Complete Guide to Self-Publishing", description: "Step-by-step guide from manuscript to published book.", icon: BookOpen, color: "bg-[#F2D8BE] text-[#8A6A4A]" },
  { title: "Book Marketing Strategies", description: "Proven strategies to promote your books and grow your readership.", icon: TrendingUp, color: "bg-emerald-100 text-emerald-600" },
  { title: "Understanding Royalties", description: "How royalties are calculated and when you get paid.", icon: DollarSign, color: "bg-blue-100 text-blue-600" },
  { title: "Cover Design Best Practices", description: "Tips for creating covers that sell books.", icon: FileText, color: "bg-violet-100 text-violet-600" },
];

const tickets = [
  { id: "SUP-001", subject: "Royalty payment inquiry", status: "open", date: "2 days ago", priority: "medium" },
  { id: "SUP-002", subject: "Book cover revision request", status: "in_progress", date: "3 days ago", priority: "high" },
  { id: "SUP-003", subject: "Account verification help", status: "closed", date: "1 week ago", priority: "low" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-blue-700", bg: "bg-blue-50" },
  in_progress: { label: "In Progress", color: "text-amber-700", bg: "bg-amber-50" },
  closed: { label: "Closed", color: "text-emerald-700", bg: "bg-emerald-50" },
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-slate-600", bg: "bg-slate-50" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-50" },
  high: { label: "High", color: "text-red-700", bg: "bg-red-50" },
};

export default function AuthorSupportCenterPage() {
  const [activeTab, setActiveTab] = useState<"support" | "faqs" | "announcements" | "resources">("support");
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "", description: "" });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const tabs = [
    { id: "support" as const, label: "Support Centre", icon: Headphones },
    { id: "faqs" as const, label: "FAQs", icon: HelpCircle },
    { id: "announcements" as const, label: "Announcements", icon: Bell },
    { id: "resources" as const, label: "Resources", icon: BookOpen },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Premium Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Support Centre</h1>
          <p className="mt-1 text-sm text-[#6A4E37]">Get support, find answers, and access publishing resources.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="rounded-[calc(0.5rem-2px)] border-0 bg-white px-3 py-2 text-sm font-medium text-[#1D1D1D] hover:bg-[#F5EDE3]"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <Button
            onClick={() => setTicketDialogOpen(true)}
            className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Get Support
          </Button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#D8B27A] text-[#1D1D1D] shadow-sm"
                : "bg-white text-[#6A4E37] border border-[#E8DDD0] hover:border-[#D8B27A]/50 hover:bg-[#F5EDE3]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Support Centre Tab */}
      {activeTab === "support" && (
        <motion.div variants={item} className="space-y-6">
          {/* My Support Requests Table */}
          <Card className="border border-[#E8DDD0] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#1D1D1D]">My Support Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-[#E8DDD0] bg-[#F5EDE3]/30">
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#6A4E37] px-5 py-3">Reference</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#6A4E37] px-5 py-3">Subject</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#6A4E37] px-5 py-3">Status</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#6A4E37] px-5 py-3">Priority</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#6A4E37] px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => {
                      const status = statusConfig[ticket.status];
                      const priority = priorityConfig[ticket.priority];
                      return (
                        <tr key={ticket.id} className="border-t border-[#E8DDD0]/60 hover:bg-[#F5EDE3]/20 transition-colors cursor-pointer">
                          <td className="px-5 py-3.5 text-sm font-semibold text-[#8A6A4A]">{ticket.id}</td>
                          <td className="px-5 py-3.5 text-sm font-medium text-[#1D1D1D]">{ticket.subject}</td>
                          <td className="px-5 py-3.5">
                            <Badge className={`${status.bg} ${status.color} border-0 px-2.5 py-0.5 text-xs font-medium`}>{status.label}</Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge className={`${priority.bg} ${priority.color} border-0 px-2.5 py-0.5 text-xs font-medium`}>{priority.label}</Badge>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-[#6A4E37]">{ticket.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Help + Support Hours */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-[#E8DDD0] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-[#1D1D1D] flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#8A6A4A]" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="group rounded-xl border border-[#E8DDD0] p-4 hover:border-[#D8B27A]/40 hover:bg-[#F5EDE3]/30 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#F2D8BE] p-2.5 transition-transform duration-200 group-hover:scale-105"><BookOpen className="h-5 w-5 text-[#8A6A4A]" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1D1D1D]">Publishing Guides</p>
                      <p className="text-xs text-[#6A4E37]">Step-by-step tutorials for authors</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#6A4E37] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="group rounded-xl border border-[#E8DDD0] p-4 hover:border-[#D8B27A]/40 hover:bg-[#F5EDE3]/30 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2.5 transition-transform duration-200 group-hover:scale-105"><HelpCircle className="h-5 w-5 text-emerald-600" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1D1D1D]">FAQs</p>
                      <p className="text-xs text-[#6A4E37]">Find answers to common questions</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#6A4E37] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="group rounded-xl border border-[#E8DDD0] p-4 hover:border-[#D8B27A]/40 hover:bg-[#F5EDE3]/30 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2.5 transition-transform duration-200 group-hover:scale-105"><Send className="h-5 w-5 text-blue-600" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1D1D1D]">Contact Support</p>
                      <p className="text-xs text-[#6A4E37]">Get help from our team</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#6A4E37] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#E8DDD0] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-[#1D1D1D]">Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6A4E37]">Monday - Friday</span>
                  <span className="font-medium text-[#1D1D1D]">9:00 AM - 6:00 PM</span>
                </div>
                <div className="h-px bg-[#E8DDD0]/60" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6A4E37]">Saturday</span>
                  <span className="font-medium text-[#1D1D1D]">10:00 AM - 2:00 PM</span>
                </div>
                <div className="h-px bg-[#E8DDD0]/60" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6A4E37]">Sunday</span>
                  <span className="font-medium text-[#6A4E37]/60">Closed</span>
                </div>
                <div className="mt-4 rounded-lg bg-[#F5EDE3]/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#6A4E37]">Average Response Time</p>
                    <Badge className="bg-[#D8B27A]/20 text-[#8A6A4A] border-0 px-2 py-0.5 text-xs font-semibold">~4 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <motion.div variants={item} className="space-y-4">
          <div className="relative max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A] z-10" />
            <Input placeholder="Search FAQs..." className="pl-9 rounded-[calc(0.5rem-2px)] border-0 bg-white" />
          </div>
          {faqs.map((faq, i) => (
            <Card key={i} className="border border-[#E8DDD0] shadow-sm hover:shadow-md transition-shadow duration-200">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-[#1D1D1D] pr-4">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-[#6A4E37] transition-transform duration-200 flex-shrink-0 ${expandedFaq === i ? "rotate-180" : ""}`} />
              </button>
              {expandedFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-5 text-sm text-[#6A4E37] leading-relaxed border-t border-[#E8DDD0] pt-4"
                >
                  {faq.answer}
                </motion.div>
              )}
            </Card>
          ))}
        </motion.div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <motion.div variants={item} className="space-y-4">
          {announcements.map((ann, i) => (
            <Card key={i} className="border border-[#E8DDD0] shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-2.5 flex-shrink-0 ${
                    ann.type === "feature" ? "bg-emerald-100" : ann.type === "promotion" ? "bg-[#F2D8BE]" : "bg-blue-100"
                  }`}>
                    {ann.type === "feature" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> :
                     ann.type === "promotion" ? <DollarSign className="h-5 w-5 text-[#8A6A4A]" /> :
                     <AlertCircle className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1D1D1D]">{ann.title}</h3>
                      <Badge className={`text-xs font-medium px-2 py-0.5 ${
                        ann.type === "feature" ? "bg-emerald-50 text-emerald-700" :
                        ann.type === "promotion" ? "bg-[#F2D8BE]/60 text-[#8A6A4A]" :
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {ann.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6A4E37] mt-1.5 leading-relaxed">{ann.description}</p>
                    <p className="text-xs text-[#8A6A4A] mt-2">{ann.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <motion.div variants={item}>
          <div className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource, i) => (
              <Card key={i} className="group border border-[#E8DDD0] shadow-sm hover:shadow-md hover:border-[#D8B27A]/40 transition-all duration-200 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-3 transition-transform duration-200 group-hover:scale-105 ${resource.color}`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1D1D1D]">{resource.title}</h3>
                      <p className="text-sm text-[#6A4E37] mt-1 leading-relaxed">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Get Support Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Get Support</DialogTitle>
            <DialogDescription>Describe your issue and we&apos;ll get back to you within 4 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1D1D1D]">Subject</label>
              <Input placeholder="Brief description of your issue" className="border-[#E8DDD0]" value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1D1D1D]">Category</label>
              <Select value={ticketForm.category} onValueChange={(v) => setTicketForm({ ...ticketForm, category: v })}>
                <SelectTrigger className="border-[#E8DDD0]"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="publishing">Publishing Help</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1D1D1D]">Description</label>
              <Textarea placeholder="Please describe your issue in detail..." rows={4} className="border-[#E8DDD0]" value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketDialogOpen(false)} className="border-[#E8DDD0]">Cancel</Button>
            <Button onClick={() => setTicketDialogOpen(false)} className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]" disabled={!ticketForm.subject || !ticketForm.category}>
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
