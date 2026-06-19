"use client";

import { motion } from "framer-motion";
import { Mail, Send, Users, Megaphone, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  { label: "Subscribers", value: "0", icon: Users, color: "text-blue-500" },
  { label: "Campaigns Sent", value: "0", icon: Send, color: "text-emerald-500" },
  { label: "Open Rate", value: "0%", icon: Mail, color: "text-amber-500" },
];

export default function MarketingPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground">
            Manage newsletter subscribers, campaigns, and templates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90"
            disabled
          >
            <Megaphone className="h-4 w-4 mr-1" />
            New Campaign
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-full bg-muted p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="subscribers">
          <TabsList>
            <TabsTrigger value="subscribers">
              <Users className="mr-1 h-3.5 w-3.5" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <Send className="mr-1 h-3.5 w-3.5" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Mail className="mr-1 h-3.5 w-3.5" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search subscribers..."
                      className="pl-9"
                      disabled
                    />
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-lg font-medium">
                          No newsletter subscribers yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Subscribers will appear here once users sign up for your
                          newsletter.
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Send className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      className="pl-9"
                      disabled
                    />
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90"
                    disabled
                  >
                    <Megaphone className="h-4 w-4 mr-1" />
                    Create Campaign
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Open Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-lg font-medium">
                          No campaigns sent yet. Create your first email campaign.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Track performance and engagement for each campaign you
                          send.
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      className="pl-9"
                      disabled
                    />
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/90"
                    disabled
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    New Template
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-lg font-medium">
                          No email templates yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create reusable templates to speed up your email
                          campaigns.
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
