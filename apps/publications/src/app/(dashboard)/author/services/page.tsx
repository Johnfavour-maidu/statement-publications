"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PenTool,
  CheckCircle,
  Paintbrush,
  Hash,
  Megaphone,
  Headphones,
  Clock,
  DollarSign,
  ArrowRight,
  Star,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = "all" | "publishing" | "design" | "marketing";

interface Service {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  turnaround: string;
  category: Category;
  icon: React.ElementType;
  features: string[];
  popular?: boolean;
}

const services: Service[] = [
  {
    id: "book-publishing",
    title: "Book Publishing",
    description:
      "Full-service publishing including formatting, distribution setup, and listing on major platforms like Amazon, Apple Books, and Kobo.",
    priceRange: "$299 - $999",
    turnaround: "2-4 weeks",
    category: "publishing",
    icon: BookOpen,
    features: [
      "Digital & print formats",
      "Global distribution",
      "ISBN assignment",
      "Platform listings",
      "Sales tracking dashboard",
    ],
    popular: true,
  },
  {
    id: "editing",
    title: "Professional Editing",
    description:
      "Comprehensive editing from developmental edits to line editing, ensuring your manuscript is polished and publication-ready.",
    priceRange: "$199 - $799",
    turnaround: "1-3 weeks",
    category: "publishing",
    icon: PenTool,
    features: [
      "Developmental editing",
      "Line editing",
      "Copy editing",
      "Detailed feedback report",
      "Two revision rounds",
    ],
  },
  {
    id: "proofreading",
    title: "Proofreading",
    description:
      "Final pass proofreading to catch typos, grammatical errors, and formatting inconsistencies before publication.",
    priceRange: "$99 - $349",
    turnaround: "3-7 days",
    category: "publishing",
    icon: CheckCircle,
    features: [
      "Grammar & spelling check",
      "Punctuation review",
      "Consistency check",
      "Formatting verification",
      "Quick turnaround",
    ],
  },
  {
    id: "cover-design",
    title: "Cover Design",
    description:
      "Eye-catching custom cover designs crafted by professional designers who understand genre trends and market appeal.",
    priceRange: "$149 - $599",
    turnaround: "1-2 weeks",
    category: "design",
    icon: Paintbrush,
    features: [
      "Custom illustrations",
      "Genre-appropriate styling",
      "3 concept revisions",
      "Print-ready files",
      "Social media assets",
    ],
    popular: true,
  },
  {
    id: "isbn-registration",
    title: "ISBN Registration",
    description:
      "Official ISBN assignment and barcode generation for your books, ensuring proper cataloging and distribution.",
    priceRange: "$49 - $129",
    turnaround: "1-3 days",
    category: "publishing",
    icon: Hash,
    features: [
      "Official ISBN assignment",
      "Barcode generation",
      "Metadata registration",
      "Library catalog listing",
      "Bowker integration",
    ],
  },
  {
    id: "marketing",
    title: "Book Marketing",
    description:
      "Strategic marketing campaigns including social media promotion, email marketing, and book launch management.",
    priceRange: "$199 - $899",
    turnaround: "4-8 weeks",
    category: "marketing",
    icon: Megaphone,
    features: [
      "Social media campaigns",
      "Email marketing funnels",
      "Press release writing",
      "Book launch strategy",
      "Analytics reporting",
    ],
  },
  {
    id: "audiobook",
    title: "Audiobook Production",
    description:
      "Professional audiobook production with vetted narrators, studio-quality recording, and distribution to Audible and more.",
    priceRange: "$499 - $2,499",
    turnaround: "4-8 weeks",
    category: "design",
    icon: Headphones,
    features: [
      "Professional narration",
      "Studio recording",
      "Audio editing & mastering",
      "Quality assurance",
      "Audible distribution",
    ],
  },
];

const categories: { label: string; value: Category }[] = [
  { label: "All Services", value: "all" },
  { label: "Publishing", value: "publishing" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorServicesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    bookTitle: "",
    manuscript: "",
    notes: "",
  });

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const handleOrderNow = (service: Service) => {
    setSelectedService(service);
    setOrderDialogOpen(true);
  };

  const handleSubmitOrder = () => {
    setOrderDialogOpen(false);
    setOrderForm({ bookTitle: "", manuscript: "", notes: "" });
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Publishing Services
          </h1>
          <p className="text-muted-foreground">
            Professional services to bring your book to life.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {services.length} services available
        </Badge>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.value)}
              className={
                activeCategory === cat.value
                  ? "bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
                  : ""
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div key={service.id} variants={item}>
              <Card className="relative h-full transition-shadow hover:shadow-lg">
                {service.popular && (
                  <div className="absolute -top-2 right-4">
                    <Badge className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]">
                      <Star className="mr-1 h-3 w-3" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D8B27A]/10">
                    <Icon className="h-6 w-6 text-[#D8B27A]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-[#D8B27A]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>{service.priceRange}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{service.turnaround}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOrderNow(service)}
                      className="w-full bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
                    >
                      Order Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Service</DialogTitle>
            <DialogDescription>
              {selectedService?.title} — Complete the form below to place your
              order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedService && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedService.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price Range</span>
                  <span className="font-semibold text-[#8A6A4A]">
                    {selectedService.priceRange}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Turnaround</span>
                  <span>{selectedService.turnaround}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="book-title">Book Title</Label>
              <Input
                id="book-title"
                placeholder="Enter your book title"
                value={orderForm.bookTitle}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, bookTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manuscript">Manuscript / File Link</Label>
              <Input
                id="manuscript"
                placeholder="Google Drive, Dropbox, or file URL"
                value={orderForm.manuscript}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, manuscript: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or instructions..."
                rows={3}
                value={orderForm.notes}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOrderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitOrder}
              className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
            >
              Submit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
