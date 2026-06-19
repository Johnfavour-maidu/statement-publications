"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface TicketMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
  isStaff: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

const defaultTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Royalty payment not received for May 2026",
    category: "Royalties",
    priority: "High",
    status: "In Progress",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: "m1",
        sender: "Adaeze Nwosu",
        content: "I haven't received my royalty payment for May 2026 yet. It was supposed to be processed by June 5th. Could you please look into this?",
        time: new Date(Date.now() - 86400000 * 3).toISOString(),
        isStaff: false,
      },
      {
        id: "m2",
        sender: "Support Team",
        content: "Hello Adaeze, thank you for reaching out. We've checked your account and can see that the payment was initiated but there was a delay in processing. The payment should reflect in your account within 24 hours. We apologize for the inconvenience.",
        time: new Date(Date.now() - 86400000 * 2).toISOString(),
        isStaff: true,
      },
      {
        id: "m3",
        sender: "Adaeze Nwosu",
        content: "Thank you for the update. I'll check my account. If it doesn't reflect by tomorrow, I'll follow up again.",
        time: new Date(Date.now() - 86400000).toISOString(),
        isStaff: false,
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Unable to upload book cover image",
    category: "Technical Issues",
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      {
        id: "m4",
        sender: "Adaeze Nwosu",
        content: "I'm trying to upload a cover image for my new book but keep getting an error message saying 'File format not supported'. I've tried both JPG and PNG formats. The file size is under 5MB.",
        time: new Date(Date.now() - 86400000 * 2).toISOString(),
        isStaff: false,
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "How to set up pre-orders",
    category: "Publishing",
    priority: "Low",
    status: "Resolved",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    messages: [
      {
        id: "m5",
        sender: "Adaeze Nwosu",
        content: "Hi, I'd like to set up a pre-order for my upcoming book. How do I do that on the platform?",
        time: new Date(Date.now() - 86400000 * 7).toISOString(),
        isStaff: false,
      },
      {
        id: "m6",
        sender: "Support Team",
        content: "Hello Adaeze! To set up a pre-order:\n\n1. Go to your Books dashboard\n2. Click 'Upload New Book'\n3. Fill in the book details\n4. Set a future publication date\n5. Enable the 'Pre-order' option\n6. Set your pre-order price\n\nThe book will automatically become available for purchase on the publication date. Let me know if you need further assistance!",
        time: new Date(Date.now() - 86400000 * 6).toISOString(),
        isStaff: true,
      },
      {
        id: "m7",
        sender: "Adaeze Nwosu",
        content: "Perfect, that worked! Thank you so much for the detailed instructions.",
        time: new Date(Date.now() - 86400000 * 5).toISOString(),
        isStaff: false,
      },
    ],
  },
  {
    id: "TKT-004",
    subject: "Account verification stuck",
    category: "Account Issues",
    priority: "Urgent",
    status: "In Progress",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    messages: [
      {
        id: "m8",
        sender: "Adaeze Nwosu",
        content: "My account verification has been stuck on 'Pending Review' for over a week now. I submitted my documents on time. This is preventing me from receiving payments. Please help!",
        time: new Date(Date.now() - 86400000).toISOString(),
        isStaff: false,
      },
      {
        id: "m9",
        sender: "Support Team",
        content: "Hello Adaeze, we sincerely apologize for the delay. We're escalating this to our verification team for immediate review. You should receive an update within 24 hours. In the meantime, your earnings are being tracked and will be released once verification is complete.",
        time: new Date(Date.now() - 3600000 * 6).toISOString(),
        isStaff: true,
      },
    ],
  },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Open: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: AlertCircle },
  "In Progress": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", icon: Clock },
  Resolved: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: CheckCircle2 },
  Closed: { color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-900/30", icon: XCircle },
};

const priorityConfig: Record<string, string> = {
  Low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  High: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/author/support");
        if (res.ok) {
          const data = await res.json();
          if (data.tickets && data.tickets.length > 0) {
            setTickets(data.tickets);
          } else {
            setTickets(defaultTickets);
          }
        } else {
          setTickets(defaultTickets);
        }
      } catch {
        setTickets(defaultTickets);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleCreateTicket = () => {
    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "Adaeze Nwosu",
          content: newTicket.description,
          time: new Date().toISOString(),
          isStaff: false,
        },
      ],
    };
    setTickets((prev) => [ticket, ...prev]);
    setTicketDialogOpen(false);
    setNewTicket({ subject: "", category: "", priority: "", description: "" });
  };

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return;
    const msg: TicketMessage = {
      id: `m-${Date.now()}`,
      sender: "Adaeze Nwosu",
      content: newMessage,
      time: new Date().toISOString(),
      isStaff: false,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString() }
          : t
      )
    );
    setNewMessage("");
  };

  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground">
            Get help with publishing, royalties, and account issues.
          </p>
        </div>
        <Button
          className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
          onClick={() => setTicketDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Open Ticket
        </Button>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
              <div className="rounded-lg p-3 bg-[#D8B27A]/10">
                <LifeBuoy className="h-5 w-5 text-[#D8B27A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Open / In Progress</p>
                <p className="text-2xl font-bold">{openTickets}</p>
              </div>
              <div className="rounded-lg p-3 bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Resolved / Closed</p>
                <p className="text-2xl font-bold">{resolvedTickets}</p>
              </div>
              <div className="rounded-lg p-3 bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <LifeBuoy className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No support requests</p>
              <p className="text-sm text-muted-foreground">
                Create a ticket to get help from our support team.
              </p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => {
            const status = statusConfig[ticket.status];
            const isExpanded = expandedTicket === ticket.id;

            return (
              <Card key={ticket.id}>
                <button
                  onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/30"
                >
                  <div className={`rounded-lg p-2 ${status.bg}`}>
                    <status.icon className={`h-4 w-4 ${status.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                      <Badge className={priorityConfig[ticket.priority]}>{ticket.priority}</Badge>
                    </div>
                    <p className="font-medium truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{ticket.category}</span>
                      <span>&middot;</span>
                      <span>Created {formatDate(ticket.createdAt, "relative")}</span>
                      <span>&middot;</span>
                      <span>Updated {formatDate(ticket.updatedAt, "relative")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={ticket.status === "Resolved" ? "success" : ticket.status === "Closed" ? "secondary" : ticket.status === "In Progress" ? "warning" : "default"}>
                      {ticket.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.messages.length}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                      {ticket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`rounded-lg p-4 ${
                            msg.isStaff
                              ? "bg-[#D8B27A]/5 border border-[#D8B27A]/20 ml-8"
                              : "bg-muted/50 mr-8"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                msg.isStaff
                                  ? "bg-[#D8B27A]/20 text-[#D8B27A]"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {msg.isStaff ? "SUPPORT" : "YOU"}
                            </div>
                            <span className="text-xs font-medium">{msg.sender}</span>
                            <span className="text-xs text-muted-foreground">
                              &middot; {formatDate(msg.time, "relative")}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t p-4">
                      <div className="flex gap-3">
                        <Input
                          placeholder="Type your reply..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(ticket.id);
                            }
                          }}
                        />
                        <Button
                          className="shrink-0 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
                          onClick={() => handleSendMessage(ticket.id)}
                          disabled={!newMessage.trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </motion.div>

      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Open Support Request</DialogTitle>
            <DialogDescription>
              Describe your issue and we&apos;ll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input
                id="ticket-subject"
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, subject: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(val) =>
                    setNewTicket({ ...newTicket, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Publishing">Publishing</SelectItem>
                    <SelectItem value="Royalties">Royalties</SelectItem>
                    <SelectItem value="Technical Issues">Technical Issues</SelectItem>
                    <SelectItem value="Account Issues">Account Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(val) =>
                    setNewTicket({ ...newTicket, priority: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                placeholder="Provide detailed information about your issue..."
                className="min-h-[120px]"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
              onClick={handleCreateTicket}
              disabled={!newTicket.subject || !newTicket.category || !newTicket.priority || !newTicket.description}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
