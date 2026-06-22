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
  { question: "How do I track my book sales?", answer: "Visit the Reports page to see detailed analytics including sales, revenue, views, and reader engagement metrics." },
  { question: "Can I edit my book after publishing?", answer: "Yes, you can update your book details, cover, and metadata at any time from the All Books page." },
  { question: "How do I order publishing services?", answer: "Visit the Services page and click Browse Service Marketplace to explore editing, cover design, marketing, and other services." },
  { question: "What file formats are supported?", answer: "We accept PDF, DOCX, EPUB, and MOBI for manuscripts. Cover images should be JPG or PNG at 300 DPI." },
];

const announcements = [
  { title: "New Analytics Dashboard", description: "We've launched a completely redesigned Reports page with enhanced analytics and royalty tracking.", date: "Jun 20, 2026", type: "feature" },
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
  { id: "TKT-001", subject: "Royalty payment inquiry", status: "open", date: "2 days ago", priority: "medium" },
  { id: "TKT-002", subject: "Book cover revision request", status: "in_progress", date: "3 days ago", priority: "high" },
  { id: "TKT-003", subject: "Account verification help", status: "closed", date: "1 week ago", priority: "low" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-blue-700", bg: "bg-blue-100" },
  in_progress: { label: "In Progress", color: "text-amber-700", bg: "bg-amber-100" },
  closed: { label: "Closed", color: "text-emerald-700", bg: "bg-emerald-100" },
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-gray-700", bg: "bg-gray-100" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-100" },
  high: { label: "High", color: "text-red-700", bg: "bg-red-100" },
};

export default function AuthorCommunityPage() {
  const [activeTab, setActiveTab] = useState<"support" | "faqs" | "announcements" | "resources">("support");
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "", description: "" });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const tabs = [
    { id: "support" as const, label: "Support Center", icon: Headphones },
    { id: "faqs" as const, label: "FAQs", icon: HelpCircle },
    { id: "announcements" as const, label: "Announcements", icon: Bell },
    { id: "resources" as const, label: "Resources", icon: BookOpen },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Community</h1>
          <p className="text-[#6A4E37]">Get support, find answers, and access publishing resources.</p>
        </div>
        <Button onClick={() => setTicketDialogOpen(true)} className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
          <Plus className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
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
                : "bg-white text-[#6A4E37] border border-[#E8DDD0] hover:bg-[#F5EDE3]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Support Center Tab */}
      {activeTab === "support" && (
        <motion.div variants={item} className="space-y-6">
          <Card className="border border-[#E8DDD0]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">My Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-[#E8DDD0] bg-[#F5EDE3]/30">
                      <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Ticket</th>
                      <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Subject</th>
                      <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Priority</th>
                      <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => {
                      const status = statusConfig[ticket.status];
                      const priority = priorityConfig[ticket.priority];
                      return (
                        <tr key={ticket.id} className="border-t border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/30 transition-colors cursor-pointer">
                          <td className="px-4 py-3 text-sm font-medium text-[#8A6A4A]">{ticket.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1D1D1D]">{ticket.subject}</td>
                          <td className="px-4 py-3">
                            <Badge className={`${status.bg} ${status.color} border-0`}>{status.label}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`${priority.bg} ${priority.color} border-0`}>{priority.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#6A4E37]">{ticket.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-[#E8DDD0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#8A6A4A]" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#F2D8BE] p-2.5"><BookOpen className="h-5 w-5 text-[#8A6A4A]" /></div>
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Publishing Guides</p>
                      <p className="text-xs text-[#6A4E37]">Step-by-step tutorials for authors</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#6A4E37] ml-auto" />
                  </div>
                </div>
                <div className="rounded-xl border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2.5"><HelpCircle className="h-5 w-5 text-emerald-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">FAQs</p>
                      <p className="text-xs text-[#6A4E37]">Find answers to common questions</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#6A4E37] ml-auto" />
                  </div>
                </div>
                <div className="rounded-xl border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2.5"><Send className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Contact Support</p>
                      <p className="text-xs text-[#6A4E37]">Get help from our team</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#6A4E37] ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#E8DDD0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6A4E37]">Monday - Friday</span>
                  <span className="font-medium text-[#1D1D1D]">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6A4E37]">Saturday</span>
                  <span className="font-medium text-[#1D1D1D]">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6A4E37]">Sunday</span>
                  <span className="font-medium text-[#1D1D1D]">Closed</span>
                </div>
                <div className="rounded-lg bg-[#F5EDE3]/50 p-3 mt-3">
                  <p className="text-xs text-[#6A4E37]">Average response time: <span className="font-medium text-[#1D1D1D]">4 hours</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <motion.div variants={item} className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
            <Input placeholder="Search FAQs..." className="pl-9 border-[#E8DDD0]" />
          </div>
          {faqs.map((faq, i) => (
            <Card key={i} className="border border-[#E8DDD0]">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-[#1D1D1D]">{faq.question}</span>
                {expandedFaq === i ? <ChevronUp className="h-5 w-5 text-[#6A4E37]" /> : <ChevronDown className="h-5 w-5 text-[#6A4E37]" />}
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 text-sm text-[#6A4E37] border-t border-[#E8DDD0] pt-3">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </motion.div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <motion.div variants={item} className="space-y-4">
          {announcements.map((ann, i) => (
            <Card key={i} className="border border-[#E8DDD0]">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-2.5 ${
                    ann.type === "feature" ? "bg-emerald-100" : ann.type === "promotion" ? "bg-[#F2D8BE]" : "bg-blue-100"
                  }`}>
                    {ann.type === "feature" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> :
                     ann.type === "promotion" ? <DollarSign className="h-5 w-5 text-[#8A6A4A]" /> :
                     <AlertCircle className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1D1D1D]">{ann.title}</h3>
                      <Badge className={`text-xs ${
                        ann.type === "feature" ? "bg-emerald-100 text-emerald-700" :
                        ann.type === "promotion" ? "bg-[#F2D8BE] text-[#8A6A4A]" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {ann.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6A4E37] mt-1">{ann.description}</p>
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
              <Card key={i} className="border border-[#E8DDD0] hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-3 ${resource.color}`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1D1D1D]">{resource.title}</h3>
                      <p className="text-sm text-[#6A4E37] mt-1">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>Describe your issue and we'll get back to you within 4 hours.</DialogDescription>
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
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
