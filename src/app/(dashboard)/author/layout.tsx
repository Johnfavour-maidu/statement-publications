"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

const mockUser = {
  name: "Adaeze Nwosu",
  email: "adaeze@statementpub.com",
  image: null,
  role: "AUTHOR" as const,
};

const mockNotifications = [
  {
    id: "1",
    title: "Book Approved",
    message: "Your book 'The Last Horizon' has been approved for publication.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "New Sale",
    message: "You earned $12.99 from a sale of 'Echoes of Tomorrow'.",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    title: "Royalty Paid",
    message: "Your monthly royalty of $342.50 has been processed.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function AuthorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout user={mockUser} notifications={mockNotifications}>
      {children}
    </DashboardLayout>
  );
}
