export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "PUBLISHER"
  | "AUTHOR"
  | "READER";

export type BookStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type WithdrawalStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";

export type NotificationType =
  | "BOOK_APPROVED"
  | "BOOK_REJECTED"
  | "NEW_SALE"
  | "ROYALTY_PAID"
  | "WITHDRAWAL_REQUESTED"
  | "WITHDRAWAL_COMPLETED"
  | "NEW_FOLLOWER"
  | "NEW_REVIEW"
  | "SYSTEM"
  | "ANNOUNCEMENT";

export type BookFormat = "EBOOK" | "PAPERBACK" | "HARDCOVER" | "AUDIOBOOK";

export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  password: string | null;
  image: string | null;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  phone: string | null;
  bio: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorProfile {
  id: string;
  userId: string;
  penName: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  genre: string[];
  totalBooks: number;
  totalSales: number;
  totalEarnings: number;
  bio: string | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  books: Book[];
}

export interface ReaderProfile {
  id: string;
  userId: string;
  readingHistory: unknown;
  preferences: unknown;
  favoriteGenres: string[];
  totalPurchases: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  orders: Order[];
  wishlist: Wishlist[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category | null;
  children?: Category[];
  books?: Book[];
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  authorId: string;
  categoryId: string | null;
  isbn: string | null;
  language: string;
  pageCount: number | null;
  publicationDate: Date | null;
  publisher: string | null;
  edition: string | null;
  coverImage: string | null;
  manuscriptFile: string | null;
  epubFile: string | null;
  audiobookFile: string | null;
  format: BookFormat;
  status: BookStatus;
  isPublic: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  isPromoted: boolean;
  price: number;
  discountPrice: number | null;
  currency: string;
  royaltyRate: number;
  totalSales: number;
  totalRevenue: number;
  totalReviews: number;
  averageRating: number;
  totalDownloads: number;
  tags: string[];
  metadata: unknown;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author?: AuthorProfile;
  category?: Category | null;
  orderItems?: OrderItem[];
  reviews?: Review[];
  wishlists?: Wishlist[];
  readingProgress?: ReadingProgress[];
  bookmarks?: Bookmark[];
  highlights?: Highlight[];
  notes?: Note[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  readerProfileId: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string | null;
  paymentRef: string | null;
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  readerProfile?: ReaderProfile | null;
  items?: OrderItem[];
  payment?: Payment | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  quantity: number;
  price: number;
  format: BookFormat;
  order?: Order;
  book?: Book;
}

export interface Payment {
  id: string;
  orderId: string | null;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  status: PaymentStatus;
  gateway: string;
  gatewayRef: string | null;
  metadata: unknown;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  order?: Order | null;
  user?: User;
}

export interface Royalty {
  id: string;
  authorId: string;
  bookId: string | null;
  amount: number;
  commission: number;
  netAmount: number;
  period: string;
  status: string;
  paidAt: Date | null;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalEarned: number;
  totalWithdrawn: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  transactions?: WalletTransaction[];
  withdrawals?: Withdrawal[];
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: string;
  description: string | null;
  reference: string | null;
  createdAt: Date;
  wallet?: Wallet;
}

export interface Withdrawal {
  id: string;
  walletId: string;
  userId: string;
  amount: number;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  bankCode: string | null;
  method: string;
  status: WithdrawalStatus;
  gatewayRef: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  wallet?: Wallet;
  user?: User;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  title: string | null;
  content: string | null;
  isVerified: boolean;
  isVisible: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  book?: Book;
}

export interface Wishlist {
  id: string;
  userId: string;
  bookId: string;
  createdAt: Date;
  user?: User;
  book?: Book;
}

export interface Follower {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower?: User;
  following?: User;
}

export interface Purchase {
  id: string;
  userId: string;
  bookId: string;
  amount: number;
  format: BookFormat;
  createdAt: Date;
  user?: User;
  book?: Book;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  metadata: unknown;
  createdAt: Date;
  user?: User;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  authorId: string;
  category: string | null;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  comments?: BlogComment[];
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  post?: BlogPost;
  user?: User;
  parent?: BlogComment | null;
  replies?: BlogComment[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minPurchase: number | null;
  maxUses: number | null;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdById: string;
  createdAt: Date;
  creator?: User;
}

export interface Affiliate {
  id: string;
  userId: string;
  affiliateCode: string;
  commissionRate: number;
  totalEarnings: number;
  totalReferrals: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  referrals?: AffiliateReferral[];
}

export interface AffiliateReferral {
  id: string;
  affiliateId: string;
  purchaseAmount: number;
  commission: number;
  status: string;
  createdAt: Date;
  affiliate?: Affiliate;
}

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  progress: number;
  position: unknown;
  updatedAt: Date;
  user?: User;
  book?: Book;
}

export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  position: Record<string, unknown>;
  label: string | null;
  createdAt: Date;
  user?: User;
  book?: Book;
}

export interface Highlight {
  id: string;
  userId: string;
  bookId: string;
  text: string;
  color: string;
  position: Record<string, unknown>;
  note: string | null;
  createdAt: Date;
  user?: User;
  book?: Book;
}

export interface Note {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  position: unknown;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  book?: Book;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string;
  type: string;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  userId: string | null;
  event: string;
  page: string | null;
  metadata: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
  user?: User | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  oldValues: unknown;
  newValues: unknown;
  ip: string | null;
  createdAt: Date;
  user?: User | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookFilters {
  search?: string;
  categoryId?: string;
  authorId?: string;
  status?: BookStatus;
  format?: BookFormat;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  sortBy?: "title" | "price" | "rating" | "sales" | "createdAt";
  sortOrder?: "asc" | "desc";
}
