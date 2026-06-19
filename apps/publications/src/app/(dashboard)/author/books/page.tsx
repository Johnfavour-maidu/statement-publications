"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  ArrowUpDown,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";

type BookStatus = "PUBLISHED" | "DRAFT" | "SUBMITTED" | "REJECTED";

interface Book {
  id: string;
  title: string;
  coverImage: string | null;
  status: BookStatus;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  format: string;
  category?: { name: string } | null;
}

interface BooksResponse {
  items: Book[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const statusConfig: Record<
  BookStatus,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }
> = {
  PUBLISHED: { label: "Published", variant: "success" },
  DRAFT: { label: "Draft", variant: "secondary" },
  SUBMITTED: { label: "Under Review", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export default function AuthorBooksPage() {
  const [booksData, setBooksData] = useState<BooksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [page, search, sortBy, sortOrder, activeTab]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
        sortBy,
        sortOrder,
      });

      if (search) params.set("search", search);
      if (activeTab !== "all") {
        const statusMap: Record<string, string> = {
          published: "PUBLISHED",
          draft: "DRAFT",
          under_review: "SUBMITTED",
          rejected: "REJECTED",
        };
        params.set("status", statusMap[activeTab] || "");
      }

      const response = await fetch(`/api/author/books?${params.toString()}`);
      const json = await response.json();
      if (json.success) {
        setBooksData(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const books = booksData?.items || [];
  const totalPages = booksData?.totalPages || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Books</h1>
          <p className="text-muted-foreground">
            Manage and track all your published books.
          </p>
        </div>
        <Button asChild className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
          <Link href="/author/books/new">
            <Plus className="h-4 w-4" />
            Upload New Book
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">
            All ({booksData?.total || 0})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft
          </TabsTrigger>
          <TabsTrigger value="under_review">
            Under Review
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <BooksTable books={books} />
          )}
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function BooksTable({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">No books found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <Button asChild className="mt-4 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
            <Link href="/author/books/new">
              <Plus className="h-4 w-4" />
              Upload New Book
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Cover
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Rating
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const status = statusConfig[book.status] || statusConfig.DRAFT;
                return (
                  <tr
                    key={book.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-12 w-9 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-9 items-center justify-center rounded-md bg-muted">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {book.format} &middot;{" "}
                          {formatDate(book.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {book.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {book.totalSales.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatCurrency(book.totalRevenue)}
                    </td>
                    <td className="px-4 py-3">
                      {book.averageRating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm">{book.averageRating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({book.totalReviews})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
