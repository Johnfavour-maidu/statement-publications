"use client";

import { motion } from "framer-motion";
import { Shield, Users, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Permission {
  name: string;
  granted: boolean;
}

interface Role {
  name: string;
  description: string;
  icon: React.ReactNode;
  permissions: Permission[];
  color: string;
}

const roles: Role[] = [
  {
    name: "Super Admin",
    description: "Full access to all platform features and settings",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-red-100 text-red-800 border-red-200",
    permissions: [
      { name: "Manage Users", granted: true },
      { name: "Manage Books", granted: true },
      { name: "Approve Publications", granted: true },
      { name: "Manage Payments", granted: true },
      { name: "Manage Content", granted: true },
      { name: "Manage Blog", granted: true },
      { name: "Manage Settings", granted: true },
      { name: "View Analytics", granted: true },
      { name: "Manage Roles", granted: true },
      { name: "Manage Support", granted: true },
    ],
  },
  {
    name: "Admin",
    description: "Manage authors, books, content, and platform operations",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    permissions: [
      { name: "Manage Users", granted: true },
      { name: "Manage Books", granted: true },
      { name: "Approve Publications", granted: true },
      { name: "Manage Payments", granted: false },
      { name: "Manage Content", granted: true },
      { name: "Manage Blog", granted: true },
      { name: "Manage Settings", granted: true },
      { name: "View Analytics", granted: true },
      { name: "Manage Roles", granted: false },
      { name: "Manage Support", granted: true },
    ],
  },
  {
    name: "Publishing Manager",
    description: "Review and approve book submissions",
    icon: <Users className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    permissions: [
      { name: "Manage Users", granted: false },
      { name: "Manage Books", granted: true },
      { name: "Approve Publications", granted: true },
      { name: "Manage Payments", granted: false },
      { name: "Manage Content", granted: false },
      { name: "Manage Blog", granted: false },
      { name: "Manage Settings", granted: false },
      { name: "View Analytics", granted: true },
      { name: "Manage Roles", granted: false },
      { name: "Manage Support", granted: false },
    ],
  },
  {
    name: "Editor",
    description: "Edit and manage blog content and website copy",
    icon: <Users className="h-5 w-5" />,
    color: "bg-green-100 text-green-800 border-green-200",
    permissions: [
      { name: "Manage Users", granted: false },
      { name: "Manage Books", granted: false },
      { name: "Approve Publications", granted: false },
      { name: "Manage Payments", granted: false },
      { name: "Manage Content", granted: true },
      { name: "Manage Blog", granted: true },
      { name: "Manage Settings", granted: false },
      { name: "View Analytics", granted: true },
      { name: "Manage Roles", granted: false },
      { name: "Manage Support", granted: false },
    ],
  },
  {
    name: "Finance Officer",
    description: "Manage payments, royalties, and withdrawals",
    icon: <Users className="h-5 w-5" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    permissions: [
      { name: "Manage Users", granted: false },
      { name: "Manage Books", granted: false },
      { name: "Approve Publications", granted: false },
      { name: "Manage Payments", granted: true },
      { name: "Manage Content", granted: false },
      { name: "Manage Blog", granted: false },
      { name: "Manage Settings", granted: false },
      { name: "View Analytics", granted: true },
      { name: "Manage Roles", granted: false },
      { name: "Manage Support", granted: false },
    ],
  },
  {
    name: "Marketing Manager",
    description: "Manage campaigns, newsletters, and promotions",
    icon: <Users className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    permissions: [
      { name: "Manage Users", granted: false },
      { name: "Manage Books", granted: false },
      { name: "Approve Publications", granted: false },
      { name: "Manage Payments", granted: false },
      { name: "Manage Content", granted: true },
      { name: "Manage Blog", granted: true },
      { name: "Manage Settings", granted: false },
      { name: "View Analytics", granted: true },
      { name: "Manage Roles", granted: false },
      { name: "Manage Support", granted: false },
    ],
  },
  {
    name: "Customer Support",
    description: "Handle support requests and author inquiries",
    icon: <Users className="h-5 w-5" />,
    color: "bg-teal-100 text-teal-800 border-teal-200",
    permissions: [
      { name: "Manage Users", granted: false },
      { name: "Manage Books", granted: false },
      { name: "Approve Publications", granted: false },
      { name: "Manage Payments", granted: false },
      { name: "Manage Content", granted: false },
      { name: "Manage Blog", granted: false },
      { name: "Manage Settings", granted: false },
      { name: "View Analytics", granted: false },
      { name: "Manage Roles", granted: false },
      { name: "Manage Support", granted: true },
    ],
  },
];

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-2 text-gray-600">
            View the role structure and permissions for your platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge className={role.color}>{role.icon}</Badge>
                      {role.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </h4>
                    <ul className="space-y-2">
                      {role.permissions.map((permission) => (
                        <li
                          key={permission.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">{permission.name}</span>
                          {permission.granted ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <Button disabled>
            Edit Roles & Permissions
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Role management coming soon
          </p>
        </motion.div>
      </div>
    </div>
  );
}
