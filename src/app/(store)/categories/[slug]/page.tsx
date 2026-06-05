"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "@/components/shared/book-card";

const categoryData: Record<string, { name: string; description: string }> = {
  fiction: { name: "Fiction", description: "Immerse yourself in compelling stories, from literary fiction to genre-bending tales." },
  "non-fiction": { name: "Non-Fiction", description: "Explore real-world topics, from history and science to current affairs." },
  romance: { name: "Romance", description: "Love stories that will make your heart flutter." },
  poetry: { name: "Poetry", description: "Beautifully crafted verses that speak to the soul." },
  children: { name: "Children's", description: "Stories designed to spark imagination in young readers." },
  "self-help": { name: "Self-Help", description: "Books to inspire personal growth and transformation." },
  "science-fiction": { name: "Science Fiction", description: "Explore the frontiers of imagination and technology." },
  biography: { name: "Biography", description: "Real lives, extraordinary stories." },
  academic: { name: "Academic", description: "Scholarly works and educational resources." },
  drama: { name: "Drama", description: "Theatrical works and dramatic literature." },
  nature: { name: "Nature", description: "Books celebrating the natural world." },
  cooking: { name: "Cooking", description: "Culinary adventures and recipe collections." },
};

const mockBooksByCategory: Record<string, Array<{
  id: string;
  title: string;
  slug: string;
  coverImage: null;
  author: { user: { name: string } };
  price: number;
  discountPrice: number | null;
  averageRating: number;
  totalReviews: number;
  format: string;
  isNew?: boolean;
  isBestseller?: boolean;
}>> = {
  fiction: [
    { id: "1", title: "The Last Sunrise", slug: "the-last-sunrise", coverImage: null, author: { user: { name: "Adaeze Nwosu" } }, price: 14.99, discountPrice: 9.99, averageRating: 4.8, totalReviews: 234, format: "EBOOK", isNew: true, isBestseller: true },
    { id: "2", title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", coverImage: null, author: { user: { name: "Chidi Okoro" } }, price: 12.99, discountPrice: null, averageRating: 4.5, totalReviews: 189, format: "PAPERBACK" },
    { id: "3", title: "Whispers in the Wind", slug: "whispers-in-the-wind", coverImage: null, author: { user: { name: "Fatima Bello" } }, price: 19.99, discountPrice: 14.99, averageRating: 4.9, totalReviews: 312, format: "HARDCOVER" },
    { id: "4", title: "Chasing Shadows", slug: "chasing-shadows", coverImage: null, author: { user: { name: "Kemi Adekunle" } }, price: 11.99, discountPrice: null, averageRating: 4.2, totalReviews: 87, format: "EBOOK", isNew: true },
  ],
  romance: [
    { id: "5", title: "The Garden of Secrets", slug: "the-garden-of-secrets", coverImage: null, author: { user: { name: "Olumide Bankole" } }, price: 16.99, discountPrice: 12.99, averageRating: 4.6, totalReviews: 156, format: "PAPERBACK" },
    { id: "6", title: "Beneath the Surface", slug: "beneath-the-surface", coverImage: null, author: { user: { name: "Ngozi Eze" } }, price: 13.99, discountPrice: null, averageRating: 4.3, totalReviews: 98, format: "EBOOK" },
  ],
  poetry: [
    { id: "8", title: "Poems of the Heart", slug: "poems-of-the-heart", coverImage: null, author: { user: { name: "Aisha Mohammed" } }, price: 9.99, discountPrice: null, averageRating: 4.4, totalReviews: 67, format: "EBOOK" },
  ],
  children: [
    { id: "9", title: "The Little Explorer", slug: "the-little-explorer", coverImage: null, author: { user: { name: "Tunde Ogundimu" } }, price: 8.99, discountPrice: 6.99, averageRating: 4.8, totalReviews: 145, format: "PAPERBACK", isBestseller: true },
  ],
};

export default function CategoryBooksPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState("newest");

  const category = categoryData[slug] || { name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), description: "Explore our collection of books." };
  const books = mockBooksByCategory[slug] || mockBooksByCategory.fiction;

  return (
    <div className="py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/store/books" className="hover:text-foreground transition-colors">Books</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="text-muted-foreground max-w-2xl">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {books.length} {books.length === 1 ? "book" : "books"} found
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">
            No books in this category yet.
          </p>
          <Button asChild variant="outline">
            <Link href="/store/books">Browse All Books</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
