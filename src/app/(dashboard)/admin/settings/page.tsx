"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  CreditCard,
  Mail,
  Percent,
  ToggleLeft,
  Save,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminSettingsPage() {
  const [platformSettings, setPlatformSettings] = useState({
    name: "Statement Publications",
    tagline: "Discover African Literature at Its Finest",
    description: "A leading digital publishing platform connecting African authors with readers worldwide.",
    supportEmail: "support@statementpub.com",
    logo: null as string | null,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    mobileMoneyEnabled: true,
    bankTransferEnabled: true,
    minimumPayout: 50,
    payoutSchedule: "monthly",
    autoPayout: true,
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
  });

  const [commissionRates, setCommissionRates] = useState({
    standardRate: 20,
    premiumAuthorRate: 15,
    audiobookRate: 25,
    printRate: 20,
    premiumThreshold: 50,
  });

  const [featureToggles, setFeatureToggles] = useState({
    audiobooks: true,
    printOnDemand: false,
    affiliateProgram: true,
    authorVerification: true,
    bookRecommendations: true,
    socialFeatures: true,
    darkMode: true,
    betaFeatures: false,
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings, payment options, and feature toggles.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="platform">
          <TabsList>
            <TabsTrigger value="platform">
              <Globe className="mr-1 h-3.5 w-3.5" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="mr-1 h-3.5 w-3.5" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-1 h-3.5 w-3.5" />
              Email
            </TabsTrigger>
            <TabsTrigger value="commission">
              <Percent className="mr-1 h-3.5 w-3.5" />
              Commission
            </TabsTrigger>
            <TabsTrigger value="features">
              <ToggleLeft className="mr-1 h-3.5 w-3.5" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure your platform name, description, and general settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      SP
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-1 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Recommended: 512x512px PNG or SVG
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input
                    value={platformSettings.name}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={platformSettings.tagline}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, tagline: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={platformSettings.description}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })
                    }
                  />
                </div>

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Gateways</CardTitle>
                  <CardDescription>
                    Enable or disable payment methods for your platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "stripeEnabled", label: "Stripe", description: "Accept credit/debit cards via Stripe" },
                    { key: "paypalEnabled", label: "PayPal", description: "Accept payments via PayPal" },
                    { key: "mobileMoneyEnabled", label: "Mobile Money", description: "Accept MTN, Vodafone, and AirtelTigo payments" },
                    { key: "bankTransferEnabled", label: "Bank Transfer", description: "Accept direct bank transfers" },
                  ].map((gateway) => (
                    <div key={gateway.key} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <p className="font-medium">{gateway.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {gateway.description}
                        </p>
                      </div>
                      <Switch
                        checked={paymentSettings[gateway.key as keyof typeof paymentSettings] as boolean}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, [gateway.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Settings</CardTitle>
                  <CardDescription>
                    Configure how authors receive their earnings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Payout Amount ($)</Label>
                    <Input
                      type="number"
                      value={paymentSettings.minimumPayout}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          minimumPayout: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="font-medium">Automatic Payouts</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically process payouts on schedule
                      </p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoPayout}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({ ...paymentSettings, autoPayout: checked })
                      }
                    />
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure which email notifications are sent to users.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "welcomeEmail", label: "Welcome Email", description: "Send welcome email to new users" },
                    { key: "orderConfirmation", label: "Order Confirmation", description: "Send confirmation after purchase" },
                    { key: "bookApproval", label: "Book Approval", description: "Notify authors when books are approved/rejected" },
                    { key: "royaltyPaid", label: "Royalty Paid", description: "Notify authors when royalties are paid" },
                    { key: "withdrawalUpdate", label: "Withdrawal Updates", description: "Notify authors about withdrawal status" },
                    { key: "newsletter", label: "Newsletter", description: "Weekly newsletter to all users" },
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <p className="font-medium">{notification.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings[notification.key as keyof typeof emailSettings] as boolean}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, [notification.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SMTP Configuration</CardTitle>
                  <CardDescription>
                    Configure your email server settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={emailSettings.smtpHost}
                        onChange={(e) =>
                          setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input
                        value={emailSettings.smtpPort}
                        onChange={(e) =>
                          setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commission" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Rates</CardTitle>
                <CardDescription>
                  Set the platform commission rates for different book formats and author tiers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Standard Commission Rate (%)</Label>
                    <Input
                      type="number"
                      value={commissionRates.standardRate}
                      onChange={(e) =>
                        setCommissionRates({
                          ...commissionRates,
                          standardRate: Number(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Applied to all standard authors
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Premium Author Rate (%)</Label>
                    <Input
                      type="number"
                      value={commissionRates.premiumAuthorRate}
                      onChange={(e) =>
                        setCommissionRates({
                          ...commissionRates,
                          premiumAuthorRate: Number(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      For authors exceeding threshold
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Audiobook Commission (%)</Label>
                    <Input
                      type="number"
                      value={commissionRates.audiobookRate}
                      onChange={(e) =>
                        setCommissionRates({
                          ...commissionRates,
                          audiobookRate: Number(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Applied to audiobook sales
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Print Book Commission (%)</Label>
                    <Input
                      type="number"
                      value={commissionRates.printRate}
                      onChange={(e) =>
                        setCommissionRates({
                          ...commissionRates,
                          printRate: Number(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Applied to print book sales
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Premium Author Threshold (total sales $)</Label>
                  <Input
                    type="number"
                    value={commissionRates.premiumThreshold}
                    onChange={(e) =>
                      setCommissionRates({
                        ...commissionRates,
                        premiumThreshold: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Authors reaching this sales threshold qualify for premium rates
                  </p>
                </div>

                <Separator />

                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium mb-2">Commission Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Standard Author earns: </span>
                      <span className="font-semibold text-emerald-600">{100 - commissionRates.standardRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platform keeps: </span>
                      <span className="font-semibold">{commissionRates.standardRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Premium Author earns: </span>
                      <span className="font-semibold text-emerald-600">{100 - commissionRates.premiumAuthorRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platform keeps: </span>
                      <span className="font-semibold">{commissionRates.premiumAuthorRate}%</span>
                    </div>
                  </div>
                </div>

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable or disable platform features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "audiobooks", label: "Audiobooks", description: "Enable audiobook publishing and playback" },
                  { key: "printOnDemand", label: "Print on Demand", description: "Enable print-on-demand for physical books" },
                  { key: "affiliateProgram", label: "Affiliate Program", description: "Enable the affiliate referral program" },
                  { key: "authorVerification", label: "Author Verification", description: "Require admin verification for new authors" },
                  { key: "bookRecommendations", label: "Book Recommendations", description: "Enable personalized book recommendations" },
                  { key: "socialFeatures", label: "Social Features", description: "Enable following, reviews, and social interactions" },
                  { key: "darkMode", label: "Dark Mode", description: "Allow users to switch to dark mode" },
                  { key: "betaFeatures", label: "Beta Features", description: "Enable experimental beta features" },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="font-medium">{feature.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={featureToggles[feature.key as keyof typeof featureToggles]}
                      onCheckedChange={(checked) =>
                        setFeatureToggles({ ...featureToggles, [feature.key]: checked })
                      }
                    />
                  </div>
                ))}

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
