"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Check,
  X,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

type BookStatus = "all" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";

interface Book {
  id: string;
  title: string;
  author: string;
  authorEmail: string;
  category: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  submittedDate: string;
  coverColor: string;
  price: number;
  format: string;
  rejectionReason?: string;
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Shadows of Yesterday",
    author: "Adaeze Nwosu",
    authorEmail: "adaeze@example.com",
    category: "Fiction",
    status: "SUBMITTED",
    submittedDate: new Date(Date.now() - 86400000).toISOString(),
    coverColor: "bg-blue-500",
    price: 13.99,
    format: "EBOOK",
  },
  {
    id: "2",
    title: "The Golden Path",
    author: "Tariq Hassan",
    authorEmail: "tariq@example.com",
    category: "Self-Help",
    status: "SUBMITTED",
    submittedDate: new Date(Date.now() - 172800000).toISOString(),
    coverColor: "bg-amber-500",
    price: 16.99,
    format: "PAPERBACK",
  },
  {
    id: "3",
    title: "Echoes in Time",
    author: "Ngozi Okafor",
    authorEmail: "ngozi@example.com",
    category: "Science Fiction",
    status: "SUBMITTED",
    submittedDate: new Date(Date.now() - 259200000).toISOString(),
    coverColor: "bg-violet-500",
    price: 11.99,
    format: "EBOOK",
  },
  {
    id: "4",
    title: "Beneath the Surface",
    author: "Amina Diallo",
    authorEmail: "amina@example.com",
    category: "Mystery",
    status: "APPROVED",
    submittedDate: new Date(Date.now() - 345600000).toISOString(),
    coverColor: "bg-emerald-500",
    price: 19.99,
    format: "HARDCOVER",
  },
  {
    id: "5",
    title: "Whispers in the Dark",
    author: "Emeka Nwachukwu",
    authorEmail: "emeka@example.com",
    category: "Thriller",
    status: "APPROVED",
    submittedDate: new Date(Date.now() - 432000000).toISOString(),
    coverColor: "bg-rose-500",
    price: 14.99,
    format: "EBOOK",
  },
  {
    id: "6",
    title: "The Last Horizon",
    author: "Sofia Osei",
    authorEmail: "sofia@example.com",
    category: "Romance",
    status: "REJECTED",
    submittedDate: new Date(Date.now() - 518400000).toISOString(),
    coverColor: "bg-pink-500",
    price: 12.99,
    format: "EBOOK",
    rejectionReason: "Content does not meet our quality standards. Please revise and resubmit.",
  },
  {
    id: "7",
    title: "River of Stars",
    author: "Fatima Al-Rashid",
    authorEmail: "fatima@example.com",
    category: "Science Fiction",
    status: "PUBLISHED",
    submittedDate: new Date(Date.now() - 604800000).toISOString(),
    coverColor: "bg-cyan-500",
    price: 18.99,
    format: "HARDCOVER",
  },
  {
    id: "8",
    title: "Crimson Horizons",
    author: "Nadia El-Amin",
    authorEmail: "nadia@example.com",
    category: "Romance",
    status: "PUBLISHED",
    submittedDate: new Date(Date.now() - 691200000).toISOString(),
    coverColor: "bg-red-500",
    price: 16.99,
    format: "PAPERBACK",
  },
  {
    id: "9",
    title: "Midnight Echoes",
    author: "Kwame Asante",
    authorEmail: "kwame@example.com",
    category: "Mystery",
    status: "PUBLISHED",
    submittedDate: new Date(Date.now() - 777600000).toISOString(),
    coverColor: "bg-indigo-500",
    price: 14.99,
    format: "EBOOK",
  },
  {
    id: "10",
    title: "Beyond the Horizon",
    author: "Amara Okafor",
    authorEmail: "amara@example.com",
    category: "Fiction",
    status: "SUBMITTED",
    submittedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    coverColor: "bg-teal-500",
    price: 15.99,
    format: "PAPERBACK",
  },
  {
    id: "11",
    title: "The Silent Echo",
    author: "David Mensah",
    authorEmail: "david@example.com",
    category: "Literary Fiction",
    status: "PUBLISHED",
    submittedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    coverColor: "bg-slate-500",
    price: 12.99,
    format: "EBOOK",
  },
  {
    id: "12",
    title: "Desert Winds",
    author: "Tariq Hassan",
    authorEmail: "tariq@example.com",
    category: "Historical Fiction",
    status: "REJECTED",
    submittedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    coverColor: "bg-orange-500",
    price: 17.99,
    format: "HARDCOVER",
    rejectionReason: "Manuscript requires significant revision. The narrative structure needs improvement.",
  },
];

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }
> = {
  SUBMITTED: { label: "Pending Review", variant: "secondary", icon: Clock },
  APPROVED: { label: "Approved", variant: "default", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
  PUBLISHED: { label: "Published", variant: "outline", icon: CheckCircle2 },
};

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

export default function AdminBooksPage() {
  const [filter, setFilter] = useState<BookStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredBooks = mockBooks.filter((book) => {
    const matchesFilter = filter === "all" || book.status === filter;
    const matchesSearch =
      search === "" ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: mockBooks.length,
    SUBMITTED: mockBooks.filter((b) => b.status === "SUBMITTED").length,
    APPROVED: mockBooks.filter((b) => b.status === "APPROVED").length,
    REJECTED: mockBooks.filter((b) => b.status === "REJECTED").length,
    PUBLISHED: mockBooks.filter((b) => b.status === "PUBLISHED").length,
  };

  const handleApprove = (book: Book) => {
    setSelectedBook(book);
    setApproveDialogOpen(true);
  };

  const handleReject = (book: Book) => {
    setSelectedBook(book);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    setApproveDialogOpen(false);
    setSelectedBook(null);
  };

  const confirmReject = () => {
    setRejectDialogOpen(false);
    setSelectedBook(null);
    setRejectReason("");
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBooks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBooks.map((b) => b.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Book Approvals</h1>
        <p className="text-muted-foreground">
          Review and manage book submissions from authors.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedIds.length} selected</Badge>
            <Button size="sm" variant="outline">
              <Check className="mr-1 h-3.5 w-3.5" />
              Approve All
            </Button>
            <Button size="sm" variant="destructive">
              <X className="mr-1 h-3.5 w-3.5" />
              Reject All
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as BookStatus)}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="SUBMITTED">
              Pending ({counts.SUBMITTED})
            </TabsTrigger>
            <TabsTrigger value="APPROVED">
              Approved ({counts.APPROVED})
            </TabsTrigger>
            <TabsTrigger value="REJECTED">
              Rejected ({counts.REJECTED})
            </TabsTrigger>
            <TabsTrigger value="PUBLISHED">
              Published ({counts.PUBLISHED})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredBooks.length && filteredBooks.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <p className="mt-4 text-lg font-medium">No books found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBooks.map((book) => {
                        const statusInfo = statusConfig[book.status];
                        return (
                          <TableRow key={book.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(book.id)}
                                onChange={() => toggleSelect(book.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-8 rounded ${book.coverColor} flex items-center justify-center`}>
                                  <BookOpen className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium">{book.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {book.format} &middot; ${book.price}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(book.author)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{book.author}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{book.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusInfo.variant}>
                                <statusInfo.icon className="mr-1 h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(book.submittedDate)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {book.status === "SUBMITTED" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      onClick={() => handleApprove(book)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleReject(book)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button size="sm" variant="ghost" className="h-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve &quot;{selectedBook?.title}&quot; by {selectedBook?.author}? This book will be published on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} className="bg-emerald-600 hover:bg-emerald-700">
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Book</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting &quot;{selectedBook?.title}&quot; by {selectedBook?.author}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
