"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Headphones,
  Mail,
  MessageSquare,
  Search,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  CreditCard,
  Settings,
  Wrench,
  HelpCircle,
  User,
  ChevronRight,
  Send,
  StickyNote,
  ArrowUpRight,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate, getInitials } from "@/lib/utils"

interface ConversationMessage {
  id: string
  sender: string
  senderRole: "author" | "staff" | "system"
  content: string
  timestamp: string
}

interface StatusHistoryEntry {
  status: string
  changedBy: string
  timestamp: string
}

interface SupportRequest {
  id: string
  author: string
  authorEmail: string
  authorAvatar?: string
  category: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  date: string
  assignedStaff: string
  status: "Open" | "Awaiting Response" | "In Progress" | "Resolved" | "Closed"
  conversation: ConversationMessage[]
  internalNotes: string[]
  statusHistory: StatusHistoryEntry[]
}

const stats = [
  { title: "Total Support Requests", value: 147, icon: Headphones, color: "text-[#8A6A4A]", bgColor: "bg-[#F2D8BE]/40" },
  { title: "Open", value: 23, icon: AlertCircle, color: "text-blue-600", bgColor: "bg-blue-50" },
  { title: "Awaiting Response", value: 12, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
  { title: "In Progress", value: 18, icon: Settings, color: "text-purple-600", bgColor: "bg-purple-50" },
  { title: "Resolved", value: 76, icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { title: "Closed", value: 18, icon: XCircle, color: "text-gray-500", bgColor: "bg-gray-50" },
]

const categoryBars = [
  { label: "Publishing Support", count: 42, color: "bg-[#8A6A4A]" },
  { label: "Service Orders", count: 31, color: "bg-[#D8B27A]" },
  { label: "Royalties & Payments", count: 24, color: "bg-[#8A6A4A]/70" },
  { label: "Account Issues", count: 19, color: "bg-[#D8B27A]/80" },
  { label: "Technical Support", count: 17, color: "bg-[#8A6A4A]/50" },
  { label: "General Enquiries", count: 14, color: "bg-[#D8B27A]/60" },
]

const monthlyVolume = [
  { label: "Jan 2026", count: 18, color: "bg-[#8A6A4A]" },
  { label: "Feb 2026", count: 24, color: "bg-[#D8B27A]" },
  { label: "Mar 2026", count: 31, color: "bg-[#8A6A4A]" },
  { label: "Apr 2026", count: 27, color: "bg-[#D8B27A]" },
  { label: "May 2026", count: 22, color: "bg-[#8A6A4A]" },
  { label: "Jun 2026", count: 25, color: "bg-[#D8B27A]" },
]

const supportRequests: SupportRequest[] = [
  {
    id: "SR-1001",
    author: "Adaobi Nnamdi",
    authorEmail: "adaobi.n@email.com",
    category: "Publishing Support",
    title: "Delayed manuscript review for The Ember Chronicles",
    description: "My manuscript was submitted three weeks ago and I haven't received any update on the review status. Could you please provide an update?",
    priority: "High",
    date: "2026-06-16T08:30:00Z",
    assignedStaff: "Blessing Okafor",
    status: "Open",
    conversation: [
      { id: "m1", sender: "Adaobi Nnamdi", senderRole: "author", content: "My manuscript was submitted three weeks ago and I haven't received any update on the review status. Could you please provide an update on The Ember Chronicles?", timestamp: "2026-06-16T08:30:00Z" },
      { id: "m2", sender: "Blessing Okafor", senderRole: "staff", content: "Hello Adaobi, thank you for reaching out. I'm looking into the status of your manuscript review now and will get back to you within 24 hours.", timestamp: "2026-06-16T09:15:00Z" },
      { id: "m3", sender: "System", senderRole: "system", content: "Support request assigned to Blessing Okafor", timestamp: "2026-06-16T09:00:00Z" },
    ],
    internalNotes: ["Manuscript currently with second reviewer. Expected completion by Friday."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-16T08:30:00Z" },
    ],
  },
  {
    id: "SR-1002",
    author: "Chukwuemeka Obi",
    authorEmail: "c.obi@email.com",
    category: "Royalties & Payments",
    title: "Incorrect royalty calculation for Q1 2026",
    description: "The royalty statement for Q1 shows significantly lower earnings than expected based on my sales dashboard. Please review.",
    priority: "Urgent",
    date: "2026-06-15T14:20:00Z",
    assignedStaff: "Emeka Adebayo",
    status: "In Progress",
    conversation: [
      { id: "m1", sender: "Chukwuemeka Obi", senderRole: "author", content: "The royalty statement for Q1 shows significantly lower earnings than expected based on my sales dashboard. There's a discrepancy of about $2,400.", timestamp: "2026-06-15T14:20:00Z" },
      { id: "m2", sender: "Emeka Adebayo", senderRole: "staff", content: "Thank you for bringing this to our attention. I'm pulling the detailed sales records for Q1 and comparing them against your royalty statement. I'll have an update for you shortly.", timestamp: "2026-06-15T15:00:00Z" },
    ],
    internalNotes: ["Finance team confirms a batch of sales was processed late. Will need to recalculate."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-15T14:20:00Z" },
      { status: "In Progress", changedBy: "Emeka Adebayo", timestamp: "2026-06-15T15:05:00Z" },
    ],
  },
  {
    id: "SR-1003",
    author: "Fatima Al-Rashid",
    authorEmail: "fatima.r@email.com",
    category: "Service Orders",
    title: "Need to update cover design order for Desert Bloom",
    description: "I'd like to change the color scheme of my cover design order from warm tones to cool tones. The order hasn't been started yet.",
    priority: "Medium",
    date: "2026-06-15T10:45:00Z",
    assignedStaff: "Blessing Okafor",
    status: "Awaiting Response",
    conversation: [
      { id: "m1", sender: "Fatima Al-Rashid", senderRole: "author", content: "I'd like to change the color scheme of my cover design order from warm tones to cool tones. Is this possible?", timestamp: "2026-06-15T10:45:00Z" },
      { id: "m2", sender: "Blessing Okafor", senderRole: "staff", content: "Of course, Fatima! I can update your cover design preferences. Could you please share some reference images or describe the cool tone palette you have in mind?", timestamp: "2026-06-15T11:30:00Z" },
    ],
    internalNotes: [],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-15T10:45:00Z" },
      { status: "Awaiting Response", changedBy: "Blessing Okafor", timestamp: "2026-06-15T11:30:00Z" },
    ],
  },
  {
    id: "SR-1004",
    author: "Ibrahim Suleiman",
    authorEmail: "ibrahim.s@email.com",
    category: "Account Issues",
    title: "Cannot access author dashboard after password reset",
    description: "After resetting my password, I'm unable to log in. The system says my account is locked.",
    priority: "High",
    date: "2026-06-14T16:10:00Z",
    assignedStaff: "Ngozi Eze",
    status: "Resolved",
    conversation: [
      { id: "m1", sender: "Ibrahim Suleiman", senderRole: "author", content: "After resetting my password, I'm unable to log in. The system says my account is locked. I've tried multiple times.", timestamp: "2026-06-14T16:10:00Z" },
      { id: "m2", sender: "Ngozi Eze", senderRole: "staff", content: "I'm sorry for the inconvenience, Ibrahim. I can see your account was temporarily locked after multiple failed attempts. I've unlocked it now. Please try logging in again with your new password.", timestamp: "2026-06-14T16:25:00Z" },
      { id: "m3", sender: "Ibrahim Suleiman", senderRole: "author", content: "It works now! Thank you for the quick resolution.", timestamp: "2026-06-14T16:32:00Z" },
      { id: "m4", sender: "Ngozi Eze", senderRole: "staff", content: "Great! I'm glad it's resolved. I've also enabled two-factor authentication on your account for added security. Let me know if you need anything else.", timestamp: "2026-06-14T16:35:00Z" },
    ],
    internalNotes: ["Account was locked after 5 failed login attempts. Unlocked and 2FA enabled."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-14T16:10:00Z" },
      { status: "In Progress", changedBy: "Ngozi Eze", timestamp: "2026-06-14T16:15:00Z" },
      { status: "Resolved", changedBy: "Ngozi Eze", timestamp: "2026-06-14T16:35:00Z" },
    ],
  },
  {
    id: "SR-1005",
    author: "Oluwaseun Adeyemi",
    authorEmail: "seun.a@email.com",
    category: "Technical Support",
    title: "PDF proof download link expired",
    description: "The link to download my book proof expired before I could review it. Can you generate a new one?",
    priority: "Low",
    date: "2026-06-14T09:00:00Z",
    assignedStaff: "Emeka Adebayo",
    status: "Closed",
    conversation: [
      { id: "m1", sender: "Oluwaseun Adeyemi", senderRole: "author", content: "The link to download my book proof expired before I could review it. Can you generate a new one?", timestamp: "2026-06-14T09:00:00Z" },
      { id: "m2", sender: "Emeka Adebayo", senderRole: "staff", content: "I've generated a new proof download link. It will be valid for 72 hours. You should receive it via email shortly.", timestamp: "2026-06-14T09:20:00Z" },
      { id: "m3", sender: "Oluwaseun Adeyemi", senderRole: "author", content: "Got it, thank you!", timestamp: "2026-06-14T09:35:00Z" },
    ],
    internalNotes: ["New proof link generated and sent."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-14T09:00:00Z" },
      { status: "In Progress", changedBy: "Emeka Adebayo", timestamp: "2026-06-14T09:10:00Z" },
      { status: "Resolved", changedBy: "Emeka Adebayo", timestamp: "2026-06-14T09:25:00Z" },
      { status: "Closed", changedBy: "System", timestamp: "2026-06-14T09:40:00Z" },
    ],
  },
  {
    id: "SR-1006",
    author: "Amina Bello",
    authorEmail: "amina.b@email.com",
    category: "General Enquiries",
    title: "Question about bulk order discounts for schools",
    description: "We're a school library looking to order 200 copies of a title. Do you offer bulk discounts?",
    priority: "Low",
    date: "2026-06-13T11:30:00Z",
    assignedStaff: "Ngozi Eze",
    status: "Awaiting Response",
    conversation: [
      { id: "m1", sender: "Amina Bello", senderRole: "author", content: "We're a school library looking to order 200 copies of a title. Do you offer bulk discounts?", timestamp: "2026-06-13T11:30:00Z" },
      { id: "m2", sender: "Ngozi Eze", senderRole: "staff", content: "Hello Amina, thank you for your interest! Yes, we do offer bulk discounts for educational institutions. Could you share the specific title and format you're interested in?", timestamp: "2026-06-13T12:00:00Z" },
    ],
    internalNotes: [],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-13T11:30:00Z" },
      { status: "Awaiting Response", changedBy: "Ngozi Eze", timestamp: "2026-06-13T12:00:00Z" },
    ],
  },
  {
    id: "SR-1007",
    author: "Kwame Mensah",
    authorEmail: "kwame.m@email.com",
    category: "Publishing Support",
    title: "Request to update ISBN for upcoming release",
    description: "I need to change the ISBN assigned to my upcoming book before it goes to print next week.",
    priority: "Urgent",
    date: "2026-06-12T15:45:00Z",
    assignedStaff: "Blessing Okafor",
    status: "In Progress",
    conversation: [
      { id: "m1", sender: "Kwame Mensah", senderRole: "author", content: "I need to change the ISBN assigned to my upcoming book before it goes to print next week. Is this possible?", timestamp: "2026-06-12T15:45:00Z" },
      { id: "m2", sender: "Blessing Okafor", senderRole: "staff", content: "Hello Kwame, I understand the urgency. I'm checking with our production team to see if we can accommodate this change before the print deadline. I'll update you within a few hours.", timestamp: "2026-06-12T16:00:00Z" },
    ],
    internalNotes: ["Production team says we have until Thursday to make changes. Need to update ISBN in all systems."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-12T15:45:00Z" },
      { status: "In Progress", changedBy: "Blessing Okafor", timestamp: "2026-06-12T16:10:00Z" },
    ],
  },
  {
    id: "SR-1008",
    author: "Nneka Okoro",
    authorEmail: "nneka.o@email.com",
    category: "Service Orders",
    title: "Editing service turnaround time inquiry",
    description: "I purchased the premium editing package two weeks ago. When can I expect the first round of edits?",
    priority: "Medium",
    date: "2026-06-11T13:20:00Z",
    assignedStaff: "Emeka Adebayo",
    status: "Open",
    conversation: [
      { id: "m1", sender: "Nneka Okoro", senderRole: "author", content: "I purchased the premium editing package two weeks ago. When can I expect the first round of edits?", timestamp: "2026-06-11T13:20:00Z" },
    ],
    internalNotes: ["Premium package has a 3-week turnaround. Check with editing team on progress."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-11T13:20:00Z" },
    ],
  },
  {
    id: "SR-1009",
    author: "Tariq Hassan",
    authorEmail: "tariq.h@email.com",
    category: "Royalties & Payments",
    title: "Request for detailed sales breakdown by region",
    description: "Could you provide a detailed breakdown of sales by region for my title 'The Last Sunset'?",
    priority: "Low",
    date: "2026-06-10T09:15:00Z",
    assignedStaff: "Ngozi Eze",
    status: "Resolved",
    conversation: [
      { id: "m1", sender: "Tariq Hassan", senderRole: "author", content: "Could you provide a detailed breakdown of sales by region for my title 'The Last Sunset'?", timestamp: "2026-06-10T09:15:00Z" },
      { id: "m2", sender: "Ngozi Eze", senderRole: "staff", content: "Of course, Tariq! I've prepared the regional sales breakdown and attached it to your author dashboard. You can download it from the Reports section.", timestamp: "2026-06-10T10:30:00Z" },
      { id: "m3", sender: "Tariq Hassan", senderRole: "author", content: "Perfect, thank you for the quick turnaround!", timestamp: "2026-06-10T10:45:00Z" },
    ],
    internalNotes: ["Regional breakdown uploaded to author dashboard."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-10T09:15:00Z" },
      { status: "In Progress", changedBy: "Ngozi Eze", timestamp: "2026-06-10T09:30:00Z" },
      { status: "Resolved", changedBy: "Ngozi Eze", timestamp: "2026-06-10T10:30:00Z" },
    ],
  },
  {
    id: "SR-1010",
    author: "Yemi Osinbajo",
    authorEmail: "yemi.o@email.com",
    category: "Technical Support",
    title: "Ebook formatting broken on Kindle devices",
    description: "Readers are reporting that my ebook has broken formatting on Kindle Paperwhite. Chapters are merging together.",
    priority: "High",
    date: "2026-06-09T17:00:00Z",
    assignedStaff: "Emeka Adebayo",
    status: "In Progress",
    conversation: [
      { id: "m1", sender: "Yemi Osinbajo", senderRole: "author", content: "Readers are reporting that my ebook has broken formatting on Kindle Paperwhite. Chapters are merging together and images aren't displaying correctly.", timestamp: "2026-06-09T17:00:00Z" },
      { id: "m2", sender: "Emeka Adebayo", senderRole: "staff", content: "I'm sorry to hear about this, Yemi. I'll have our technical team look into the EPUB file and identify the formatting issues. We'll get a fix deployed as soon as possible.", timestamp: "2026-06-09T17:15:00Z" },
    ],
    internalNotes: ["EPUB validation shows some nested div issues. Team is working on a fix."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-09T17:00:00Z" },
      { status: "In Progress", changedBy: "Emeka Adebayo", timestamp: "2026-06-09T17:20:00Z" },
    ],
  },
  {
    id: "SR-1011",
    author: "Chidera Eze",
    authorEmail: "chidera.e@email.com",
    category: "Account Issues",
    title: "Update bank account details for royalty payments",
    description: "I recently changed banks and need to update my payment information before the next payout cycle.",
    priority: "Medium",
    date: "2026-06-08T10:00:00Z",
    assignedStaff: "Ngozi Eze",
    status: "Closed",
    conversation: [
      { id: "m1", sender: "Chidera Eze", senderRole: "author", content: "I recently changed banks and need to update my payment information before the next payout cycle.", timestamp: "2026-06-08T10:00:00Z" },
      { id: "m2", sender: "Ngozi Eze", senderRole: "staff", content: "I can help with that, Chidera. Please submit your new bank details through the secure form in your account settings, and I'll verify them on our end.", timestamp: "2026-06-08T10:15:00Z" },
      { id: "m3", sender: "Chidera Eze", senderRole: "author", content: "Done! I've submitted the new details.", timestamp: "2026-06-08T10:30:00Z" },
      { id: "m4", sender: "Ngozi Eze", senderRole: "staff", content: "Verified and approved. Your new bank details will be used for the next payout cycle. Thank you!", timestamp: "2026-06-08T10:45:00Z" },
    ],
    internalNotes: ["Bank details verified and updated in payment system."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-08T10:00:00Z" },
      { status: "In Progress", changedBy: "Ngozi Eze", timestamp: "2026-06-08T10:10:00Z" },
      { status: "Resolved", changedBy: "Ngozi Eze", timestamp: "2026-06-08T10:45:00Z" },
      { status: "Closed", changedBy: "System", timestamp: "2026-06-08T10:50:00Z" },
    ],
  },
  {
    id: "SR-1012",
    author: "Halima Yusuf",
    authorEmail: "halima.y@email.com",
    category: "Publishing Support",
    title: "Request to expedite print run for book launch event",
    description: "My book launch is in 10 days and I need the print run completed before then. Is expedited printing available?",
    priority: "Urgent",
    date: "2026-06-07T08:45:00Z",
    assignedStaff: "Blessing Okafor",
    status: "Open",
    conversation: [
      { id: "m1", sender: "Halima Yusuf", senderRole: "author", content: "My book launch is in 10 days and I need the print run completed before then. Is expedited printing available?", timestamp: "2026-06-07T08:45:00Z" },
    ],
    internalNotes: ["Check with print house if they can accommodate expedited timeline."],
    statusHistory: [
      { status: "Open", changedBy: "System", timestamp: "2026-06-07T08:45:00Z" },
    ],
  },
]

const categoryFilters = [
  { label: "All", value: "all", icon: Filter },
  { label: "Publishing Support", value: "Publishing Support", icon: FileText },
  { label: "Service Orders", value: "Service Orders", icon: Package },
  { label: "Royalties & Payments", value: "Royalties & Payments", icon: CreditCard },
  { label: "Account Issues", value: "Account Issues", icon: User },
  { label: "Technical Support", value: "Technical Support", icon: Wrench },
  { label: "General Enquiries", value: "General Enquiries", icon: HelpCircle },
]

const statusFilters = ["All", "Open", "Awaiting Response", "In Progress", "Resolved", "Closed"]

const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700 border-blue-200",
  "Awaiting Response": "bg-amber-100 text-amber-700 border-amber-200",
  "In Progress": "bg-purple-100 text-purple-700 border-purple-200",
  Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Closed: "bg-gray-100 text-gray-600 border-gray-200",
}

const priorityColors: Record<string, string> = {
  Low: "bg-gray-100 text-gray-600 border-gray-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
  High: "bg-amber-100 text-amber-700 border-amber-200",
  Urgent: "bg-red-100 text-red-700 border-red-200",
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function SupportPage() {
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeStatus, setActiveStatus] = useState("All")
  const [newNote, setNewNote] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const filteredRequests = supportRequests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || req.category === activeCategory
    const matchesStatus = activeStatus === "All" || req.status === activeStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const openDetail = (req: SupportRequest) => {
    setSelectedRequest(req)
    setDetailOpen(true)
  }

  const maxCategoryCount = Math.max(...categoryBars.map((c) => c.count))
  const maxMonthlyCount = Math.max(...monthlyVolume.map((m) => m.count))

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D] sm:text-3xl">
            Support Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all author enquiries, issues, and requests from a centralized dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <Button variant="outline" size="sm" className="border-[#E8DDD0]">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="border border-[#E8DDD0] rounded-xl bg-white">
              <CardContent className="p-4">
                <div className={`inline-flex rounded-lg p-2.5 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="mt-3 text-2xl font-bold text-[#1D1D1D]">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-[#E8DDD0] rounded-xl bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#1D1D1D]">
              Requests by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryBars.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{cat.label}</span>
                  <span className="font-medium text-[#1D1D1D]">{cat.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F2D8BE]/30">
                  <motion.div
                    className={`h-full rounded-full ${cat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[#E8DDD0] rounded-xl bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#1D1D1D]">
              Monthly Request Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyVolume.map((month) => (
              <div key={month.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{month.label}</span>
                  <span className="font-medium text-[#1D1D1D]">{month.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F2D8BE]/30">
                  <motion.div
                    className={`h-full rounded-full ${month.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(month.count / maxMonthlyCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Tabs + Search */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {categoryFilters.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeCategory === cat.value
                      ? "bg-[#8A6A4A] text-white"
                      : "bg-[#F2D8BE]/30 text-[#1D1D1D] hover:bg-[#F2D8BE]/50"
                  }`}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              placeholder="Search requests..."
              className="w-full pl-9 sm:w-[280px] border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeStatus === status
                    ? "bg-[#1D1D1D] text-white"
                    : "bg-[#F2D8BE]/20 text-[#1D1D1D]/70 hover:bg-[#F2D8BE]/40"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Support Requests Table */}
      <motion.div variants={itemVariants}>
        <Card className="border border-[#E8DDD0] rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F2D8BE]/30 border-[#E8DDD0]">
                  <TableHead className="text-xs font-semibold text-[#1D1D1D]">Request ID</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D]">Author</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D] hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D]">Issue Title</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D] hidden lg:table-cell">Priority</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D] hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D] hidden xl:table-cell">Assigned Staff</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D]">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-[#1D1D1D] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req, i) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-[#F2D8BE]/10 border-[#E8DDD0] cursor-pointer"
                    onClick={() => openDetail(req)}
                  >
                    <TableCell className="font-mono text-xs font-medium text-[#8A6A4A]">
                      {req.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-[#F2D8BE] text-[#8A6A4A] text-[10px] font-semibold">
                            {getInitials(req.author)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-[#1D1D1D] whitespace-nowrap">
                          {req.author}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="border-[#E8DDD0] text-[#8A6A4A] text-[10px]">
                        {req.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <span className="text-sm text-[#1D1D1D] line-clamp-1">
                        {req.title}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${priorityColors[req.priority]}`}
                      >
                        {req.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(req.date, "relative")}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-[#1D1D1D] whitespace-nowrap">
                      {req.assignedStaff}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${statusColors[req.status]}`}
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[#8A6A4A] hover:text-[#8A6A4A]/80 hover:bg-[#F2D8BE]/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDetail(req)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 border border-[#E8DDD0] bg-white">
          {selectedRequest && (
            <>
              {/* Dialog Header */}
              <div className="px-6 pt-6 pb-4 border-b border-[#E8DDD0]">
                <DialogHeader className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-[#8A6A4A]">
                      {selectedRequest.id}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${statusColors[selectedRequest.status]}`}
                    >
                      {selectedRequest.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${priorityColors[selectedRequest.priority]}`}
                    >
                      {selectedRequest.priority}
                    </Badge>
                    <Badge variant="outline" className="border-[#E8DDD0] text-[#8A6A4A] text-[10px]">
                      {selectedRequest.category}
                    </Badge>
                  </div>
                  <DialogTitle className="text-base font-semibold text-[#1D1D1D]">
                    {selectedRequest.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {selectedRequest.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Author Info Card */}
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#F2D8BE]/20 p-3 border border-[#E8DDD0]">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#F2D8BE] text-[#8A6A4A] text-xs font-semibold">
                      {getInitials(selectedRequest.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1D1D1D]">{selectedRequest.author}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedRequest.authorEmail}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Assigned to</p>
                    <p className="font-medium text-[#1D1D1D]">{selectedRequest.assignedStaff}</p>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              <ScrollArea className="flex-1 px-6 py-4 max-h-[320px]">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[#1D1D1D] uppercase tracking-wide">
                    Conversation
                  </h4>
                  {selectedRequest.conversation.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback
                          className={`text-[10px] font-semibold ${
                            msg.senderRole === "author"
                              ? "bg-[#F2D8BE] text-[#8A6A4A]"
                              : msg.senderRole === "staff"
                              ? "bg-[#8A6A4A] text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {msg.senderRole === "system" ? (
                            <Settings className="h-3.5 w-3.5" />
                          ) : (
                            getInitials(msg.sender)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#1D1D1D]">
                            {msg.sender}
                          </span>
                          {msg.senderRole === "staff" && (
                            <span className="rounded bg-[#8A6A4A]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#8A6A4A]">
                              Staff
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(msg.timestamp, "relative")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#1D1D1D]/80 leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-[#E8DDD0]" />

                {/* Internal Notes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-[#1D1D1D] uppercase tracking-wide flex items-center gap-1.5">
                    <StickyNote className="h-3.5 w-3.5 text-[#8A6A4A]" />
                    Internal Notes
                  </h4>
                  {selectedRequest.internalNotes.length > 0 ? (
                    selectedRequest.internalNotes.map((note, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-amber-50 border border-amber-200 p-3"
                      >
                        <p className="text-sm text-[#1D1D1D]/80">{note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No internal notes yet.</p>
                  )}
                </div>

                <Separator className="my-4 bg-[#E8DDD0]" />

                {/* Status History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-[#1D1D1D] uppercase tracking-wide">
                    Status History
                  </h4>
                  <div className="space-y-2">
                    {selectedRequest.statusHistory.map((entry, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <div className="h-2 w-2 rounded-full bg-[#8A6A4A] shrink-0" />
                        <span className="text-[#1D1D1D] font-medium">{entry.status}</span>
                        <span className="text-muted-foreground">by {entry.changedBy}</span>
                        <span className="text-muted-foreground ml-auto">
                          {formatDate(entry.timestamp, "relative")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* Footer: Actions + Message Input */}
              <div className="border-t border-[#E8DDD0] px-6 py-4 space-y-3">
                {/* Quick Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#E8DDD0] text-xs h-8"
                    onClick={() => setDetailOpen(false)}
                  >
                    <User className="h-3.5 w-3.5 mr-1" />
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs h-8"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Mark Resolved
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 text-xs h-8"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Close Request
                  </Button>
                </div>

                {/* Reply Input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a reply..."
                    className="flex-1 border-[#E8DDD0] text-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="bg-[#8A6A4A] hover:bg-[#8A6A4A]/90 text-white h-9 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
