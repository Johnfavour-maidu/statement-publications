"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart, BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All Categories", count: 33 },
  { id: "fiction", name: "Fiction", count: 3 },
  { id: "non-fiction", name: "Non-Fiction", count: 3 },
  { id: "business", name: "Business", count: 3 },
  { id: "technology", name: "Technology", count: 5 },
  { id: "education", name: "Education", count: 3 },
  { id: "religion", name: "Religion", count: 3 },
  { id: "biography", name: "Biography", count: 3 },
  { id: "romance", name: "Romance", count: 3 },
  { id: "mystery", name: "Mystery", count: 3 },
  { id: "poetry", name: "Poetry", count: 3 },
  { id: "children", name: "Children's", count: 3 },
  { id: "finance", name: "Finance", count: 3 },
];

const mockBooks = [
  {
    id: "1",
    title: "Echoes of Tomorrow",
    slug: "echoes-of-tomorrow",
    author: "James Mitchell",
    price: 14.99,
    discountPrice: 11.99,
    averageRating: 4.5,
    totalReviews: 234,
    category: "fiction",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    description: "A sweeping tale of hope and resilience in a world transformed by time.",
  },
  {
    id: "2",
    title: "The Silent Garden",
    slug: "the-silent-garden",
    author: "Eleanor Hayes",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.8,
    totalReviews: 312,
    category: "fiction",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    description: "In a garden where whispers hold secrets, one woman uncovers a mystery that spans generations.",
  },
  {
    id: "3",
    title: "Midnight Bridges",
    slug: "midnight-bridges",
    author: "Marcus Chen",
    price: 12.99,
    discountPrice: 9.99,
    averageRating: 4.2,
    totalReviews: 87,
    category: "fiction",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    description: "A mysterious traveler crosses bridges that only appear at midnight, discovering worlds unseen.",
  },
  {
    id: "4",
    title: "Thinking in Systems",
    slug: "thinking-in-systems",
    author: "Diana Morales",
    price: 18.99,
    discountPrice: 14.99,
    averageRating: 4.7,
    totalReviews: 189,
    category: "non-fiction",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    description: "A practical guide to understanding complex systems and making better decisions.",
  },
  {
    id: "5",
    title: "The Power of Habit",
    slug: "the-power-of-habit",
    author: "Charles Duhigg",
    price: 15.99,
    discountPrice: null,
    averageRating: 4.6,
    totalReviews: 456,
    category: "non-fiction",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    description: "Why we do what we do in life and business, and how to change habits that shape our future.",
  },
  {
    id: "6",
    title: "Atomic Focus",
    slug: "atomic-focus",
    author: "Dr. Sarah Lin",
    price: 13.99,
    discountPrice: 10.99,
    averageRating: 4.4,
    totalReviews: 123,
    category: "non-fiction",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    description: "Master the art of deep concentration in a world of constant distraction.",
  },
  {
    id: "7",
    title: "The Lean Startup",
    slug: "the-lean-startup",
    author: "Eric Ries",
    price: 19.99,
    discountPrice: 15.99,
    averageRating: 4.5,
    totalReviews: 567,
    category: "business",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    description: "How constant innovation creates wildly successful businesses.",
  },
  {
    id: "8",
    title: "Zero to One",
    slug: "zero-to-one",
    author: "Peter Thiel",
    price: 17.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 389,
    category: "business",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    description: "Notes on startups, or how to build the future.",
  },
  {
    id: "9",
    title: "Good to Great",
    slug: "good-to-great",
    author: "Jim Collins",
    price: 16.99,
    discountPrice: 12.99,
    averageRating: 4.4,
    totalReviews: 298,
    category: "business",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    description: "Why some companies make the leap and others don't.",
  },
  {
    id: "10",
    title: "Clean Code",
    slug: "clean-code",
    author: "Robert C. Martin",
    price: 34.99,
    discountPrice: 27.99,
    averageRating: 4.7,
    totalReviews: 678,
    category: "technology",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
    description: "A handbook of agile software craftsmanship.",
  },
  {
    id: "11",
    title: "The Pragmatic Programmer",
    slug: "the-pragmatic-programmer",
    author: "David Thomas",
    price: 39.99,
    discountPrice: null,
    averageRating: 4.8,
    totalReviews: 445,
    category: "technology",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
    description: "Your journey to mastery in software development.",
  },
  {
    id: "12",
    title: "AI Revolution",
    slug: "ai-revolution",
    author: "Dr. Kai Nakamura",
    price: 24.99,
    discountPrice: 19.99,
    averageRating: 4.6,
    totalReviews: 234,
    category: "technology",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    description: "How artificial intelligence is reshaping our world and what it means for humanity.",
  },
  {
    id: "13",
    title: "Mindset",
    slug: "mindset",
    author: "Carol Dweck",
    price: 16.99,
    discountPrice: 12.99,
    averageRating: 4.5,
    totalReviews: 567,
    category: "education",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    description: "The new psychology of success that transforms how we think about learning.",
  },
  {
    id: "14",
    title: "The First 20 Hours",
    slug: "the-first-20-hours",
    author: "Josh Kaufman",
    price: 14.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 198,
    category: "education",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    description: "How to learn anything fast in just 20 hours of deliberate practice.",
  },
  {
    id: "15",
    title: "Ultralearning",
    slug: "ultralearning",
    author: "Scott Young",
    price: 18.99,
    discountPrice: 14.99,
    averageRating: 4.4,
    totalReviews: 156,
    category: "education",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #005aa7 0%, #fffde4 100%)",
    description: "Master hard skills, outsmart the competition, and accelerate your career.",
  },
  {
    id: "16",
    title: "The Purpose Driven Life",
    slug: "the-purpose-driven-life",
    author: "Rick Warren",
    price: 15.99,
    discountPrice: null,
    averageRating: 4.6,
    totalReviews: 789,
    category: "religion",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    description: "What on Earth am I here for? A 40-day journey to discovering your purpose.",
  },
  {
    id: "17",
    title: "Mere Christianity",
    slug: "mere-christianity",
    author: "C.S. Lewis",
    price: 12.99,
    discountPrice: 9.99,
    averageRating: 4.8,
    totalReviews: 1023,
    category: "religion",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
    description: "A theological classic that explores the core of Christian belief.",
  },
  {
    id: "18",
    title: "Siddhartha",
    slug: "siddhartha",
    author: "Hermann Hesse",
    price: 11.99,
    discountPrice: null,
    averageRating: 4.7,
    totalReviews: 567,
    category: "religion",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)",
    description: "A profound journey of spiritual awakening and self-discovery.",
  },
  {
    id: "19",
    title: "Steve Jobs",
    slug: "steve-jobs",
    author: "Walter Isaacson",
    price: 22.99,
    discountPrice: 17.99,
    averageRating: 4.6,
    totalReviews: 890,
    category: "biography",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
    description: "The exclusive biography of the visionary behind Apple.",
  },
  {
    id: "20",
    title: "Educated",
    slug: "educated",
    author: "Tara Westover",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.7,
    totalReviews: 678,
    category: "biography",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)",
    description: "A memoir about a young girl who leaves her survivalist family to pursue education.",
  },
  {
    id: "21",
    title: "Becoming",
    slug: "becoming",
    author: "Michelle Obama",
    price: 19.99,
    discountPrice: 15.99,
    averageRating: 4.8,
    totalReviews: 1234,
    category: "biography",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #e8198b 0%, #c7eafd 100%)",
    description: "An intimate, powerful, and inspiring memoir by the former First Lady.",
  },
  {
    id: "22",
    title: "The Notebook",
    slug: "the-notebook",
    author: "Nicholas Sparks",
    price: 13.99,
    discountPrice: 10.99,
    averageRating: 4.4,
    totalReviews: 456,
    category: "romance",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    description: "A poignant love story about the enduring power of devotion.",
  },
  {
    id: "23",
    title: "Pride and Prejudice",
    slug: "pride-and-prejudice",
    author: "Jane Austen",
    price: 11.99,
    discountPrice: null,
    averageRating: 4.9,
    totalReviews: 2345,
    category: "romance",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    description: "The timeless tale of love, reputation, and class differences.",
  },
  {
    id: "24",
    title: "Outlander",
    slug: "outlander",
    author: "Diana Gabaldon",
    price: 18.99,
    discountPrice: 14.99,
    averageRating: 4.6,
    totalReviews: 789,
    category: "romance",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    description: "A sweeping tale of adventure, history, and timeless love.",
  },
  {
    id: "25",
    title: "Gone Girl",
    slug: "gone-girl",
    author: "Gillian Flynn",
    price: 14.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 567,
    category: "mystery",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)",
    description: "A dark thriller about a marriage gone terribly wrong.",
  },
  {
    id: "26",
    title: "The Girl on the Train",
    slug: "the-girl-on-the-train",
    author: "Paula Hawkins",
    price: 15.99,
    discountPrice: 11.99,
    averageRating: 4.2,
    totalReviews: 456,
    category: "mystery",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #616161 0%, #9bc5c3 100%)",
    description: "A gripping psychological thriller with an unreliable narrator.",
  },
  {
    id: "27",
    title: "The Silent Patient",
    slug: "the-silent-patient",
    author: "Alex Michaelides",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.5,
    totalReviews: 678,
    category: "mystery",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
    description: "A woman shoots her husband and then never speaks another word.",
  },
  {
    id: "28",
    title: "Milk and Honey",
    slug: "milk-and-honey",
    author: "Rupi Kaur",
    price: 12.99,
    discountPrice: 9.99,
    averageRating: 4.5,
    totalReviews: 890,
    category: "poetry",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    description: "A collection of poetry about survival, love, loss, and femininity.",
  },
  {
    id: "29",
    title: "The Sun and Her Flowers",
    slug: "the-sun-and-her-flowers",
    author: "Rupi Kaur",
    price: 13.99,
    discountPrice: null,
    averageRating: 4.4,
    totalReviews: 567,
    category: "poetry",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)",
    description: "A vibrant collection of poetry and prose about growth, healing, and empowerment.",
  },
  {
    id: "30",
    title: "Leaves of Grass",
    slug: "leaves-of-grass",
    author: "Walt Whitman",
    price: 10.99,
    discountPrice: null,
    averageRating: 4.7,
    totalReviews: 345,
    category: "poetry",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    description: "A landmark collection celebrating the beauty and spirit of America.",
  },
  {
    id: "31",
    title: "The Giving Tree",
    slug: "the-giving-tree",
    author: "Shel Silverstein",
    price: 11.99,
    discountPrice: 8.99,
    averageRating: 4.8,
    totalReviews: 1567,
    category: "children",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    description: "A tender story about the love between a tree and a boy.",
  },
  {
    id: "32",
    title: "Where the Wild Things Are",
    slug: "where-the-wild-things-are",
    author: "Maurice Sendak",
    price: 12.99,
    discountPrice: null,
    averageRating: 4.9,
    totalReviews: 1890,
    category: "children",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
    description: "A magical adventure to where the wild things live.",
  },
  {
    id: "33",
    title: "Charlotte's Web",
    slug: "charlottes-web",
    author: "E.B. White",
    price: 10.99,
    discountPrice: 7.99,
    averageRating: 4.8,
    totalReviews: 2345,
    category: "children",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #c2e59c 0%, #64b3f4 100%)",
    description: "The classic tale of a pig named Wilbur and his friendship with a spider named Charlotte.",
  },
  {
    id: "34",
    title: "Rich Dad Poor Dad",
    slug: "rich-dad-poor-dad",
    author: "Robert Kiyosaki",
    price: 17.99,
    discountPrice: 13.99,
    averageRating: 4.5,
    totalReviews: 1234,
    category: "finance",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    description: "What the rich teach their kids about money that the poor and middle class do not.",
  },
  {
    id: "35",
    title: "The Millionaire Next Door",
    slug: "the-millionaire-next-door",
    author: "Thomas Stanley",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.4,
    totalReviews: 567,
    category: "finance",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
    description: "The surprising secrets of America's wealthy.",
  },
  {
    id: "36",
    title: "I Will Teach You to Be Rich",
    slug: "i-will-teach-you-to-be-rich",
    author: "Ramit Sethi",
    price: 15.99,
    discountPrice: 11.99,
    averageRating: 4.3,
    totalReviews: 345,
    category: "finance",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #e44d26 0%, #f16529 100%)",
    description: "A 6-week personal finance program for anyone who wants to build wealth.",
  },
  {
    id: "37",
    title: "The Innovators",
    slug: "the-innovators",
    author: "Walter Isaacson",
    price: 19.99,
    discountPrice: 15.99,
    averageRating: 4.6,
    totalReviews: 456,
    category: "technology",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)",
    description: "How a group of hackers, geniuses, and geeks created the digital revolution.",
  },
  {
    id: "38",
    title: "Homo Deus",
    slug: "homo-deus",
    author: "Yuval Noah Harari",
    price: 21.99,
    discountPrice: 17.99,
    averageRating: 4.7,
    totalReviews: 678,
    category: "technology",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
    description: "A brief history of tomorrow exploring what the future holds for humanity.",
  },
  {
    id: "39",
    title: "Life 3.0",
    slug: "life-3-0",
    author: "Max Tegmark",
    price: 20.99,
    discountPrice: 16.99,
    averageRating: 4.5,
    totalReviews: 345,
    category: "technology",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
    description: "Being human in the age of artificial intelligence.",
  },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestselling", label: "Bestselling" },
];

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = useMemo(() => {
    let result = [...mockBooks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-high":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "rating":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "bestselling":
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [searchQuery, sortBy, selectedCategory]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Books
        </h1>
        <p className="text-muted-foreground">
          Discover your next great read from our curated collection.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    selectedCategory === cat.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedCategory === cat.id
                      ? filteredBooks.length
                      : cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedBooks.length} of {filteredBooks.length} books
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {paginatedBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/books/${book.slug}`} className="block group">
                  <div className="relative overflow-hidden rounded-xl border bg-card transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/20 group-hover:scale-[1.02]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div
                        className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                        style={{ background: book.gradient }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {book.discountPrice && (
                          <Badge className="bg-emerald-500 text-white border-0 text-[10px]">
                            -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                          </Badge>
                        )}
                        {book.isNew && (
                          <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">
                            New
                          </Badge>
                        )}
                        {book.isBestseller && (
                          <Badge className="bg-amber-500 text-white border-0 text-[10px]">
                            Bestseller
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {book.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                        <Button size="sm" className="rounded-full bg-background/90 text-foreground hover:bg-background backdrop-blur-sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Quick View
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < Math.round(book.averageRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-muted text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({book.totalReviews})
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          ${(book.discountPrice || book.price).toFixed(2)}
                        </span>
                        {book.discountPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${book.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                No books found matching your criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9 p-0 transition-all duration-200 hover:scale-110"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
