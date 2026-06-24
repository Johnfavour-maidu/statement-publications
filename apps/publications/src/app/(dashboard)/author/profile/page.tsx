"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Save,
  Globe,
  AtSign,
  Share2,
  Link2,
  BookOpen,
  Eye,
  User,
  Shield,
  Bell,
  Settings,
  Lock,
  Mail,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const genreOptions = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery",
  "Romance", "Thriller", "Biography", "Self-Help", "Poetry",
  "Children's", "History", "Horror", "Adventure", "Literary Fiction",
];

interface ProfileData {
  penName: string;
  bio: string;
  website: string;
  twitter: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  genres: string[];
  avatarPreview: string;
}

const initialProfile: ProfileData = {
  penName: "Sarah Mitchell",
  bio: "Award-winning author of literary fiction and personal finance books. My writing explores themes of wealth building, financial independence, and the human relationship with money. Author of 'Financial Freedom' and 'The Wealth Blueprint'.",
  website: "https://sarahmitchell-author.com",
  twitter: "@sarah_writes",
  instagram: "@sarah.mitchell",
  facebook: "SarahMitchellAuthor",
  linkedin: "sarah-mitchell",
  genres: ["Non-Fiction", "Self-Help", "Business"],
  avatarPreview: "",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [email, setEmail] = useState("sarah@example.com");
  const [penName, setPenName] = useState("Sarah Mitchell");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleGenre = (genre: string) => {
    setProfile((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfile((prev) => ({
        ...prev,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Premium Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Profile & Settings</h1>
          <p className="mt-1 text-sm text-[#6A4E37]">Manage your profile, account settings, and preferences.</p>
        </div>
        <div className="refresh-btn-border rounded-lg p-[2px]">
          <Button
            onClick={handleSave}
            className="rounded-[calc(0.5rem-2px)] bg-white px-4 py-2 text-sm font-medium text-[#1D1D1D] hover:bg-[#F5EDE3] transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border border-[#E8DDD0] bg-[#F5EDE3]/30 p-1">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D] data-[state=active]:shadow-sm px-4 py-2">
              <User className="h-4 w-4" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D] data-[state=active]:shadow-sm px-4 py-2">
              <Settings className="h-4 w-4" />
              Account Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D] data-[state=active]:shadow-sm px-4 py-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D] data-[state=active]:shadow-sm px-4 py-2">
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-[#E8DDD0] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-[#1D1D1D]">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-5">
                      <div className="group relative">
                        <Avatar className="h-20 w-20 ring-2 ring-[#E8DDD0] ring-offset-2 transition-all duration-200 group-hover:ring-[#D8B27A]/50">
                          <AvatarImage src={profile.avatarPreview || undefined} />
                          <AvatarFallback className="bg-[#F2D8BE] text-[#8A6A4A] text-xl font-semibold">
                            {getInitials(profile.penName)}
                          </AvatarFallback>
                        </Avatar>
                        <Label htmlFor="avatar" className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-[#1D1D1D]/0 text-[#1D1D1D]/0 transition-all duration-200 group-hover:bg-[#1D1D1D]/40 group-hover:text-white">
                          <Camera className="h-5 w-5" />
                          <input id="avatar" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </Label>
                      </div>
                      <div>
                        <p className="font-medium text-[#1D1D1D]">Profile Photo</p>
                        <p className="text-xs text-[#6A4E37] mt-0.5">JPG, PNG or WebP. Max 2MB.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="penName" className="text-sm font-medium text-[#1D1D1D]">Pen Name</Label>
                      <Input
                        id="penName"
                        value={profile.penName}
                        onChange={(e) => updateField("penName", e.target.value)}
                        className="border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bio" className="text-sm font-medium text-[#1D1D1D]">Bio</Label>
                        <span className="text-xs text-[#6A4E37] tabular-nums">{profile.bio.length}/500</span>
                      </div>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        className="border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium text-[#1D1D1D]">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input
                          id="website"
                          placeholder="https://yourwebsite.com"
                          className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                          value={profile.website}
                          onChange={(e) => updateField("website", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E8DDD0] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-[#1D1D1D]">Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-sm font-medium text-[#1D1D1D]">Twitter / X</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input
                          id="twitter"
                          placeholder="@username"
                          className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                          value={profile.twitter}
                          onChange={(e) => updateField("twitter", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-sm font-medium text-[#1D1D1D]">Instagram</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input
                          id="instagram"
                          placeholder="@username"
                          className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                          value={profile.instagram}
                          onChange={(e) => updateField("instagram", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="text-sm font-medium text-[#1D1D1D]">Facebook</Label>
                      <div className="relative">
                        <Share2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input
                          id="facebook"
                          placeholder="Page name"
                          className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                          value={profile.facebook}
                          onChange={(e) => updateField("facebook", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sm font-medium text-[#1D1D1D]">LinkedIn</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input
                          id="linkedin"
                          placeholder="Profile slug"
                          className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                          value={profile.linkedin}
                          onChange={(e) => updateField("linkedin", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E8DDD0] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-[#1D1D1D]">Genre Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {genreOptions.map((genre) => (
                        <Badge
                          key={genre}
                          variant={profile.genres.includes(genre) ? "default" : "outline"}
                          className={`cursor-pointer transition-all duration-200 px-3 py-1 text-xs font-medium ${
                            profile.genres.includes(genre)
                              ? "bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] shadow-sm"
                              : "border-[#E8DDD0] text-[#6A4E37] hover:border-[#D8B27A]/50 hover:bg-[#F5EDE3]"
                          }`}
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-[#6A4E37]">Select up to 5 genres that best describe your writing.</p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Public Profile Preview */}
                <Card className="border border-[#E8DDD0] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#8A6A4A]" />
                      Public Profile Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl border border-[#E8DDD0] bg-gradient-to-b from-[#F5EDE3]/50 to-white p-5 text-center">
                      <Avatar className="mx-auto h-16 w-16 ring-2 ring-white shadow-md">
                        <AvatarImage src={profile.avatarPreview || undefined} />
                        <AvatarFallback className="bg-[#F2D8BE] text-[#8A6A4A] text-lg font-semibold">
                          {getInitials(profile.penName)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mt-3 text-lg font-bold text-[#1D1D1D]">{profile.penName || "Your Name"}</h3>
                      {profile.bio && <p className="mt-2 text-sm text-[#6A4E37] leading-relaxed line-clamp-3">{profile.bio}</p>}
                      {profile.genres.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                          {profile.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs bg-[#F2D8BE] text-[#8A6A4A] px-2 py-0.5 font-medium">{genre}</Badge>
                          ))}
                          {profile.genres.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-[#F2D8BE] text-[#8A6A4A] px-2 py-0.5 font-medium">+{profile.genres.length - 3}</Badge>
                          )}
                        </div>
                      )}
                      {profile.website && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#8A6A4A]">
                          <Globe className="h-3 w-3" />
                          <span>{profile.website.replace(/https?:\/\//, "")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Author Stats */}
                <Card className="border border-[#E8DDD0] shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#8A6A4A]" />
                      Author Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    {[
                      { label: "Books Published", value: "12" },
                      { label: "Total Sales", value: "1,847" },
                      { label: "Average Rating", value: "4.7 ★" },
                      { label: "Followers", value: "342" },
                      { label: "Member Since", value: "Jan 2024" },
                    ].map((stat, i) => (
                      <div key={stat.label}>
                        <div className="flex justify-between items-center py-2.5">
                          <span className="text-sm text-[#6A4E37]">{stat.label}</span>
                          <span className="text-sm font-bold text-[#1D1D1D] tabular-nums">{stat.value}</span>
                        </div>
                        {i < 4 && <div className="h-px bg-[#E8DDD0]/60" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <Card className="border border-[#E8DDD0] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#1D1D1D]">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-email" className="text-sm font-medium text-[#1D1D1D]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input
                        id="account-email"
                        type="email"
                        className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-penname" className="text-sm font-medium text-[#1D1D1D]">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input
                        id="account-penname"
                        className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                        value={penName}
                        onChange={(e) => setPenName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#1D1D1D]">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#1D1D1D]">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <Card className="border border-[#E8DDD0] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#1D1D1D] flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#8A6A4A]" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-medium text-[#1D1D1D]">Current Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input
                        id="current-password"
                        type="password"
                        className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-[#1D1D1D]">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input
                        id="new-password"
                        type="password"
                        className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-[#1D1D1D]">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input
                        id="confirm-password"
                        type="password"
                        className="pl-9 border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
                      <Shield className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#E8DDD0] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#1D1D1D]">Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-xl border border-[#E8DDD0] p-4">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Authenticator App</p>
                      <p className="text-xs text-[#6A4E37] mt-0.5">Use an authenticator app to generate one-time codes.</p>
                    </div>
                    <Button variant="outline" className="border-[#E8DDD0] hover:border-[#D8B27A]/50 hover:bg-[#F5EDE3] transition-colors">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <Card className="border border-[#E8DDD0] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#1D1D1D] flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#8A6A4A]" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-[#E8DDD0] p-4 hover:border-[#D8B27A]/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Email Notifications</p>
                      <p className="text-xs text-[#6A4E37] mt-0.5">Receive email updates about your books and earnings.</p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${emailNotifications ? "bg-[#D8B27A]" : "bg-[#E8DDD0]"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${emailNotifications ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E8DDD0] p-4 hover:border-[#D8B27A]/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Marketing Emails</p>
                      <p className="text-xs text-[#6A4E37] mt-0.5">Receive tips, promotions, and platform updates.</p>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${marketingEmails ? "bg-[#D8B27A]" : "bg-[#E8DDD0]"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${marketingEmails ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#E8DDD0] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#1D1D1D]">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#1D1D1D]">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger className="border-[#E8DDD0] bg-white focus:border-[#D8B27A] focus:ring-[#D8B27A]/20 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
