"use client";

import { useState, useMemo } from "react";
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
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type BookStatus = "PUBLISHED" | "DRAFT" | "UNDER_REVIEW" | "REJECTED";

interface MockBook {
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
}

const mockBooks: MockBook[] = [
  {
    id: "1",
    title: "The Last Horizon",
    coverImage: null,
    status: "PUBLISHED",
    totalSales: 487,
    totalRevenue: 6327.13,
    averageRating: 4.8,
    totalReviews: 124,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    format: "EBOOK",
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    coverImage: null,
    status: "PUBLISHED",
    totalSales: 312,
    totalRevenue: 4991.88,
    averageRating: 4.6,
    totalReviews: 89,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    format: "PAPERBACK",
  },
  {
    id: "3",
    title: "Whispers in the Dark",
    coverImage: null,
    status: "PUBLISHED",
    totalSales: 198,
    totalRevenue: 1977.02,
    averageRating: 4.9,
    totalReviews: 67,
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    format: "EBOOK",
  },
  {
    id: "4",
    title: "Beyond the Stars",
    coverImage: null,
    status: "UNDER_REVIEW",
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    format: "HARDCOVER",
  },
  {
    id: "5",
    title: "Crimson Tide",
    coverImage: null,
    status: "DRAFT",
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    format: "EBOOK",
  },
  {
    id: "6",
    title: "The Silent Witness",
    coverImage: null,
    status: "PUBLISHED",
    totalSales: 56,
    totalRevenue: 559.44,
    averageRating: 4.3,
    totalReviews: 18,
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    format: "EBOOK",
  },
  {
    id: "7",
    title: "Midnight Solitude",
    coverImage: null,
    status: "DRAFT",
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    format: "EBOOK",
  },
  {
    id: "8",
    title: "Fractured Dreams",
    coverImage: null,
    status: "REJECTED",
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    format: "PAPERBACK",
  },
  {
    id: "9",
    title: "River of Shadows",
    coverImage: null,
    status: "PUBLISHED",
    totalSales: 234,
    totalRevenue: 3038.66,
    averageRating: 4.7,
    totalReviews: 78,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    format: "PAPERBACK",
  },
  {
    id: "10",
    title: "The Forgotten Kingdom",
    coverImage: null,
    status: "UNDER_REVIEW",
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    format: "EBOOK",
  },
  {
    id: "11",
    title: "Autumn Whispers",
    coverImage: null,
    status: "PUBLISHED",
    totalSales: 89,
    totalRevenue: 889.11,
    averageRating: 4.4,
    totalReviews: 31,
    createdAt: new Date(Date.now() - 86400000 * 75).toISOString(),
    format: "EBOOK",
  },
  {
    id: "12",
    title: "Starlight Memoirs",
    coverImage: null,
    status: "DRAFT",
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    format: "HARDCOVER",
  },
];

const statusConfig: Record<
  BookStatus,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }
> = {
  PUBLISHED: { label: "Published", variant: "success" },
  DRAFT: { label: "Draft", variant: "secondary" },
  UNDER_REVIEW: { label: "Under Review", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export default function AuthorBooksPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredBooks = useMemo(() => {
    let books = [...mockBooks];

    if (search) {
      books = books.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    books.sort((a, b) => {
      const aVal = a[sortBy as keyof MockBook] ?? 0;
      const bVal = b[sortBy as keyof MockBook] ?? 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return books;
  }, [search, sortBy, sortOrder]);

  const getBooksByStatus = (status?: BookStatus) => {
    if (!status) return filteredBooks;
    return filteredBooks.filter((b) => b.status === status);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

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
        <Button asChild>
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
            onChange={(e) => setSearch(e.target.value)}
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
              <SelectItem value="totalSales">Sales</SelectItem>
              <SelectItem value="totalRevenue">Revenue</SelectItem>
              <SelectItem value="averageRating">Rating</SelectItem>
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredBooks.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({getBooksByStatus("PUBLISHED").length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({getBooksByStatus("DRAFT").length})
          </TabsTrigger>
          <TabsTrigger value="under_review">
            Under Review ({getBooksByStatus("UNDER_REVIEW").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <BooksTable books={filteredBooks} />
        </TabsContent>
        <TabsContent value="published" className="mt-4">
          <BooksTable books={getBooksByStatus("PUBLISHED")} />
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          <BooksTable books={getBooksByStatus("DRAFT")} />
        </TabsContent>
        <TabsContent value="under_review" className="mt-4">
          <BooksTable books={getBooksByStatus("UNDER_REVIEW")} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function BooksTable({ books }: { books: MockBook[] }) {
  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">No books found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
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
                const status = statusConfig[book.status];
                return (
                  <tr
                    key={book.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex h-12 w-9 items-center justify-center rounded-md bg-muted">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
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
