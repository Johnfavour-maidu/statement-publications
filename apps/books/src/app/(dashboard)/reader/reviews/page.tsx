"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BookOpen,
  Edit,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, cn } from "@/lib/utils";

interface Review {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  rating: number;
  title: string;
  content: string;
  dateWritten: string;
  isEdited: boolean;
  helpfulCount: number;
}

interface PendingReview {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  datePurchased: string;
  rating: number | null;
  title: string;
  content: string;
}

const mockGivenReviews: Review[] = [
  {
    id: "1",
    bookTitle: "The Silent Echo",
    bookAuthor: "Amara Okafor",
    rating: 5,
    title: "A masterpiece of modern fiction",
    content:
      "This book completely changed my perspective on storytelling. The characters are deeply developed and the plot keeps you guessing until the very last page. Okafor has outdone herself with this one.",
    dateWritten: new Date(Date.now() - 86400000 * 5).toISOString(),
    isEdited: false,
    helpfulCount: 24,
  },
  {
    id: "2",
    bookTitle: "Midnight Echoes",
    bookAuthor: "Kwame Asante",
    rating: 4,
    title: "Engaging and thought-provoking",
    content:
      "A well-crafted story that blends mystery with cultural richness. The pacing could be slightly better in the middle section, but overall a fantastic read that I'd recommend to anyone.",
    dateWritten: new Date(Date.now() - 86400000 * 15).toISOString(),
    isEdited: false,
    helpfulCount: 18,
  },
  {
    id: "3",
    bookTitle: "River of Stars",
    bookAuthor: "Fatima Al-Rashid",
    rating: 5,
    title: "Beautiful prose and unforgettable journey",
    content:
      "Al-Rashid weaves a tapestry of emotions with her poetic writing style. Every chapter felt like a new discovery. This is the kind of book you want to read slowly and savor every word.",
    dateWritten: new Date(Date.now() - 86400000 * 30).toISOString(),
    isEdited: true,
    helpfulCount: 42,
  },
  {
    id: "4",
    bookTitle: "Echoes in Time",
    bookAuthor: "Ngozi Okafor",
    rating: 5,
    title: "A sci-fi gem with heart",
    content:
      "What sets this apart from other sci-fi novels is the emotional depth. The science fiction elements are well-researched, but it's the human connections that make this story truly shine.",
    dateWritten: new Date(Date.now() - 86400000 * 60).toISOString(),
    isEdited: false,
    helpfulCount: 31,
  },
  {
    id: "5",
    bookTitle: "The Last Garden",
    bookAuthor: "Sofia Osei",
    rating: 4,
    title: "Hauntingly beautiful",
    content:
      "A story that stays with you long after you finish reading. The imagery is vivid and the themes of loss and renewal are handled with great sensitivity.",
    dateWritten: new Date(Date.now() - 86400000 * 90).toISOString(),
    isEdited: false,
    helpfulCount: 15,
  },
];

const mockPendingReviews: PendingReview[] = [
  {
    id: "1",
    bookTitle: "Whispers of the Forgotten",
    bookAuthor: "David Mensah",
    datePurchased: new Date(Date.now() - 86400000 * 21).toISOString(),
    rating: null,
    title: "",
    content: "",
  },
  {
    id: "2",
    bookTitle: "Crimson Horizons",
    bookAuthor: "Nadia El-Amin",
    datePurchased: new Date(Date.now() - 86400000 * 7).toISOString(),
    rating: null,
    title: "",
    content: "",
  },
  {
    id: "3",
    bookTitle: "Beyond the Horizon",
    bookAuthor: "Emeka Nwachukwu",
    datePurchased: new Date(Date.now() - 86400000 * 5).toISOString(),
    rating: null,
    title: "",
    content: "",
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

function StarRating({
  rating,
  onRate,
  size = "md",
}: {
  rating: number;
  onRate?: (rating: number) => void;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "transition-colors",
            size === "sm" ? "p-0" : "p-0.5",
            onRate && "cursor-pointer hover:scale-110"
          )}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate?.(star)}
          disabled={!onRate}
        >
          <Star
            className={cn(
              size === "sm" ? "h-4 w-4" : "h-5 w-5",
              star <= (hovered || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function PendingReviewCard({
  review,
  onSubmit,
}: {
  review: PendingReview;
  onSubmit: (id: string, data: { rating: number; title: string; content: string }) => void;
}) {
  const [rating, setRating] = useState(review.rating || 0);
  const [title, setTitle] = useState(review.title);
  const [content, setContent] = useState(review.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit(review.id, { rating, title, content });
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <BookOpen className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">{review.bookTitle}</h3>
          <p className="text-xs text-muted-foreground">{review.bookAuthor}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Purchased {formatDate(review.datePurchased, "relative")}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Your Rating
          </label>
          <StarRating rating={rating} onRate={setRating} />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Review Title
          </label>
          <Input
            placeholder="Summarize your experience..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Your Review
          </label>
          <Textarea
            placeholder="Tell others what you thought about this book..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] text-sm resize-none"
          />
        </div>

        <Button
          size="sm"
          disabled={rating === 0 || !title.trim() || !content.trim() || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="mr-1 h-3.5 w-3.5" />
              Submit Review
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function ReaderReviewsPage() {
  const [reviews, setReviews] = useState(mockGivenReviews);
  const [pendingReviews, setPendingReviews] = useState(mockPendingReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditTitle(review.title);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleSaveEdit = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, title: editTitle, content: editContent, rating: editRating, isEdited: true }
          : r
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmitPending = (
    id: string,
    data: { rating: number; title: string; content: string }
  ) => {
    const pending = pendingReviews.find((r) => r.id === id);
    if (!pending) return;

    const newReview: Review = {
      id: pending.id,
      bookTitle: pending.bookTitle,
      bookAuthor: pending.bookAuthor,
      rating: data.rating,
      title: data.title,
      content: data.content,
      dateWritten: new Date().toISOString(),
      isEdited: false,
      helpfulCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);
    setPendingReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">
          Manage your book reviews and share your reading experiences.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="given">
          <TabsList>
            <TabsTrigger value="given" className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Given Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Pending Reviews ({pendingReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="given" className="mt-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {reviews.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
                      <p className="mt-6 text-lg font-medium">No reviews yet</p>
                      <p className="text-sm text-muted-foreground">
                        Complete a book and share your thoughts.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                reviews.map((review) => (
                  <motion.div key={review.id} variants={item} layout exit="exit">
                    <Card className="overflow-hidden">
                      <CardContent className="p-5">
                        {editingId === review.id ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{review.bookTitle}</p>
                                <p className="text-xs text-muted-foreground">
                                  {review.bookAuthor}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Rating
                              </label>
                              <StarRating rating={editRating} onRate={setEditRating} />
                            </div>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="h-9 text-sm"
                            />
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[80px] text-sm resize-none"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(review.id)}
                                disabled={!editTitle.trim() || !editContent.trim()}
                              >
                                Save Changes
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                  <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold">
                                    {review.bookTitle}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">
                                    {review.bookAuthor}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={review.rating} size="sm" />
                                    {review.isEdited && (
                                      <Badge variant="secondary" className="text-[10px]">
                                        Edited
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(review)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDelete(review.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Review
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div>
                              <p className="text-sm font-medium">{review.title}</p>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {review.content}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t">
                              <p className="text-xs text-muted-foreground">
                                Written {formatDate(review.dateWritten, "relative")}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3" />
                                <span>{review.helpfulCount} found this helpful</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="pending" className="mt-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {pendingReviews.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <CheckCircle2 className="h-16 w-16 text-muted-foreground/30" />
                      <p className="mt-6 text-lg font-medium">All caught up!</p>
                      <p className="text-sm text-muted-foreground">
                        No pending reviews. Keep reading!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                pendingReviews.map((review) => (
                  <motion.div key={review.id} variants={item} layout exit="exit">
                    <PendingReviewCard
                      review={review}
                      onSubmit={handleSubmitPending}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
