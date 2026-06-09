"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { BookOpen, FileText, User, Tag, Clock, ArrowRight } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "book" | "author" | "article" | "category";
  subtitle?: string;
  href: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const recentSearches = [
  "Fiction books",
  "African literature",
  "Self-help guides",
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.items || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "author":
        return <User className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "category":
        return <Tag className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search books, authors, articles..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Searching..." : "No results found."}
        </CommandEmpty>

        {!query && (
          <>
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => handleSelect(`/store?search=${encodeURIComponent(item)}`)}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => handleSelect("/store")}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Browse Store</span>
                <CommandShortcut>
                  <ArrowRight className="h-3 w-3" />
                </CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/store?isFeatured=true")}>
                <Tag className="mr-2 h-4 w-4" />
                <span>Featured Books</span>
                <CommandShortcut>
                  <ArrowRight className="h-3 w-3" />
                </CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/blog")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Blog</span>
                <CommandShortcut>
                  <ArrowRight className="h-3 w-3" />
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {results.length > 0 && (
          <>
            <CommandGroup heading="Books">
              {results
                .filter((r) => r.type === "book")
                .slice(0, 5)
                .map((item) => (
                  <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="block text-xs text-muted-foreground truncate">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="Authors">
              {results
                .filter((r) => r.type === "author")
                .slice(0, 3)
                .map((item) => (
                  <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                    {getIcon(item.type)}
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="Articles">
              {results
                .filter((r) => r.type === "article")
                .slice(0, 3)
                .map((item) => (
                  <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="block text-xs text-muted-foreground truncate">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
