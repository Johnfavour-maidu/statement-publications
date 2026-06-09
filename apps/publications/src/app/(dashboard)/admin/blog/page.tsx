"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorEmail: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
  createdAt: string;
  avatarColor: string;
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Rise of African Literature in 2025",
    slug: "rise-african-literature-2025",
    excerpt: "Exploring the growing influence of African authors on the global literary stage.",
    content: "African literature has seen unprecedented growth in recent years...",
    author: "Amara Okafor",
    authorEmail: "amara@example.com",
    category: "Industry",
    tags: ["african literature", "trends", "2025"],
    isPublished: true,
    isFeatured: true,
    viewCount: 4523,
    likeCount: 234,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    avatarColor: "bg-blue-500",
  },
  {
    id: "2",
    title: "How to Self-Publish Your First Book",
    slug: "self-publish-first-book",
    excerpt: "A comprehensive guide for first-time authors looking to self-publish.",
    content: "Self-publishing has become increasingly accessible...",
    author: "David Mensah",
    authorEmail: "david@example.com",
    category: "Publishing",
    tags: ["self-publishing", "guide", "authors"],
    isPublished: true,
    isFeatured: false,
    viewCount: 3210,
    likeCount: 189,
    publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    avatarColor: "bg-emerald-500",
  },
  {
    id: "3",
    title: "Understanding Royalties: A Complete Guide",
    slug: "understanding-royalties",
    excerpt: "Everything authors need to know about earning royalties on Statement.",
    content: "Royalties are the primary way authors earn income...",
    author: "Fatima Al-Rashid",
    authorEmail: "fatima@example.com",
    category: "Finance",
    tags: ["royalties", "payments", "guide"],
    isPublished: true,
    isFeatured: true,
    viewCount: 2876,
    likeCount: 156,
    publishedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    avatarColor: "bg-amber-500",
  },
  {
    id: "4",
    title: "Top 10 Writing Tips for Beginners",
    slug: "writing-tips-beginners",
    excerpt: "Essential writing tips to help you craft compelling stories.",
    content: "Writing is a craft that requires dedication and practice...",
    author: "Nadia El-Amin",
    authorEmail: "nadia@example.com",
    category: "Writing",
    tags: ["writing tips", "beginners", "craft"],
    isPublished: false,
    isFeatured: false,
    viewCount: 0,
    likeCount: 0,
    publishedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    avatarColor: "bg-pink-500",
  },
  {
    id: "5",
    title: "Statement Publications Year in Review",
    slug: "year-in-review-2025",
    excerpt: "A look back at our achievements and milestones in 2025.",
    content: "2025 has been an incredible year for Statement Publications...",
    author: "Admin User",
    authorEmail: "admin@statementpub.com",
    category: "Company",
    tags: ["year in review", "milestones", "company"],
    isPublished: false,
    isFeatured: false,
    viewCount: 0,
    likeCount: 0,
    publishedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    avatarColor: "bg-slate-700",
  },
  {
    id: "6",
    title: "The Future of Digital Publishing",
    slug: "future-digital-publishing",
    excerpt: "How technology is transforming the publishing industry.",
    content: "Digital publishing continues to evolve rapidly...",
    author: "Emeka Nwachukwu",
    authorEmail: "emeka@example.com",
    category: "Industry",
    tags: ["digital publishing", "technology", "future"],
    isPublished: true,
    isFeatured: false,
    viewCount: 1892,
    likeCount: 98,
    publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString(),
    avatarColor: "bg-teal-500",
  },
  {
    id: "7",
    title: "Building Your Author Platform",
    slug: "building-author-platform",
    excerpt: "Strategies for building a loyal readership and online presence.",
    content: "Every author needs a strong platform...",
    author: "Tariq Hassan",
    authorEmail: "tariq@example.com",
    category: "Marketing",
    tags: ["author platform", "marketing", "social media"],
    isPublished: true,
    isFeatured: false,
    viewCount: 2345,
    likeCount: 134,
    publishedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    avatarColor: "bg-lime-500",
  },
  {
    id: "8",
    title: "New Features: Audiobook Support",
    slug: "audiobook-support",
    excerpt: "Introducing our new audiobook publishing feature.",
    content: "We're excited to announce that audiobook support is now live...",
    author: "Admin User",
    authorEmail: "admin@statementpub.com",
    category: "Updates",
    tags: ["audiobook", "features", "announcement"],
    isPublished: true,
    isFeatured: true,
    viewCount: 5678,
    likeCount: 312,
    publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    avatarColor: "bg-slate-700",
  },
];

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

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Industry",
    tags: "",
  });

  const filteredPosts = posts.filter((post) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && post.isPublished) ||
      (filter === "draft" && !post.isPublished);
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.isPublished).length,
    draft: posts.filter((p) => !p.isPublished).length,
  };

  const handleCreatePost = () => {
    const slug = newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setPosts([
      {
        id: Date.now().toString(),
        title: newPost.title,
        slug,
        excerpt: newPost.excerpt,
        content: newPost.content,
        author: "Admin User",
        authorEmail: "admin@statementpub.com",
        category: newPost.category,
        tags: newPost.tags.split(",").map((t) => t.trim()),
        isPublished: false,
        isFeatured: false,
        viewCount: 0,
        likeCount: 0,
        publishedAt: null,
        createdAt: new Date().toISOString(),
        avatarColor: "bg-slate-700",
      },
      ...posts,
    ]);
    setCreateDialogOpen(false);
    setNewPost({ title: "", excerpt: "", content: "", category: "Industry", tags: "" });
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    }
  };

  const togglePublish = (id: string) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              isPublished: !p.isPublished,
              publishedAt: !p.isPublished ? new Date().toISOString() : null,
            }
          : p
      )
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Create and manage blog posts for the Statement platform.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          New Post
        </Button>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "published" | "draft")}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="published">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Published ({counts.published})
            </TabsTrigger>
            <TabsTrigger value="draft">
              <Clock className="mr-1 h-3.5 w-3.5" />
              Drafts ({counts.draft})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Likes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <p className="mt-4 text-lg font-medium">No posts found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{post.title}</p>
                                {post.isFeatured && (
                                  <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                                {post.excerpt}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`${post.avatarColor} text-white text-[10px]`}>
                                  {getInitials(post.author)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{post.author}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{post.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {post.isPublished ? (
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <Clock className="mr-1 h-3 w-3" />
                                Draft
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              {post.viewCount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm text-muted-foreground">
                              {post.likeCount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {post.publishedAt
                              ? formatDate(post.publishedAt)
                              : formatDate(post.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8"
                                onClick={() => togglePublish(post.id)}
                              >
                                {post.isPublished ? (
                                  <Clock className="h-4 w-4" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setSelectedPost(post);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Write a new blog post for the Statement platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title..."
              />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Brief description of the post..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your post content..."
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  placeholder="e.g., Industry, Writing"
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="e.g., tips, writing, publishing"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={!newPost.title.trim()}>
              <FileText className="mr-1 h-4 w-4" />
              Create Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedPost?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
