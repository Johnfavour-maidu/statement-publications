"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Feather,
  Baby,
  GraduationCap,
  Globe,
  Building,
  Lightbulb,
  Search,
  Palette,
  Coins,
  Briefcase,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    slug: "fiction",
    icon: BookOpen,
    count: 3,
    description: "Immerse yourself in compelling stories from literary fiction to genre-bending tales.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Non-Fiction",
    slug: "non-fiction",
    icon: Globe,
    count: 3,
    description: "Explore real-world topics from history and science to current affairs.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    name: "Business",
    slug: "business",
    icon: Briefcase,
    count: 3,
    description: "Learn from the best business minds and startup strategies.",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },
  {
    name: "Technology",
    slug: "technology",
    icon: Lightbulb,
    count: 5,
    description: "Stay ahead with the latest in coding, AI, and digital innovation.",
    gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  },
  {
    name: "Education",
    slug: "education",
    icon: GraduationCap,
    count: 3,
    description: "Transform your learning with mindset, skills, and study strategies.",
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  },
  {
    name: "Religion",
    slug: "religion",
    icon: Heart,
    count: 3,
    description: "Explore faith, spirituality, and the search for meaning.",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  },
  {
    name: "Biography",
    slug: "biography",
    icon: Building,
    count: 3,
    description: "Real lives, extraordinary stories from visionary leaders.",
    gradient: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
  },
  {
    name: "Romance",
    slug: "romance",
    icon: Heart,
    count: 3,
    description: "Love stories that will make your heart flutter and soar.",
    gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  },
  {
    name: "Mystery",
    slug: "mystery",
    icon: Search,
    count: 3,
    description: "Gripping thrillers that will keep you on the edge of your seat.",
    gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)",
  },
  {
    name: "Poetry",
    slug: "poetry",
    icon: Feather,
    count: 3,
    description: "Beautifully crafted verses that speak to the soul.",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  {
    name: "Children's",
    slug: "children",
    icon: Baby,
    count: 3,
    description: "Stories designed to spark imagination in young readers.",
    gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
  },
  {
    name: "Finance",
    slug: "finance",
    icon: Coins,
    count: 3,
    description: "Master your money with wealth-building and investment wisdom.",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  {
    name: "Self-Help",
    slug: "self-help",
    icon: Palette,
    count: 3,
    description: "Inspiring personal growth, habits, and transformation.",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CategoriesPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Categories
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collection of genres. Find your next favorite read
          from a wide variety of categories.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.slug} variants={item}>
              <Link href={`/categories/${category.slug}`}>
                <div className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:scale-[1.02]">
                  <div
                    className="h-32 w-full transition-transform duration-500 group-hover:scale-110"
                    style={{ background: category.gradient }}
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} {category.count === 1 ? "book" : "books"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
