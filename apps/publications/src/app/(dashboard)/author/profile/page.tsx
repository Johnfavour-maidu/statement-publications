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

  // Account Settings state
  const [email, setEmail] = useState("sarah@example.com");
  const [penName, setPenName] = useState("Sarah Mitchell");

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences state
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
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Profile & Settings</h1>
          <p className="text-[#6A4E37]">
            Manage your profile, account settings, and preferences.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border border-[#E8DDD0] bg-[#F5EDE3]/30">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D]">
              <User className="h-4 w-4" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D]">
              <Settings className="h-4 w-4" />
              Account Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D]">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-[#D8B27A] data-[state=active]:text-[#1D1D1D]">
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-[#E8DDD0]">
                  <CardHeader>
                    <CardTitle className="text-base">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile.avatarPreview || undefined} />
                          <AvatarFallback className="bg-[#F2D8BE] text-[#8A6A4A] text-xl">
                            {getInitials(profile.penName)}
                          </AvatarFallback>
                        </Avatar>
                        <Label htmlFor="avatar" className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#D8B27A] text-[#1D1D1D] shadow-md hover:bg-[#c9a46a]">
                          <Camera className="h-4 w-4" />
                          <input id="avatar" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </Label>
                      </div>
                      <div>
                        <p className="font-medium text-[#1D1D1D]">Profile Photo</p>
                        <p className="text-xs text-[#6A4E37]">JPG, PNG or WebP. Max 2MB.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="penName" className="text-[#1D1D1D]">Pen Name</Label>
                      <Input id="penName" value={profile.penName} onChange={(e) => updateField("penName", e.target.value)} className="border-[#E8DDD0]" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-[#1D1D1D]">Bio</Label>
                      <Textarea id="bio" rows={4} value={profile.bio} onChange={(e) => updateField("bio", e.target.value)} className="border-[#E8DDD0]" />
                      <p className="text-xs text-[#6A4E37]">{profile.bio.length}/500 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-[#1D1D1D]">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input id="website" placeholder="https://yourwebsite.com" className="pl-9 border-[#E8DDD0]" value={profile.website} onChange={(e) => updateField("website", e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E8DDD0]">
                  <CardHeader>
                    <CardTitle className="text-base">Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-[#1D1D1D]">Twitter / X</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input id="twitter" placeholder="@username" className="pl-9 border-[#E8DDD0]" value={profile.twitter} onChange={(e) => updateField("twitter", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-[#1D1D1D]">Instagram</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input id="instagram" placeholder="@username" className="pl-9 border-[#E8DDD0]" value={profile.instagram} onChange={(e) => updateField("instagram", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="text-[#1D1D1D]">Facebook</Label>
                      <div className="relative">
                        <Share2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input id="facebook" placeholder="Page name" className="pl-9 border-[#E8DDD0]" value={profile.facebook} onChange={(e) => updateField("facebook", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-[#1D1D1D]">LinkedIn</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                        <Input id="linkedin" placeholder="Profile slug" className="pl-9 border-[#E8DDD0]" value={profile.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E8DDD0]">
                  <CardHeader>
                    <CardTitle className="text-base">Genre Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {genreOptions.map((genre) => (
                        <Badge
                          key={genre}
                          variant={profile.genres.includes(genre) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${profile.genres.includes(genre) ? "bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]" : "border-[#E8DDD0]"}`}
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

              <div className="space-y-6">
                <Card className="border border-[#E8DDD0]">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#8A6A4A]" />
                      Public Profile Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/30 p-4 text-center">
                      <Avatar className="mx-auto h-16 w-16">
                        <AvatarImage src={profile.avatarPreview || undefined} />
                        <AvatarFallback className="bg-[#F2D8BE] text-[#8A6A4A] text-lg">
                          {getInitials(profile.penName)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mt-3 text-lg font-semibold text-[#1D1D1D]">{profile.penName || "Your Name"}</h3>
                      {profile.bio && <p className="mt-2 text-sm text-[#6A4E37] line-clamp-3">{profile.bio}</p>}
                      {profile.genres.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                          {profile.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs bg-[#F2D8BE] text-[#8A6A4A]">{genre}</Badge>
                          ))}
                          {profile.genres.length > 3 && <Badge variant="secondary" className="text-xs bg-[#F2D8BE] text-[#8A6A4A]">+{profile.genres.length - 3}</Badge>}
                        </div>
                      )}
                      {profile.website && (
                        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[#8A6A4A]">
                          <Globe className="h-3 w-3" />
                          {profile.website.replace(/https?:\/\//, "")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E8DDD0]">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#8A6A4A]" />
                      Author Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6A4E37]">Books Published</span>
                      <span className="font-medium text-[#1D1D1D]">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6A4E37]">Total Sales</span>
                      <span className="font-medium text-[#1D1D1D]">1,847</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6A4E37]">Average Rating</span>
                      <span className="font-medium text-[#1D1D1D]">4.7 ★</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6A4E37]">Followers</span>
                      <span className="font-medium text-[#1D1D1D]">342</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6A4E37]">Member Since</span>
                      <span className="font-medium text-[#1D1D1D]">Jan 2024</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <Card className="border border-[#E8DDD0]">
                <CardHeader>
                  <CardTitle className="text-base">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-email" className="text-[#1D1D1D]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input id="account-email" type="email" className="pl-9 border-[#E8DDD0]" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-penname" className="text-[#1D1D1D]">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input id="account-penname" className="pl-9 border-[#E8DDD0]" value={penName} onChange={(e) => setPenName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1D1D1D]">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-[#E8DDD0]">
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
                    <Label className="text-[#1D1D1D]">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="border-[#E8DDD0]">
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
              <Card className="border border-[#E8DDD0]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#8A6A4A]" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-[#1D1D1D]">Current Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input id="current-password" type="password" className="pl-9 border-[#E8DDD0]" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-[#1D1D1D]">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input id="new-password" type="password" className="pl-9 border-[#E8DDD0]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-[#1D1D1D]">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
                      <Input id="confirm-password" type="password" className="pl-9 border-[#E8DDD0]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
                    <Shield className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-[#E8DDD0]">
                <CardHeader>
                  <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Authenticator App</p>
                      <p className="text-xs text-[#6A4E37]">Use an authenticator app to generate one-time codes.</p>
                    </div>
                    <Button variant="outline" className="border-[#E8DDD0]">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <Card className="border border-[#E8DDD0]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#8A6A4A]" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-[#E8DDD0] p-4">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Email Notifications</p>
                      <p className="text-xs text-[#6A4E37]">Receive email updates about your books and earnings.</p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? "bg-[#D8B27A]" : "bg-[#E8DDD0]"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E8DDD0] p-4">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D]">Marketing Emails</p>
                      <p className="text-xs text-[#6A4E37]">Receive tips, promotions, and platform updates.</p>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${marketingEmails ? "bg-[#D8B27A]" : "bg-[#E8DDD0]"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${marketingEmails ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#E8DDD0]">
                <CardHeader>
                  <CardTitle className="text-base">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[#1D1D1D]">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger className="border-[#E8DDD0]">
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
