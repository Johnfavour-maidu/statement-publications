"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  BookOpen,
  Star,
  Bell,
  BellOff,
  TrendingDown,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";

interface WishlistBook {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  price: number;
  originalPrice: number | null;
  format: string;
  rating: number;
  reviews: number;
  dateAdded: string;
  priceTracking: {
    current: number;
    lowest: number;
    highest: number;
    trend: "up" | "down" | "stable";
  };
  notifyOnPriceDrop: boolean;
}

const mockWishlist: WishlistBook[] = [
  {
    id: "1",
    title: "The Forgotten Kingdom",
    author: "Nadia El-Amin",
    coverImage: null,
    price: 15.99,
    originalPrice: 19.99,
    format: "EBOOK",
    rating: 4.7,
    reviews: 89,
    dateAdded: new Date(Date.now() - 86400000 * 5).toISOString(),
    priceTracking: {
      current: 15.99,
      lowest: 12.99,
      highest: 19.99,
      trend: "down",
    },
    notifyOnPriceDrop: true,
  },
  {
    id: "2",
    title: "A Dance with Dragons",
    author: "Kwame Asante",
    coverImage: null,
    price: 18.99,
    originalPrice: null,
    format: "HARDCOVER",
    rating: 4.9,
    reviews: 234,
    dateAdded: new Date(Date.now() - 86400000 * 10).toISOString(),
    priceTracking: {
      current: 18.99,
      lowest: 18.99,
      highest: 18.99,
      trend: "stable",
    },
    notifyOnPriceDrop: false,
  },
  {
    id: "3",
    title: "Shadows of Yesterday",
    author: "Adaeze Nwosu",
    coverImage: null,
    price: 12.99,
    originalPrice: 14.99,
    format: "EBOOK",
    rating: 4.5,
    reviews: 156,
    dateAdded: new Date(Date.now() - 86400000 * 15).toISOString(),
    priceTracking: {
      current: 12.99,
      lowest: 9.99,
      highest: 14.99,
      trend: "up",
    },
    notifyOnPriceDrop: true,
  },
  {
    id: "4",
    title: "The Golden Path",
    author: "Tariq Hassan",
    coverImage: null,
    price: 16.99,
    originalPrice: null,
    format: "PAPERBACK",
    rating: 4.6,
    reviews: 98,
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(),
    priceTracking: {
      current: 16.99,
      lowest: 16.99,
      highest: 16.99,
      trend: "stable",
    },
    notifyOnPriceDrop: true,
  },
  {
    id: "5",
    title: "Beyond the Horizon",
    author: "Emeka Nwachukwu",
    coverImage: null,
    price: 14.99,
    originalPrice: 17.99,
    format: "EBOOK",
    rating: 4.4,
    reviews: 67,
    dateAdded: new Date(Date.now() - 86400000 * 20).toISOString(),
    priceTracking: {
      current: 14.99,
      lowest: 11.99,
      highest: 17.99,
      trend: "down",
    },
    notifyOnPriceDrop: false,
  },
  {
    id: "6",
    title: "River of Stars",
    author: "Fatima Al-Rashid",
    coverImage: null,
    price: 19.99,
    originalPrice: null,
    format: "HARDCOVER",
    rating: 4.8,
    reviews: 312,
    dateAdded: new Date(Date.now() - 86400000 * 8).toISOString(),
    priceTracking: {
      current: 19.99,
      lowest: 16.99,
      highest: 22.99,
      trend: "down",
    },
    notifyOnPriceDrop: true,
  },
];

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
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function ReaderWishlistPage() {
  const [wishlist, setWishlist] = useState(mockWishlist);

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((b) => b.id !== id));
  };

  const togglePriceNotification = (id: string) => {
    setWishlist((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, notifyOnPriceDrop: !b.notifyOnPriceDrop }
          : b
      )
    );
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3.5 w-3.5 text-red-500" />;
      case "down":
        return <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
        <p className="text-muted-foreground">
          Books you&apos;re saving for later. Track prices and get notified of drops.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-pink-100 dark:bg-pink-900/30 p-2.5">
                <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wishlist.length}</p>
                <p className="text-xs text-muted-foreground">Items in wishlist</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-2.5">
                <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {wishlist.filter((b) => b.priceTracking.trend === "down").length}
                </p>
                <p className="text-xs text-muted-foreground">Price drops available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 hidden sm:block">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2.5">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {wishlist.filter((b) => b.notifyOnPriceDrop).length}
                </p>
                <p className="text-xs text-muted-foreground">Tracking prices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <AnimatePresence mode="popLayout">
          {wishlist.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Heart className="h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-6 text-lg font-medium">Your wishlist is empty</p>
                  <p className="text-sm text-muted-foreground">
                    Browse the store and save books you love.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/store">Browse Store</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((book) => (
                <motion.div
                  key={book.id}
                  variants={item}
                  layout
                  exit="exit"
                >
                  <div className="group rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-t-xl">
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {book.priceTracking.trend === "down" && (
                          <Badge className="bg-emerald-500 text-white border-0 text-[10px]">
                            Price Drop
                          </Badge>
                        )}
                        {book.originalPrice && (
                          <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">
                            -{Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => togglePriceNotification(book.id)}
                            >
                              {book.notifyOnPriceDrop ? (
                                <>
                                  <BellOff className="mr-2 h-4 w-4" />
                                  Stop Tracking Price
                                </>
                              ) : (
                                <>
                                  <Bell className="mr-2 h-4 w-4" />
                                  Track Price Drop
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => removeFromWishlist(book.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from Wishlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          {book.format}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold">
                            {formatCurrency(book.price)}
                          </span>
                          {book.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(book.originalPrice)}
                            </span>
                          )}
                          {book.priceTracking.trend !== "stable" && (
                            <span className="flex items-center gap-0.5">
                              {getTrendIcon(book.priceTracking.trend)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>
                            Lowest: {formatCurrency(book.priceTracking.lowest)}
                          </span>
                          <span>
                            Highest: {formatCurrency(book.priceTracking.highest)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground"
                          onClick={() => togglePriceNotification(book.id)}
                        >
                          {book.notifyOnPriceDrop ? (
                            <>
                              <Bell className="mr-1 h-3 w-3 text-blue-500" />
                              Tracking
                            </>
                          ) : (
                            <>
                              <BellOff className="mr-1 h-3 w-3" />
                              Not Tracking
                            </>
                          )}
                        </Button>
                        <Button size="sm" className="h-7 text-xs">
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          Add to Cart
                        </Button>
                      </div>

                      <p className="text-[10px] text-muted-foreground text-center">
                        Added {formatDate(book.dateAdded, "relative")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
