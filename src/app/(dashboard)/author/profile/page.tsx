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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const genreOptions = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "Biography",
  "Self-Help",
  "Poetry",
  "Children's",
  "History",
  "Horror",
  "Adventure",
  "Literary Fiction",
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
  penName: "Adaeze Nwosu",
  bio: "Award-winning author of literary fiction and science fiction. Born in Lagos, Nigeria, and currently based in London. My writing explores themes of identity, technology, and the human condition. Author of 'The Last Horizon' and 'Echoes of Tomorrow'.",
  website: "https://adaeze-author.com",
  twitter: "@adaeze_writes",
  instagram: "@adaeze.nwosu",
  facebook: "AdaezeNwosuAuthor",
  linkedin: "adaeze-nwosu",
  genres: ["Fiction", "Science Fiction", "Literary Fiction"],
  avatarPreview: "",
};

export default function AuthorProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [saved, setSaved] = useState(false);

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
          <h1 className="text-2xl font-bold tracking-tight">Author Profile</h1>
          <p className="text-muted-foreground">
            Manage your public author profile and bio.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatarPreview || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(profile.penName)}
                    </AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="avatar"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Label>
                </div>
                <div>
                  <p className="font-medium">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WebP. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="penName">Pen Name</Label>
                <Input
                  id="penName"
                  value={profile.penName}
                  onChange={(e) => updateField("penName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    className="pl-9"
                    value={profile.website}
                    onChange={(e) => updateField("website", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="twitter"
                    placeholder="@username"
                    className="pl-9"
                    value={profile.twitter}
                    onChange={(e) => updateField("twitter", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="instagram"
                    placeholder="@username"
                    className="pl-9"
                    value={profile.instagram}
                    onChange={(e) => updateField("instagram", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <div className="relative">
                  <Share2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="facebook"
                    placeholder="Page name"
                    className="pl-9"
                    value={profile.facebook}
                    onChange={(e) => updateField("facebook", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    placeholder="Profile slug"
                    className="pl-9"
                    value={profile.linkedin}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Genre Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {genreOptions.map((genre) => (
                  <Badge
                    key={genre}
                    variant={
                      profile.genres.includes(genre) ? "default" : "outline"
                    }
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Select up to 5 genres that best describe your writing.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Public Profile Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4 text-center">
                <Avatar className="mx-auto h-16 w-16">
                  <AvatarImage src={profile.avatarPreview || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(profile.penName)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-3 text-lg font-semibold">
                  {profile.penName || "Your Name"}
                </h3>
                {profile.bio && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {profile.bio}
                  </p>
                )}
                {profile.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {profile.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {profile.genres.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{profile.genres.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                {profile.website && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-primary">
                    <Globe className="h-3 w-3" />
                    {profile.website.replace(/https?:\/\//, "")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Author Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Books Published</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Sales</span>
                <span className="font-medium">1,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Rating</span>
                <span className="font-medium">4.7 ★</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Followers</span>
                <span className="font-medium">342</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
