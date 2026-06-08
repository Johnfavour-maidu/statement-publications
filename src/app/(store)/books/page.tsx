"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, Star, ShoppingCart, Heart, X, ChevronDown,
  ArrowUpDown, BookOpen, TrendingUp, Clock, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

const categories = [
  { id: "all", name: "All Books", count: 39 },
  { id: "fiction", name: "Fiction", count: 6, sub: [
    { id: "literary-fiction", name: "Literary Fiction", count: 2 },
    { id: "contemporary", name: "Contemporary", count: 2 },
    { id: "historical-fiction", name: "Historical Fiction", count: 1 },
    { id: "magical-realism", name: "Magical Realism", count: 1 },
  ]},
  { id: "non-fiction", name: "Non-Fiction", count: 5, sub: [
    { id: "memoir", name: "Memoir", count: 2 },
    { id: "essays", name: "Essays", count: 1 },
    { id: "journalism", name: "Journalism", count: 1 },
    { id: "self-help", name: "Self-Help", count: 1 },
  ]},
  { id: "business", name: "Business", count: 5, sub: [
    { id: "entrepreneurship", name: "Entrepreneurship", count: 2 },
    { id: "leadership", name: "Leadership", count: 2 },
    { id: "marketing", name: "Marketing", count: 1 },
  ]},
  { id: "technology", name: "Technology", count: 5, sub: [
    { id: "artificial-intelligence", name: "Artificial Intelligence", count: 2 },
    { id: "data-science", name: "Data Science", count: 1 },
    { id: "cybersecurity", name: "Cybersecurity", count: 1 },
    { id: "web-development", name: "Web Development", count: 1 },
  ]},
  { id: "religion", name: "Religion", count: 4, sub: [
    { id: "christianity", name: "Christianity", count: 2 },
    { id: "spirituality", name: "Spirituality", count: 1 },
    { id: "devotionals", name: "Devotionals", count: 1 },
  ]},
  { id: "health", name: "Health & Wellness", count: 3, sub: [
    { id: "nutrition", name: "Nutrition", count: 1 },
    { id: "fitness", name: "Fitness", count: 1 },
    { id: "mental-health", name: "Mental Health", count: 1 },
  ]},
  { id: "education", name: "Education", count: 4, sub: [
    { id: "textbooks", name: "Textbooks", count: 2 },
    { id: "study-guides", name: "Study Guides", count: 1 },
    { id: "children-education", name: "Children's Education", count: 1 },
  ]},
  { id: "children", name: "Children's", count: 4, sub: [
    { id: "picture-books", name: "Picture Books", count: 2 },
    { id: "early-readers", name: "Early Readers", count: 1 },
    { id: "middle-grade", name: "Middle Grade", count: 1 },
  ]},
  { id: "poetry", name: "Poetry", count: 3, sub: [
    { id: "contemporary-poetry", name: "Contemporary Poetry", count: 1 },
    { id: "african-poetry", name: "African Poetry", count: 1 },
    { id: "love-poetry", name: "Love Poetry", count: 1 },
  ]},
  { id: "romance", name: "Romance", count: 3, sub: [
    { id: "contemporary-romance", name: "Contemporary Romance", count: 1 },
    { id: "historical-romance", name: "Historical Romance", count: 1 },
    { id: "romantic-suspense", name: "Romantic Suspense", count: 1 },
  ]},
  { id: "mystery", name: "Mystery & Thriller", count: 3, sub: [
    { id: "crime-thriller", name: "Crime Thriller", count: 1 },
    { id: "psychological-thriller", name: "Psychological Thriller", count: 1 },
    { id: "cozy-mystery", name: "Cozy Mystery", count: 1 },
  ]},
  { id: "finance", name: "Finance", count: 3, sub: [
    { id: "investing", name: "Investing", count: 1 },
    { id: "personal-finance", name: "Personal Finance", count: 1 },
    { id: "financial-freedom", name: "Financial Freedom", count: 1 },
  ]},
  { id: "biography", name: "Biography", count: 3, sub: [
    { id: "autobiography", name: "Autobiography", count: 1 },
    { id: "historical-biography", name: "Historical Biography", count: 1 },
    { id: "celebrity-biography", name: "Celebrity Biography", count: 1 },
  ]},
];

const sortOptions = [
  { id: "featured", label: "Featured", icon: Star },
  { id: "newest", label: "Newest Releases", icon: Clock },
  { id: "bestselling", label: "Best Selling", icon: TrendingUp },
  { id: "rating", label: "Highest Rated", icon: Star },
  { id: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
  { id: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
  { id: "title-az", label: "Title: A-Z", icon: ArrowUpDown },
  { id: "reviews", label: "Most Reviewed", icon: ArrowUpDown },
];

const trendingSearches = [
  "Financial Freedom", "Creative Mind", "Leadership", "African Fiction",
  "Poetry", "Self-Help", "Entrepreneurship", "Children's Books",
];

const mockBooks = [
  { id: "1", title: "Financial Freedom Unleashed", slug: "financial-freedom-unleashed", author: "Sarah Mitchell", price: 14.99, discountPrice: 11.99, averageRating: 4.8, totalReviews: 234, category: "finance", subcategory: "financial-freedom", isNew: true, isBestseller: true, cover: "/cover1.jpg", description: "Your roadmap to wealth and prosperity." },
  { id: "2", title: "Explore Your Creative Mind to Positivity", slug: "creative-mind-positivity", author: "Rotyen Mercado", price: 12.99, discountPrice: null, averageRating: 4.6, totalReviews: 189, category: "non-fiction", subcategory: "self-help", isNew: false, isBestseller: true, cover: "/cover2.webp", description: "Unlock the motivation to increase productivity and develop positive thinking habits." },
  { id: "3", title: "Made to Impress", slug: "made-to-impress", author: "Andrew Cris", price: 16.99, discountPrice: null, averageRating: 4.9, totalReviews: 312, category: "non-fiction", subcategory: "self-help", isNew: false, isBestseller: true, cover: "/cover3.webp", description: "Discover great secrets of abstract art and creative expression." },
  { id: "4", title: "The Mind of a Leader", slug: "mind-of-a-leader", author: "Kevin Anderson", price: 13.99, discountPrice: 10.99, averageRating: 4.7, totalReviews: 156, category: "business", subcategory: "leadership", isNew: true, isBestseller: false, cover: "/cover4.webp", description: "How to lead yourself, your people and your organization to extraordinary results." },
  { id: "5", title: "Rivers of Gold", slug: "rivers-of-gold", author: "Yaw Asante", price: 11.99, discountPrice: null, averageRating: 4.5, totalReviews: 278, category: "fiction", subcategory: "contemporary", isNew: false, isBestseller: true, cover: "/cover5.webp", description: "A sweeping tale of adventure and discovery across West Africa." },
  { id: "6", title: "Beneath the Stars", slug: "beneath-the-stars", author: "Esi Dankwa", price: 15.99, discountPrice: 12.99, averageRating: 4.8, totalReviews: 201, category: "romance", subcategory: "contemporary-romance", isNew: true, isBestseller: false, cover: "/cover6.webp", description: "A love story that transcends time and distance." },
  { id: "7", title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", author: "Kofi Mensah", price: 12.99, discountPrice: null, averageRating: 4.6, totalReviews: 189, category: "technology", subcategory: "artificial-intelligence", isNew: false, isBestseller: false, cover: "/cover7.webp", description: "Exploring the intersection of technology and humanity." },
  { id: "8", title: "The Silent Garden", slug: "the-silent-garden", author: "Amara Osei", price: 14.99, discountPrice: null, averageRating: 4.8, totalReviews: 234, category: "fiction", subcategory: "literary-fiction", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop", description: "A lyrical exploration of memory and belonging." },
  { id: "9", title: "Whispers in the Dark", slug: "whispers-in-the-dark", author: "Nana Agyeman", price: 16.99, discountPrice: 13.99, averageRating: 4.9, totalReviews: 312, category: "mystery", subcategory: "psychological-thriller", isNew: true, isBestseller: true, cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop", description: "A gripping psychological thriller that keeps you guessing." },
  { id: "10", title: "The Last Horizon", slug: "the-last-horizon", author: "Akosua Boateng", price: 13.99, discountPrice: null, averageRating: 4.7, totalReviews: 156, category: "fiction", subcategory: "historical-fiction", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop", description: "An epic historical saga spanning three generations." },
  { id: "11", title: "Digital Empires", slug: "digital-empires", author: "Dr. Fatima Al-Hassan", price: 18.99, discountPrice: 14.99, averageRating: 4.7, totalReviews: 198, category: "technology", subcategory: "artificial-intelligence", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop", description: "The future of AI and its impact on society." },
  { id: "12", title: "The Art of Starting Up", slug: "art-of-starting-up", author: "Kwame Mensah", price: 15.99, discountPrice: null, averageRating: 4.6, totalReviews: 145, category: "business", subcategory: "entrepreneurship", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", description: "A practical guide to building your first company." },
  { id: "13", title: "Prayers That Move Mountains", slug: "prayers-move-mountains", author: "Pastor David Osei", price: 11.99, discountPrice: 9.99, averageRating: 4.9, totalReviews: 456, category: "religion", subcategory: "christianity", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=600&fit=crop", description: "A powerful devotional for spiritual breakthrough." },
  { id: "14", title: "Little Stars Learning", slug: "little-stars-learning", author: "Grace Adjei", price: 9.99, discountPrice: null, averageRating: 4.8, totalReviews: 89, category: "children", subcategory: "picture-books", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", description: "A colorful adventure teaching kids about the alphabet." },
  { id: "15", title: "Code Like a Pro", slug: "code-like-pro", author: "Michael Chen", price: 22.99, discountPrice: 17.99, averageRating: 4.5, totalReviews: 312, category: "technology", subcategory: "web-development", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop", description: "Master modern web development from zero to hero." },
  { id: "16", title: "The Wealth Blueprint", slug: "wealth-blueprint", author: "Nadia Okafor", price: 16.99, discountPrice: null, averageRating: 4.7, totalReviews: 178, category: "finance", subcategory: "investing", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop", description: "Build lasting wealth through smart investment strategies." },
  { id: "17", title: "African Voices Anthology", slug: "african-voices", author: "Various Authors", price: 19.99, discountPrice: 15.99, averageRating: 4.8, totalReviews: 234, category: "poetry", subcategory: "african-poetry", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop", description: "A stunning collection of contemporary African poetry." },
  { id: "18", title: "The Entrepreneur's Playbook", slug: "entrepreneurs-playbook", author: "Samuel Kwarteng", price: 17.99, discountPrice: null, averageRating: 4.6, totalReviews: 167, category: "business", subcategory: "entrepreneurship", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=600&fit=crop", description: "Lessons from Africa's most successful founders." },
  { id: "19", title: "Healing Hearts", slug: "healing-hearts", author: "Dr. Ama Serwaa", price: 13.99, discountPrice: 10.99, averageRating: 4.7, totalReviews: 145, category: "health", subcategory: "mental-health", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=600&fit=crop", description: "A compassionate guide to emotional wellness and resilience." },
  { id: "20", title: "Crimson Shadows", slug: "crimson-shadows", author: "Evelyn Ansah", price: 14.99, discountPrice: null, averageRating: 4.8, totalReviews: 289, category: "mystery", subcategory: "crime-thriller", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=600&fit=crop", description: "A detective hunts a serial killer in Accra." },
  { id: "21", title: "Quantum Leaps", slug: "quantum-leaps", author: "Prof. Isaac Darko", price: 21.99, discountPrice: 17.99, averageRating: 4.5, totalReviews: 98, category: "technology", subcategory: "data-science", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop", description: "The science behind quantum computing breakthroughs." },
  { id: "22", title: "Love in Lagos", slug: "love-in-lagos", author: "Chioma Eze", price: 12.99, discountPrice: null, averageRating: 4.6, totalReviews: 201, category: "romance", subcategory: "contemporary-romance", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=600&fit=crop", description: "A modern love story set in the heart of Lagos." },
  { id: "23", title: "WAEC Mathematics Success", slug: "waec-mathematics", author: "Dr. Emmanuel Nwosu", price: 8.99, discountPrice: null, averageRating: 4.4, totalReviews: 345, category: "education", subcategory: "textbooks", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=600&fit=crop", description: "Complete WAEC preparation guide for mathematics." },
  { id: "24", title: "Journey to Inner Peace", slug: "inner-peace", author: "Rev. Sarah Adjei", price: 10.99, discountPrice: 8.99, averageRating: 4.8, totalReviews: 167, category: "religion", subcategory: "spirituality", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", description: "Finding calm in a chaotic world through meditation." },
  { id: "25", title: "The Crypto Revolution", slug: "crypto-revolution", author: "Daniel Asante", price: 15.99, discountPrice: null, averageRating: 4.3, totalReviews: 123, category: "finance", subcategory: "investing", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=600&fit=crop", description: "Understanding cryptocurrency and blockchain technology." },
  { id: "26", title: "Tiny Tots ABC", slug: "tiny-tots-abc", author: "Patricia Owusu", price: 7.99, discountPrice: null, averageRating: 4.9, totalReviews: 89, category: "children", subcategory: "early-readers", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=600&fit=crop", description: "Learn the alphabet with fun illustrations." },
  { id: "27", title: "Heartstrings", slug: "heartstrings", author: "Abena Mensah", price: 13.99, discountPrice: 11.99, averageRating: 4.7, totalReviews: 178, category: "poetry", subcategory: "love-poetry", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop", description: "Poems of love, loss, and longing." },
  { id: "28", title: "Cyber Shield", slug: "cyber-shield", author: "Dr. Grace Amoako", price: 19.99, discountPrice: null, averageRating: 4.6, totalReviews: 89, category: "technology", subcategory: "cybersecurity", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=600&fit=crop", description: "Protecting your digital assets in the modern age." },
  { id: "29", title: "The CEO's Handbook", slug: "ceos-handbook", author: "James Kofi", price: 18.99, discountPrice: 14.99, averageRating: 4.8, totalReviews: 234, category: "business", subcategory: "leadership", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop", description: "Essential strategies for modern business leaders." },
  { id: "30", title: "Nutrition 101", slug: "nutrition-101", author: "Dr. Fatima Ibrahim", price: 14.99, discountPrice: null, averageRating: 4.5, totalReviews: 156, category: "health", subcategory: "nutrition", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=600&fit=crop", description: "A complete guide to healthy eating and nutrition." },
  { id: "31", title: "Seeds of Destiny", slug: "seeds-of-destiny", author: "Bishop Michael Osei", price: 12.99, discountPrice: 9.99, averageRating: 4.9, totalReviews: 567, category: "religion", subcategory: "devotionals", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&h=600&fit=crop", description: "Daily devotionals for purposeful living." },
  { id: "32", title: "The Study Master", slug: "study-master", author: "Prof. Kwaku Boateng", price: 11.99, discountPrice: null, averageRating: 4.4, totalReviews: 234, category: "education", subcategory: "study-guides", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop", description: "Proven techniques for academic excellence." },
  { id: "33", title: "Kingdom Adventures", slug: "kingdom-adventures", author: "Nana Yaa Asantewaa", price: 10.99, discountPrice: null, averageRating: 4.8, totalReviews: 67, category: "children", subcategory: "middle-grade", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=400&h=600&fit=crop", description: "An exciting adventure through an ancient kingdom." },
  { id: "34", title: "Shadows of Deceit", slug: "shadows-deceit", author: "Victoria Asare", price: 15.99, discountPrice: 12.99, averageRating: 4.7, totalReviews: 189, category: "mystery", subcategory: "psychological-thriller", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", description: "Nothing is what it seems in this mind-bending thriller." },
  { id: "35", title: "Fitness Foundations", slug: "fitness-foundations", author: "Coach Emmanuel", price: 13.99, discountPrice: null, averageRating: 4.6, totalReviews: 145, category: "health", subcategory: "fitness", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop", description: "Build strength and confidence with proven workouts." },
  { id: "36", title: "Savannah Tales", slug: "savannah-tales", author: "Kwadwo Opoku", price: 11.99, discountPrice: null, averageRating: 4.5, totalReviews: 98, category: "fiction", subcategory: "literary-fiction", isNew: false, isBestseller: false, cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop", description: "Stories of life on the Ghanaian savannah." },
  { id: "37", title: "The Marketing Machine", slug: "marketing-machine", author: "Aisha Mohammed", price: 16.99, discountPrice: 13.99, averageRating: 4.7, totalReviews: 167, category: "business", subcategory: "marketing", isNew: true, isBestseller: false, cover: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=600&fit=crop", description: "Modern marketing strategies that actually work." },
  { id: "38", title: "Sisterhood of Stars", slug: "sisterhood-stars", author: "Ama Darko", price: 13.99, discountPrice: null, averageRating: 4.8, totalReviews: 212, category: "fiction", subcategory: "contemporary", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop", description: "The bonds of friendship that sustain us." },
  { id: "39", title: "WAEC English Success", slug: "waec-english", author: "Dr. Grace Osei", price: 8.99, discountPrice: null, averageRating: 4.5, totalReviews: 456, category: "education", subcategory: "textbooks", isNew: false, isBestseller: true, cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop", description: "Complete WAEC preparation for English Language." },
];

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const itemsPerPage = 12;

  const filteredBooks = useMemo(() => {
    let result = [...mockBooks];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter(
        (b) => b.category === selectedCategory || b.subcategory === selectedCategory
      );
    }
    result = result.filter((b) => b.price >= priceRange[0] && b.price <= priceRange[1]);
    switch (sortBy) {
      case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "bestselling": result.sort((a, b) => b.totalReviews - a.totalReviews); break;
      case "rating": result.sort((a, b) => b.averageRating - a.averageRating); break;
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "title-az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "reviews": result.sort((a, b) => b.totalReviews - a.totalReviews); break;
    }
    return result;
  }, [search, selectedCategory, sortBy, priceRange]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = useCallback((term: string) => {
    setSearch(term);
    setCurrentPage(1);
    if (term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches((prev) => [term.trim(), ...prev].slice(0, 5));
    }
  }, [recentSearches]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addToCart = (book: typeof mockBooks[0]) => {
    addItem({ id: book.id, title: book.title, author: book.author, price: book.discountPrice || book.price, cover: book.cover });
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search Section */}
      <section className="relative bg-gradient-to-b from-[#FDF6EE] to-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal"
            style={{ fontFamily: "var(--font-libre)" }}
          >
            Discover Your Next Great Read
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-dark-gray/70"
          >
            Browse thousands of books from independent authors worldwide
          </motion.p>

          {/* Search Bar */}
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mt-8 max-w-2xl mx-auto"
          >
            <div className={cn(
              "flex items-center rounded-2xl border-2 bg-white shadow-lg transition-all duration-300",
              searchFocused ? "border-[#EBC9A8] shadow-xl ring-4 ring-[#EBC9A8]/10" : "border-gray-200"
            )}>
              <Search className="ml-4 h-5 w-5 text-dark-gray/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(search);
                }}
                placeholder="Search by title, author, or category..."
                className="flex-1 px-4 py-4 text-base bg-transparent outline-none placeholder:text-dark-gray/40"
              />
              {search && (
                <button onClick={() => handleSearch("")} className="mr-2 p-1 rounded-full hover:bg-gray-100">
                  <X className="h-4 w-4 text-dark-gray/50" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-xl z-50 p-4"
                >
                  {recentSearches.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-dark-gray/50 uppercase tracking-wider mb-2">Recent Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { handleSearch(term); setSearchFocused(false); }}
                            className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-[#EBC9A8]/20 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-dark-gray/50 uppercase tracking-wider mb-2">Trending Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => { handleSearch(term); setSearchFocused(false); }}
                          className="px-3 py-1.5 text-sm rounded-full bg-[#EBC9A8]/10 hover:bg-[#EBC9A8]/30 text-charcoal transition-colors"
                        >
                          <TrendingUp className="inline h-3 w-3 mr-1" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn("lg:w-64 shrink-0", showFilters ? "block" : "hidden lg:block")}>
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                          selectedCategory === cat.id
                            ? "bg-[#EBC9A8]/20 text-charcoal font-semibold"
                            : "text-dark-gray/70 hover:bg-gray-50"
                        )}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-dark-gray/40">{cat.count}</span>
                      </button>
                      {selectedCategory === cat.id && cat.sub && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {cat.sub.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => { setSelectedCategory(sub.id); setCurrentPage(1); }}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all",
                                selectedCategory === sub.id
                                  ? "bg-[#EBC9A8]/10 text-charcoal font-medium"
                                  : "text-dark-gray/50 hover:bg-gray-50 hover:text-dark-gray/70"
                              )}
                            >
                              <span>{sub.name}</span>
                              <span className="text-dark-gray/30">{sub.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={priceRange[1]}
                    onChange={(e) => { setPriceRange([0, Number(e.target.value)]); setCurrentPage(1); }}
                    className="w-full accent-[#EBC9A8]"
                  />
                  <div className="flex justify-between text-xs text-dark-gray/50 mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "all" || search || priceRange[1] < 50) && (
                <button
                  onClick={() => { setSelectedCategory("all"); setSearch(""); setPriceRange([0, 50]); setCurrentPage(1); }}
                  className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Book Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <p className="text-sm text-dark-gray/60">
                  <span className="font-semibold text-charcoal">{filteredBooks.length}</span> books found
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border bg-white outline-none focus:border-[#EBC9A8]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "all" || search) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#EBC9A8]/20 text-charcoal font-medium">
                    {selectedCat?.name}
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-rose-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#EBC9A8]/20 text-charcoal font-medium">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => handleSearch("")} className="ml-1 hover:text-rose-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Books Grid */}
            {paginatedBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link href={`/books/${book.slug}`}>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {book.isNew && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded-full">
                            New
                          </span>
                        )}
                        {book.isBestseller && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#EBC9A8] text-charcoal rounded-full">
                            Bestseller
                          </span>
                        )}
                        {book.discountPrice && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white rounded-full">
                            -{Math.round((1 - book.discountPrice / book.price) * 100)}%
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="mt-3 px-1">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn("h-3 w-3", i < Math.round(book.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")}
                          />
                        ))}
                        <span className="text-[10px] text-dark-gray/50 ml-1">({book.totalReviews})</span>
                      </div>
                      <Link href={`/books/${book.slug}`}>
                        <h3 className="text-sm font-semibold text-charcoal line-clamp-2 hover:text-[#8A6A4A] transition-colors leading-snug">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-dark-gray/60 mt-0.5">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-charcoal">
                            ${(book.discountPrice || book.price).toFixed(2)}
                          </span>
                          {book.discountPrice && (
                            <span className="text-xs text-dark-gray/40 line-through">${book.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleItem({ id: book.id, title: book.title, author: book.author, price: book.price, cover: book.cover, slug: book.slug });
                            }}
                            className="p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                          >
                            <Heart className={cn("h-4 w-4", isInWishlist(book.id) ? "fill-rose-500 text-rose-500" : "text-dark-gray/40")} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(book);
                            }}
                            className="p-1.5 rounded-full hover:bg-[#EBC9A8]/20 transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4 text-dark-gray/40" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 mx-auto text-dark-gray/20 mb-4" />
                <h3 className="text-lg font-semibold text-charcoal mb-2">No books found</h3>
                <p className="text-sm text-dark-gray/50">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-10 w-10 rounded-lg text-sm font-medium transition-all",
                      page === currentPage
                        ? "bg-[#EBC9A8] text-charcoal shadow-sm"
                        : "text-dark-gray/60 hover:bg-gray-100"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
