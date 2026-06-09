"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  HelpCircle,
  MessageSquare,
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Save,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
}

const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "How do I publish a book on Statement?",
    answer: "To publish a book, create an author account, upload your manuscript, fill in the book details, and submit for review. Our editorial team will review your submission within 5-7 business days.",
    category: "Publishing",
    isActive: true,
  },
  {
    id: "2",
    question: "What are the royalty rates?",
    answer: "Authors earn 80% of net sales for ebooks and 60% for print books. Royalties are calculated monthly and paid out once your balance reaches $50 or more.",
    category: "Payments",
    isActive: true,
  },
  {
    id: "3",
    question: "How do I withdraw my earnings?",
    answer: "Navigate to your wallet in the dashboard, click 'Withdraw', and enter your bank details. Withdrawals are processed within 3-5 business days.",
    category: "Payments",
    isActive: true,
  },
  {
    id: "4",
    question: "Can I publish in multiple formats?",
    answer: "Yes! Statement supports ebook (EPUB, PDF), paperback, and hardcover formats. You can publish your book in any combination of these formats.",
    category: "Publishing",
    isActive: true,
  },
  {
    id: "5",
    question: "What file formats are accepted?",
    answer: "We accept EPUB, PDF, and DOCX for ebooks. For print books, we accept PDF with bleed settings. Audiobooks should be submitted as MP3 or M4B files.",
    category: "Technical",
    isActive: false,
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Chinua Adebayo",
    role: "Bestselling Author",
    content: "Statement Publications transformed my writing career. The platform is intuitive, the royalties are fair, and the support team is incredible.",
    rating: 5,
    isActive: true,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    role: "Indie Author",
    content: "I've published three books on Statement and the process gets easier every time. The analytics dashboard helps me understand my readers.",
    rating: 5,
    isActive: true,
  },
  {
    id: "3",
    name: "Kofi Mensah",
    role: "First-time Author",
    content: "As a first-time author, I was nervous about self-publishing. Statement made the entire process straightforward and stress-free.",
    rating: 4,
    isActive: true,
  },
  {
    id: "4",
    name: "Fatima Hassan",
    role: "Award-winning Author",
    content: "The global reach of Statement has helped me connect with readers across Africa and beyond. The platform truly understands African literature.",
    rating: 5,
    isActive: false,
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Holiday Sale - 30% Off All Ebooks",
    content: "Celebrate the holiday season with 30% off all ebooks from December 15th to January 5th. Use code HOLIDAY30 at checkout.",
    isActive: true,
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  },
  {
    id: "2",
    title: "New Audiobook Feature Launch",
    content: "We're excited to announce that audiobook support is now live! Authors can now upload and sell audiobooks directly on the platform.",
    isActive: true,
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    endDate: null,
  },
  {
    id: "3",
    title: "Scheduled Maintenance",
    content: "Statement will undergo scheduled maintenance on January 10th from 2:00 AM to 6:00 AM UTC. Some features may be temporarily unavailable.",
    isActive: false,
    startDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
];

const homepageContent = {
  heroTitle: "Discover African Literature at Its Finest",
  heroSubtitle: "Explore a curated collection of books from talented African authors. Read, publish, and connect with the literary community.",
  featuredTitle: "Featured Books",
  featuredSubtitle: "Hand-picked selections from our editorial team",
  ctaTitle: "Share Your Story with the World",
  ctaSubtitle: "Join thousands of authors who have published on Statement",
};

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

export default function AdminContentPage() {
  const [faqs, setFAQs] = useState(mockFAQs);
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [faqDialogOpen, setFAQDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "General" });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", role: "", content: "", rating: 5 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", endDate: "" });

  const [homepage, setHomepage] = useState(homepageContent);

  const handleSaveFAQ = () => {
    if (editingFAQ) {
      setFAQs(faqs.map((f) => (f.id === editingFAQ.id ? { ...f, ...newFAQ } : f)));
    } else {
      setFAQs([...faqs, { id: Date.now().toString(), ...newFAQ, isActive: true }]);
    }
    setFAQDialogOpen(false);
    setEditingFAQ(null);
    setNewFAQ({ question: "", answer: "", category: "General" });
  };

  const handleSaveTestimonial = () => {
    if (editingTestimonial) {
      setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? { ...t, ...newTestimonial } : t)));
    } else {
      setTestimonials([...testimonials, { id: Date.now().toString(), ...newTestimonial, isActive: true }]);
    }
    setTestimonialDialogOpen(false);
    setEditingTestimonial(null);
    setNewTestimonial({ name: "", role: "", content: "", rating: 5 });
  };

  const handleSaveAnnouncement = () => {
    setAnnouncements([
      ...announcements,
      {
        id: Date.now().toString(),
        ...newAnnouncement,
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: newAnnouncement.endDate ? new Date(newAnnouncement.endDate).toISOString() : null,
      },
    ]);
    setAnnouncementDialogOpen(false);
    setNewAnnouncement({ title: "", content: "", endDate: "" });
  };

  const toggleFAQActive = (id: string) => {
    setFAQs(faqs.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)));
  };

  const deleteFAQ = (id: string) => {
    setFAQs(faqs.filter((f) => f.id !== id));
  };

  const toggleTestimonialActive = (id: string) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Manage website content, FAQs, testimonials, and announcements.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="homepage">
          <TabsList>
            <TabsTrigger value="homepage">
              <FileText className="mr-1 h-3.5 w-3.5" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <HelpCircle className="mr-1 h-3.5 w-3.5" />
              FAQs ({faqs.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
              Testimonials ({testimonials.length})
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="mr-1 h-3.5 w-3.5" />
              Announcements ({announcements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homepage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Content</CardTitle>
                <CardDescription>
                  Edit the main content sections displayed on the homepage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hero Section</h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={homepage.heroTitle}
                      onChange={(e) =>
                        setHomepage({ ...homepage, heroTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                      value={homepage.heroSubtitle}
                      onChange={(e) =>
                        setHomepage({ ...homepage, heroSubtitle: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Featured Section</h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={homepage.featuredTitle}
                      onChange={(e) =>
                        setHomepage({ ...homepage, featuredTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={homepage.featuredSubtitle}
                      onChange={(e) =>
                        setHomepage({ ...homepage, featuredSubtitle: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Call to Action</h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={homepage.ctaTitle}
                      onChange={(e) =>
                        setHomepage({ ...homepage, ctaTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={homepage.ctaSubtitle}
                      onChange={(e) =>
                        setHomepage({ ...homepage, ctaSubtitle: e.target.value })
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
          </TabsContent>

          <TabsContent value="faqs" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>FAQ Management</CardTitle>
                  <CardDescription>
                    Manage frequently asked questions displayed on the help page.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingFAQ(null);
                    setNewFAQ({ question: "", answer: "", category: "General" });
                    setFAQDialogOpen(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add FAQ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{faq.question}</p>
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                            {!faq.isActive && (
                              <Badge variant="outline" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {faq.answer}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch
                            checked={faq.isActive}
                            onCheckedChange={() => toggleFAQActive(faq.id)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => {
                              setEditingFAQ(faq);
                              setNewFAQ({ question: faq.question, answer: faq.answer, category: faq.category });
                              setFAQDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-red-600 hover:text-red-700"
                            onClick={() => deleteFAQ(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Testimonial Management</CardTitle>
                  <CardDescription>
                    Manage customer testimonials displayed on the homepage.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setNewTestimonial({ name: "", role: "", content: "", rating: 5 });
                    setTestimonialDialogOpen(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Testimonial
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch
                            checked={testimonial.isActive}
                            onCheckedChange={() => toggleTestimonialActive(testimonial.id)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => {
                              setEditingTestimonial(testimonial);
                              setNewTestimonial({ name: testimonial.name, role: testimonial.role, content: testimonial.content, rating: testimonial.rating });
                              setTestimonialDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-red-600 hover:text-red-700"
                            onClick={() => deleteTestimonial(testimonial.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{testimonial.content}&quot;
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <span key={i} className="text-amber-400">&#9733;</span>
                        ))}
                      </div>
                      {!testimonial.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>
                    Create and manage platform-wide announcements.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setNewAnnouncement({ title: "", content: "", endDate: "" });
                    setAnnouncementDialogOpen(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  New Announcement
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{announcement.title}</p>
                            {announcement.isActive ? (
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <XCircle className="mr-1 h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {announcement.content}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started {formatDate(announcement.startDate)}
                            </span>
                            {announcement.endDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Ends {formatDate(announcement.endDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch
                            checked={announcement.isActive}
                            onCheckedChange={() => toggleAnnouncementActive(announcement.id)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-red-600 hover:text-red-700"
                            onClick={() => deleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={faqDialogOpen} onOpenChange={setFAQDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                placeholder="Enter the question..."
              />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                placeholder="Enter the answer..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={newFAQ.category}
                onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                placeholder="e.g., Publishing, Payments, Technical"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFAQDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFAQ} disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()}>
              <Save className="mr-1 h-4 w-4" />
              {editingFAQ ? "Save Changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                placeholder="Customer name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                placeholder="e.g., Bestselling Author, Indie Author"
              />
            </div>
            <div className="space-y-2">
              <Label>Testimonial</Label>
              <Textarea
                value={newTestimonial.content}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                placeholder="Write the testimonial..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTestimonial} disabled={!newTestimonial.name.trim() || !newTestimonial.content.trim()}>
              <Save className="mr-1 h-4 w-4" />
              {editingTestimonial ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create a new platform-wide announcement visible to all users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Announcement title..."
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Announcement content..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Input
                type="date"
                value={newAnnouncement.endDate}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAnnouncement} disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}>
              <Megaphone className="mr-1 h-4 w-4" />
              Publish Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
