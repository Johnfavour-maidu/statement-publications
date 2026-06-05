"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  BookOpen,
  ChevronRight,
  ThumbsUp,
  User,
  Calendar,
  Globe,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const allBooks = [
  {
    id: "1",
    title: "Echoes of Tomorrow",
    slug: "echoes-of-tomorrow",
    author: "James Mitchell",
    authorBio: "James Mitchell is an award-winning novelist known for his thought-provoking fiction that explores the intersection of technology and humanity. He holds an MFA from Columbia University and has been published in over 20 countries.",
    price: 14.99,
    discountPrice: 11.99,
    averageRating: 4.5,
    totalReviews: 234,
    category: "fiction",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    description: "A sweeping tale of hope and resilience in a world transformed by time. When Dr. Elena Foster discovers a way to glimpse into the future, she must decide whether to change history or let destiny unfold. A masterfully crafted novel that blends science fiction with deep human emotion, Echoes of Tomorrow explores the consequences of knowing what lies ahead and the courage it takes to face the unknown.\n\nMitchell weaves together multiple timelines and perspectives, creating a rich tapestry of interconnected lives. From the bustling streets of future New York to the quiet corners of a small English village, this story spans decades and continents.",
    publicationDate: "2025-03-15",
    pageCount: 342,
    isbn: "978-1234567890",
    publisher: "Statement Publications",
    relatedSlugs: ["the-silent-garden", "midnight-bridges", "thinking-in-systems"],
  },
  {
    id: "2",
    title: "The Silent Garden",
    slug: "the-silent-garden",
    author: "Eleanor Hayes",
    authorBio: "Eleanor Hayes is a British author celebrated for her lyrical prose and atmospheric storytelling. Her works have won multiple literary prizes and been translated into 15 languages.",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.8,
    totalReviews: 312,
    category: "fiction",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    description: "In a garden where whispers hold secrets, one woman uncovers a mystery that spans generations. The Silent Garden is a hauntingly beautiful novel about memory, loss, and the stories we inherit without knowing.\n\nWhen botanical illustrator Iris Blackwell inherits a crumbling estate in the English countryside, she discovers a walled garden that hasn't been entered in over a century. Inside, she finds rare plants and cryptic journals that point to a family secret buried deep in the past.",
    publicationDate: "2024-11-20",
    pageCount: 388,
    isbn: "978-1234567891",
    publisher: "Penguin Books",
    relatedSlugs: ["echoes-of-tomorrow", "midnight-bridges", "milk-and-honey"],
  },
  {
    id: "3",
    title: "Midnight Bridges",
    slug: "midnight-bridges",
    author: "Marcus Chen",
    authorBio: "Marcus Chen is a Taiwanese-American author whose work blends magical realism with contemporary themes. He has been recognized as one of the most innovative voices in modern fiction.",
    price: 12.99,
    discountPrice: 9.99,
    averageRating: 4.2,
    totalReviews: 87,
    category: "fiction",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    description: "A mysterious traveler crosses bridges that only appear at midnight, discovering worlds unseen. Midnight Bridges is a collection of interconnected stories that explore the liminal spaces between reality and imagination.",
    publicationDate: "2025-01-10",
    pageCount: 256,
    isbn: "978-1234567892",
    publisher: "HarperCollins",
    relatedSlugs: ["echoes-of-tomorrow", "the-silent-garden", "leaves-of-grass"],
  },
  {
    id: "4",
    title: "Thinking in Systems",
    slug: "thinking-in-systems",
    author: "Diana Morales",
    authorBio: "Diana Morales is a systems theorist and author whose work bridges the gap between complex science and practical application. She consults for Fortune 500 companies and teaches at MIT.",
    price: 18.99,
    discountPrice: 14.99,
    averageRating: 4.7,
    totalReviews: 189,
    category: "non-fiction",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    description: "A practical guide to understanding complex systems and making better decisions. Thinking in Systems reveals how to see patterns, understand feedback loops, and create positive change in business and life.",
    publicationDate: "2024-08-05",
    pageCount: 312,
    isbn: "978-1234567893",
    publisher: "Doubleday",
    relatedSlugs: ["the-power-of-habit", "atomic-focus", "rich-dad-poor-dad"],
  },
  {
    id: "5",
    title: "The Power of Habit",
    slug: "the-power-of-habit",
    author: "Charles Duhigg",
    authorBio: "Charles Duhigg is a Pulitzer Prize-winning reporter and author. His work has appeared in The New York Times, The Atlantic, and other major publications.",
    price: 15.99,
    discountPrice: null,
    averageRating: 4.6,
    totalReviews: 456,
    category: "non-fiction",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    description: "Why we do what we do in life and business, and how to change habits that shape our future. Duhigg takes us to the cutting edge of scientific discoveries that explain why habits exist and how they can be changed.",
    publicationDate: "2023-06-12",
    pageCount: 371,
    isbn: "978-1234567894",
    publisher: "Random House",
    relatedSlugs: ["thinking-in-systems", "atomic-focus", "the-lean-startup"],
  },
  {
    id: "6",
    title: "Atomic Focus",
    slug: "atomic-focus",
    author: "Dr. Sarah Lin",
    authorBio: "Dr. Sarah Lin is a cognitive neuroscientist and bestselling author. She holds a PhD from Stanford and runs the Focus Institute, a research center dedicated to understanding human concentration.",
    price: 13.99,
    discountPrice: 10.99,
    averageRating: 4.4,
    totalReviews: 123,
    category: "non-fiction",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    description: "Master the art of deep concentration in a world of constant distraction. Based on cutting-edge neuroscience research, Atomic Focus provides practical strategies for achieving laser-like focus.",
    publicationDate: "2025-02-28",
    pageCount: 264,
    isbn: "978-1234567895",
    publisher: "Simon & Schuster",
    relatedSlugs: ["the-power-of-habit", "thinking-in-systems", "mindset"],
  },
  {
    id: "7",
    title: "The Lean Startup",
    slug: "the-lean-startup",
    author: "Eric Ries",
    authorBio: "Eric Ries is an entrepreneur and author who has influenced a generation of startup founders. He advises businesses of all sizes on innovation and growth.",
    price: 19.99,
    discountPrice: 15.99,
    averageRating: 4.5,
    totalReviews: 567,
    category: "business",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    description: "How constant innovation creates wildly successful businesses. The Lean Startup methodology has been adopted by entrepreneurs and companies around the world.",
    publicationDate: "2023-09-15",
    pageCount: 336,
    isbn: "978-1234567896",
    publisher: "Crown Business",
    relatedSlugs: ["zero-to-one", "good-to-great", "rich-dad-poor-dad"],
  },
  {
    id: "8",
    title: "Zero to One",
    slug: "zero-to-one",
    author: "Peter Thiel",
    authorBio: "Peter Thiel is an entrepreneur, investor, and co-founder of PayPal and Palantir Technologies. He was the first external investor in Facebook.",
    price: 17.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 389,
    category: "business",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    description: "Notes on startups, or how to build the future. Thiel challenges conventional wisdom and offers contrarian thinking about innovation.",
    publicationDate: "2023-03-20",
    pageCount: 224,
    isbn: "978-1234567897",
    publisher: "Crown Business",
    relatedSlugs: ["the-lean-startup", "good-to-great", "the-innovators"],
  },
  {
    id: "9",
    title: "Good to Great",
    slug: "good-to-great",
    author: "Jim Collins",
    authorBio: "Jim Collins is a bestselling author and business consultant. His research has transformed how organizations think about performance and leadership.",
    price: 16.99,
    discountPrice: 12.99,
    averageRating: 4.4,
    totalReviews: 298,
    category: "business",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    description: "Why some companies make the leap and others don't. Based on years of rigorous research, Collins identifies the factors that distinguish truly great companies.",
    publicationDate: "2022-10-01",
    pageCount: 320,
    isbn: "978-1234567898",
    publisher: "HarperBusiness",
    relatedSlugs: ["the-lean-startup", "zero-to-one", "steve-jobs"],
  },
  {
    id: "10",
    title: "Clean Code",
    slug: "clean-code",
    author: "Robert C. Martin",
    authorBio: "Robert C. Martin, known as Uncle Bob, is a software craftsman with over 50 years of experience. He has written extensively about software design and agile practices.",
    price: 34.99,
    discountPrice: 27.99,
    averageRating: 4.7,
    totalReviews: 678,
    category: "technology",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
    description: "A handbook of agile software craftsmanship. This book is essential reading for every professional developer who wants to write clean, maintainable code.",
    publicationDate: "2022-08-01",
    pageCount: 464,
    isbn: "978-0132350884",
    publisher: "Prentice Hall",
    relatedSlugs: ["the-pragmatic-programmer", "ai-revolution", "the-innovators"],
  },
  {
    id: "11",
    title: "The Pragmatic Programmer",
    slug: "the-pragmatic-programmer",
    author: "David Thomas",
    authorBio: "David Thomas is a veteran software developer and author. His practical approach to programming has influenced millions of developers worldwide.",
    price: 39.99,
    discountPrice: null,
    averageRating: 4.8,
    totalReviews: 445,
    category: "technology",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
    description: "Your journey to mastery in software development. This classic guide is packed with practical advice and timeless wisdom for programmers of all levels.",
    publicationDate: "2023-04-15",
    pageCount: 352,
    isbn: "978-0135957059",
    publisher: "Addison-Wesley",
    relatedSlugs: ["clean-code", "ai-revolution", "homo-deus"],
  },
  {
    id: "12",
    title: "AI Revolution",
    slug: "ai-revolution",
    author: "Dr. Kai Nakamura",
    authorBio: "Dr. Kai Nakamura is a leading AI researcher at Stanford University. He has published over 100 papers on machine learning and artificial intelligence.",
    price: 24.99,
    discountPrice: 19.99,
    averageRating: 4.6,
    totalReviews: 234,
    category: "technology",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    description: "How artificial intelligence is reshaping our world and what it means for humanity. A comprehensive look at the technology that will define the next century.",
    publicationDate: "2025-01-20",
    pageCount: 288,
    isbn: "978-1234567899",
    publisher: "MIT Press",
    relatedSlugs: ["homo-deus", "life-3-0", "clean-code"],
  },
  {
    id: "13",
    title: "Mindset",
    slug: "mindset",
    author: "Carol Dweck",
    authorBio: "Carol Dweck is a Stanford University professor and one of the world's leading researchers in motivation and personality. Her work has influenced education, business, and sports.",
    price: 16.99,
    discountPrice: 12.99,
    averageRating: 4.5,
    totalReviews: 567,
    category: "education",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    description: "The new psychology of success that transforms how we think about learning. Dweck reveals how a simple idea about the brain can create a love of learning and resilience.",
    publicationDate: "2022-11-15",
    pageCount: 276,
    isbn: "978-0345472328",
    publisher: "Ballantine Books",
    relatedSlugs: ["the-first-20-hours", "ultralearning", "atomic-focus"],
  },
  {
    id: "14",
    title: "The First 20 Hours",
    slug: "the-first-20-hours",
    author: "Josh Kaufman",
    authorBio: "Josh Kaufman is an author and learning consultant. His TEDx talk on rapid skill acquisition has been viewed millions of times.",
    price: 14.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 198,
    category: "education",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    description: "How to learn anything fast in just 20 hours of deliberate practice. Kaufman debunks the 10,000-hour rule and shows how to acquire skills quickly.",
    publicationDate: "2023-05-10",
    pageCount: 256,
    isbn: "978-0062120199",
    publisher: "HarperOne",
    relatedSlugs: ["mindset", "ultralearning", "the-power-of-habit"],
  },
  {
    id: "15",
    title: "Ultralearning",
    slug: "ultralearning",
    author: "Scott Young",
    authorBio: "Scott Young is a writer and entrepreneur known for completing the MIT Challenge and sharing his learning strategies online.",
    price: 18.99,
    discountPrice: 14.99,
    averageRating: 4.4,
    totalReviews: 156,
    category: "education",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #005aa7 0%, #fffde4 100%)",
    description: "Master hard skills, outsmart the competition, and accelerate your career. A practical framework for learning anything faster and more effectively.",
    publicationDate: "2025-03-05",
    pageCount: 288,
    isbn: "978-0062857781",
    publisher: "HarperBusiness",
    relatedSlugs: ["mindset", "the-first-20-hours", "thinking-in-systems"],
  },
  {
    id: "16",
    title: "The Purpose Driven Life",
    slug: "the-purpose-driven-life",
    author: "Rick Warren",
    authorBio: "Rick Warren is an American pastor and author. He founded Saddleback Church and is one of the most influential spiritual leaders in the world.",
    price: 15.99,
    discountPrice: null,
    averageRating: 4.6,
    totalReviews: 789,
    category: "religion",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    description: "What on Earth am I here for? A 40-day journey to discovering your purpose. This book has changed millions of lives around the world.",
    publicationDate: "2022-06-01",
    pageCount: 368,
    isbn: "978-0310337508",
    publisher: "Zondervan",
    relatedSlugs: ["mere-christianity", "siddhartha", "educated"],
  },
  {
    id: "17",
    title: "Mere Christianity",
    slug: "mere-christianity",
    author: "C.S. Lewis",
    authorBio: "C.S. Lewis was a British writer and lay theologian. He is best known for his works of fiction, including The Chronicles of Narnia, and his apologetic writings.",
    price: 12.99,
    discountPrice: 9.99,
    averageRating: 4.8,
    totalReviews: 1023,
    category: "religion",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
    description: "A theological classic that explores the core of Christian belief. Lewis makes a compelling case for the rationality of faith.",
    publicationDate: "2022-01-15",
    pageCount: 304,
    isbn: "978-0060652920",
    publisher: "HarperOne",
    relatedSlugs: ["the-purpose-driven-life", "siddhartha", "leaves-of-grass"],
  },
  {
    id: "18",
    title: "Siddhartha",
    slug: "siddhartha",
    author: "Hermann Hesse",
    authorBio: "Hermann Hesse was a German-Swiss poet, novelist, and painter. He was awarded the Nobel Prize in Literature in 1946.",
    price: 11.99,
    discountPrice: null,
    averageRating: 4.7,
    totalReviews: 567,
    category: "religion",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)",
    description: "A profound journey of spiritual awakening and self-discovery. Hesse's timeless masterpiece explores the search for meaning and enlightenment.",
    publicationDate: "2022-03-01",
    pageCount: 152,
    isbn: "978-0553208849",
    publisher: "Bantam",
    relatedSlugs: ["mere-christianity", "the-purpose-driven-life", "leaves-of-grass"],
  },
  {
    id: "19",
    title: "Steve Jobs",
    slug: "steve-jobs",
    author: "Walter Isaacson",
    authorBio: "Walter Isaacson is an American biographer and journalist. He has written bestselling biographies of Benjamin Franklin, Albert Einstein, and Steve Jobs.",
    price: 22.99,
    discountPrice: 17.99,
    averageRating: 4.6,
    totalReviews: 890,
    category: "biography",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
    description: "The exclusive biography of the visionary behind Apple. Based on more than 40 interviews with Jobs and over 100 interviews with family and colleagues.",
    publicationDate: "2022-04-15",
    pageCount: 656,
    isbn: "978-1451648539",
    publisher: "Simon & Schuster",
    relatedSlugs: ["educated", "becoming", "good-to-great"],
  },
  {
    id: "20",
    title: "Educated",
    slug: "educated",
    author: "Tara Westover",
    authorBio: "Tara Westover is an American author. Born to survivalists in Idaho, she didn't set foot in a classroom until she was 17. She went on to earn a PhD from Cambridge.",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.7,
    totalReviews: 678,
    category: "biography",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)",
    description: "A memoir about a young girl who leaves her survivalist family to pursue education. A powerful story of self-invention and the transformative power of learning.",
    publicationDate: "2023-02-20",
    pageCount: 352,
    isbn: "978-0399590504",
    publisher: "Random House",
    relatedSlugs: ["steve-jobs", "becoming", "mindset"],
  },
  {
    id: "21",
    title: "Becoming",
    slug: "becoming",
    author: "Michelle Obama",
    authorBio: "Michelle Obama is an American attorney and author. She served as the First Lady of the United States from 2009 to 2017.",
    price: 19.99,
    discountPrice: 15.99,
    averageRating: 4.8,
    totalReviews: 1234,
    category: "biography",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #e8198b 0%, #c7eafd 100%)",
    description: "An intimate, powerful, and inspiring memoir by the former First Lady. Michelle Obama invites readers into her world, sharing her triumphs and challenges.",
    publicationDate: "2022-11-13",
    pageCount: 448,
    isbn: "978-1524763138",
    publisher: "Crown",
    relatedSlugs: ["steve-jobs", "educated", "the-purpose-driven-life"],
  },
  {
    id: "22",
    title: "The Notebook",
    slug: "the-notebook",
    author: "Nicholas Sparks",
    authorBio: "Nicholas Sparks is an American novelist and screenwriter. His novels have been translated into over 50 languages and have sold more than 100 million copies.",
    price: 13.99,
    discountPrice: 10.99,
    averageRating: 4.4,
    totalReviews: 456,
    category: "romance",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    description: "A poignant love story about the enduring power of devotion. Sparks weaves a tale of love that spans decades and transcends time.",
    publicationDate: "2022-09-01",
    pageCount: 214,
    isbn: "978-0446676090",
    publisher: "Grand Central",
    relatedSlugs: ["pride-and-prejudice", "outlander", "the-silent-garden"],
  },
  {
    id: "23",
    title: "Pride and Prejudice",
    slug: "pride-and-prejudice",
    author: "Jane Austen",
    authorBio: "Jane Austen was an English novelist known for her wit, social commentary, and masterful portrayal of the English gentry.",
    price: 11.99,
    discountPrice: null,
    averageRating: 4.9,
    totalReviews: 2345,
    category: "romance",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    description: "The timeless tale of love, reputation, and class differences. One of the most beloved novels in the English language.",
    publicationDate: "2022-01-01",
    pageCount: 432,
    isbn: "978-0141439518",
    publisher: "Penguin Classics",
    relatedSlugs: ["the-notebook", "outlander", "mere-christianity"],
  },
  {
    id: "24",
    title: "Outlander",
    slug: "outlander",
    author: "Diana Gabaldon",
    authorBio: "Diana Gabaldon is an American author known for her Outlander series, which blends historical fiction, romance, and science fiction.",
    price: 18.99,
    discountPrice: 14.99,
    averageRating: 4.6,
    totalReviews: 789,
    category: "romance",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    description: "A sweeping tale of adventure, history, and timeless love. Gabaldon's epic series has captivated millions of readers worldwide.",
    publicationDate: "2023-06-01",
    pageCount: 850,
    isbn: "978-0440212560",
    publisher: "Dell",
    relatedSlugs: ["the-notebook", "pride-and-prejudice", "the-silent-garden"],
  },
  {
    id: "25",
    title: "Gone Girl",
    slug: "gone-girl",
    author: "Gillian Flynn",
    authorBio: "Gillian Flynn is an American author and screenwriter. Her debut novel, Sharp Objects, was an Edgar Award finalist.",
    price: 14.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 567,
    category: "mystery",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)",
    description: "A dark thriller about a marriage gone terribly wrong. Flynn's twisted tale of deception keeps you guessing until the very end.",
    publicationDate: "2022-05-22",
    pageCount: 432,
    isbn: "978-0307588371",
    publisher: "Crown",
    relatedSlugs: ["the-girl-on-the-train", "the-silent-patient", "midnight-bridges"],
  },
  {
    id: "26",
    title: "The Girl on the Train",
    slug: "the-girl-on-the-train",
    author: "Paula Hawkins",
    authorBio: "Paula Hawkins is a British author. Her debut thriller became an international bestseller and was adapted into a major motion picture.",
    price: 15.99,
    discountPrice: 11.99,
    averageRating: 4.2,
    totalReviews: 456,
    category: "mystery",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #616161 0%, #9bc5c3 100%)",
    description: "A gripping psychological thriller with an unreliable narrator. Hawkins delivers a suspenseful ride that will keep you turning pages.",
    publicationDate: "2023-01-13",
    pageCount: 336,
    isbn: "978-0062388780",
    publisher: "Riverhead",
    relatedSlugs: ["gone-girl", "the-silent-patient", "midnight-bridges"],
  },
  {
    id: "27",
    title: "The Silent Patient",
    slug: "the-silent-patient",
    author: "Alex Michaelides",
    authorBio: "Alex Michaelides is a British-Cypriot author. His debut novel became an international sensation and spent weeks on the New York Times bestseller list.",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.5,
    totalReviews: 678,
    category: "mystery",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
    description: "A woman shoots her husband and then never speaks another word. Michaelides crafts a taut, suspenseful thriller with a jaw-dropping twist.",
    publicationDate: "2025-02-05",
    pageCount: 336,
    isbn: "978-1250301697",
    publisher: "Celadon",
    relatedSlugs: ["gone-girl", "the-girl-on-the-train", "echoes-of-tomorrow"],
  },
  {
    id: "28",
    title: "Milk and Honey",
    slug: "milk-and-honey",
    author: "Rupi Kaur",
    authorBio: "Rupi Kaur is a Canadian poet and author. Her work has been translated into over 40 languages and has sold millions of copies worldwide.",
    price: 12.99,
    discountPrice: 9.99,
    averageRating: 4.5,
    totalReviews: 890,
    category: "poetry",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    description: "A collection of poetry about survival, love, loss, and femininity. Kaur's raw, accessible verses resonate with readers around the world.",
    publicationDate: "2022-07-15",
    pageCount: 208,
    isbn: "978-1449474256",
    publisher: "Andrews McMeel",
    relatedSlugs: ["the-sun-and-her-flowers", "leaves-of-grass", "the-silent-garden"],
  },
  {
    id: "29",
    title: "The Sun and Her Flowers",
    slug: "the-sun-and-her-flowers",
    author: "Rupi Kaur",
    authorBio: "Rupi Kaur is a Canadian poet and author. Her work has been translated into over 40 languages and has sold millions of copies worldwide.",
    price: 13.99,
    discountPrice: null,
    averageRating: 4.4,
    totalReviews: 567,
    category: "poetry",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)",
    description: "A vibrant collection of poetry and prose about growth, healing, and empowerment. Kaur's second collection is a journey through wilting, falling, rooting, rising, and blooming.",
    publicationDate: "2023-03-20",
    pageCount: 256,
    isbn: "978-1449486792",
    publisher: "Andrews McMeel",
    relatedSlugs: ["milk-and-honey", "leaves-of-grass", "the-silent-garden"],
  },
  {
    id: "30",
    title: "Leaves of Grass",
    slug: "leaves-of-grass",
    author: "Walt Whitman",
    authorBio: "Walt Whitman was an American poet, essayist, and journalist. He is often called the father of free verse and is one of the most influential American poets.",
    price: 10.99,
    discountPrice: null,
    averageRating: 4.7,
    totalReviews: 345,
    category: "poetry",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    description: "A landmark collection celebrating the beauty and spirit of America. Whitman's masterwork is a celebration of democracy, nature, and the human body.",
    publicationDate: "2022-01-01",
    pageCount: 528,
    isbn: "978-0486456713",
    publisher: "Dover",
    relatedSlugs: ["milk-and-honey", "the-sun-and-her-flowers", "siddhartha"],
  },
  {
    id: "31",
    title: "The Giving Tree",
    slug: "the-giving-tree",
    author: "Shel Silverstein",
    authorBio: "Shel Silverstein was an American writer, poet, and illustrator. He is best known for his children's books and songwriting.",
    price: 11.99,
    discountPrice: 8.99,
    averageRating: 4.8,
    totalReviews: 1567,
    category: "children",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    description: "A tender story about the love between a tree and a boy. This classic picture book has touched generations of readers with its message of selfless love.",
    publicationDate: "2022-06-01",
    pageCount: 64,
    isbn: "978-0060256654",
    publisher: "HarperCollins",
    relatedSlugs: ["where-the-wild-things-are", "charlottes-web", "milk-and-honey"],
  },
  {
    id: "32",
    title: "Where the Wild Things Are",
    slug: "where-the-wild-things-are",
    author: "Maurice Sendak",
    authorBio: "Maurice Sendak was an American illustrator and writer of children's books. He received the Caldecott Medal for Where the Wild Things Are.",
    price: 12.99,
    discountPrice: null,
    averageRating: 4.9,
    totalReviews: 1890,
    category: "children",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
    description: "A magical adventure to where the wild things live. Sendak's masterpiece is a celebration of imagination and the power of childhood fantasy.",
    publicationDate: "2022-01-01",
    pageCount: 48,
    isbn: "978-0064431781",
    publisher: "HarperCollins",
    relatedSlugs: ["the-giving-tree", "charlottes-web", "milk-and-honey"],
  },
  {
    id: "33",
    title: "Charlotte's Web",
    slug: "charlottes-web",
    author: "E.B. White",
    authorBio: "E.B. White was an American writer and a leading contributor to The New Yorker. He is best known for his children's novels and for co-authoring The Elements of Style.",
    price: 10.99,
    discountPrice: 7.99,
    averageRating: 4.8,
    totalReviews: 2345,
    category: "children",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #c2e59c 0%, #64b3f4 100%)",
    description: "The classic tale of a pig named Wilbur and his friendship with a spider named Charlotte. White's beloved story celebrates friendship, loyalty, and the cycle of life.",
    publicationDate: "2022-01-01",
    pageCount: 184,
    isbn: "978-0061121135",
    publisher: "HarperCollins",
    relatedSlugs: ["the-giving-tree", "where-the-wild-things-are", "milk-and-honey"],
  },
  {
    id: "34",
    title: "Rich Dad Poor Dad",
    slug: "rich-dad-poor-dad",
    author: "Robert Kiyosaki",
    authorBio: "Robert Kiyosaki is an American entrepreneur and author. He advocates financial independence through investing, real estate, and building businesses.",
    price: 17.99,
    discountPrice: 13.99,
    averageRating: 4.5,
    totalReviews: 1234,
    category: "finance",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    description: "What the rich teach their kids about money that the poor and middle class do not. This book has challenged and changed the way millions think about money.",
    publicationDate: "2022-04-01",
    pageCount: 336,
    isbn: "978-1612681139",
    publisher: "Plata Publishing",
    relatedSlugs: ["the-millionaire-next-door", "i-will-teach-you-to-be-rich", "the-lean-startup"],
  },
  {
    id: "35",
    title: "The Millionaire Next Door",
    slug: "the-millionaire-next-door",
    author: "Thomas Stanley",
    authorBio: "Thomas Stanley was an American author and researcher. He spent decades studying the habits and behaviors of America's wealthy.",
    price: 16.99,
    discountPrice: null,
    averageRating: 4.4,
    totalReviews: 567,
    category: "finance",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
    description: "The surprising secrets of America's wealthy. Stanley reveals that most millionaires live well below their means.",
    publicationDate: "2023-01-15",
    pageCount: 272,
    isbn: "978-1589795471",
    publisher: "TarcherPerigee",
    relatedSlugs: ["rich-dad-poor-dad", "i-will-teach-you-to-be-rich", "good-to-great"],
  },
  {
    id: "36",
    title: "I Will Teach You to Be Rich",
    slug: "i-will-teach-you-to-be-rich",
    author: "Ramit Sethi",
    authorBio: "Ramit Sethi is an American author and personal finance advisor. He founded I Will Teach You to Be Rich, a personal finance website.",
    price: 15.99,
    discountPrice: 11.99,
    averageRating: 4.3,
    totalReviews: 345,
    category: "finance",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #e44d26 0%, #f16529 100%)",
    description: "A 6-week personal finance program for anyone who wants to build wealth. Sethi provides a no-guilt approach to spending, saving, and investing.",
    publicationDate: "2025-03-10",
    pageCount: 352,
    isbn: "978-1523093335",
    publisher: "Avery",
    relatedSlugs: ["rich-dad-poor-dad", "the-millionaire-next-door", "the-lean-startup"],
  },
  {
    id: "37",
    title: "The Innovators",
    slug: "the-innovators",
    author: "Walter Isaacson",
    authorBio: "Walter Isaacson is an American biographer and journalist. He has written bestselling biographies of Benjamin Franklin, Albert Einstein, and Steve Jobs.",
    price: 19.99,
    discountPrice: 15.99,
    averageRating: 4.6,
    totalReviews: 456,
    category: "technology",
    isNew: false,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)",
    description: "How a group of hackers, geniuses, and geeks created the digital revolution. Isaacson tells the story of the people who made the computer and the internet possible.",
    publicationDate: "2023-07-01",
    pageCount: 560,
    isbn: "978-1476708690",
    publisher: "Simon & Schuster",
    relatedSlugs: ["ai-revolution", "homo-deus", "clean-code"],
  },
  {
    id: "38",
    title: "Homo Deus",
    slug: "homo-deus",
    author: "Yuval Noah Harari",
    authorBio: "Yuval Noah Harari is an Israeli historian and author. His books have sold over 35 million copies in 65 languages.",
    price: 21.99,
    discountPrice: 17.99,
    averageRating: 4.7,
    totalReviews: 678,
    category: "technology",
    isNew: false,
    isBestseller: true,
    gradient: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
    description: "A brief history of tomorrow exploring what the future holds for humanity. Harari examines the future of humankind in an age where biotechnology and AI are reshaping our world.",
    publicationDate: "2023-09-15",
    pageCount: 464,
    isbn: "978-0062464316",
    publisher: "Harper",
    relatedSlugs: ["ai-revolution", "life-3-0", "the-innovators"],
  },
  {
    id: "39",
    title: "Life 3.0",
    slug: "life-3-0",
    author: "Max Tegmark",
    authorBio: "Max Tegmark is a Swedish-American physicist and cosmologist. He is a professor at MIT and co-founder of the Future of Life Institute.",
    price: 20.99,
    discountPrice: 16.99,
    averageRating: 4.5,
    totalReviews: 345,
    category: "technology",
    isNew: true,
    isBestseller: false,
    gradient: "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
    description: "Being human in the age of artificial intelligence. Tegmark explores the options and opportunities that AI offers and the risks it poses.",
    publicationDate: "2025-01-15",
    pageCount: 384,
    isbn: "978-1101946596",
    publisher: "Vintage",
    relatedSlugs: ["ai-revolution", "homo-deus", "the-innovators"],
  },
];

const reviews = [
  {
    id: "r1",
    user: "Sarah M.",
    rating: 5,
    title: "Couldn't put it down!",
    content: "This book exceeded all my expectations. The author's writing style is captivating and the story kept me hooked from the first page to the last. Highly recommended!",
    helpfulCount: 42,
    date: "2025-04-10",
  },
  {
    id: "r2",
    user: "Michael R.",
    rating: 4,
    title: "Beautifully written",
    content: "A truly compelling read with well-developed characters and a plot that keeps you guessing. The pacing is excellent and the themes are thought-provoking.",
    helpfulCount: 28,
    date: "2025-03-22",
  },
  {
    id: "r3",
    user: "Emily K.",
    rating: 5,
    title: "A masterpiece",
    content: "One of the best books I've read this year. The depth of emotion and the quality of the prose are remarkable. I've already recommended it to all my friends.",
    helpfulCount: 35,
    date: "2025-03-15",
  },
];

const formats = [
  { value: "ebook", label: "Ebook", price: 9.99 },
  { value: "paperback", label: "Paperback", price: 19.99 },
  { value: "hardcover", label: "Hardcover", price: 29.99 },
];

export default function BookDetailPage() {
  const params = useParams();
  const slug = params.id as string;

  const book = useMemo(() => {
    return allBooks.find((b) => b.slug === slug) || allBooks[0];
  }, [slug]);

  const relatedBooks = useMemo(() => {
    return allBooks
      .filter((b) => book.relatedSlugs?.includes(b.slug))
      .slice(0, 4);
  }, [book.relatedSlugs]);

  const [selectedFormat, setSelectedFormat] = useState("ebook");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentPrice = formats.find((f) => f.value === selectedFormat)?.price || 9.99;

  return (
    <div className="py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/books" className="hover:text-foreground transition-colors">
          Books
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl mx-auto md:mx-0 max-w-[320px]"
            >
              <div
                className="h-full w-full transition-transform duration-500 hover:scale-105"
                style={{ background: book.gradient }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {book.discountPrice && (
                  <Badge className="bg-emerald-500 text-white border-0">
                    -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                  </Badge>
                )}
                {book.isNew && (
                  <Badge className="bg-primary text-primary-foreground border-0">
                    New
                  </Badge>
                )}
                {book.isBestseller && (
                  <Badge className="bg-amber-500 text-white border-0">
                    Bestseller
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
                  <Badge variant="secondary" className="capitalize">{book.category}</Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {book.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {book.author.charAt(0)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">by</span>
                  <span className="font-medium">{book.author}</span>
                </div>
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
                  ${currentPrice.toFixed(2)}
                </span>
                {selectedFormat === "ebook" && book.discountPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${book.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Format</p>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <motion.button
                      key={f.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                        ${f.price.toFixed(2)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="w-full bg-[#FFB347] hover:bg-[#FFA234] text-black font-semibold transition-colors">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "px-4 transition-all",
                      isWishlisted && "bg-primary/10 border-primary text-primary"
                    )}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={cn("h-5 w-5", isWishlisted && "fill-primary")}
                    />
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {book.pageCount} pages
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  English
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {book.author}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(book.publicationDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="space-y-4">
                {book.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="text-xs">{book.isbn}</Badge>
                <Badge variant="secondary" className="text-xs">{book.publisher}</Badge>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">About the Author</h2>
              <div className="flex items-start gap-4 p-4 rounded-xl border">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-medium text-primary">
                    {book.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{book.author}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {book.authorBio}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reviews ({book.totalReviews})</h2>
                <Button variant="outline" size="sm">
                  Write a Review
                </Button>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{review.user}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
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
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border p-5 space-y-4">
              <h3 className="font-semibold">Book Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISBN</span>
                  <span>{book.isbn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publisher</span>
                  <span>{book.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pages</span>
                  <span>{book.pageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {relatedBooks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedBooks.map((rb, i) => (
              <motion.div
                key={rb.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/books/${rb.slug}`} className="block group">
                  <div className="relative overflow-hidden rounded-xl border bg-card transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/20 group-hover:scale-[1.02]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div
                        className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                        style={{ background: rb.gradient }}
                      />
                    </div>
                    <div className="p-3 space-y-1.5">
                      <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {rb.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{rb.author}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold">
                          ${(rb.discountPrice || rb.price).toFixed(2)}
                        </span>
                        {rb.discountPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${rb.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


