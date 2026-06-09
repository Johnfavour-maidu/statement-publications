"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  BookOpen,
  Star,
  Play,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

type ReadingStatus = "all" | "reading" | "completed" | "unread";
type ViewMode = "grid" | "list";

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  price: number;
  format: string;
  rating: number;
  reviews: number;
  status: "reading" | "completed" | "unread";
  progress: number;
  currentPage: number;
  totalPages: number;
  lastRead: string | null;
  datePurchased: string;
}

const mockLibraryBooks: LibraryBook[] = [
  {
    id: "1",
    title: "The Silent Echo",
    author: "Amara Okafor",
    coverImage: null,
    price: 14.99,
    format: "EBOOK",
    rating: 4.8,
    reviews: 124,
    status: "reading",
    progress: 72,
    currentPage: 216,
    totalPages: 300,
    lastRead: "2 hours ago",
    datePurchased: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "2",
    title: "Whispers of the Forgotten",
    author: "David Mensah",
    coverImage: null,
    price: 12.99,
    format: "EBOOK",
    rating: 4.5,
    reviews: 89,
    status: "reading",
    progress: 45,
    currentPage: 135,
    totalPages: 300,
    lastRead: "Yesterday",
    datePurchased: new Date(Date.now() - 86400000 * 21).toISOString(),
  },
  {
    id: "3",
    title: "Crimson Horizons",
    author: "Nadia El-Amin",
    coverImage: null,
    price: 16.99,
    format: "PAPERBACK",
    rating: 4.7,
    reviews: 67,
    status: "reading",
    progress: 12,
    currentPage: 36,
    totalPages: 300,
    lastRead: "3 days ago",
    datePurchased: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "4",
    title: "Midnight Echoes",
    author: "Kwame Asante",
    coverImage: null,
    price: 14.99,
    format: "EBOOK",
    rating: 4.6,
    reviews: 203,
    status: "completed",
    progress: 100,
    currentPage: 320,
    totalPages: 320,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "5",
    title: "River of Stars",
    author: "Fatima Al-Rashid",
    coverImage: null,
    price: 18.99,
    format: "HARDCOVER",
    rating: 4.9,
    reviews: 312,
    status: "completed",
    progress: 100,
    currentPage: 450,
    totalPages: 450,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "6",
    title: "The Last Garden",
    author: "Sofia Osei",
    coverImage: null,
    price: 12.99,
    format: "EBOOK",
    rating: 4.4,
    reviews: 56,
    status: "completed",
    progress: 100,
    currentPage: 280,
    totalPages: 280,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: "7",
    title: "Beyond the Horizon",
    author: "Emeka Nwachukwu",
    coverImage: null,
    price: 15.99,
    format: "PAPERBACK",
    rating: 4.3,
    reviews: 78,
    status: "unread",
    progress: 0,
    currentPage: 0,
    totalPages: 340,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "8",
    title: "Shadows of Yesterday",
    author: "Adaeze Nwosu",
    coverImage: null,
    price: 13.99,
    format: "EBOOK",
    rating: 4.7,
    reviews: 145,
    status: "unread",
    progress: 0,
    currentPage: 0,
    totalPages: 290,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "9",
    title: "The Golden Path",
    author: "Tariq Hassan",
    coverImage: null,
    price: 16.99,
    format: "PAPERBACK",
    rating: 4.5,
    reviews: 92,
    status: "unread",
    progress: 0,
    currentPage: 0,
    totalPages: 380,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "10",
    title: "Echoes in Time",
    author: "Ngozi Okafor",
    coverImage: null,
    price: 11.99,
    format: "EBOOK",
    rating: 4.8,
    reviews: 167,
    status: "completed",
    progress: 100,
    currentPage: 260,
    totalPages: 260,
    lastRead: null,
    datePurchased: new Date(Date.now() - 86400000 * 90).toISOString(),
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

export default function ReaderLibraryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReadingStatus>("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredBooks = useMemo(() => {
    let books = [...mockLibraryBooks];

    if (search) {
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "all") {
      books = books.filter((b) => b.status === filter);
    }

    switch (sortBy) {
      case "title":
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        books.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "progress":
        books.sort((a, b) => b.progress - a.progress);
        break;
      case "recent":
      default:
        books.sort(
          (a, b) =>
            new Date(b.datePurchased).getTime() -
            new Date(a.datePurchased).getTime()
        );
        break;
    }

    return books;
  }, [search, filter, sortBy]);

  const counts = {
    all: mockLibraryBooks.length,
    reading: mockLibraryBooks.filter((b) => b.status === "reading").length,
    completed: mockLibraryBooks.filter((b) => b.status === "completed").length,
    unread: mockLibraryBooks.filter((b) => b.status === "unread").length,
  };

  const getStatusIcon = (status: LibraryBook["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "reading":
        return <Clock className="h-3.5 w-3.5 text-blue-500" />;
      case "unread":
        return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: LibraryBook["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "reading":
        return "Reading";
      case "unread":
        return "Unread";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Library</h1>
        <p className="text-muted-foreground">
          All your purchased books in one place.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as ReadingStatus)}>
        <TabsList>
          <TabsTrigger value="all">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="reading">
            Reading ({counts.reading})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({counts.completed})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({counts.unread})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <AnimatePresence mode="wait">
            {filteredBooks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-lg font-medium">No books found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filters.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                key="grid"
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredBooks.map((book) => (
                  <motion.div key={book.id} variants={item}>
                    <div className="group rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-t-xl">
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-background/90 backdrop-blur-sm"
                          >
                            {getStatusIcon(book.status)}
                            <span className="ml-1">{getStatusLabel(book.status)}</span>
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-[10px] bg-background/90 backdrop-blur-sm">
                            {book.format}
                          </Badge>
                        </div>
                        {book.status === "reading" && (
                          <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                {book.currentPage}/{book.totalPages} pages
                              </span>
                              <span className="font-medium">{book.progress}%</span>
                            </div>
                            <Progress value={book.progress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        <div>
                          <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
                            {book.title}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {book.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{book.rating}</span>
                          <span className="text-[10px] text-muted-foreground">
                            ({book.reviews})
                          </span>
                        </div>
                        {book.lastRead && (
                          <p className="text-xs text-muted-foreground">
                            Last read {book.lastRead}
                          </p>
                        )}
                        <Button
                          className="w-full"
                          size="sm"
                          variant={book.status === "unread" ? "default" : "outline"}
                        >
                          {book.status === "unread" ? (
                            <>
                              <Play className="mr-1 h-3.5 w-3.5" />
                              Start Reading
                            </>
                          ) : book.status === "reading" ? (
                            <>
                              <Play className="mr-1 h-3.5 w-3.5" />
                              Continue Reading
                            </>
                          ) : (
                            <>
                              <BookOpen className="mr-1 h-3.5 w-3.5" />
                              Read Again
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {filteredBooks.map((book) => (
                  <motion.div key={book.id} variants={item}>
                    <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <BookOpen className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold truncate">
                            {book.title}
                          </h3>
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {getStatusLabel(book.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {book.author} &middot; {book.format}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs">{book.rating}</span>
                          </div>
                          {book.status === "reading" && (
                            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                              <Progress value={book.progress} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {book.progress}%
                              </span>
                            </div>
                          )}
                          {book.lastRead && (
                            <span className="text-xs text-muted-foreground">
                              Last read {book.lastRead}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold hidden sm:block">
                          {formatCurrency(book.price)}
                        </span>
                        <Button
                          size="sm"
                          variant={book.status === "unread" ? "default" : "outline"}
                        >
                          {book.status === "unread" ? (
                            <>
                              <Play className="mr-1 h-3.5 w-3.5" />
                              Start
                            </>
                          ) : book.status === "reading" ? (
                            <>
                              <Play className="mr-1 h-3.5 w-3.5" />
                              Continue
                            </>
                          ) : (
                            <>
                              <BookOpen className="mr-1 h-3.5 w-3.5" />
                              Read Again
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
