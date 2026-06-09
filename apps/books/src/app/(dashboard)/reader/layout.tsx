"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

const mockUser = {
  name: "Chioma Eze",
  email: "chioma@statementpub.com",
  image: null,
  role: "READER" as const,
};

const mockNotifications = [
  {
    id: "1",
    title: "Book Available",
    message: "The book 'Midnight Echoes' you wishlisted is now available.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Reading Goal",
    message: "You're 80% to your monthly reading goal. Keep going!",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    title: "Order Confirmed",
    message: "Your order #STMT-2601-KX9M has been confirmed.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function ReaderDashboardLayout({
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
