"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  BookOpen,
  Star,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryData: Record<string, { name: string; description: string; gradient: string }> = {
  fiction: {
    name: "Fiction",
    description: "Immerse yourself in compelling stories from literary fiction to genre-bending tales that transport you to new worlds.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  "non-fiction": {
    name: "Non-Fiction",
    description: "Explore real-world topics from history and science to current affairs. Learn from the experts and expand your knowledge.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  business: {
    name: "Business",
    description: "Learn from the best business minds. Discover startup strategies, leadership principles, and innovation frameworks.",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },
  technology: {
    name: "Technology",
    description: "Stay ahead with the latest in coding, AI, and digital innovation. Essential reads for tech enthusiasts and professionals.",
    gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  },
  education: {
    name: "Education",
    description: "Transform your learning with mindset, skills, and study strategies. Unlock your potential with these educational reads.",
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  },
  religion: {
    name: "Religion",
    description: "Explore faith, spirituality, and the search for meaning. Deepen your understanding of religious traditions and beliefs.",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  },
  biography: {
    name: "Biography",
    description: "Real lives, extraordinary stories from visionary leaders. Discover the lives that shaped our world.",
    gradient: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
  },
  romance: {
    name: "Romance",
    description: "Love stories that will make your heart flutter and soar. From timeless classics to modern love tales.",
    gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  },
  mystery: {
    name: "Mystery",
    description: "Gripping thrillers that will keep you on the edge of your seat. Unravel the puzzles and solve the crimes.",
    gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)",
  },
  poetry: {
    name: "Poetry",
    description: "Beautifully crafted verses that speak to the soul. From classic poetry to contemporary spoken word.",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  children: {
    name: "Children's",
    description: "Stories designed to spark imagination in young readers. Classic tales and new adventures for all ages.",
    gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
  },
  finance: {
    name: "Finance",
    description: "Master your money with wealth-building and investment wisdom. Take control of your financial future.",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  "self-help": {
    name: "Self-Help",
    description: "Inspiring personal growth, habits, and transformation. Books that will change your life for the better.",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
};

const allBooks = [
  { id: "1", title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", author: "James Mitchell", price: 14.99, discountPrice: 11.99, averageRating: 4.5, totalReviews: 234, category: "fiction", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "2", title: "The Silent Garden", slug: "the-silent-garden", author: "Eleanor Hayes", price: 16.99, discountPrice: null, averageRating: 4.8, totalReviews: 312, category: "fiction", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: "3", title: "Midnight Bridges", slug: "midnight-bridges", author: "Marcus Chen", price: 12.99, discountPrice: 9.99, averageRating: 4.2, totalReviews: 87, category: "fiction", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { id: "4", title: "Thinking in Systems", slug: "thinking-in-systems", author: "Diana Morales", price: 18.99, discountPrice: 14.99, averageRating: 4.7, totalReviews: 189, category: "non-fiction", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { id: "5", title: "The Power of Habit", slug: "the-power-of-habit", author: "Charles Duhigg", price: 15.99, discountPrice: null, averageRating: 4.6, totalReviews: 456, category: "non-fiction", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { id: "6", title: "Atomic Focus", slug: "atomic-focus", author: "Dr. Sarah Lin", price: 13.99, discountPrice: 10.99, averageRating: 4.4, totalReviews: 123, category: "non-fiction", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { id: "7", title: "The Lean Startup", slug: "the-lean-startup", author: "Eric Ries", price: 19.99, discountPrice: 15.99, averageRating: 4.5, totalReviews: 567, category: "business", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { id: "8", title: "Zero to One", slug: "zero-to-one", author: "Peter Thiel", price: 17.99, discountPrice: null, averageRating: 4.3, totalReviews: 389, category: "business", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { id: "9", title: "Good to Great", slug: "good-to-great", author: "Jim Collins", price: 16.99, discountPrice: 12.99, averageRating: 4.4, totalReviews: 298, category: "business", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
  { id: "10", title: "Clean Code", slug: "clean-code", author: "Robert C. Martin", price: 34.99, discountPrice: 27.99, averageRating: 4.7, totalReviews: 678, category: "technology", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)" },
  { id: "11", title: "The Pragmatic Programmer", slug: "the-pragmatic-programmer", author: "David Thomas", price: 39.99, discountPrice: null, averageRating: 4.8, totalReviews: 445, category: "technology", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)" },
  { id: "12", title: "AI Revolution", slug: "ai-revolution", author: "Dr. Kai Nakamura", price: 24.99, discountPrice: 19.99, averageRating: 4.6, totalReviews: 234, category: "technology", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)" },
  { id: "37", title: "The Innovators", slug: "the-innovators", author: "Walter Isaacson", price: 19.99, discountPrice: 15.99, averageRating: 4.6, totalReviews: 456, category: "technology", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)" },
  { id: "38", title: "Homo Deus", slug: "homo-deus", author: "Yuval Noah Harari", price: 21.99, discountPrice: 17.99, averageRating: 4.7, totalReviews: 678, category: "technology", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)" },
  { id: "13", title: "Mindset", slug: "mindset", author: "Carol Dweck", price: 16.99, discountPrice: 12.99, averageRating: 4.5, totalReviews: 567, category: "education", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
  { id: "14", title: "The First 20 Hours", slug: "the-first-20-hours", author: "Josh Kaufman", price: 14.99, discountPrice: null, averageRating: 4.3, totalReviews: 198, category: "education", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
  { id: "15", title: "Ultralearning", slug: "ultralearning", author: "Scott Young", price: 18.99, discountPrice: 14.99, averageRating: 4.4, totalReviews: 156, category: "education", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #005aa7 0%, #fffde4 100%)" },
  { id: "16", title: "The Purpose Driven Life", slug: "the-purpose-driven-life", author: "Rick Warren", price: 15.99, discountPrice: null, averageRating: 4.6, totalReviews: 789, category: "religion", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" },
  { id: "17", title: "Mere Christianity", slug: "mere-christianity", author: "C.S. Lewis", price: 12.99, discountPrice: 9.99, averageRating: 4.8, totalReviews: 1023, category: "religion", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)" },
  { id: "18", title: "Siddhartha", slug: "siddhartha", author: "Hermann Hesse", price: 11.99, discountPrice: null, averageRating: 4.7, totalReviews: 567, category: "religion", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)" },
  { id: "19", title: "Steve Jobs", slug: "steve-jobs", author: "Walter Isaacson", price: 22.99, discountPrice: 17.99, averageRating: 4.6, totalReviews: 890, category: "biography", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)" },
  { id: "20", title: "Educated", slug: "educated", author: "Tara Westover", price: 16.99, discountPrice: null, averageRating: 4.7, totalReviews: 678, category: "biography", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)" },
  { id: "21", title: "Becoming", slug: "becoming", author: "Michelle Obama", price: 19.99, discountPrice: 15.99, averageRating: 4.8, totalReviews: 1234, category: "biography", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #e8198b 0%, #c7eafd 100%)" },
  { id: "22", title: "The Notebook", slug: "the-notebook", author: "Nicholas Sparks", price: 13.99, discountPrice: 10.99, averageRating: 4.4, totalReviews: 456, category: "romance", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)" },
  { id: "23", title: "Pride and Prejudice", slug: "pride-and-prejudice", author: "Jane Austen", price: 11.99, discountPrice: null, averageRating: 4.9, totalReviews: 2345, category: "romance", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" },
  { id: "24", title: "Outlander", slug: "outlander", author: "Diana Gabaldon", price: 18.99, discountPrice: 14.99, averageRating: 4.6, totalReviews: 789, category: "romance", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" },
  { id: "25", title: "Gone Girl", slug: "gone-girl", author: "Gillian Flynn", price: 14.99, discountPrice: null, averageRating: 4.3, totalReviews: 567, category: "mystery", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)" },
  { id: "26", title: "The Girl on the Train", slug: "the-girl-on-the-train", author: "Paula Hawkins", price: 15.99, discountPrice: 11.99, averageRating: 4.2, totalReviews: 456, category: "mystery", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #616161 0%, #9bc5c3 100%)" },
  { id: "27", title: "The Silent Patient", slug: "the-silent-patient", author: "Alex Michaelides", price: 16.99, discountPrice: null, averageRating: 4.5, totalReviews: 678, category: "mystery", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" },
  { id: "28", title: "Milk and Honey", slug: "milk-and-honey", author: "Rupi Kaur", price: 12.99, discountPrice: 9.99, averageRating: 4.5, totalReviews: 890, category: "poetry", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { id: "29", title: "The Sun and Her Flowers", slug: "the-sun-and-her-flowers", author: "Rupi Kaur", price: 13.99, discountPrice: null, averageRating: 4.4, totalReviews: 567, category: "poetry", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)" },
  { id: "30", title: "Leaves of Grass", slug: "leaves-of-grass", author: "Walt Whitman", price: 10.99, discountPrice: null, averageRating: 4.7, totalReviews: 345, category: "poetry", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { id: "31", title: "The Giving Tree", slug: "the-giving-tree", author: "Shel Silverstein", price: 11.99, discountPrice: 8.99, averageRating: 4.8, totalReviews: 1567, category: "children", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)" },
  { id: "32", title: "Where the Wild Things Are", slug: "where-the-wild-things-are", author: "Maurice Sendak", price: 12.99, discountPrice: null, averageRating: 4.9, totalReviews: 1890, category: "children", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)" },
  { id: "33", title: "Charlotte's Web", slug: "charlottes-web", author: "E.B. White", price: 10.99, discountPrice: 7.99, averageRating: 4.8, totalReviews: 2345, category: "children", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #c2e59c 0%, #64b3f4 100%)" },
  { id: "34", title: "Rich Dad Poor Dad", slug: "rich-dad-poor-dad", author: "Robert Kiyosaki", price: 17.99, discountPrice: 13.99, averageRating: 4.5, totalReviews: 1234, category: "finance", isNew: false, isBestseller: true, gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
  { id: "35", title: "The Millionaire Next Door", slug: "the-millionaire-next-door", author: "Thomas Stanley", price: 16.99, discountPrice: null, averageRating: 4.4, totalReviews: 567, category: "finance", isNew: false, isBestseller: false, gradient: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)" },
  { id: "36", title: "I Will Teach You to Be Rich", slug: "i-will-teach-you-to-be-rich", author: "Ramit Sethi", price: 15.99, discountPrice: 11.99, averageRating: 4.3, totalReviews: 345, category: "finance", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #e44d26 0%, #f16529 100%)" },
  { id: "39", title: "Life 3.0", slug: "life-3-0", author: "Max Tegmark", price: 20.99, discountPrice: 16.99, averageRating: 4.5, totalReviews: 345, category: "technology", isNew: true, isBestseller: false, gradient: "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestselling", label: "Bestselling" },
];

export default function CategoryBooksPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState("newest");

  const category = categoryData[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Explore our collection of books.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const filteredBooks = useMemo(() => {
    let result = allBooks.filter((b) => b.category === slug);

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
  }, [slug, sortBy]);

  return (
    <div className="py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="hover:text-foreground transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div
          className="h-48 w-full"
          style={{ background: category.gradient }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-white/80 mt-2 max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/categories"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Categories
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book, i) => (
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
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">
            No books in this category yet.
          </p>
          <Button asChild variant="outline">
            <Link href="/books">Browse All Books</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
