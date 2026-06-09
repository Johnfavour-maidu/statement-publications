"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

const mockUser = {
  name: "John Admin",
  email: "admin@statementpub.com",
  image: null,
  role: "ADMIN" as const,
};

const mockNotifications = [
  {
    id: "1",
    title: "New Book Submission",
    message: "Amara Okafor submitted 'The Silent Echo' for review.",
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "2",
    title: "Withdrawal Request",
    message: "David Mensah requested a withdrawal of $245.00.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "New Author Registration",
    message: "Nadia El-Amin registered as a new author.",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "4",
    title: "Payout Processed",
    message: "Monthly payouts totaling $4,320.00 have been processed.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function AdminDashboardLayout({
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
