"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  BookOpen,
  Share2,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCard } from "@/components/shared/book-card";
import { cn, formatCurrency, calculateDiscount, formatDate } from "@/lib/utils";

const book = {
  id: "1",
  title: "The Last Sunrise",
  slug: "the-last-sunrise",
  subtitle: "A Journey Through Time and Memory",
  description:
    "In a world where memories can be traded like currency, one woman discovers that forgetting might be more dangerous than remembering. Adaeze Nwosu crafts a stunning debut novel that weaves together themes of identity, loss, and the enduring power of human connection.\n\nWhen Amara Okafor wakes up in a city where no one remembers the past, she must navigate a landscape of forgotten truths and buried secrets. With the help of a mysterious stranger, she embarks on a journey that will challenge everything she believes about herself and the world around her.\n\nThe Last Sunrise is a breathtaking exploration of what it means to be human in a world that has chosen to forget.",
  coverImage: null,
  author: {
    id: "a1",
    name: "Adaeze Nwosu",
    penName: "A. Nwosu",
    bio: "Adaeze Nwosu is an award-winning Nigerian author known for her thought-provoking fiction that explores themes of identity, memory, and cultural heritage. She holds an MFA from the University of Lagos and has been shortlisted for the Caine Prize for African Writing.",
    avatar: null,
  },
  price: 14.99,
  discountPrice: 9.99,
  averageRating: 4.8,
  totalReviews: 234,
  isbn: "978-1234567890",
  language: "English",
  pageCount: 342,
  publicationDate: "2025-03-15",
  publisher: "Statement Publications",
  edition: "First Edition",
  format: "EBOOK",
  category: { name: "Fiction", slug: "fiction" },
  tags: ["memory", "identity", "African fiction", "speculative"],
  isFeatured: true,
  isBestseller: true,
  isNew: true,
  relatedBooks: [
    { id: "2", title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", coverImage: null, author: { user: { name: "Chidi Okoro" } }, price: 12.99, discountPrice: null, averageRating: 4.5, totalReviews: 189, format: "PAPERBACK" },
    { id: "3", title: "Whispers in the Wind", slug: "whispers-in-the-wind", coverImage: null, author: { user: { name: "Fatima Bello" } }, price: 19.99, discountPrice: 14.99, averageRating: 4.9, totalReviews: 312, format: "HARDCOVER" },
    { id: "5", title: "The Garden of Secrets", slug: "the-garden-of-secrets", coverImage: null, author: { user: { name: "Olumide Bankole" } }, price: 16.99, discountPrice: 12.99, averageRating: 4.6, totalReviews: 156, format: "PAPERBACK" },
  ],
};

const mockReviews = [
  {
    id: "r1",
    user: { name: "Chidera O." },
    rating: 5,
    title: "Absolutely stunning!",
    content: "This book blew me away. The way Nwosu handles themes of memory and identity is nothing short of masterful. I couldn't put it down.",
    helpfulCount: 42,
    createdAt: "2025-04-10",
  },
  {
    id: "r2",
    user: { name: "Emeka A." },
    rating: 5,
    title: "A must-read",
    content: "Beautiful prose, compelling characters, and a plot that keeps you guessing. This is the kind of book that stays with you long after you finish reading it.",
    helpfulCount: 38,
    createdAt: "2025-04-05",
  },
  {
    id: "r3",
    user: { name: "Fatima B." },
    rating: 4,
    title: "Beautifully written",
    content: "The writing is gorgeous and the world-building is exceptional. I only wished for a bit more depth in the middle section, but overall a fantastic read.",
    helpfulCount: 24,
    createdAt: "2025-03-28",
  },
];

const formats = [
  { value: "EBOOK", label: "Ebook", price: 9.99 },
  { value: "PAPERBACK", label: "Paperback", price: 14.99 },
  { value: "HARDCOVER", label: "Hardcover", price: 22.99 },
];

export default function BookDetailPage() {
  const [selectedFormat, setSelectedFormat] = useState("EBOOK");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = calculateDiscount(book.price, book.discountPrice);
  const currentPrice = formats.find((f) => f.value === selectedFormat)?.price || book.price;

  return (
    <div className="py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/store/books" className="hover:text-foreground transition-colors">
          Books
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-xl mx-auto md:mx-0 max-w-[280px]"
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center gradient-charcoal">
                  <BookOpen className="h-20 w-20 text-primary/40" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {discount > 0 && (
                  <Badge className="bg-emerald-500 text-white border-0">
                    -{discount}%
                  </Badge>
                )}
                {book.isNew && (
                  <Badge className="bg-primary text-primary-foreground border-0">
                    New
                  </Badge>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{book.category.name}</Badge>
                  {book.isBestseller && (
                    <Badge className="bg-amber-500 text-white border-0">
                      Bestseller
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-lg text-muted-foreground mt-1">
                    {book.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.round(book.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {book.averageRating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({book.totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {formatCurrency(currentPrice)}
                </span>
                {selectedFormat === "EBOOK" && book.discountPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(book.price)}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Format</p>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setSelectedFormat(f.value)}
                      className={cn(
                        "rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                        selectedFormat === f.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "hover:border-foreground/20"
                      )}
                    >
                      {f.label}
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {formatCurrency(f.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "px-4",
                    isWishlisted && "bg-primary/10 border-primary text-primary"
                  )}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={cn("h-5 w-5", isWishlisted && "fill-primary")}
                  />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {book.pageCount} pages
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {book.language}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {book.author.name}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(book.publicationDate!, "long")}
                </div>
              </div>
            </motion.div>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({book.totalReviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {book.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <div className="flex flex-wrap gap-2 mt-6">
                  {book.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 text-sm text-muted-foreground space-y-1">
                  <p><strong>ISBN:</strong> {book.isbn}</p>
                  <p><strong>Publisher:</strong> {book.publisher}</p>
                  <p><strong>Edition:</strong> {book.edition}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Customer Reviews</h3>
                <Button variant="outline" size="sm">
                  Write a Review
                </Button>
              </div>

              {mockReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {review.user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {review.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt, "long")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {review.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                About the Author
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {book.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{book.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {book.author.penName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.author.bio}
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/authors/${book.author.id}`}>
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div>
            <h3 className="font-semibold mb-4">Related Books</h3>
            <div className="space-y-4">
              {book.relatedBooks.map((rb) => (
                <BookCard key={rb.id} book={rb} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  );
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}
