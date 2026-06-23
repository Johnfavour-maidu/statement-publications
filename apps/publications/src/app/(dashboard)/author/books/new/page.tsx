"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Check, Upload, FileText, Image as ImageIcon,
  DollarSign, Eye, Send, X, File, BookOpen, Search, Tag, Clock,
  AlertTriangle, Save, Cloud, CloudOff, Layers, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Book Details", icon: FileText },
  { id: 2, label: "Manuscript", icon: Upload },
  { id: 3, label: "Cover Design", icon: ImageIcon },
  { id: 4, label: "Categories", icon: Layers },
  { id: 5, label: "Pricing", icon: DollarSign },
  { id: 6, label: "Review & Submit", icon: Send },
];

const categories = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
  "Thriller", "Biography", "Self-Help", "Poetry", "Children's", "History",
];

const popularCategories = ["Self-Help", "Fiction", "Biography", "Non-Fiction", "Romance"];

const languages = ["English", "Spanish", "French", "German", "Portuguese", "Igbo", "Yoruba", "Hausa"];

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
  tags: string[];
}

const initialFormData: FormData = {
  title: "", subtitle: "", description: "", category: "", language: "English",
  isbn: "", manuscriptFile: null, manuscriptName: "", coverFile: null,
  coverPreview: "", price: "", discount: "", royaltyRate: "70", currency: "USD", tags: [],
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function NewBookPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragType, setDragType] = useState<"manuscript" | "cover" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategorySearch, setShowCategorySearch] = useState(false);
  const stickyNavRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("unsaved");
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  useEffect(() => {
    if (saveStatus === "unsaved") {
      const timer = setTimeout(() => {
        setSaveStatus("saving");
        setTimeout(() => {
          setSaveStatus("saved");
          setLastSaved(new Date());
        }, 800);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
    }
    if (step === 2) { if (!formData.manuscriptFile) newErrors.manuscript = "Manuscript file is required"; }
    if (step === 3) { if (!formData.coverFile) newErrors.cover = "Cover image is required"; }
    if (step === 4) { if (!formData.category) newErrors.category = "Category is required"; }
    if (step === 5) { if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getStepStatus = (stepId: number): "complete" | "current" | "warning" | "upcoming" => {
    if (stepId < currentStep) return "complete";
    if (stepId === currentStep) return "current";
    if (stepId === 2 && !formData.manuscriptFile) return "warning";
    if (stepId === 3 && !formData.coverFile) return "warning";
    if (stepId === 5 && !formData.price) return "warning";
    return "upcoming";
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, steps.length)); };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleManuscriptDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false); setDragType(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/epub+zip"];
      if (validTypes.includes(file.type)) {
        setFormData((prev) => ({ ...prev, manuscriptFile: file, manuscriptName: file.name }));
        if (errors.manuscript) setErrors((prev) => { const next = { ...prev }; delete next.manuscript; return next; });
      }
    }
  }, [errors.manuscript]);

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false); setDragType(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, coverFile: file, coverPreview: URL.createObjectURL(file) }));
      if (errors.cover) setErrors((prev) => { const next = { ...prev }; delete next.cover; return next; });
    }
  }, [errors.cover]);

  const handleManuscriptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, manuscriptFile: file, manuscriptName: file.name }));
      if (errors.manuscript) setErrors((prev) => { const next = { ...prev }; delete next.manuscript; return next; });
    }
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, coverFile: file, coverPreview: URL.createObjectURL(file) }));
      if (errors.cover) setErrors((prev) => { const next = { ...prev }; delete next.cover; return next; });
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: formDataObj });
      const data = await response.json();
      if (data.success) return data.data.url;
      return null;
    } catch (error) { console.error("Upload failed:", error); return null; }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let coverUrl = null, manuscriptUrl = null;
      if (formData.coverFile) coverUrl = await uploadFile(formData.coverFile);
      if (formData.manuscriptFile) manuscriptUrl = await uploadFile(formData.manuscriptFile);
      const categoryResponse = await fetch("/api/categories");
      const categoryData = await categoryResponse.json();
      let categoryId = null;
      if (categoryData.success) {
        const category = categoryData.data.find((c: { name: string }) => c.name === formData.category);
        if (category) categoryId = category.id;
      }
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title, subtitle: formData.subtitle || undefined,
          description: formData.description, categoryId, isbn: formData.isbn || undefined,
          language: formData.language, coverImage: coverUrl, manuscriptFile: manuscriptUrl,
          format: "EBOOK", price: parseFloat(formData.price),
          discountPrice: formData.discount ? parseFloat(formData.discount) : undefined,
          currency: formData.currency, royaltyRate: parseInt(formData.royaltyRate), tags: formData.tags,
        }),
      });
      const data = await response.json();
      if (data.success) {
        const newBook = {
          id: `submitted-${Date.now()}`,
          title: formData.title,
          subtitle: formData.subtitle,
          isbn: formData.isbn || `978-0-000000-${Math.floor(Math.random() * 99).toString().padStart(2, "0")}-${Math.floor(Math.random() * 9)}`,
          category: formData.category || "Uncategorized",
          status: "pending" as const,
          formats: ["eBook"] as string[],
          views: 0, sales: 0, revenue: 0, rating: 0,
          createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          description: formData.description,
          performance: "new" as const,
        };
        const existing = JSON.parse(localStorage.getItem("authorCreatedBooks") || "[]");
        existing.push(newBook);
        localStorage.setItem("authorCreatedBooks", JSON.stringify(existing));
        router.push("/author/books");
      } else alert(data.error || "Failed to create book");
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to create book. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  const filteredCategories = categories.filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase()));
  const progress = (currentStep / steps.length) * 100;

  const inputClass = "rounded-lg border-[#E8DDD0] bg-white focus-visible:ring-2 focus-visible:ring-[#D8B27A]/40 focus-visible:border-[#D8B27A] transition-all duration-200 h-11";
  const labelClass = "text-sm font-medium text-[#1D1D1D] mb-1.5";

  return (
    <div className="min-h-screen bg-[#F5EDE3]/30">
      {/* Sticky Step Navigation */}
      <div ref={stickyNavRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DDD0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => { if (step.id <= currentStep || status === "complete") setCurrentStep(step.id); }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 text-[#1D1D1D]",
                    status === "complete" && "bg-emerald-50 hover:bg-emerald-100 cursor-pointer",
                    status === "current" && "bg-[#D8B27A]/10 border border-[#D8B27A]/30",
                    status === "warning" && "hover:bg-[#F5EDE3] cursor-pointer",
                    status === "upcoming" && "hover:bg-[#F5EDE3]",
                  )}
                >
                  {status === "complete" ? (
                    <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>
                  ) : (
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                      status === "current" && "border-[#D8B27A] bg-[#D8B27A] text-white",
                      status === "warning" && "border-[#1D1D1D] text-[#1D1D1D]",
                      status === "upcoming" && "border-[#E8DDD0] text-[#1D1D1D]",
                    )}>{step.id}</div>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-[#E8DDD0]">
          <motion.div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A]" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Premium Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-lg hover:bg-[#F5EDE3]">
              <Link href="/author/books"><ArrowLeft className="h-5 w-5 text-[#8A6A4A]" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#1D1D1D] tracking-tight">Create New Book</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Upload, manage, and prepare your manuscript for publication.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              saveStatus === "saved" && "bg-emerald-50 text-emerald-600",
              saveStatus === "saving" && "bg-amber-50 text-amber-600",
              saveStatus === "unsaved" && "bg-gray-100 text-gray-500",
            )}>
              {saveStatus === "saved" && <><Cloud className="h-3.5 w-3.5" /> Saved{lastSaved ? ` ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</>}
              {saveStatus === "saving" && <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" /> Saving...</>}
              {saveStatus === "unsaved" && <><CloudOff className="h-3.5 w-3.5" /> Unsaved changes</>}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
              <Check className="h-3.5 w-3.5" /> Ready to Submit
            </div>
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

                {/* Step 1: Book Details */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center"><FileText className="h-4 w-4 text-[#8A6A4A]" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1D1D1D]">Book Details</h2>
                            <p className="text-xs text-muted-foreground">Basic information about your book</p>
                          </div>
                        </div>
                        {formData.title && formData.description && formData.category && (
                          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><Check className="h-3 w-3" /> Complete</span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="space-y-1.5">
                        <Label className={labelClass}>Title <span className="text-red-500">*</span></Label>
                        <Input placeholder="Enter your book title" value={formData.title} onChange={(e) => updateField("title", e.target.value)} className={cn(inputClass, errors.title && "border-red-400 focus-visible:ring-red-400/40")} />
                        {errors.title && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.title}</p>}
                        {formData.title && !errors.title && <p className="text-xs text-emerald-600 flex items-center gap-1"><Check className="h-3 w-3" /> Title entered</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelClass}>Subtitle</Label>
                        <Input placeholder="Enter subtitle (optional)" value={formData.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelClass}>Description <span className="text-red-500">*</span></Label>
                        <Textarea placeholder="Write a compelling book description that will attract readers..." rows={5} value={formData.description} onChange={(e) => updateField("description", e.target.value)} className={cn(inputClass, "resize-none", errors.description && "border-red-400 focus-visible:ring-red-400/40")} />
                        <div className="flex justify-between">
                          {errors.description ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.description}</p> : formData.description ? <p className="text-xs text-emerald-600 flex items-center gap-1"><Check className="h-3 w-3" /> Description added</p> : <p className="text-xs text-muted-foreground">{formData.description.length}/2000 characters</p>}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelClass}>ISBN</Label>
                        <Input placeholder="978-3-16-148410-0 (optional)" value={formData.isbn} onChange={(e) => updateField("isbn", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Manuscript Upload */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center"><Upload className="h-4 w-4 text-[#8A6A4A]" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1D1D1D]">Manuscript Upload</h2>
                            <p className="text-xs text-muted-foreground">Upload your manuscript file</p>
                          </div>
                        </div>
                        {formData.manuscriptFile && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><Check className="h-3 w-3" /> Uploaded</span>}
                      </div>
                    </div>
                    <div className="p-6">
                      <div
                        className={cn(
                          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer",
                          dragType === "manuscript" ? "border-[#D8B27A] bg-[#D8B27A]/5 scale-[1.01]" : "border-[#E8DDD0] hover:border-[#D8B27A]/50 hover:bg-[#F5EDE3]/20",
                          formData.manuscriptFile && "border-emerald-300 bg-emerald-50/30",
                          errors.manuscript && "border-red-400 bg-red-50/30",
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); setDragType("manuscript"); }}
                        onDragLeave={() => { setIsDragOver(false); setDragType(null); }}
                        onDrop={handleManuscriptDrop}
                        onClick={() => !formData.manuscriptFile && document.getElementById("manuscript-input")?.click()}
                      >
                        <input id="manuscript-input" type="file" className="hidden" accept=".pdf,.docx,.epub" onChange={handleManuscriptFileSelect} />
                        {formData.manuscriptFile ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center"><FileText className="h-8 w-8 text-emerald-600" /></div>
                            <div className="text-center">
                              <p className="font-semibold text-[#1D1D1D]">{formData.manuscriptName}</p>
                              <p className="text-sm text-muted-foreground mt-1">{formatFileSize(formData.manuscriptFile.size)}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium"><Check className="h-4 w-4" /> File uploaded successfully</div>
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFormData((prev) => ({ ...prev, manuscriptFile: null, manuscriptName: "" })); }} className="rounded-lg border-[#E8DDD0] hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                              <X className="mr-2 h-4 w-4" /> Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-[#F5EDE3] flex items-center justify-center"><Upload className="h-8 w-8 text-[#8A6A4A]" /></div>
                            <div className="text-center">
                              <p className="font-semibold text-[#1D1D1D]">Drag & drop your manuscript here</p>
                              <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Supports PDF, DOCX, EPUB (max 50MB)</p>
                          </div>
                        )}
                      </div>
                      {errors.manuscript && <p className="mt-3 text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.manuscript}</p>}
                    </div>
                  </div>
                )}

                {/* Step 3: Cover Design */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center"><ImageIcon className="h-4 w-4 text-[#8A6A4A]" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1D1D1D]">Book Cover</h2>
                            <p className="text-xs text-muted-foreground">Upload your book cover image</p>
                          </div>
                        </div>
                        {formData.coverFile && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><Check className="h-3 w-3" /> Uploaded</span>}
                      </div>
                    </div>
                    <div className="p-6">
                      <div
                        className={cn(
                          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer",
                          dragType === "cover" ? "border-[#D8B27A] bg-[#D8B27A]/5 scale-[1.01]" : "border-[#E8DDD0] hover:border-[#D8B27A]/50 hover:bg-[#F5EDE3]/20",
                          formData.coverPreview && "border-emerald-300 bg-emerald-50/30",
                          errors.cover && "border-red-400 bg-red-50/30",
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); setDragType("cover"); }}
                        onDragLeave={() => { setIsDragOver(false); setDragType(null); }}
                        onDrop={handleCoverDrop}
                        onClick={() => !formData.coverPreview && document.getElementById("cover-input")?.click()}
                      >
                        <input id="cover-input" type="file" className="hidden" accept="image/*" onChange={handleCoverFileSelect} />
                        {formData.coverPreview ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                              <img src={formData.coverPreview} alt="Cover preview" className="h-56 w-40 rounded-xl object-cover shadow-lg ring-1 ring-[#E8DDD0]" />
                              <Button variant="destructive" size="icon" className="absolute -right-2 -top-2 h-7 w-7 rounded-full shadow-md" onClick={(e) => { e.stopPropagation(); setFormData((prev) => ({ ...prev, coverFile: null, coverPreview: "" })); }}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-[#1D1D1D]">{formData.coverFile?.name}</p>
                              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 justify-center"><Check className="h-3 w-3" /> Cover uploaded successfully</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-[#F5EDE3] flex items-center justify-center"><ImageIcon className="h-8 w-8 text-[#8A6A4A]" /></div>
                            <div className="text-center">
                              <p className="font-semibold text-[#1D1D1D]">Drag & drop your cover image here</p>
                              <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP (recommended 1600x2560px)</p>
                          </div>
                        )}
                      </div>
                      {errors.cover && <p className="mt-3 text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.cover}</p>}
                    </div>
                  </div>
                )}

                {/* Step 4: Categories */}
                {currentStep === 4 && (
                  <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center"><Layers className="h-4 w-4 text-[#8A6A4A]" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1D1D1D]">Book Categories</h2>
                            <p className="text-xs text-muted-foreground">Choose the right categories for your book</p>
                          </div>
                        </div>
                        {formData.category && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><Check className="h-3 w-3" /> Selected</span>}
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Category Search */}
                      <div className="space-y-1.5">
                        <Label className={labelClass}>Search Categories</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search categories..." value={categorySearch} onChange={(e) => { setCategorySearch(e.target.value); setShowCategorySearch(true); }} onFocus={() => setShowCategorySearch(true)} className={cn(inputClass, "pl-9")} />
                        </div>
                        {showCategorySearch && categorySearch && (
                          <div className="mt-2 bg-white border border-[#E8DDD0] rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                            {filteredCategories.map((cat) => (
                              <button key={cat} onClick={() => { updateField("category", cat); setCategorySearch(""); setShowCategorySearch(false); }} className={cn("w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5EDE3] transition-colors flex items-center gap-2", formData.category === cat && "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium")}>
                                {formData.category === cat && <Check className="h-4 w-4 text-[#8A6A4A]" />} {cat}
                              </button>
                            ))}
                            {filteredCategories.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No categories found</p>}
                          </div>
                        )}
                      </div>
                      {/* Popular Categories */}
                      <div>
                        <Label className={labelClass}>Popular Categories</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {popularCategories.map((cat) => (
                            <button key={cat} onClick={() => updateField("category", cat)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border", formData.category === cat ? "bg-[#D8B27A] text-[#1D1D1D] border-[#D8B27A] shadow-sm" : "bg-white text-muted-foreground border-[#E8DDD0] hover:border-[#D8B27A] hover:text-[#8A6A4A]")}>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* All Categories Grid */}
                      <div>
                        <Label className={labelClass}>All Categories</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {categories.map((cat) => (
                            <button key={cat} onClick={() => updateField("category", cat)} className={cn("px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-left", formData.category === cat ? "bg-[#D8B27A]/10 text-[#8A6A4A] border-[#D8B27A] shadow-sm" : "bg-white text-muted-foreground border-[#E8DDD0] hover:border-[#D8B27A]/50 hover:bg-[#F5EDE3]/30")}>
                              {formData.category === cat && <Check className="h-3.5 w-3.5 inline mr-1.5" />}{cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      {errors.category && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.category}</p>}
                      {/* Selected category chip */}
                      {formData.category && (
                        <div className="flex items-center gap-2 p-3 bg-[#D8B27A]/5 rounded-xl border border-[#D8B27A]/20">
                          <Tag className="h-4 w-4 text-[#8A6A4A]" />
                          <span className="text-sm font-medium text-[#8A6A4A]">Selected:</span>
                          <span className="px-3 py-1 rounded-full bg-[#D8B27A] text-[#1D1D1D] text-xs font-semibold">{formData.category}</span>
                          <button onClick={() => updateField("category", "")} className="ml-auto text-muted-foreground hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                        </div>
                      )}
                      {/* Language */}
                      <div className="space-y-1.5">
                        <Label className={labelClass}>Language</Label>
                        <Select value={formData.language} onValueChange={(v) => updateField("language", v)}>
                          <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                          <SelectContent>{languages.map((lang) => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Pricing */}
                {currentStep === 5 && (
                  <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center"><DollarSign className="h-4 w-4 text-[#8A6A4A]" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1D1D1D]">Pricing & Distribution</h2>
                            <p className="text-xs text-muted-foreground">Set your book price and royalty options</p>
                          </div>
                        </div>
                        {formData.price && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><Check className="h-3 w-3" /> Set</span>}
                      </div>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Price <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                            <Input type="number" step="0.01" min="0" placeholder="9.99" className={cn(inputClass, "pl-8", errors.price && "border-red-400")} value={formData.price} onChange={(e) => updateField("price", e.target.value)} />
                          </div>
                          {errors.price && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.price}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Discount Price</Label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                            <Input type="number" step="0.01" min="0" placeholder="7.99 (optional)" className={cn(inputClass, "pl-8")} value={formData.discount} onChange={(e) => updateField("discount", e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Royalty Rate</Label>
                          <Select value={formData.royaltyRate} onValueChange={(v) => updateField("royaltyRate", v)}>
                            <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="35">35%</SelectItem>
                              <SelectItem value="70">70%</SelectItem>
                              <SelectItem value="75">75%</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">Higher royalty rates may affect distribution channels.</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Currency</Label>
                          <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                            <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
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
                        <div className="rounded-xl bg-gradient-to-r from-[#8A6A4A]/5 to-[#D8B27A]/5 border border-[#D8B27A]/20 p-5">
                          <h4 className="font-semibold text-[#1D1D1D] mb-3">Revenue Preview</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-[#E8DDD0]/50">
                              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">List Price</p>
                              <p className="text-lg font-bold text-[#1D1D1D] mt-1">${parseFloat(formData.price || "0").toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-[#E8DDD0]/50">
                              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">Your Royalty ({formData.royaltyRate}%)</p>
                              <p className="text-lg font-bold text-emerald-600 mt-1">${(parseFloat(formData.price || "0") * (parseFloat(formData.royaltyRate) / 100)).toFixed(2)}</p>
                            </div>
                            {formData.discount && (
                              <div className="bg-white rounded-lg p-3 border border-[#E8DDD0]/50">
                                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">Discount Price</p>
                                <p className="text-lg font-bold text-[#8A6A4A] mt-1">${parseFloat(formData.discount).toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center"><Eye className="h-4 w-4 text-[#8A6A4A]" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1D1D1D]">Review & Submit</h2>
                            <p className="text-xs text-muted-foreground">Review your book details before publishing</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <div className="p-4 bg-[#F5EDE3]/20 rounded-xl">
                              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">Title</p>
                              <p className="text-lg font-bold text-[#1D1D1D]">{formData.title || "—"}</p>
                              {formData.subtitle && <p className="text-sm text-muted-foreground mt-0.5">{formData.subtitle}</p>}
                            </div>
                            <div className="p-4 bg-[#F5EDE3]/20 rounded-xl">
                              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">Description</p>
                              <p className="text-sm text-[#1D1D1D] leading-relaxed">{formData.description || "—"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-[#F5EDE3]/20 rounded-xl">
                                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">Category</p>
                                <p className="text-sm font-medium text-[#1D1D1D]">{formData.category || "—"}</p>
                              </div>
                              <div className="p-3 bg-[#F5EDE3]/20 rounded-xl">
                                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">Language</p>
                                <p className="text-sm font-medium text-[#1D1D1D]">{formData.language}</p>
                              </div>
                            </div>
                            {formData.isbn && (
                              <div className="p-3 bg-[#F5EDE3]/20 rounded-xl">
                                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">ISBN</p>
                                <p className="text-sm font-mono text-[#1D1D1D]">{formData.isbn}</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="p-4 bg-[#F5EDE3]/20 rounded-xl">
                              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-2">Manuscript</p>
                              {formData.manuscriptFile ? (
                                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center"><FileText className="h-5 w-5 text-emerald-600" /></div><div><p className="text-sm font-medium text-[#1D1D1D]">{formData.manuscriptName}</p><p className="text-xs text-muted-foreground">{formatFileSize(formData.manuscriptFile.size)}</p></div></div>
                              ) : <p className="text-sm text-muted-foreground">Not uploaded</p>}
                            </div>
                            <div className="p-4 bg-[#F5EDE3]/20 rounded-xl">
                              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-2">Cover Image</p>
                              {formData.coverPreview ? (
                                <img src={formData.coverPreview} alt="Cover" className="h-36 w-24 rounded-lg object-cover shadow-md ring-1 ring-[#E8DDD0]" />
                              ) : <p className="text-sm text-muted-foreground">Not uploaded</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-[#F5EDE3]/20 rounded-xl">
                                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">Price</p>
                                <p className="text-lg font-bold text-[#1D1D1D]">${parseFloat(formData.price || "0").toFixed(2)}</p>
                              </div>
                              <div className="p-3 bg-[#F5EDE3]/20 rounded-xl">
                                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-1">Royalty</p>
                                <p className="text-lg font-bold text-emerald-600">{formData.royaltyRate}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Submit CTA */}
                    <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                      <div className="p-8 flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-2xl bg-[#D8B27A]/10 flex items-center justify-center mb-4"><BookOpen className="h-8 w-8 text-[#8A6A4A]" /></div>
                        <h3 className="text-xl font-bold text-[#1D1D1D]">Ready to Submit?</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md">Your book will be reviewed by our editorial team. This typically takes 2-5 business days.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live Preview Panel */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                  <p className="text-xs font-semibold text-[#8A6A4A] tracking-wider uppercase">Live Preview</p>
                </div>
                <div className="p-4">
                  <div className={cn("w-36 mx-auto rounded-xl shadow-lg overflow-hidden mb-4 transition-all duration-300", formData.coverPreview ? "" : "bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A]")}>
                    {formData.coverPreview ? (
                      <img src={formData.coverPreview} alt="Cover" className="w-full h-52 object-cover" />
                    ) : (
                      <div className="w-full h-52 flex flex-col items-center justify-center p-4 text-center">
                        <BookOpen className="h-10 w-10 text-white/60 mb-2" />
                        <p className="text-xs text-white/80 font-medium leading-tight">{formData.title || "Book Title"}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-bold text-[#1D1D1D] truncate">{formData.title || "Untitled Book"}</p>
                    {formData.subtitle && <p className="text-xs text-muted-foreground truncate">{formData.subtitle}</p>}
                    {formData.category && <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D8B27A]/10 text-[#8A6A4A] text-[10px] font-semibold">{formData.category}</span>}
                    {formData.price && <p className="text-sm font-bold text-[#1D1D1D]">${parseFloat(formData.price).toFixed(2)}</p>}
                  </div>
                </div>
              </div>
              {/* Section Status */}
              <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                  <p className="text-xs font-semibold text-[#8A6A4A] tracking-wider uppercase">Progress</p>
                </div>
                <div className="p-3 space-y-1">
                  {[
                    { label: "Book Details", done: !!formData.title && !!formData.description && !!formData.category },
                    { label: "Manuscript", done: !!formData.manuscriptFile },
                    { label: "Cover Design", done: !!formData.coverFile },
                    { label: "Categories", done: !!formData.category },
                    { label: "Pricing", done: !!formData.price && parseFloat(formData.price) > 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F5EDE3]/30 transition-colors">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      {item.done ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600"><Check className="h-3 w-3" /> Done</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600"><AlertTriangle className="h-3 w-3" /> Needed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DDD0] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl border-[#E8DDD0] hover:bg-[#F5EDE3] px-5">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-[#E8DDD0] hover:bg-[#F5EDE3] px-5 text-[#8A6A4A]" onClick={() => {
              setSaveStatus("saving");
              const newBook = {
                id: `draft-${Date.now()}`,
                title: formData.title || "Untitled Draft",
                subtitle: formData.subtitle,
                isbn: formData.isbn || `978-0-000000-${Math.floor(Math.random() * 99).toString().padStart(2, "0")}-${Math.floor(Math.random() * 9)}`,
                category: formData.category || "Uncategorized",
                status: "draft" as const,
                formats: [] as string[],
                views: 0, sales: 0, revenue: 0, rating: 0,
                createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                description: formData.description || "",
                performance: "new" as const,
              };
              const existing = JSON.parse(localStorage.getItem("authorCreatedBooks") || "[]");
              existing.push(newBook);
              localStorage.setItem("authorCreatedBooks", JSON.stringify(existing));
              setTimeout(() => { setSaveStatus("saved"); setLastSaved(new Date()); }, 800);
            }}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            {currentStep < 6 ? (
              <Button onClick={nextStep} className="rounded-xl bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] text-white hover:from-[#6B5538] hover:to-[#b8966a] px-6 shadow-md shadow-[#8A6A4A]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#8A6A4A]/30">
                {currentStep === 5 ? "Review" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] text-white hover:from-[#6B5538] hover:to-[#b8966a] px-6 shadow-md shadow-[#8A6A4A]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#8A6A4A]/30">
                {isSubmitting ? (
                  <><div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Submitting...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Submit for Review</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
