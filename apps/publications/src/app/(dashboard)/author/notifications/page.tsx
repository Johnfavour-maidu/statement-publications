"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  XCircle,
  DollarSign,
  Info,
  MessageSquare,
  CheckCheck,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: "book_approved" | "book_rejected" | "payment" | "service_update" | "message";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  book_approved: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "border-l-emerald-500",
  },
  book_rejected: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-l-red-500",
  },
  payment: {
    icon: DollarSign,
    color: "text-[#D8B27A]",
    bg: "bg-[#D8B27A]/10",
    border: "border-l-[#D8B27A]",
  },
  service_update: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-l-blue-500",
  },
  message: {
    icon: MessageSquare,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-l-gray-400",
  },
};

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "book_approved",
    title: "Book Approved",
    description: "Your book 'The Last Horizon' has been approved and is now live on the platform.",
    time: new Date(Date.now() - 1800000).toISOString(),
    isRead: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "You received a payment of $12.99 from the sale of 'The Last Horizon'.",
    time: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
  },
  {
    id: "3",
    type: "message",
    title: "New Message from Support",
    description: "You have a new message from the support team regarding your royalty inquiry.",
    time: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
  },
  {
    id: "4",
    type: "book_rejected",
    title: "Book Rejected",
    description: "Your book 'Fractured Dreams' was not approved. Please review the feedback and resubmit.",
    time: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  },
  {
    id: "5",
    type: "payment",
    title: "Royalty Payment Processed",
    description: "Your monthly royalty of $342.50 for May 2026 has been processed and will be deposited within 3-5 business days.",
    time: new Date(Date.now() - 86400000 * 2).toISOString(),
    isRead: true,
  },
  {
    id: "6",
    type: "service_update",
    title: "Platform Maintenance Scheduled",
    description: "Scheduled maintenance on June 15, 2026 from 2:00 AM to 4:00 AM UTC. The platform may be temporarily unavailable.",
    time: new Date(Date.now() - 86400000 * 3).toISOString(),
    isRead: true,
  },
  {
    id: "7",
    type: "book_approved",
    title: "Book Approved",
    description: "Your book 'Echoes of Tomorrow' has been approved and is now available for purchase.",
    time: new Date(Date.now() - 86400000 * 4).toISOString(),
    isRead: true,
  },
  {
    id: "8",
    type: "payment",
    title: "Payment Received",
    description: "You received a payment of $15.99 from the sale of 'Echoes of Tomorrow'.",
    time: new Date(Date.now() - 86400000 * 5).toISOString(),
    isRead: true,
  },
  {
    id: "9",
    type: "service_update",
    title: "New Analytics Features Available",
    description: "We've added new analytics features to help you track your book performance. Check out your dashboard!",
    time: new Date(Date.now() - 86400000 * 6).toISOString(),
    isRead: true,
  },
  {
    id: "10",
    type: "book_approved",
    title: "Book Approved",
    description: "Your book 'Whispers in the Dark' has been approved and is now live on the platform.",
    time: new Date(Date.now() - 86400000 * 7).toISOString(),
    isRead: true,
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

export default function AuthorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/author/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length > 0) {
            setNotifications(data.notifications);
          } else {
            setNotifications(defaultNotifications);
          }
        } else {
          setNotifications(defaultNotifications);
        }
      } catch {
        setNotifications(defaultNotifications);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on your book activity and platform changes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-4 pt-4">
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex items-center gap-2">
                    Unread
                    {unreadCount > 0 && (
                      <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-[#D8B27A] text-[#1D1D1D]">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="m-0">
                <NotificationList
                  notifications={filteredNotifications}
                  onMarkRead={handleMarkRead}
                />
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <NotificationList
                  notifications={filteredNotifications}
                  onMarkRead={handleMarkRead}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function NotificationList({
  notifications,
  onMarkRead,
}: {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Bell className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notif) => {
        const config = typeConfig[notif.type];
        const Icon = config.icon;

        return (
          <button
            key={notif.id}
            onClick={() => onMarkRead(notif.id)}
            className={`flex w-full gap-4 p-4 text-left transition-colors hover:bg-muted/30 ${
              !notif.isRead ? `border-l-4 ${config.border} bg-muted/10` : "border-l-4 border-l-transparent"
            }`}
          >
            <div className={`shrink-0 rounded-lg p-2 ${config.bg}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm ${!notif.isRead ? "font-semibold" : "font-medium"}`}>
                  {notif.title}
                </p>
                {!notif.isRead && (
                  <div className="h-2 w-2 rounded-full bg-[#D8B27A]" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {notif.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(notif.time, "relative")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
