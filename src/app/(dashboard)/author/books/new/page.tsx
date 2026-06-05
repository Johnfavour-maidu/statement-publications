"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Eye,
  Send,
  X,
  File,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Book Information", icon: FileText },
  { id: 2, label: "Upload Manuscript", icon: Upload },
  { id: 3, label: "Upload Cover", icon: ImageIcon },
  { id: 4, label: "Pricing", icon: DollarSign },
  { id: 5, label: "Review", icon: Eye },
  { id: 6, label: "Submit", icon: Send },
];

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "Biography",
  "Self-Help",
  "Poetry",
  "Children's",
  "History",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Igbo",
  "Yoruba",
  "Hausa",
];

interface FormData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  language: string;
  isbn: string;
  manuscriptFile: File | null;
  manuscriptName: string;
  coverFile: File | null;
  coverPreview: string;
  price: string;
  discount: string;
  royaltyRate: string;
  currency: string;
}

const initialFormData: FormData = {
  title: "",
  subtitle: "",
  description: "",
  category: "",
  language: "English",
  isbn: "",
  manuscriptFile: null,
  manuscriptName: "",
  coverFile: null,
  coverPreview: "",
  price: "",
  discount: "",
  royaltyRate: "70",
  currency: "USD",
};

export default function NewBookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
    }

    if (step === 2) {
      if (!formData.manuscriptFile)
        newErrors.manuscript = "Manuscript file is required";
    }

    if (step === 3) {
      if (!formData.coverFile) newErrors.cover = "Cover image is required";
    }

    if (step === 4) {
      if (!formData.price || parseFloat(formData.price) <= 0)
        newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleManuscriptDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        const validTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/epub+zip",
        ];
        if (validTypes.includes(file.type)) {
          setFormData((prev) => ({
            ...prev,
            manuscriptFile: file,
            manuscriptName: file.name,
          }));
          if (errors.manuscript) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.manuscript;
              return next;
            });
          }
        }
      }
    },
    [errors.manuscript]
  );

  const handleCoverDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          coverFile: file,
          coverPreview: URL.createObjectURL(file),
        }));
        if (errors.cover) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.cover;
            return next;
          });
        }
      }
    },
    [errors.cover]
  );

  const handleManuscriptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        manuscriptFile: file,
        manuscriptName: file.name,
      }));
      if (errors.manuscript) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.manuscript;
          return next;
        });
      }
    }
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        coverFile: file,
        coverPreview: URL.createObjectURL(file),
      }));
      if (errors.cover) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.cover;
          return next;
        });
      }
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/author/books">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Book</h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].label}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Progress value={progress} className="h-2" />
          <div className="mt-4 flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors",
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Book Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={cn(errors.title && "border-destructive")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter subtitle (optional)"
                    value={formData.subtitle}
                    onChange={(e) => updateField("subtitle", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Write a compelling book description..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className={cn(errors.description && "border-destructive")}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => updateField("category", v)}
                    >
                      <SelectTrigger
                        className={cn(errors.category && "border-destructive")}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-destructive">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(v) => updateField("language", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    placeholder="978-3-16-148410-0 (optional)"
                    value={formData.isbn}
                    onChange={(e) => updateField("isbn", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Manuscript</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25",
                    errors.manuscript && "border-destructive"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleManuscriptDrop}
                >
                  {formData.manuscriptFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{formData.manuscriptName}</p>
                        <p className="text-sm text-muted-foreground">
                          {(formData.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            manuscriptFile: null,
                            manuscriptName: "",
                          }))
                        }
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          Drag & drop your manuscript here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports PDF, DOCX, EPUB (max 50MB)
                        </p>
                      </div>
                      <Label>
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <File className="mr-2 h-4 w-4" />
                            Browse Files
                          </span>
                        </Button>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.epub"
                          onChange={handleManuscriptFileSelect}
                        />
                      </Label>
                    </div>
                  )}
                </div>
                {errors.manuscript && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.manuscript}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25",
                    errors.cover && "border-destructive"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleCoverDrop}
                >
                  {formData.coverPreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img
                          src={formData.coverPreview}
                          alt="Cover preview"
                          className="h-64 w-44 rounded-lg object-cover shadow-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2 h-6 w-6"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              coverFile: null,
                              coverPreview: "",
                            }))
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formData.coverFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          Drag & drop your cover image here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports JPG, PNG, WebP (recommended 1600x2560px)
                        </p>
                      </div>
                      <Label>
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Browse Files
                          </span>
                        </Button>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverFileSelect}
                        />
                      </Label>
                    </div>
                  )}
                </div>
                {errors.cover && (
                  <p className="mt-2 text-xs text-destructive">{errors.cover}</p>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="9.99"
                        className={cn("pl-7", errors.price && "border-destructive")}
                        value={formData.price}
                        onChange={(e) => updateField("price", e.target.value)}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-destructive">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="discount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="7.99 (optional)"
                        className="pl-7"
                        value={formData.discount}
                        onChange={(e) => updateField("discount", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Royalty Rate</Label>
                    <Select
                      value={formData.royaltyRate}
                      onValueChange={(v) => updateField("royaltyRate", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="35">35%</SelectItem>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Higher royalty rates may affect distribution channels.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(v) => updateField("currency", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.price && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="font-medium">Revenue Preview</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">List Price</p>
                        <p className="font-medium">
                          ${parseFloat(formData.price || "0").toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Your Royalty</p>
                        <p className="font-medium text-emerald-600">
                          $
                          {(
                            parseFloat(formData.price || "0") *
                            (parseFloat(formData.royaltyRate) / 100)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Title
                      </p>
                      <p className="text-lg font-semibold">{formData.title || "—"}</p>
                    </div>
                    {formData.subtitle && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Subtitle
                        </p>
                        <p>{formData.subtitle}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm">{formData.description || "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Category
                        </p>
                        <p>{formData.category || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Language
                        </p>
                        <p>{formData.language}</p>
                      </div>
                    </div>
                    {formData.isbn && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          ISBN
                        </p>
                        <p>{formData.isbn}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Manuscript
                      </p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <p>{formData.manuscriptName || "Not uploaded"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Cover Image
                      </p>
                      {formData.coverPreview ? (
                        <img
                          src={formData.coverPreview}
                          alt="Cover"
                          className="h-32 w-20 rounded object-cover"
                        />
                      ) : (
                        <p>Not uploaded</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Price
                        </p>
                        <p className="text-lg font-semibold">
                          ${parseFloat(formData.price || "0").toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Royalty Rate
                        </p>
                        <p>{formData.royaltyRate}%</p>
                      </div>
                    </div>
                    {formData.discount && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Discount Price
                        </p>
                        <p>${parseFloat(formData.discount).toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Submit for Review</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  Ready to Submit?
                </h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Your book will be reviewed by our editorial team. This
                  typically takes 2-5 business days. You&apos;ll receive a
                  notification once it&apos;s been reviewed.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Edit
                  </Button>
                  <Button size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep < 6 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? "Review" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
