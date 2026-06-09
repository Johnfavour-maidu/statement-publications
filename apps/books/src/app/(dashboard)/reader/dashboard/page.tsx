"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Star,
  ShoppingCart,
  TrendingUp,
  BookMarked,
  ArrowUpRight,
  Flame,
  Target,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

const stats = [
  {
    label: "Books Purchased",
    value: "24",
    change: "+3 this month",
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Books Read",
    value: "18",
    change: "+2 this month",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Reading Hours",
    value: "142",
    change: "+18 this month",
    icon: Clock,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Reviews Written",
    value: "11",
    change: "+1 this week",
    icon: Star,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const currentlyReading = [
  {
    id: "1",
    title: "The Silent Echo",
    author: "Amara Okafor",
    progress: 72,
    currentPage: 216,
    totalPages: 300,
    lastRead: "2 hours ago",
  },
  {
    id: "2",
    title: "Whispers of the Forgotten",
    author: "David Mensah",
    progress: 45,
    currentPage: 135,
    totalPages: 300,
    lastRead: "Yesterday",
  },
  {
    id: "3",
    title: "Crimson Horizons",
    author: "Nadia El-Amin",
    progress: 12,
    currentPage: 36,
    totalPages: 300,
    lastRead: "3 days ago",
  },
];

const recentPurchases = [
  {
    id: "1",
    title: "Midnight Echoes",
    author: "Kwame Asante",
    price: 14.99,
    format: "EBOOK",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    title: "River of Stars",
    author: "Fatima Al-Rashid",
    price: 18.99,
    format: "HARDCOVER",
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "3",
    title: "The Last Garden",
    author: "Sofia Osei",
    price: 12.99,
    format: "EBOOK",
    date: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "4",
    title: "Beyond the Horizon",
    author: "Emeka Nwachukwu",
    price: 15.99,
    format: "PAPERBACK",
    date: new Date(Date.now() - 432000000).toISOString(),
  },
];

const recommendedBooks = [
  {
    id: "1",
    title: "Shadows of Yesterday",
    author: "Adaeze Nwosu",
    price: 13.99,
    rating: 4.7,
    reviews: 89,
    format: "EBOOK",
  },
  {
    id: "2",
    title: "The Golden Path",
    author: "Tariq Hassan",
    price: 16.99,
    rating: 4.5,
    reviews: 124,
    format: "PAPERBACK",
  },
  {
    id: "3",
    title: "Echoes in Time",
    author: "Ngozi Okafor",
    price: 11.99,
    rating: 4.8,
    reviews: 67,
    format: "EBOOK",
  },
  {
    id: "4",
    title: "Beneath the Surface",
    author: "Amina Diallo",
    price: 19.99,
    rating: 4.6,
    reviews: 203,
    format: "HARDCOVER",
  },
];

const readingStreak = {
  currentStreak: 12,
  longestStreak: 28,
  monthlyGoal: 4,
  booksReadThisMonth: 3,
  dailyMinutesGoal: 30,
  todayMinutesRead: 22,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ReaderDashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, Chioma
        </h1>
        <p className="text-muted-foreground">
          Pick up where you left off or discover something new.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Currently Reading</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reader/library">
                View Library
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {currentlyReading.map((book) => (
              <div
                key={book.id}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium leading-tight">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <Button size="sm" className="shrink-0">
                      <Play className="mr-1 h-3.5 w-3.5" />
                      Continue
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {book.currentPage} of {book.totalPages} pages
                      </span>
                      <span className="font-medium">{book.progress}%</span>
                    </div>
                    <Progress value={book.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Last read {book.lastRead}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Reading Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center space-y-1">
              <p className="text-4xl font-bold text-orange-500">
                {readingStreak.currentStreak}
              </p>
              <p className="text-sm text-muted-foreground">day streak</p>
              <p className="text-xs text-muted-foreground">
                Best: {readingStreak.longestStreak} days
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    Monthly Goal
                  </span>
                  <span className="font-medium">
                    {readingStreak.booksReadThisMonth}/{readingStreak.monthlyGoal} books
                  </span>
                </div>
                <Progress
                  value={(readingStreak.booksReadThisMonth / readingStreak.monthlyGoal) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Today&apos;s Reading
                  </span>
                  <span className="font-medium">
                    {readingStreak.todayMinutesRead}/{readingStreak.dailyMinutesGoal} min
                  </span>
                </div>
                <Progress
                  value={(readingStreak.todayMinutesRead / readingStreak.dailyMinutesGoal) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {readingStreak.dailyMinutesGoal - readingStreak.todayMinutesRead > 0
                  ? `${readingStreak.dailyMinutesGoal - readingStreak.todayMinutesRead} more minutes to hit today's goal`
                  : "You've hit today's reading goal!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Purchases</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reader/library">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="rounded-lg border p-3 space-y-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-20 items-center justify-center rounded-lg bg-muted">
                    <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{purchase.title}</p>
                    <p className="text-xs text-muted-foreground">{purchase.author}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {formatCurrency(purchase.price)}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {purchase.format}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recommended For You</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/store">
                Browse Store
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedBooks.map((book) => (
                <div
                  key={book.id}
                  className="group rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-t-xl">
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {book.format}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{book.rating}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({book.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold">
                        {formatCurrency(book.price)}
                      </span>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
