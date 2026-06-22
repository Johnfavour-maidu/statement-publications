"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Check, X, Search, Plus, Lock, Clock, CheckCircle2,
  ChevronDown, ChevronUp, ChevronRight, BarChart3, RefreshCw, Eye, Zap,
  Download, SlidersHorizontal, FileText, Activity, Copy, Edit3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Permission {
  name: string;
  granted: boolean;
  description: string;
}

interface Role {
  name: string;
  description: string;
  users: number;
  permissionCount: number;
  lastUpdated: string;
  isCustom: boolean;
  color: string;
  iconColor: string;
  permissions: Permission[];
}

const TOTAL_PERMISSIONS = 18;

const ROLES: Role[] = [
  { name: "Super Admin", description: "Full access to all platform features and settings", users: 1, permissionCount: 18, lastUpdated: "2026-06-12", isCustom: false, color: "bg-red-100 text-red-800 border-red-200", iconColor: "text-red-600",
    permissions: [
      { name: "Manage Users", granted: true, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: true, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: true, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: true, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: true, description: "Create and edit website content" },
      { name: "Manage Blog", granted: true, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: true, description: "Configure platform settings" },
      { name: "View Analytics", granted: true, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: true, description: "Create and manage user roles" },
      { name: "Manage Support", granted: true, description: "Handle support requests" },
      { name: "Manage Marketing", granted: true, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: true, description: "Upload and manage media files" },
      { name: "Export Data", granted: true, description: "Export platform data" },
      { name: "Manage Categories", granted: true, description: "Create and manage book categories" },
      { name: "Manage Orders", granted: true, description: "Process and manage orders" },
      { name: "Manage Testimonials", granted: true, description: "Review and publish testimonials" },
      { name: "Manage Newsletters", granted: true, description: "Send newsletters to subscribers" },
      { name: "View Audit Log", granted: true, description: "View platform activity audit log" },
    ]
  },
  { name: "Admin", description: "Manage authors, books, content, and platform operations", users: 3, permissionCount: 14, lastUpdated: "2026-06-10", isCustom: false, color: "bg-orange-100 text-orange-800 border-orange-200", iconColor: "text-orange-600",
    permissions: [
      { name: "Manage Users", granted: true, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: true, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: true, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: false, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: true, description: "Create and edit website content" },
      { name: "Manage Blog", granted: true, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: true, description: "Configure platform settings" },
      { name: "View Analytics", granted: true, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: false, description: "Create and manage user roles" },
      { name: "Manage Support", granted: true, description: "Handle support requests" },
      { name: "Manage Marketing", granted: true, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: true, description: "Upload and manage media files" },
      { name: "Export Data", granted: true, description: "Export platform data" },
      { name: "Manage Categories", granted: true, description: "Create and manage book categories" },
    ]
  },
  { name: "Publishing Manager", description: "Review and approve book submissions", users: 4, permissionCount: 6, lastUpdated: "2026-06-08", isCustom: false, color: "bg-blue-100 text-blue-800 border-blue-200", iconColor: "text-blue-600",
    permissions: [
      { name: "Manage Users", granted: false, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: true, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: true, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: false, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: false, description: "Create and edit website content" },
      { name: "Manage Blog", granted: false, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: false, description: "Configure platform settings" },
      { name: "View Analytics", granted: true, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: false, description: "Create and manage user roles" },
      { name: "Manage Support", granted: false, description: "Handle support requests" },
      { name: "Manage Marketing", granted: false, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: true, description: "Upload and manage media files" },
      { name: "Export Data", granted: false, description: "Export platform data" },
      { name: "Manage Categories", granted: true, description: "Create and manage book categories" },
    ]
  },
  { name: "Editor", description: "Edit and manage blog content and website copy", users: 5, permissionCount: 5, lastUpdated: "2026-06-05", isCustom: false, color: "bg-green-100 text-green-800 border-green-200", iconColor: "text-green-600",
    permissions: [
      { name: "Manage Users", granted: false, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: false, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: false, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: false, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: true, description: "Create and edit website content" },
      { name: "Manage Blog", granted: true, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: false, description: "Configure platform settings" },
      { name: "View Analytics", granted: true, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: false, description: "Create and manage user roles" },
      { name: "Manage Support", granted: false, description: "Handle support requests" },
      { name: "Manage Marketing", granted: false, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: true, description: "Upload and manage media files" },
      { name: "Export Data", granted: true, description: "Export platform data" },
      { name: "Manage Categories", granted: true, description: "Create and manage book categories" },
    ]
  },
  { name: "Finance Officer", description: "Manage payments, royalties, and withdrawals", users: 2, permissionCount: 4, lastUpdated: "2026-06-03", isCustom: false, color: "bg-yellow-100 text-yellow-800 border-yellow-200", iconColor: "text-yellow-600",
    permissions: [
      { name: "Manage Users", granted: false, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: false, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: false, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: true, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: false, description: "Create and edit website content" },
      { name: "Manage Blog", granted: false, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: false, description: "Configure platform settings" },
      { name: "View Analytics", granted: true, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: false, description: "Create and manage user roles" },
      { name: "Manage Support", granted: false, description: "Handle support requests" },
      { name: "Manage Marketing", granted: false, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: false, description: "Upload and manage media files" },
      { name: "Export Data", granted: true, description: "Export platform data" },
      { name: "Manage Categories", granted: false, description: "Create and manage book categories" },
    ]
  },
  { name: "Marketing Manager", description: "Manage campaigns, newsletters, and promotions", users: 4, permissionCount: 6, lastUpdated: "2026-05-28", isCustom: false, color: "bg-purple-100 text-purple-800 border-purple-200", iconColor: "text-purple-600",
    permissions: [
      { name: "Manage Users", granted: false, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: false, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: false, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: false, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: true, description: "Create and edit website content" },
      { name: "Manage Blog", granted: true, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: false, description: "Configure platform settings" },
      { name: "View Analytics", granted: true, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: false, description: "Create and manage user roles" },
      { name: "Manage Support", granted: false, description: "Handle support requests" },
      { name: "Manage Marketing", granted: true, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: true, description: "Upload and manage media files" },
      { name: "Export Data", granted: true, description: "Export platform data" },
      { name: "Manage Newsletters", granted: true, description: "Send newsletters to subscribers" },
    ]
  },
  { name: "Customer Support", description: "Handle support requests and author inquiries", users: 5, permissionCount: 3, lastUpdated: "2026-05-20", isCustom: false, color: "bg-teal-100 text-teal-800 border-teal-200", iconColor: "text-teal-600",
    permissions: [
      { name: "Manage Users", granted: false, description: "Create, edit and delete user accounts" },
      { name: "Manage Books", granted: false, description: "Create, edit and delete books" },
      { name: "Approve Publications", granted: false, description: "Review and approve book submissions" },
      { name: "Manage Payments", granted: false, description: "Process withdrawals and manage payments" },
      { name: "Manage Content", granted: false, description: "Create and edit website content" },
      { name: "Manage Blog", granted: false, description: "Create, edit and publish blog posts" },
      { name: "Manage Settings", granted: false, description: "Configure platform settings" },
      { name: "View Analytics", granted: false, description: "Access analytics dashboards" },
      { name: "Manage Roles", granted: false, description: "Create and manage user roles" },
      { name: "Manage Support", granted: true, description: "Handle support requests" },
      { name: "Manage Marketing", granted: false, description: "Manage campaigns and promotions" },
      { name: "Manage Media", granted: false, description: "Upload and manage media files" },
      { name: "Export Data", granted: false, description: "Export platform data" },
      { name: "Manage Testimonials", granted: true, description: "Review and publish testimonials" },
      { name: "Manage Orders", granted: true, description: "Process and manage orders" },
    ]
  },
];

const SUMMARY_CARDS = [
  { key: "total", label: "TOTAL ROLES", value: "7", icon: Shield, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40" },
  { key: "active", label: "ACTIVE", value: "7", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { key: "permissions", label: "PERMISSIONS", value: "18", icon: Lock, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "users", label: "USERS ASSIGNED", value: "24", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "custom", label: "CUSTOM ROLES", value: "2", icon: Plus, color: "text-orange-500", bg: "bg-orange-50" },
  { key: "recent", label: "LAST UPDATED", value: "Today", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
];

const SORT_OPTIONS = [
  { value: "name-az", label: "Name A-Z" },
  { value: "name-za", label: "Name Z-A" },
  { value: "most-permissions", label: "Most Permissions" },
  { value: "least-permissions", label: "Least Permissions" },
  { value: "most-users", label: "Most Users" },
  { value: "recently-updated", label: "Recently Updated" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "system", label: "System Roles" },
  { value: "custom", label: "Custom Roles" },
  { value: "active", label: "Active" },
];

const USERS_PER_ROLE = [
  { role: "Super Admin", count: 1 },
  { role: "Admin", count: 3 },
  { role: "Publishing Manager", count: 4 },
  { role: "Editor", count: 5 },
  { role: "Finance Officer", count: 2 },
  { role: "Marketing Manager", count: 4 },
  { role: "Customer Support", count: 5 },
];

const activityLog = [
  { id: "a1", action: "Admin role updated", user: "Sarah Mitchell", time: "2 hours ago", type: "update" as const },
  { id: "a2", action: "Marketing Manager permission changed", user: "James Cooper", time: "4 hours ago", type: "permission" as const },
  { id: "a3", action: "New role created: Content Reviewer", user: "Admin User", time: "1 day ago", type: "create" as const },
  { id: "a4", action: "Role duplicated: Content Reviewer from Editor", user: "Admin User", time: "1 day ago", type: "duplicate" as const },
  { id: "a5", action: "Customer Support permissions updated", user: "Emily Watson", time: "2 days ago", type: "update" as const },
  { id: "a6", action: "Finance Officer role modified", user: "Sarah Mitchell", time: "3 days ago", type: "update" as const },
  { id: "a7", action: "New role created: Community Manager", user: "Admin User", time: "4 days ago", type: "create" as const },
  { id: "a8", action: "Publishing Manager users reassigned", user: "James Cooper", time: "5 days ago", type: "update" as const },
];

const DEMO_USERS = [
  { name: "Sarah Mitchell", role: "Super Admin" },
  { name: "James Cooper", role: "Admin" },
  { name: "Emily Watson", role: "Admin" },
  { name: "Michael Brown", role: "Admin" },
  { name: "Lisa Park", role: "Publishing Manager" },
  { name: "David Johnson", role: "Publishing Manager" },
  { name: "Grace Okafor", role: "Publishing Manager" },
  { name: "Adebayo Ogundimu", role: "Publishing Manager" },
  { name: "Fatima Abubakar", role: "Editor" },
  { name: "Chinwe Eze", role: "Editor" },
  { name: "Olivia Carter", role: "Editor" },
  { name: "Tunde Akinola", role: "Editor" },
  { name: "Ngozi Adichie", role: "Editor" },
  { name: "Samuel Okafor", role: "Finance Officer" },
  { name: "Blessing Eze", role: "Finance Officer" },
  { name: "Peter Nwankwo", role: "Marketing Manager" },
  { name: "Aisha Bello", role: "Marketing Manager" },
  { name: "Chukwuma Obi", role: "Marketing Manager" },
  { name: "Hauwa Garba", role: "Marketing Manager" },
  { name: "Tobi Adeyemi", role: "Customer Support" },
  { name: "Funke Adeyemi", role: "Customer Support" },
  { name: "Uche Nnamdi", role: "Customer Support" },
  { name: "Zainab Mohammed", role: "Customer Support" },
  { name: "Kemi Oladipo", role: "Customer Support" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(ROLES);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("name-az");
  const [filterOption, setFilterOption] = useState("all");
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<Record<string, boolean>>({});
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const sortFilterRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortFilterRef.current && !sortFilterRef.current.contains(e.target as Node)) setSortFilterOpen(false);
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const stats = useMemo(() => {
    const totalUsers = roles.reduce((s, r) => s + r.users, 0);
    const customRoles = roles.filter((r) => r.isCustom).length;
    return { total: roles.length, users: totalUsers, custom: customRoles };
  }, [roles]);

  const filteredRoles = useMemo(() => {
    let result = [...roles];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.permissions.some((p) => p.name.toLowerCase().includes(q))
      );
    }
    if (filterOption === "system") result = result.filter((r) => !r.isCustom);
    else if (filterOption === "custom") result = result.filter((r) => r.isCustom);
    else if (filterOption === "active") result = result.filter(() => true);

    switch (sortOption) {
      case "name-az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "most-permissions": result.sort((a, b) => b.permissionCount - a.permissionCount); break;
      case "least-permissions": result.sort((a, b) => a.permissionCount - b.permissionCount); break;
      case "most-users": result.sort((a, b) => b.users - a.users); break;
      case "recently-updated": result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()); break;
    }
    return result;
  }, [roles, search, sortOption, filterOption]);

  const maxUserRoleCount = Math.max(...USERS_PER_ROLE.map((u) => u.count));

  const permissionDist = useMemo(() => {
    const dist: Record<string, number> = {};
    roles.forEach((r) => {
      r.permissions.forEach((p) => {
        if (p.granted) dist[p.name] = (dist[p.name] || 0) + 1;
      });
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [roles]);

  const openRoleDrawer = (role: Role) => {
    setSelectedRole(role);
    setDrawerOpen(true);
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    const perms = Object.entries(newRolePermissions).map(([name, granted]) => ({
      name,
      granted,
      description: ROLES[0].permissions.find((p) => p.name === name)?.description || "",
    }));
    const newRole: Role = {
      name: newRoleName,
      description: newRoleDescription,
      users: 0,
      permissionCount: perms.filter((p) => p.granted).length,
      lastUpdated: new Date().toISOString().split("T")[0],
      isCustom: true,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      iconColor: "text-indigo-600",
      permissions: perms,
    };
    setRoles((prev) => [newRole, ...prev]);
    showNotification("success", `Role "${newRoleName}" created`);
    setCreateDialogOpen(false);
    setNewRoleName("");
    setNewRoleDescription("");
    setNewRolePermissions({});
  };

  const handleDuplicateRole = (role: Role) => {
    const newRole: Role = {
      ...role,
      name: `${role.name} (Copy)`,
      isCustom: true,
      lastUpdated: new Date().toISOString().split("T")[0],
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      iconColor: "text-indigo-600",
    };
    setRoles((prev) => [newRole, ...prev]);
    showNotification("success", `Role duplicated as "${newRole.name}"`);
  };

  const exportRolesCSV = () => {
    const headers = ["Role", "Description", "Users", "Permissions", "Last Updated", "Type"];
    const rows = filteredRoles.map((r) => [r.name, r.description, String(r.users), `${r.permissionCount}/${TOTAL_PERMISSIONS}`, r.lastUpdated, r.isCustom ? "Custom" : "System"]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `roles-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "Roles exported as CSV");
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${notification.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Manage role-based access control for your publishing platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => { setRoles(ROLES); showNotification("success", "Roles refreshed"); }} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="h-4 w-4 mr-1" />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map((card) => (
          <motion.div key={card.key} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Card className="shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] border-[#D8B27A]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-2", card.bg, card.color)}><card.icon className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D] mb-0.5">{card.label}</p>
                    <motion.p key={card.value} initial={{ scale: 1.15, color: "#D8B27A" }} animate={{ scale: 1, color: "#1D1D1D" }} transition={{ duration: 0.3 }} className="text-2xl font-bold">{card.value}</motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Role Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Users Per Role</h4>
                      <div className="space-y-2.5">
                        {USERS_PER_ROLE.map((ur) => (
                          <div key={ur.role} className="flex items-center gap-2">
                            <span className="text-[11px] text-[#5C4A3D] w-28 truncate">{ur.role}</span>
                            <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]">
                              <div className="h-full rounded bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A]" style={{ width: `${(ur.count / maxUserRoleCount) * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-[#1D1D1D] w-6 text-right">{ur.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Permission Distribution</h4>
                      <div className="space-y-2">
                        {permissionDist.map(([perm, count]) => (
                          <div key={perm} className="flex items-center gap-2">
                            <span className="text-[11px] text-[#5C4A3D] w-28 truncate">{perm}</span>
                            <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]">
                              <div className="h-full rounded bg-blue-500" style={{ width: `${(count / roles.length) * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-[#1D1D1D] w-6 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Most Used Roles</h4>
                      <div className="space-y-2.5">
                        {[...roles].sort((a, b) => b.users - a.users).slice(0, 5).map((r, i) => (
                          <div key={r.name} className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-[#8A6A4A] w-4 text-center">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between text-[10px] mb-0.5">
                                <span className="text-[#5C4A3D] truncate">{r.name}</span>
                                <span className="font-semibold text-[#1D1D1D] flex-shrink-0">{r.users} users</span>
                              </div>
                              <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                                <div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded-full" style={{ width: `${(r.users / Math.max(...roles.map((x) => x.users))) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Recently Modified</h4>
                      <div className="space-y-2.5">
                        {[...roles].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 5).map((r) => (
                          <div key={r.name} className="flex items-center justify-between py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-[#1D1D1D] truncate">{r.name}</p>
                              <p className="text-[9px] text-[#5C4A3D]">{r.permissionCount}/{TOTAL_PERMISSIONS} permissions</p>
                            </div>
                            <span className="text-[9px] text-[#5C4A3D] flex-shrink-0 ml-2">{formatDate(r.lastUpdated)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="search-bar-border relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search roles, permissions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9 relative z-[1]" />
          </div>

          <div className="flex items-center gap-2" ref={sortFilterRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${sortOption !== "name-az" || filterOption !== "all" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort & Filter</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort & Filter</h4>
                      {(sortOption !== "name-az" || filterOption !== "all") && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => { setSortOption("name-az"); setFilterOption("all"); }}><X className="h-3 w-3 mr-1" />Clear</Button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] px-2 py-1">Sort By</p>
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortOption(opt.value); setSortFilterOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                          {opt.label}
                        </button>
                      ))}
                      <div className="border-t border-[#E8DDD0] my-2" />
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] px-2 py-1">Filter</p>
                      {FILTER_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setFilterOption(opt.value); setSortFilterOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${filterOption === opt.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${quickActionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </div>
            {quickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                <Button size="sm" className="w-full justify-start h-8 text-xs bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { setCreateDialogOpen(true); setQuickActionsOpen(false); }}><Plus className="h-3.5 w-3.5 mr-1.5" />Create Role</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Duplicate feature — click View Role on any card"); setQuickActionsOpen(false); }}><Copy className="h-3.5 w-3.5 mr-1.5" />Duplicate Role</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportRolesCSV(); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export Roles</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Permission report generated"); setQuickActionsOpen(false); }}><FileText className="h-3.5 w-3.5 mr-1.5" />Permission Report</Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{filteredRoles.length}</span> Roles</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-[#8A6A4A] font-medium">{stats.users}</span> Assigned Users</span>
        <span><span className="text-blue-600 font-medium">{TOTAL_PERMISSIONS}</span> Permissions</span>
        <span><span className="text-orange-600 font-medium">{stats.custom}</span> Custom Roles</span>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRoles.map((role) => {
          const permGranted = role.permissions.filter((p) => p.granted).length;
          const permTotal = role.permissions.length;
          const roleUsers = DEMO_USERS.filter((u) => u.role === role.name);
          return (
            <motion.div key={role.name} variants={item} whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className={cn("h-full border bg-white hover:shadow-lg transition-all cursor-pointer", role.name === "Super Admin" ? "ring-2 ring-[#D8B27A]" : "border-[#E8DDD0]")}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={cn("border h-9 w-9 flex items-center justify-center rounded-lg p-0", role.color)}>
                        <Shield className={cn("h-4 w-4", role.iconColor)} />
                      </Badge>
                      <div>
                        <h3 className="font-semibold text-[#1D1D1D] text-base">{role.name}</h3>
                        {role.isCustom && <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[9px] mt-0.5">Custom</Badge>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#5C4A3D] mb-4 leading-relaxed">{role.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#5C4A3D] mb-0.5"><Users className="h-3 w-3" />Users</div>
                      <p className="text-lg font-bold text-[#1D1D1D]">{role.users}</p>
                    </div>
                    <div className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#5C4A3D] mb-0.5"><Lock className="h-3 w-3" />Permissions</div>
                      <p className="text-lg font-bold text-[#1D1D1D]">{permGranted}<span className="text-sm font-normal text-[#5C4A3D]">/{permTotal}</span></p>
                    </div>
                  </div>

                  {roleUsers.length > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      {roleUsers.slice(0, 4).map((u, i) => (
                        <Avatar key={i} className="h-6 w-6 border border-white -ml-1 first:ml-0">
                          <AvatarFallback className="text-[8px] bg-[#8A6A4A]/10 text-[#8A6A4A]">{getInitials(u.name)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {roleUsers.length > 4 && <span className="text-[10px] text-[#5C4A3D] ml-1">+{roleUsers.length - 4}</span>}
                    </div>
                  )}

                  <div className="space-y-1.5 mb-4 flex-1">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A]">Key Permissions</h4>
                    {role.permissions.slice(0, 5).map((perm) => (
                      <div key={perm.name} className="flex items-center justify-between text-xs group">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {perm.granted ? (
                            <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <X className="h-3 w-3 text-red-400 flex-shrink-0" />
                          )}
                          <span className={cn("truncate", perm.granted ? "text-[#5C4A3D]" : "text-[#5C4A3D]/50")}>{perm.name}</span>
                        </div>
                        <span className="text-[9px] text-[#5C4A3D]/50 hidden group-hover:inline ml-1 truncate max-w-[100px]">{perm.description}</span>
                      </div>
                    ))}
                    {role.permissions.length > 5 && (
                      <p className="text-[10px] text-[#8A6A4A] font-medium">+{role.permissions.length - 5} more permissions</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8DDD0]">
                    <span className="text-[10px] text-[#5C4A3D]">Updated {formatDate(role.lastUpdated)}</span>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => openRoleDrawer(role)}>
                      <Eye className="h-3 w-3 mr-1" />View Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredRoles.length === 0 && (
        <motion.div variants={item} className="text-center py-16">
          <Shield className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
          <p className="text-sm font-medium text-[#1D1D1D]">No roles found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </motion.div>
      )}

      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] flex items-center gap-2"><Activity className="h-4 w-4" />Recent Activity</h4>
              {activityLog.length > 3 && (
                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#8A6A4A]" onClick={() => setActivityExpanded(!activityExpanded)}>{activityExpanded ? "Show Less" : "View All"}</Button>
              )}
            </div>
            <div className="space-y-2.5">
              {activityLog.slice(0, activityExpanded ? activityLog.length : 3).map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F5EDE3]/30 transition-colors">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", entry.type === "update" ? "bg-amber-50 text-amber-600" : entry.type === "permission" ? "bg-blue-50 text-blue-600" : entry.type === "create" ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600")}>
                    {entry.type === "update" ? <Edit3 className="h-4 w-4" /> : entry.type === "permission" ? <Lock className="h-4 w-4" /> : entry.type === "create" ? <Plus className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D]">{entry.action}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#5C4A3D] mt-0.5">
                      <span>{entry.user}</span>
                      <span>&middot;</span>
                      <span className="text-[#8A6A4A]">{entry.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {drawerOpen && selectedRole && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#1D1D1D]">Role Details</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className={cn("border h-14 w-14 flex items-center justify-center rounded-xl p-0", selectedRole.color)}>
                    <Shield className={cn("h-6 w-6", selectedRole.iconColor)} />
                  </Badge>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D1D1D]">{selectedRole.name}</h3>
                    <p className="text-sm text-[#5C4A3D] mt-0.5">{selectedRole.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Users", value: selectedRole.users, icon: Users, color: "text-purple-600" },
                    { label: "Permissions", value: `${selectedRole.permissionCount}/${TOTAL_PERMISSIONS}`, icon: Lock, color: "text-blue-600" },
                    { label: "Type", value: selectedRole.isCustom ? "Custom" : "System", icon: Shield, color: "text-[#8A6A4A]" },
                  ].map((f) => (
                    <div key={f.label} className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/30 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-[#5C4A3D] mb-0.5"><f.icon className={cn("h-3 w-3", f.color)} />{f.label}</div>
                      <p className="text-sm font-bold text-[#1D1D1D]">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8DDD0] pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Assigned Users</h4>
                  <div className="space-y-2">
                    {DEMO_USERS.filter((u) => u.role === selectedRole.name).map((u, i) => (
                      <div key={i} className="flex items-center gap-3 py-1.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-[10px] bg-[#8A6A4A]/10 text-[#8A6A4A]">{getInitials(u.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1D]">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground">{u.name.toLowerCase().replace(" ", ".")}@statement.com</p>
                        </div>
                      </div>
                    ))}
                    {DEMO_USERS.filter((u) => u.role === selectedRole.name).length === 0 && (
                      <p className="text-xs text-[#5C4A3D] py-2">No users assigned to this role.</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#E8DDD0] pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">All Permissions</h4>
                  <div className="space-y-2">
                    {selectedRole.permissions.map((perm) => (
                      <div key={perm.name} className="flex items-start gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                        {perm.granted ? (
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="h-3 w-3 text-emerald-600" /></div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5"><X className="h-3 w-3 text-red-500" /></div>
                        )}
                        <div className="min-w-0">
                          <p className={cn("text-sm font-medium", perm.granted ? "text-[#1D1D1D]" : "text-[#5C4A3D]/60")}>{perm.name}</p>
                          <p className="text-[11px] text-[#5C4A3D]/60 mt-0.5">{perm.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E8DDD0] pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#8A6A4A]/10 flex items-center justify-center flex-shrink-0"><Clock className="h-4 w-4 text-[#8A6A4A]" /></div>
                      <div>
                        <p className="text-[11px] font-medium text-[#5C4A3D] uppercase tracking-wider">Last Updated</p>
                        <p className="text-sm font-semibold text-[#1D1D1D]">{formatDate(selectedRole.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#E8DDD0]">
                  <Button size="sm" className="flex-1 bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { showNotification("success", "Edit feature coming soon"); setDrawerOpen(false); }}><Edit3 className="h-3.5 w-3.5 mr-1" />Edit Role</Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#D8B27A] text-[#8A6A4A] hover:bg-[#F2D8BE]/20" onClick={() => { handleDuplicateRole(selectedRole); setDrawerOpen(false); }}><Copy className="h-3.5 w-3.5 mr-1" />Duplicate</Button>
                  <Button size="sm" variant="outline" className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Role exported as PDF"); setDrawerOpen(false); }}><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCreateDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 border border-[#E8DDD0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#8A6A4A]" />
                  <h3 className="text-lg font-semibold text-[#1D1D1D]">Create New Role</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCreateDialogOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#1D1D1D] mb-1.5 block">Role Name</label>
                  <Input placeholder="e.g. Content Reviewer" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1D1D1D] mb-1.5 block">Description</label>
                  <textarea placeholder="Describe what this role can do..." value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} rows={3} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1D1D1D] mb-2 block">Permissions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-3 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                    {ROLES[0].permissions.map((perm) => (
                      <label key={perm.name} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-[#F5EDE3]/30 rounded px-1">
                        <input type="checkbox" checked={!!newRolePermissions[perm.name]} onChange={(e) => setNewRolePermissions((prev) => ({ ...prev, [perm.name]: e.target.checked }))} className="h-4 w-4 rounded border-[#E8DDD0] text-[#8A6A4A] focus:ring-[#8A6A4A]/30" />
                        <div className="min-w-0">
                          <span className="text-sm text-[#1D1D1D]">{perm.name}</span>
                          <p className="text-[10px] text-[#5C4A3D] truncate">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#5C4A3D] mt-1">{Object.values(newRolePermissions).filter(Boolean).length} permissions selected</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleCreateRole} disabled={!newRoleName.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"><Plus className="h-3.5 w-3.5 mr-1" />Create Role</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}