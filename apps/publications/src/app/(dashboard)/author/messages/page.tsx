"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  Archive,
  Search,
  Plus,
  Reply,
  ArrowLeft,
  User,
  Clock,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDate, getInitials } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  content: string;
  time: string;
  isRead: boolean;
  isArchived: boolean;
  replies: MessageReply[];
}

interface MessageReply {
  id: string;
  sender: string;
  content: string;
  time: string;
}

const defaultMessages: Message[] = [
  {
    id: "1",
    sender: "Statement Publishing",
    senderEmail: "support@statementpub.com",
    subject: "Your Book Has Been Approved",
    preview: "Congratulations! Your book 'The Last Horizon' has been approved...",
    content: "Congratulations!\n\nWe are pleased to inform you that your book 'The Last Horizon' has been reviewed and approved for publication on our platform.\n\nYour book will be available for purchase within 24 hours. You can track its performance in your analytics dashboard.\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\nThe Statement Publishing Team",
    time: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    isArchived: false,
    replies: [],
  },
  {
    id: "2",
    sender: "Adaeze Nwosu",
    senderEmail: "adaeze@statementpub.com",
    subject: "Re: Royalty Payment Inquiry",
    preview: "Thank you for your inquiry regarding your royalty payment...",
    content: "Hello,\n\nThank you for your inquiry regarding your royalty payment for May 2026.\n\nYour payment of $342.50 has been processed and will be reflected in your account within 3-5 business days.\n\nPlease let us know if you have any further questions.\n\nBest regards,\nAdaeze Nwosu",
    time: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
    isArchived: false,
    replies: [
      {
        id: "r1",
        sender: "Statement Support",
        content: "Hi Adaeze, could you provide more details about which payment you're referring to?",
        time: new Date(Date.now() - 10800000).toISOString(),
      },
    ],
  },
  {
    id: "3",
    sender: "System Notification",
    senderEmail: "noreply@statementpub.com",
    subject: "Monthly Analytics Report Available",
    preview: "Your monthly analytics report for May 2026 is now available...",
    content: "Hello Adaeze,\n\nYour monthly analytics report for May 2026 is now available in your dashboard.\n\nKey Highlights:\n- Total Views: 24,589 (+12.3%)\n- Total Downloads: 3,847 (+8.7%)\n- Revenue: $1,245.90 (+15.2%)\n\nYou can view the full report in your analytics dashboard.\n\nBest regards,\nThe Statement Publishing Team",
    time: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isArchived: false,
    replies: [],
  },
  {
    id: "4",
    sender: "David Okonkwo",
    senderEmail: "david@readersclub.ng",
    subject: "Partnership Opportunity",
    preview: "Hi Adaeze, I run a book club in Lagos with over 500 members...",
    content: "Hi Adaeze,\n\nI hope this message finds you well. My name is David Okonkwo, and I run a book club in Lagos with over 500 active members.\n\nWe would love to feature 'The Last Horizon' as our book of the month for June. Would you be interested in a virtual author session with our members?\n\nWe can offer:\n- Featured placement in our newsletter\n- Virtual Q&A session with members\n- Social media promotion\n\nLooking forward to hearing from you.\n\nBest regards,\nDavid Okonkwo\nLagos Readers Club",
    time: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
    isArchived: false,
    replies: [],
  },
  {
    id: "5",
    sender: "Statement Publishing",
    senderEmail: "updates@statementpub.com",
    subject: "Platform Update: New Features",
    preview: "We've just rolled out new features to enhance your publishing...",
    content: "Hello Adaeze,\n\nWe're excited to announce new features on the Statement Publishing platform:\n\n1. Enhanced Analytics Dashboard\n2. Improved Book Management Tools\n3. New Reader Engagement Features\n4. Streamlined Royalty Payments\n\nThese features are now live and available in your dashboard.\n\nBest regards,\nThe Statement Publishing Team",
    time: new Date(Date.now() - 345600000).toISOString(),
    isRead: true,
    isArchived: true,
    replies: [],
  },
  {
    id: "6",
    sender: "Chioma Eze",
    senderEmail: "chioma@bookreview.ng",
    subject: "Review Request: The Last Horizon",
    preview: "Hello Adaeze, I'm a book reviewer based in Abuja...",
    content: "Hello Adaeze,\n\nI'm Chioma Eze, a book reviewer based in Abuja with a following of 10,000+ readers on social media.\n\nI would love to review 'The Last Horizon' on my platform. Could you provide me with a review copy?\n\nMy platforms:\n- Blog: bookreview.ng\n- Instagram: @chioma.reads\n- Twitter: @chioma_bookworm\n\nThank you for your consideration.\n\nBest regards,\nChioma Eze",
    time: new Date(Date.now() - 432000000).toISOString(),
    isRead: true,
    isArchived: false,
    replies: [],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/author/messages");
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
            setMessages(defaultMessages);
          }
        } else {
          setMessages(defaultMessages);
        }
      } catch {
        setMessages(defaultMessages);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    if (activeTab === "unread") return !msg.isRead;
    if (activeTab === "archived") return msg.isArchived;
    return !msg.isArchived;
  }).filter((msg) => {
    if (!searchQuery) return true;
    return (
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const unreadCount = messages.filter((m) => !m.isRead && !m.isArchived).length;

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyContent.trim()) return;
    const newReply: MessageReply = {
      id: `r-${Date.now()}`,
      sender: "Adaeze Nwosu",
      content: replyContent,
      time: new Date().toISOString(),
    };
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, replies: [...m.replies, newReply] }
          : m
      )
    );
    setSelectedMessage((prev) =>
      prev ? { ...prev, replies: [...prev.replies, newReply] } : null
    );
    setReplyContent("");
  };

  const handleMarkAllRead = () => {
    setMessages((prev) =>
      prev.map((m) => ({ ...m, isRead: true }))
    );
  };

  const handleArchiveMessage = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isArchived: true } : m))
    );
    if (selectedMessage?.id === msgId) {
      setSelectedMessage(null);
    }
  };

  const handleSendCompose = () => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Adaeze Nwosu",
      senderEmail: "adaeze@statementpub.com",
      subject: composeForm.subject,
      preview: composeForm.content.slice(0, 60) + "...",
      content: composeForm.content,
      time: new Date().toISOString(),
      isRead: true,
      isArchived: false,
      replies: [],
    };
    setMessages((prev) => [newMessage, ...prev]);
    setComposeOpen(false);
    setComposeForm({ to: "", subject: "", content: "" });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with readers, publishers, and the platform team.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
          <Button
            className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
            onClick={() => setComposeOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <div className="grid h-[600px] lg:grid-cols-[380px_1fr]">
            <div className="flex flex-col border-r">
              <div className="border-b p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All ({messages.filter((m) => !m.isArchived).length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1">
                      Unread ({unreadCount})
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="flex-1">
                      Archived ({messages.filter((m) => m.isArchived).length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Mail className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`flex w-full gap-3 border-b p-4 text-left transition-colors hover:bg-muted/50 ${
                        selectedMessage?.id === msg.id ? "bg-muted/50" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-[#D8B27A]/10 text-[#D8B27A] text-xs font-semibold">
                          {getInitials(msg.sender)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${!msg.isRead ? "font-semibold" : "font-medium"}`}>
                            {msg.sender}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatDate(msg.time, "relative")}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${!msg.isRead ? "font-medium" : "text-muted-foreground"}`}>
                          {msg.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {msg.preview}
                        </p>
                      </div>
                      {!msg.isRead && (
                        <Circle className="mt-1 h-2 w-2 shrink-0 fill-[#D8B27A] text-[#D8B27A]" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col">
              {selectedMessage ? (
                <>
                  <div className="flex items-center gap-3 border-b p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedMessage(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#D8B27A]/10 text-[#D8B27A] text-xs font-semibold">
                        {getInitials(selectedMessage.sender)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedMessage.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        From: {selectedMessage.sender} &lt;{selectedMessage.senderEmail}&gt;
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveMessage(selectedMessage.id)}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Clock className="h-3 w-3" />
                          {formatDate(selectedMessage.time, "long")}
                        </div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedMessage.content}
                        </div>
                      </div>

                      {selectedMessage.replies.map((reply) => (
                        <div key={reply.id} className="rounded-lg border border-[#D8B27A]/20 bg-[#D8B27A]/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-[#D8B27A]/20 text-[#D8B27A] text-[10px] font-semibold">
                                {getInitials(reply.sender)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{reply.sender}</span>
                            <span className="text-xs text-muted-foreground">
                              &middot; {formatDate(reply.time, "relative")}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t p-4">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        className="shrink-0 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] self-end"
                        onClick={handleSendReply}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <Mail className="h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">
                    Select a message to read
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Choose from the list on the left
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Compose a new message to the platform team or a reader.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="compose-to">To</Label>
              <Input
                id="compose-to"
                placeholder="recipient@email.com"
                value={composeForm.to}
                onChange={(e) =>
                  setComposeForm({ ...composeForm, to: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compose-subject">Subject</Label>
              <Input
                id="compose-subject"
                placeholder="Message subject"
                value={composeForm.subject}
                onChange={(e) =>
                  setComposeForm({ ...composeForm, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compose-content">Message</Label>
              <Textarea
                id="compose-content"
                placeholder="Write your message..."
                className="min-h-[160px]"
                value={composeForm.content}
                onChange={(e) =>
                  setComposeForm({ ...composeForm, content: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
              onClick={handleSendCompose}
              disabled={!composeForm.to || !composeForm.subject || !composeForm.content}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
