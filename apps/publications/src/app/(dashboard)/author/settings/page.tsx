"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Lock,
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthorSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    newSale: true,
    newReview: true,
    bookApproved: true,
    bookRejected: true,
    royaltyPaid: true,
    newFollower: false,
    weeklyReport: true,
    monthlyReport: true,
    marketingEmails: false,
    productUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showEarnings: false,
    profilePublic: true,
    showBooks: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4 hidden sm:block" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4 hidden sm:block" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="mr-2 h-4 w-4 hidden sm:block" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4 hidden sm:block" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Adaeze Nwosu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="adaeze@statementpub.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      defaultValue="Africa/Lagos (WAT)"
                      readOnly
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Connected Accounts</h4>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-muted-foreground">
                          adaeze@statementpub.com
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-xs text-muted-foreground">
                          Not connected
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">New Sale</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when someone purchases your book
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newSale}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({ ...prev, newSale: v }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">New Review</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when someone reviews your book
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newReview}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({ ...prev, newReview: v }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">New Follower</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when someone follows your profile
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newFollower}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({ ...prev, newFollower: v }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book Status Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Book Approved</p>
                    <p className="text-xs text-muted-foreground">
                      When your book passes review
                    </p>
                  </div>
                  <Switch
                    checked={notifications.bookApproved}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        bookApproved: v,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Book Rejected</p>
                    <p className="text-xs text-muted-foreground">
                      When your book doesn&apos;t pass review
                    </p>
                  </div>
                  <Switch
                    checked={notifications.bookRejected}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        bookRejected: v,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Royalty Paid</p>
                    <p className="text-xs text-muted-foreground">
                      When your royalty payment is processed
                    </p>
                  </div>
                  <Switch
                    checked={notifications.royaltyPaid}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        royaltyPaid: v,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Weekly Report</p>
                    <p className="text-xs text-muted-foreground">
                      Receive weekly sales and earnings summary
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        weeklyReport: v,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Monthly Report</p>
                    <p className="text-xs text-muted-foreground">
                      Receive monthly performance report
                    </p>
                  </div>
                  <Switch
                    checked={notifications.monthlyReport}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        monthlyReport: v,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Marketing Emails</p>
                    <p className="text-xs text-muted-foreground">
                      Receive tips and promotional content
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        marketingEmails: v,
                      }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Product Updates</p>
                    <p className="text-xs text-muted-foreground">
                      New features and platform updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.productUpdates}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        productUpdates: v,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Public Profile</p>
                    <p className="text-xs text-muted-foreground">
                      Make your author profile visible to readers
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profilePublic}
                    onCheckedChange={(v) =>
                      setPrivacy((prev) => ({ ...prev, profilePublic: v }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Show Email</p>
                    <p className="text-xs text-muted-foreground">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(v) =>
                      setPrivacy((prev) => ({ ...prev, showEmail: v }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Show Earnings</p>
                    <p className="text-xs text-muted-foreground">
                      Display total earnings on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showEarnings}
                    onCheckedChange={(v) =>
                      setPrivacy((prev) => ({ ...prev, showEarnings: v }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Show Books</p>
                    <p className="text-xs text-muted-foreground">
                      Display your books on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showBooks}
                    onCheckedChange={(v) =>
                      setPrivacy((prev) => ({ ...prev, showBooks: v }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) =>
                        handlePasswordChange("current", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwords.new}
                    onChange={(e) =>
                      handlePasswordChange("new", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with a number and special character.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      handlePasswordChange("confirm", e.target.value)
                    }
                  />
                  {passwords.confirm &&
                    passwords.new !== passwords.confirm && (
                      <p className="text-xs text-destructive">
                        Passwords do not match
                      </p>
                    )}
                </div>

                <Button
                  className="mt-2"
                  disabled={
                    !passwords.current ||
                    !passwords.new ||
                    passwords.new !== passwords.confirm
                  }
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button variant="destructive" className="mt-4">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
