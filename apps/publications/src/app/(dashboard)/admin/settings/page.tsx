"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, CreditCard, Mail, Percent, ToggleLeft, Save, Upload, Loader2,
  Plug, ChevronDown, ChevronUp, ChevronRight, BarChart3, Zap, RefreshCw,
  Download, FileText, Clock, AlertTriangle, Settings,
  Undo2, Trash2, RotateCcw, Eye, Image, Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, formatCurrency } from "@/lib/utils";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const SUMMARY_CARDS = [
  { key: "status", label: "PLATFORM STATUS", value: "Live", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50", tab: "platform" },
  { key: "integrations", label: "INTEGRATIONS", value: "5 Active", icon: Plug, color: "text-blue-500", bg: "bg-blue-50", tab: "payment" },
  { key: "email", label: "EMAIL CONFIG", value: "Connected", icon: Mail, color: "text-purple-500", bg: "bg-purple-50", tab: "email" },
  { key: "features", label: "FEATURE TOGGLES", value: "12 Enabled", icon: ToggleLeft, color: "text-orange-500", bg: "bg-orange-50", tab: "features" },
];

const ANALYTICS_STATS = [
  { label: "Platform Uptime", value: "99.98%", sub: "Last 30 days" },
  { label: "Emails Sent This Month", value: "4,812", sub: "+12% vs last month" },
  { label: "Successful Payments", value: "1,247", sub: "98.3% success rate" },
  { label: "Feature Usage", value: "89%", sub: "Of active features" },
  { label: "Active Users", value: "5,234", sub: "+8.2% this month" },
];

const ACTIVITY_LOG = [
  { id: "a1", action: "Platform name updated", time: "2 hours ago", type: "update" },
  { id: "a2", action: "Commission rate changed to 15%", time: "4 hours ago", type: "commission" },
  { id: "a3", action: "SMTP settings updated", time: "1 day ago", type: "email" },
  { id: "a4", action: "Feature toggle enabled: Media Library", time: "2 days ago", type: "feature" },
  { id: "a5", action: "Logo updated", time: "3 days ago", type: "logo" },
  { id: "a6", action: "Payment gateway configured: Stripe", time: "4 days ago", type: "payment" },
  { id: "a7", action: "Email notification toggled: Newsletter", time: "5 days ago", type: "email" },
  { id: "a8", action: "Commission rates reviewed", time: "1 week ago", type: "commission" },
];

const ACTIVITY_COLORS: Record<string, { bg: string; icon: string }> = {
  update: { bg: "bg-blue-50", icon: "text-blue-600" },
  commission: { bg: "bg-amber-50", icon: "text-amber-600" },
  email: { bg: "bg-purple-50", icon: "text-purple-600" },
  feature: { bg: "bg-orange-50", icon: "text-orange-600" },
  logo: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  payment: { bg: "bg-indigo-50", icon: "text-indigo-600" },
};

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  update: <Settings className="h-3.5 w-3.5" />,
  commission: <Percent className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  feature: <ToggleLeft className="h-3.5 w-3.5" />,
  logo: <Image className="h-3.5 w-3.5" />,
  payment: <CreditCard className="h-3.5 w-3.5" />,
};

const FEATURES = [
  { key: "blogSystem", label: "Blog System", description: "Enable the built-in blog for articles and publications" },
  { key: "testimonials", label: "Testimonials", description: "Allow users to leave reviews and testimonials" },
  { key: "authorVerification", label: "Author Verification", description: "Require admin verification for new authors" },
  { key: "serviceOrders", label: "Service Orders", description: "Enable ordering publishing services" },
  { key: "bookPublishing", label: "Book Publishing", description: "Enable self-service book publishing workflow" },
  { key: "analyticsCenter", label: "Analytics Center", description: "Enable advanced analytics and reporting" },
  { key: "notifications", label: "Notifications", description: "Enable in-app and push notifications" },
  { key: "emailMarketing", label: "Email Marketing", description: "Enable email campaign management" },
  { key: "mediaLibrary", label: "Media Library", description: "Enable centralized media asset management" },
  { key: "contentManagement", label: "Content Management", description: "Enable CMS features for pages and content" },
  { key: "categories", label: "Categories", description: "Enable book and content categorization" },
  { key: "reports", label: "Reports", description: "Enable downloadable financial and analytics reports" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform");
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const [platformSettings, setPlatformSettings] = useState({
    name: "Statement Publications",
    tagline: "Discover African Literature at Its Finest",
    description: "A leading digital publishing platform connecting African authors with readers worldwide.",
    supportEmail: "support@statementpub.com",
    websiteUrl: "https://statementpub.com",
    contactPhone: "+234 801 234 5678",
    timezone: "UTC",
    defaultLanguage: "English",
    currency: "USD",
    logo: null as string | null,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    mobileMoneyEnabled: true,
    bankTransferEnabled: true,
    primaryGateway: "stripe",
    secondaryGateway: "paypal",
    minimumPayout: 50,
    autoPayout: true,
    testMode: false,
    currency: "USD",
    platformCommission: 20,
  });

  const [emailSettings, setEmailSettings] = useState({
    welcomeEmail: true,
    orderConfirmation: true,
    bookApproval: true,
    royaltyPaid: true,
    withdrawalUpdate: true,
    newsletter: true,
    marketingEmails: false,
    smtpHost: "smtp.statementpub.com",
    smtpPort: "587",
    senderName: "Statement Publications",
    senderEmail: "noreply@statementpub.com",
    lastEmailSent: "2 hours ago",
  });

  const [commissionRates, setCommissionRates] = useState({
    bookSalesCommission: 20,
    serviceSalesCommission: 15,
    affiliateCommission: 10,
    royaltyProcessingFee: 2.5,
    standardRate: 20,
    premiumAuthorRate: 15,
  });

  const [featureToggles, setFeatureToggles] = useState({
    blogSystem: true,
    testimonials: true,
    authorVerification: true,
    serviceOrders: false,
    bookPublishing: true,
    analyticsCenter: true,
    notifications: true,
    emailMarketing: false,
    mediaLibrary: true,
    contentManagement: true,
    categories: true,
    reports: true,
  });

  const updatePlatform = (updates: Partial<typeof platformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updatePayment = (updates: Partial<typeof paymentSettings>) => {
    setPaymentSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateEmail = (updates: Partial<typeof emailSettings>) => {
    setEmailSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateCommission = (updates: Partial<typeof commissionRates>) => {
    setCommissionRates((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateFeature = (key: string, value: boolean) => {
    setFeatureToggles((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setHasUnsavedChanges(false);
    showNotification("success", `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
  };

  const handleResetTab = () => {
    if (activeTab === "platform") {
      setPlatformSettings({
        name: "Statement Publications",
        tagline: "Discover African Literature at Its Finest",
        description: "A leading digital publishing platform connecting African authors with readers worldwide.",
        supportEmail: "support@statementpub.com",
        websiteUrl: "https://statementpub.com",
        contactPhone: "+234 801 234 5678",
        timezone: "UTC",
        defaultLanguage: "English",
        currency: "USD",
        logo: null,
      });
    } else if (activeTab === "payment") {
      setPaymentSettings({
        stripeEnabled: true, paypalEnabled: true, mobileMoneyEnabled: true,
        bankTransferEnabled: true, primaryGateway: "stripe", secondaryGateway: "paypal",
        minimumPayout: 50, autoPayout: true, testMode: false, currency: "USD", platformCommission: 20,
      });
    } else if (activeTab === "email") {
      setEmailSettings({
        welcomeEmail: true, orderConfirmation: true, bookApproval: true,
        royaltyPaid: true, withdrawalUpdate: true, newsletter: true, marketingEmails: false,
        smtpHost: "smtp.statementpub.com", smtpPort: "587", senderName: "Statement Publications",
        senderEmail: "noreply@statementpub.com", lastEmailSent: "2 hours ago",
      });
    } else if (activeTab === "commission") {
      setCommissionRates({ bookSalesCommission: 20, serviceSalesCommission: 15, affiliateCommission: 10, royaltyProcessingFee: 2.5, standardRate: 20, premiumAuthorRate: 15 });
    } else if (activeTab === "features") {
      setFeatureToggles({
        blogSystem: true, testimonials: true, authorVerification: true, serviceOrders: false,
        bookPublishing: true, analyticsCenter: true, notifications: true, emailMarketing: false,
        mediaLibrary: true, contentManagement: true, categories: true, reports: true,
      });
    }
    setHasUnsavedChanges(false);
    showNotification("success", `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings reset to defaults`);
  };

  const handleRestoreDefaults = () => {
    setPlatformSettings({
      name: "Statement Publications", tagline: "Discover African Literature at Its Finest",
      description: "A leading digital publishing platform connecting African authors with readers worldwide.",
      supportEmail: "support@statementpub.com", websiteUrl: "https://statementpub.com",
      contactPhone: "+234 801 234 5678", timezone: "UTC", defaultLanguage: "English", currency: "USD", logo: null,
    });
    setPaymentSettings({
      stripeEnabled: true, paypalEnabled: true, mobileMoneyEnabled: true,
      bankTransferEnabled: true, primaryGateway: "stripe", secondaryGateway: "paypal",
      minimumPayout: 50, autoPayout: true, testMode: false, currency: "USD", platformCommission: 20,
    });
    setEmailSettings({
      welcomeEmail: true, orderConfirmation: true, bookApproval: true,
      royaltyPaid: true, withdrawalUpdate: true, newsletter: true, marketingEmails: false,
      smtpHost: "smtp.statementpub.com", smtpPort: "587", senderName: "Statement Publications",
      senderEmail: "noreply@statementpub.com", lastEmailSent: "2 hours ago",
    });
    setCommissionRates({ bookSalesCommission: 20, serviceSalesCommission: 15, affiliateCommission: 10, royaltyProcessingFee: 2.5, standardRate: 20, premiumAuthorRate: 15 });
    setFeatureToggles({
      blogSystem: true, testimonials: true, authorVerification: true, serviceOrders: false,
      bookPublishing: true, analyticsCenter: true, notifications: true, emailMarketing: false,
      mediaLibrary: true, contentManagement: true, categories: true, reports: true,
    });
    setHasUnsavedChanges(false);
    setResetDialogOpen(false);
    showNotification("success", "All settings restored to defaults");
  };

  const handleExportSettings = (format: string) => {
    showNotification("success", `Settings exported as ${format}`);
    setQuickActionsOpen(false);
  };

  const handleTestEmail = () => {
    showNotification("success", "Test email sent to admin@statementpub.com");
    setQuickActionsOpen(false);
  };

  const handleRunPaymentTest = () => {
    showNotification("success", "Payment gateway test completed successfully");
    setQuickActionsOpen(false);
  };

  const enabledFeatureCount = Object.values(featureToggles).filter(Boolean).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium",
              notification.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Platform Settings</h1>
            <span className="flex items-center gap-1.5 text-xs">
              {hasUnsavedChanges ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-600 font-medium">Unsaved Changes</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 font-medium">All Changes Saved</span>
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Configure platform settings, payment options, and feature toggles.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", quickActionsOpen && "rotate-90")} />
              </Button>
            </div>
            <AnimatePresence>
              {quickActionsOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => handleExportSettings("PDF")}><FileText className="h-3.5 w-3.5 mr-1.5" />Export as PDF</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => handleExportSettings("Excel")}><Download className="h-3.5 w-3.5 mr-1.5" />Export as Excel</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => handleExportSettings("JSON")}><FileText className="h-3.5 w-3.5 mr-1.5" />Export as JSON</Button>
                  <Separator className="my-1" />
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => handleTestEmail()}><Send className="h-3.5 w-3.5 mr-1.5" />Test Email</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => handleRunPaymentTest()}><CreditCard className="h-3.5 w-3.5 mr-1.5" />Run Payment Test</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="sm" onClick={() => showNotification("success", "Settings refreshed")} className="h-9 px-3 border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
              <RefreshCw className="h-4 w-4" />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SUMMARY_CARDS.map((card) => {
          const isActive = activeTab === card.tab;
          return (
            <motion.div key={card.key} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card
                onClick={() => setActiveTab(card.tab)}
                className={cn(
                  "shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md border-[#D8B27A]/20",
                  isActive && "ring-2 ring-[#D8B27A] shadow-md border-[#D8B27A]/40"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", card.bg, card.color)}>
                      <card.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D] mb-0.5">{card.label}</p>
                      <motion.p
                        key={card.value}
                        initial={{ scale: 1.15, color: "#D8B27A" }}
                        animate={{ scale: 1, color: "#1D1D1D" }}
                        transition={{ duration: 0.3 }}
                        className="text-lg font-bold"
                      >
                        {card.value}
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Settings Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {ANALYTICS_STATS.map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-[#D8B27A]/15 p-3 bg-[#F2D8BE]/5 text-center">
                        <p className="text-[10px] text-[#5C4A3D] mb-1">{stat.label}</p>
                        <p className="text-xl font-bold text-[#1D1D1D]">{stat.value}</p>
                        <p className="text-[9px] text-[#5C4A3D] mt-0.5">{stat.sub}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="platform"><Globe className="mr-1 h-3.5 w-3.5" />Platform</TabsTrigger>
            <TabsTrigger value="payment"><CreditCard className="mr-1 h-3.5 w-3.5" />Payment</TabsTrigger>
            <TabsTrigger value="email"><Mail className="mr-1 h-3.5 w-3.5" />Email</TabsTrigger>
            <TabsTrigger value="commission"><Percent className="mr-1 h-3.5 w-3.5" />Commission</TabsTrigger>
            <TabsTrigger value="features"><ToggleLeft className="mr-1 h-3.5 w-3.5" />Features</TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo Management</CardTitle>
                  <CardDescription>Upload and manage your platform logo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-[#E8DDD0]">
                      <AvatarFallback className="bg-[#8A6A4A]/10 text-[#8A6A4A] text-2xl font-bold">SP</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><Upload className="mr-1 h-4 w-4" />Upload New Logo</Button>
                        <Button variant="outline" size="sm" className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><Eye className="mr-1 h-4 w-4" />Preview</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="mr-1 h-4 w-4" />Remove</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Recommended Size: 512x512 PNG or SVG | Maximum Upload: 5MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Information</CardTitle>
                  <CardDescription>Configure your platform name, description, and general settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Platform Name</Label>
                      <Input value={platformSettings.name} onChange={(e) => updatePlatform({ name: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tagline</Label>
                      <Input value={platformSettings.tagline} onChange={(e) => updatePlatform({ tagline: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={platformSettings.description} onChange={(e) => updatePlatform({ description: e.target.value })} rows={3} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Support Email</Label>
                      <Input type="email" value={platformSettings.supportEmail} onChange={(e) => updatePlatform({ supportEmail: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input value={platformSettings.websiteUrl} onChange={(e) => updatePlatform({ websiteUrl: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input value={platformSettings.contactPhone} onChange={(e) => updatePlatform({ contactPhone: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={platformSettings.timezone} onValueChange={(v) => updatePlatform({ timezone: v })}>
                        <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern (EST)</SelectItem>
                          <SelectItem value="CST">Central (CST)</SelectItem>
                          <SelectItem value="PST">Pacific (PST)</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Default Language</Label>
                      <Select value={platformSettings.defaultLanguage} onValueChange={(v) => updatePlatform({ defaultLanguage: v })}>
                        <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Yoruba">Yoruba</SelectItem>
                          <SelectItem value="Igbo">Igbo</SelectItem>
                          <SelectItem value="Hausa">Hausa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={platformSettings.currency} onValueChange={(v) => updatePlatform({ currency: v })}>
                        <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Gateways</CardTitle>
                  <CardDescription>Enable or disable payment methods for your platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "stripeEnabled", label: "Stripe", description: "Accept credit/debit cards via Stripe" },
                    { key: "paypalEnabled", label: "PayPal", description: "Accept payments via PayPal" },
                    { key: "mobileMoneyEnabled", label: "Mobile Money", description: "Accept MTN, Vodafone, and AirtelTigo payments" },
                    { key: "bankTransferEnabled", label: "Bank Transfer", description: "Accept direct bank transfers" },
                  ].map((gateway) => (
                    <div key={gateway.key} className="flex items-center justify-between rounded-lg border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors">
                      <div className="space-y-0.5">
                        <p className="font-medium text-[#1D1D1D]">{gateway.label}</p>
                        <p className="text-sm text-[#5C4A3D]">{gateway.description}</p>
                      </div>
                      <Switch
                        checked={paymentSettings[gateway.key as keyof typeof paymentSettings] as boolean}
                        onCheckedChange={(checked) => updatePayment({ [gateway.key]: checked })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gateway Configuration</CardTitle>
                  <CardDescription>Set primary and secondary payment gateways and currency.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Primary Gateway</Label>
                      <Select value={paymentSettings.primaryGateway} onValueChange={(v) => updatePayment({ primaryGateway: v })}>
                        <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Gateway</Label>
                      <Select value={paymentSettings.secondaryGateway} onValueChange={(v) => updatePayment({ secondaryGateway: v })}>
                        <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={paymentSettings.currency} onValueChange={(v) => updatePayment({ currency: v })}>
                        <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="NGN">NGN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Platform Commission (%)</Label>
                      <Input type="number" value={paymentSettings.platformCommission} onChange={(e) => updatePayment({ platformCommission: Number(e.target.value) })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Settings</CardTitle>
                  <CardDescription>Configure how authors receive their earnings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Payout Amount ($)</Label>
                    <Input type="number" value={paymentSettings.minimumPayout} onChange={(e) => updatePayment({ minimumPayout: Number(e.target.value) })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-medium text-[#1D1D1D]">Automatic Payouts</p>
                      <p className="text-sm text-[#5C4A3D]">Automatically process payouts on schedule</p>
                    </div>
                    <Switch checked={paymentSettings.autoPayout} onCheckedChange={(checked) => updatePayment({ autoPayout: checked })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-medium text-[#1D1D1D]">Test Mode</p>
                      <p className="text-sm text-[#5C4A3D]">Enable sandbox mode for payment testing</p>
                    </div>
                    <Switch checked={paymentSettings.testMode} onCheckedChange={(checked) => updatePayment({ testMode: checked })} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Email Notifications</CardTitle>
                      <CardDescription>Configure which email notifications are sent to users.</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "welcomeEmail", label: "Welcome Email", description: "Send welcome email to new users" },
                    { key: "orderConfirmation", label: "Order Confirmation", description: "Send confirmation after purchase" },
                    { key: "bookApproval", label: "Book Approval", description: "Notify authors when books are approved/rejected" },
                    { key: "royaltyPaid", label: "Royalty Paid", description: "Notify authors when royalties are paid" },
                    { key: "withdrawalUpdate", label: "Withdrawal Updates", description: "Notify authors about withdrawal status" },
                    { key: "newsletter", label: "Newsletter", description: "Weekly newsletter to all users" },
                    { key: "marketingEmails", label: "Marketing Emails", description: "Promotional emails and offers" },
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between rounded-lg border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors">
                      <div className="space-y-0.5">
                        <p className="font-medium text-[#1D1D1D]">{notification.label}</p>
                        <p className="text-sm text-[#5C4A3D]">{notification.description}</p>
                      </div>
                      <Switch
                        checked={emailSettings[notification.key as keyof typeof emailSettings] as boolean}
                        onCheckedChange={(checked) => updateEmail({ [notification.key]: checked })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SMTP Configuration</CardTitle>
                  <CardDescription>Configure your email server settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input value={emailSettings.smtpHost} onChange={(e) => updateEmail({ smtpHost: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input value={emailSettings.smtpPort} onChange={(e) => updateEmail({ smtpPort: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Sender Name</Label>
                      <Input value={emailSettings.senderName} onChange={(e) => updateEmail({ senderName: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sender Email</Label>
                      <Input type="email" value={emailSettings.senderEmail} onChange={(e) => updateEmail({ senderEmail: e.target.value })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last email sent: <span className="font-medium text-[#1D1D1D]">{emailSettings.lastEmailSent}</span></span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commission" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Rates</CardTitle>
                  <CardDescription>Set the platform commission rates for different sales types.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Book Sales Commission (%)</Label>
                      <Input type="number" value={commissionRates.bookSalesCommission} onChange={(e) => updateCommission({ bookSalesCommission: Number(e.target.value) })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                      <p className="text-xs text-[#5C4A3D]">Applied to all book sales revenue</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Sales Commission (%)</Label>
                      <Input type="number" value={commissionRates.serviceSalesCommission} onChange={(e) => updateCommission({ serviceSalesCommission: Number(e.target.value) })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                      <p className="text-xs text-[#5C4A3D]">Applied to publishing service orders</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Affiliate Commission (%)</Label>
                      <Input type="number" value={commissionRates.affiliateCommission} onChange={(e) => updateCommission({ affiliateCommission: Number(e.target.value) })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                      <p className="text-xs text-[#5C4A3D]">Paid to affiliate referrers</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Royalty Processing Fee (%)</Label>
                      <Input type="number" value={commissionRates.royaltyProcessingFee} onChange={(e) => updateCommission({ royaltyProcessingFee: Number(e.target.value) })} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                      <p className="text-xs text-[#5C4A3D]">Fee deducted from each royalty payout</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="rounded-lg bg-[#F5EDE3]/50 border border-[#E8DDD0] p-4">
                    <h4 className="font-medium text-[#1D1D1D] mb-3">Commission Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#5C4A3D]">Standard Author earns: </span>
                        <span className="font-semibold text-emerald-600">{100 - commissionRates.bookSalesCommission}%</span>
                      </div>
                      <div>
                        <span className="text-[#5C4A3D]">Platform keeps: </span>
                        <span className="font-semibold text-[#1D1D1D]">{commissionRates.bookSalesCommission}%</span>
                      </div>
                      <div>
                        <span className="text-[#5C4A3D]">Service Revenue Author earns: </span>
                        <span className="font-semibold text-emerald-600">{100 - commissionRates.serviceSalesCommission}%</span>
                      </div>
                      <div>
                        <span className="text-[#5C4A3D]">Affiliate earns: </span>
                        <span className="font-semibold text-emerald-600">{commissionRates.affiliateCommission}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Feature Toggles</CardTitle>
                    <CardDescription>Enable or disable platform features. {enabledFeatureCount} of {FEATURES.length} enabled.</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-[#8A6A4A]/10 text-[#8A6A4A] border-[#8A6A4A]/20 text-[10px]">
                    {enabledFeatureCount}/{FEATURES.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {FEATURES.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between rounded-lg border border-[#E8DDD0] p-4 hover:bg-[#F5EDE3]/30 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-medium text-[#1D1D1D]">{feature.label}</p>
                      <p className="text-sm text-[#5C4A3D]">{feature.description}</p>
                    </div>
                    <Switch
                      checked={featureToggles[feature.key as keyof typeof featureToggles]}
                      onCheckedChange={(checked) => updateFeature(feature.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {ACTIVITY_LOG.map((entry) => {
                const colors = ACTIVITY_COLORS[entry.type] || ACTIVITY_COLORS.update;
                return (
                  <div key={entry.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                    <div className={cn("h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0", colors.bg, colors.icon)}>
                      {ACTIVITY_ICONS[entry.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#1D1D1D]">{entry.action}</p>
                      <p className="text-[10px] text-muted-foreground">{entry.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button onClick={() => handleSave(activeTab)} disabled={saving} className="bg-[#8A6A4A] hover:bg-[#7A5A3A] text-white">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleResetTab} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">
            <Undo2 className="mr-2 h-4 w-4" />
            Reset Current Tab
          </Button>
          <Button variant="outline" onClick={() => setResetDialogOpen(true)} className="border-[#E8DDD0] text-red-500 hover:bg-red-50 hover:text-red-600">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restore Defaults
          </Button>
        </div>
      </motion.div>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Restore All Defaults
            </DialogTitle>
            <DialogDescription>
              This will reset all settings across every tab to their default values. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">Cancel</Button>
            <Button variant="destructive" onClick={handleRestoreDefaults}>Restore Defaults</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
