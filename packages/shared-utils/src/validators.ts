import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  subtitle: z.string().max(200, "Subtitle must be less than 200 characters").optional(),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters")
    .optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
  isbn: z.string().max(20, "ISBN must be less than 20 characters").optional(),
  language: z.string().min(1, "Language is required").default("English"),
  pageCount: z
    .number()
    .int("Page count must be a whole number")
    .min(1, "Page count must be at least 1")
    .max(10000, "Page count seems too high")
    .optional(),
  publicationDate: z.string().optional(),
  publisher: z.string().max(200, "Publisher name too long").optional(),
  edition: z.string().max(100, "Edition too long").optional(),
  coverImage: z.string().url("Invalid cover image URL").optional(),
  format: z.enum(["EBOOK", "PAPERBACK", "HARDCOVER", "AUDIOBOOK"]).default("EBOOK"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price seems too high"),
  discountPrice: z
    .number()
    .min(0, "Discount price cannot be negative")
    .optional(),
  royaltyRate: z
    .number()
    .min(0, "Royalty rate cannot be negative")
    .max(100, "Royalty rate cannot exceed 100%")
    .default(70),
  tags: z.array(z.string()).max(20, "Maximum 20 tags allowed").optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const createReviewSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .optional(),
  content: z
    .string()
    .max(2000, "Review must be less than 2000 characters")
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        bookId: z.string().min(1, "Book ID is required"),
        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1")
          .max(10, "Maximum 10 copies per order"),
        format: z.enum(["EBOOK", "PAPERBACK", "HARDCOVER", "AUDIOBOOK"]).default("EBOOK"),
      })
    )
    .min(1, "At least one item is required")
    .max(50, "Maximum 50 items per order"),
  couponCode: z.string().max(50, "Invalid coupon code").optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  phone: z
    .string()
    .max(20, "Phone number too long")
    .regex(/^\+?[\d\s-()]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  socialLinks: z
    .object({
      twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
      instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
      facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
      linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
      website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  coverImage: z.string().url("Invalid cover image URL").optional().or(z.literal("")),
  category: z.string().max(100, "Category too long").optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export const createWithdrawalSchema = z.object({
  amount: z
    .number()
    .min(1, "Minimum withdrawal is $1")
    .max(100000, "Maximum withdrawal is $100,000"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .min(5, "Account number is too short")
    .max(20, "Account number is too long"),
  accountName: z.string().min(1, "Account name is required"),
  bankCode: z.string().min(1, "Bank code is required"),
  method: z.enum(["bank_transfer", "mobile_money", "crypto"]).default("bank_transfer"),
});

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters")
      .max(30, "Coupon code too long")
      .regex(/^[A-Z0-9_-]+$/i, "Coupon code can only contain letters, numbers, hyphens, and underscores"),
    description: z.string().max(200, "Description too long").optional(),
    discountType: z.enum(["percentage", "fixed"]).default("percentage"),
    discountValue: z.number().min(0.01, "Discount value must be greater than 0"),
    minPurchase: z.number().min(0, "Minimum purchase cannot be negative").optional(),
    maxUses: z
      .number()
      .int("Must be a whole number")
      .min(1, "Must allow at least 1 use")
      .optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage" && data.discountValue > 100) {
        return false;
      }
      return true;
    },
    { message: "Percentage discount cannot exceed 100%", path: ["discountValue"] }
  )
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    { message: "End date must be after start date", path: ["endDate"] }
  );

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
