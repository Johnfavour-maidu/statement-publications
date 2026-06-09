"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  UserCheck,
  Shield,
  BookOpen,
  CheckCircle2,
  Ban,
  Eye,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

type UserFilter = "all" | "AUTHOR" | "READER" | "EDITOR" | "ADMIN";

interface User {
  id: string;
  name: string;
  email: string;
  role: "AUTHOR" | "READER" | "EDITOR" | "ADMIN";
  status: "active" | "suspended";
  isVerified: boolean;
  joinedDate: string;
  avatarColor: string;
  booksCount?: number;
  totalSpent?: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Amara Okafor",
    email: "amara@example.com",
    role: "AUTHOR",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    avatarColor: "bg-blue-500",
    booksCount: 8,
  },
  {
    id: "2",
    name: "David Mensah",
    email: "david@example.com",
    role: "AUTHOR",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 45).toISOString(),
    avatarColor: "bg-emerald-500",
    booksCount: 5,
  },
  {
    id: "3",
    name: "Chioma Eze",
    email: "chioma@example.com",
    role: "READER",
    status: "active",
    isVerified: false,
    joinedDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    avatarColor: "bg-violet-500",
    totalSpent: 245.99,
  },
  {
    id: "4",
    name: "Fatima Al-Rashid",
    email: "fatima@example.com",
    role: "AUTHOR",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    avatarColor: "bg-amber-500",
    booksCount: 12,
  },
  {
    id: "5",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "READER",
    status: "suspended",
    isVerified: false,
    joinedDate: new Date(Date.now() - 86400000 * 90).toISOString(),
    avatarColor: "bg-rose-500",
    totalSpent: 89.99,
  },
  {
    id: "6",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "EDITOR",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 120).toISOString(),
    avatarColor: "bg-cyan-500",
  },
  {
    id: "7",
    name: "Nadia El-Amin",
    email: "nadia@example.com",
    role: "AUTHOR",
    status: "active",
    isVerified: false,
    joinedDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    avatarColor: "bg-pink-500",
    booksCount: 3,
  },
  {
    id: "8",
    name: "James Wilson",
    email: "james@example.com",
    role: "READER",
    status: "active",
    isVerified: false,
    joinedDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    avatarColor: "bg-indigo-500",
    totalSpent: 156.50,
  },
  {
    id: "9",
    name: "Admin User",
    email: "admin@statementpub.com",
    role: "ADMIN",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 365).toISOString(),
    avatarColor: "bg-slate-700",
  },
  {
    id: "10",
    name: "Emeka Nwachukwu",
    email: "emeka@example.com",
    role: "AUTHOR",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 75).toISOString(),
    avatarColor: "bg-teal-500",
    booksCount: 7,
  },
  {
    id: "11",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    role: "READER",
    status: "active",
    isVerified: false,
    joinedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    avatarColor: "bg-orange-500",
    totalSpent: 34.99,
  },
  {
    id: "12",
    name: "Tariq Hassan",
    email: "tariq@example.com",
    role: "AUTHOR",
    status: "active",
    isVerified: true,
    joinedDate: new Date(Date.now() - 86400000 * 100).toISOString(),
    avatarColor: "bg-lime-500",
    booksCount: 9,
  },
];

const roleConfig: Record<string, { label: string; color: string }> = {
  AUTHOR: { label: "Author", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  READER: { label: "Reader", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  EDITOR: { label: "Editor", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ADMIN: { label: "Admin", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminUsersPage() {
  const [filter, setFilter] = useState<UserFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesFilter = filter === "all" || user.role === filter;
    const matchesSearch =
      search === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: mockUsers.length,
    AUTHOR: mockUsers.filter((u) => u.role === "AUTHOR").length,
    READER: mockUsers.filter((u) => u.role === "READER").length,
    EDITOR: mockUsers.filter((u) => u.role === "EDITOR").length,
    ADMIN: mockUsers.filter((u) => u.role === "ADMIN").length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, authors, and their permissions.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as UserFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="AUTHOR">
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              Authors ({counts.AUTHOR})
            </TabsTrigger>
            <TabsTrigger value="READER">
              <Users className="mr-1 h-3.5 w-3.5" />
              Readers ({counts.READER})
            </TabsTrigger>
            <TabsTrigger value="EDITOR">
              <Shield className="mr-1 h-3.5 w-3.5" />
              Editors ({counts.EDITOR})
            </TabsTrigger>
            <TabsTrigger value="ADMIN">
              <Shield className="mr-1 h-3.5 w-3.5" />
              Admins ({counts.ADMIN})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <p className="mt-4 text-lg font-medium">No users found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className={`${user.avatarColor} text-white text-xs font-medium`}>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={roleConfig[user.role].color}
                            >
                              {roleConfig[user.role].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "active" ? "default" : "destructive"}
                            >
                              {user.status === "active" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <Ban className="mr-1 h-3 w-3" />
                              )}
                              {user.status === "active" ? "Active" : "Suspended"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.isVerified ? (
                              <Badge variant="default" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <UserCheck className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(user.joinedDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {user.role === "AUTHOR" && !user.isVerified && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setVerifyDialogOpen(true);
                                  }}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 ${
                                  user.status === "active"
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                }`}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSuspendDialogOpen(true);
                                }}
                              >
                                {user.status === "active" ? (
                                  <Ban className="h-4 w-4" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Author</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify {selectedUser?.name} as an author? This will give them author privileges on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setVerifyDialogOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <UserCheck className="mr-1 h-4 w-4" />
              Verify Author
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === "active" ? "Suspend User" : "Activate User"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === "active"
                ? `Are you sure you want to suspend ${selectedUser?.name}? They will lose access to the platform.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the platform.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.status === "active" ? "destructive" : "default"}
              onClick={() => setSuspendDialogOpen(false)}
            >
              {selectedUser?.status === "active" ? (
                <>
                  <Ban className="mr-1 h-4 w-4" />
                  Suspend
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
