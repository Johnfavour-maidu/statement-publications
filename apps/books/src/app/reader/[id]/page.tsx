"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Sun,
  BookmarkPlus,
  Bookmark,
  Minus,
  Plus,
  X,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronLeft,
  ChevronRight,
  Clock,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const mockBook = {
  title: "The Last Sunrise",
  author: "Adaeze Nwosu",
  chapters: [
    { id: 1, title: "Chapter 1: Awakening" },
    { id: 2, title: "Chapter 2: The City of Forgotten Things" },
    { id: 3, title: "Chapter 3: Whispers" },
    { id: 4, title: "Chapter 4: The Trade" },
    { id: 5, title: "Chapter 5: Breaking Point" },
  ],
  content: `The morning light crept through the curtains like a thief, stealing the last remnants of sleep from Amara's eyes. She lay still for a moment, listening to the silence of a city that had forgotten how to dream.

It had been three months since the Forgetting — three months since the world had collectively decided to let go of its past. No one could explain it. One day, memories were as solid as the ground beneath your feet; the next, they were smoke, drifting away with the morning breeze.

Amara swung her legs over the side of the bed and pressed her feet against the cool floor. The apartment was quiet, save for the distant hum of traffic and the occasional bark of a neighbor's dog. She stood, stretching her arms above her head, and walked to the window.

The city stretched out before her — a sprawling landscape of glass and steel, now tinged with the dust of neglect. Buildings that had once gleamed with the promise of progress now stood like forgotten monuments to a past no one could recall.

She reached for the journal on her nightstand — the one constant in a world of flux. Its pages were filled with her handwriting, each entry a desperate attempt to hold onto something real. She flipped to the last entry and began to write.

"Day 89. The city is quieter now. Fewer people on the streets. The markets close early. I passed the old woman who sells oranges on Third Street yesterday — she was sitting behind her cart, staring at nothing. I asked her if she was alright. She looked at me with eyes that had seen too much forgetting and said, 'I used to have a daughter. I think.'"

Amara paused, pen hovering over the page. The words felt heavy, weighted with the grief of a world that had lost its story.

She continued writing.

"I've been having the dreams again. The ones where I'm standing in a field of sunflowers, and someone is calling my name. I turn, but no one is there. Just the sunflowers, swaying in a wind I can't feel. When I wake up, I can almost taste the memory — sweet and golden, like honey on my tongue. But it fades. They always fade."

A knock at the door interrupted her thoughts. She set the journal down and crossed the small apartment to answer it.

Standing in the hallway was a man she had never seen before — tall, with dark eyes that seemed to carry the weight of centuries. He wore a long coat, the color of storm clouds, and held a small leather case in his hands.

"Amara Okafor?" he asked, his voice low and measured.

She nodded, instinctively reaching for the door handle.

"My name is Kael. I've been looking for you." He paused, his gaze steady. "You remember, don't you? Before the Forgetting."

The question hit her like a physical blow. She had spent so long pretending, so long hiding her ability to remember, that hearing it spoken aloud felt like a wound being reopened.

"I don't know what you're talking about," she said, starting to close the door.

His hand caught the edge, holding it steady. "You're the only one, Amara. The only one who remembers. And there are people who would kill for that."

She stared at him, her heart pounding in her chest. The city hummed on, oblivious to the conversation that would change everything. Outside, the sun continued its ascent, painting the sky in shades of amber and gold.

But Amara knew — as surely as she knew her own name — that this sunrise would be different. This was the beginning of something. An end, perhaps. Or a new beginning.

She opened the door wider. "Tell me everything," she said.

And so he did.`,
};

const fontSizes = [
  { label: "Small", value: "text-base leading-relaxed" },
  { label: "Medium", value: "text-lg leading-relaxed" },
  { label: "Large", value: "text-xl leading-loose" },
  { label: "X-Large", value: "text-2xl leading-loose" },
];

export default function ReaderPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<"chapters" | "bookmarks" | "notes">("chapters");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<{ page: number; text: string }[]>([
    { page: 1, text: "The Forgetting — remember this concept" },
  ]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = mockBook.chapters.length;

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const pct = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
        setProgress(Math.min(pct, 100));
      }
    };
    const el = contentRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    return () => document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPage(currentPage - 1);
      if (e.key === "ArrowRight") goToPage(currentPage + 1);
      if (e.key === "Escape") setShowSidebar(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage, goToPage]);

  const toggleBookmark = () => {
    setBookmarks((prev) =>
      prev.includes(currentPage)
        ? prev.filter((p) => p !== currentPage)
        : [...prev, currentPage]
    );
  };

  const isBookmarked = bookmarks.includes(currentPage);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDarkMode ? "bg-[#0a0a0a] text-gray-100" : "bg-[#faf8f5] text-gray-900"
      )}
    >
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-md",
          isDarkMode
            ? "bg-[#0a0a0a]/80 border-gray-800"
            : "bg-[#faf8f5]/80 border-amber-900/10"
        )}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href="/store/books/the-last-sunrise" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{mockBook.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{mockBook.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>~{Math.round(progress * 3.4)} min left</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setFontSizeIndex((i) => Math.max(0, i - 1))}
              disabled={fontSizeIndex === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[40px] text-center">
              <Type className="h-3.5 w-3.5 inline mr-1" />
              {fontSizes[fontSizeIndex].label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setFontSizeIndex((i) => Math.min(fontSizes.length - 1, i + 1))}
              disabled={fontSizeIndex === fontSizes.length - 1}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleBookmark}
            >
              {isBookmarked ? (
                <Bookmark className="h-4 w-4 fill-primary text-primary" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-[2px] rounded-none" />
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "border-r overflow-hidden shrink-0",
                isDarkMode ? "bg-[#111] border-gray-800" : "bg-white border-amber-900/10"
              )}
            >
              <div className="w-[280px] h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold text-sm">Book Navigator</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowSidebar(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex border-b">
                  {(["chapters", "bookmarks", "notes"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 py-2.5 text-xs font-medium capitalize transition-colors border-b-2",
                        activeTab === tab
                          ? "border-primary text-primary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <ScrollArea className="flex-1">
                  {activeTab === "chapters" && (
                    <div className="p-2 space-y-1">
                      {mockBook.chapters.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            goToPage(ch.id);
                            setShowSidebar(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors",
                            currentPage === ch.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {ch.title}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === "bookmarks" && (
                    <div className="p-4 space-y-2">
                      {bookmarks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No bookmarks yet. Tap the bookmark icon to save pages.
                        </p>
                      ) : (
                        bookmarks.sort().map((bm) => (
                          <button
                            key={bm}
                            onClick={() => {
                              goToPage(bm);
                              setShowSidebar(false);
                            }}
                            className="w-full text-left rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
                            Page {bm} — {mockBook.chapters[bm - 1]?.title}
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {notes.length} note{notes.length !== 1 ? "s" : ""}
                      </p>
                      {notes.map((note, i) => (
                        <div
                          key={i}
                          className={cn(
                            "rounded-lg p-3 text-sm",
                            isDarkMode ? "bg-gray-800/50" : "bg-amber-50"
                          )}
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            Page {note.page}
                          </p>
                          <p>{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-6 py-12">
              <div className={cn("prose prose-lg max-w-none", fontSizes[fontSizeIndex].value)}>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {mockBook.content}
                </p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "sticky bottom-0 border-t backdrop-blur-md",
              isDarkMode
                ? "bg-[#0a0a0a]/80 border-gray-800"
                : "bg-[#faf8f5]/80 border-amber-900/10"
            )}
          >
            <div className="flex items-center justify-between px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
