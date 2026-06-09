# STATEMENT PUBLICATIONS — PLATFORM RESTRUCTURING STRATEGY

**Date**: June 9, 2026
**Status**: Implementation Plan
**Current Domain**: statement-publications.vercel.app

---

## EXECUTIVE SUMMARY

Separate the monolithic Statement Publications platform into two independent applications sharing one database:

| Platform | Purpose | Domain | Audience |
|----------|---------|--------|----------|
| **Statement Publications** | Publishing Platform | `statement-publications.vercel.app` | Authors, Writers, Publishers |
| **Statement Books** | Book Marketplace | `books.statementpublications.com` | Readers, Book Buyers |

---

## 1. PROPOSED FOLDER STRUCTURE

### Monorepo Root

```
STATEMENT/
├── apps/
│   ├── publications/              ← Statement Publications (publishing platform)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (publishing)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── blog/
│   │   │   │   │   ├── contact/
│   │   │   │   │   └── support/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── admin/
│   │   │   │   │   └── author/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── forgot-password/
│   │   │   │   ├── layout.tsx      (Root layout — Publications header/footer)
│   │   │   │   ├── page.tsx        (Homepage — publishing-focused)
│   │   │   │   └── api/
│   │   │   │       ├── admin/
│   │   │   │       ├── auth/
│   │   │   │       └── upload/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── header.tsx        (Publications header)
│   │   │   │   │   ├── footer.tsx        (Publications footer)
│   │   │   │   │   └── ...
│   │   │   │   ├── dashboard/
│   │   │   │   ├── blog/
│   │   │   │   ├── admin/
│   │   │   │   └── shared/
│   │   │   ├── public/
│   │   │   ├── next.config.ts
│   │   │   ├── package.json
│   │   │   ├── tailwind.config.ts
│   │   │   └── tsconfig.json
│   │   └── .env.local
│   │
│   └── books/                     ← Statement Books (reader marketplace)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (marketplace)/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── books/
│       │   │   │   ├── categories/
│       │   │   │   ├── authors/
│       │   │   │   ├── blog/
│       │   │   │   ├── wishlist/
│       │   │   │   └── cart/
│       │   │   ├── (dashboard)/
│       │   │   │   └── reader/
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   ├── register/
│       │   │   │   └── forgot-password/
│       │   │   ├── layout.tsx      (Root layout — Books header/footer)
│       │   │   ├── page.tsx        (Homepage — reader-focused)
│       │   │   └── api/
│       │   │       ├── auth/
│       │   │       ├── books/
│       │   │       ├── categories/
│       │   │       ├── search/
│       │   │       ├── webhooks/
│       │   │       └── users/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── header.tsx        (Books header)
│       │   │   │   ├── footer.tsx        (Books footer)
│       │   │   │   └── ...
│       │   │   ├── book/
│       │   │   ├── cart/
│       │   │   ├── checkout/
│       │   │   ├── reader/
│       │   │   ├── search/
│       │   │   └── shared/
│       │   ├── context/
│       │   │   ├── cart-context.tsx
│       │   │   └── wishlist-context.tsx
│       │   ├── hooks/
│       │   ├── public/
│       │   ├── next.config.ts
│       │   ├── package.json
│       │   ├── tailwind.config.ts
│       │   └── tsconfig.json
│       └── .env.local
│
├── packages/
│   ├── database/                   ← Shared Prisma schema + client
│   │   ├── prisma/
│   │   │   └── schema.prisma       (Single source of truth)
│   │   ├── src/
│   │   │   ├── client.ts           (PrismaClient singleton)
│   │   │   └── index.ts            (Re-exports)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth/                       ← Shared NextAuth configuration
│   │   ├── src/
│   │   │   ├── config.ts           (NextAuth config: providers, callbacks)
│   │   │   ├── middleware.ts       (Auth middleware)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-ui/                  ← Shared UI components (shadcn/ui)
│   │   ├── src/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ... (all 27 shadcn components)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/               ← Shared utility functions + types
│   │   ├── src/
│   │   │   ├── utils.ts            (cn, formatCurrency, slugify, etc.)
│   │   │   ├── types.ts            (Shared TypeScript types)
│   │   │   ├── validators.ts       (Zod schemas)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared-hooks/               ← Shared custom hooks
│       ├── src/
│       │   ├── use-media-query.ts
│       │   ├── use-debounce.ts
│       │   ├── use-click-outside.ts
│       │   ├── use-intersection-observer.ts
│       │   ├── use-local-storage.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── turbo.json                      ← Turborepo configuration
├── package.json                    ← Root package.json (workspace config)
├── pnpm-workspace.yaml
└── .gitignore
```

---

## 2. PROPOSED ROUTING STRUCTURE

### Statement Publications (apps/publications)

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Homepage — publishing-focused | **Modify** |
| `/about` | About Statement Publications | Keep |
| `/about/leadership/[slug]` | Leadership profiles | Keep |
| `/services` | Publishing services overview | Keep |
| `/services/[slug]` | Individual service page | Keep |
| `/blog` | Industry insights & news | Keep |
| `/blog/[slug]` | Blog article | Keep |
| `/blog/topic/[slug]` | Blog topic page | Keep |
| `/contact` | Contact us | Keep |
| `/support` | Support center | Keep |
| `/login` | Author/Admin login | Keep |
| `/register` | Author/Admin registration | Keep |
| `/forgot-password` | Password reset | Keep |
| `/author/dashboard` | Author publishing dashboard | Keep |
| `/author/books` | Author's published books | Keep |
| `/author/books/new` | Create new book | Keep |
| `/author/earnings` | Author earnings & royalties | Keep |
| `/author/profile` | Author profile management | Keep |
| `/author/settings` | Author account settings | Keep |
| `/admin/dashboard` | Admin overview | Keep |
| `/admin/books` | Book approval management | Keep |
| `/admin/users` | User management | Keep |
| `/admin/blog` | Blog management | Keep |
| `/admin/content` | Site content management | Keep |
| `/admin/payouts` | Payout management | Keep |
| `/admin/royalties` | Royalty management | Keep |
| `/admin/settings` | Platform settings | Keep |

**Removed from Publications:**
- ~~`/books`~~ → Moved to Books
- ~~`/books/[id]`~~ → Moved to Books
- ~~`/cart`~~ → Moved to Books
- ~~`/wishlist`~~ → Moved to Books
- ~~`/categories`~~ → Moved to Books
- ~~`/categories/[slug]`~~ → Moved to Books
- ~~`/reader/*`~~ → Moved to Books

### Statement Books (apps/books)

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Homepage — reader-focused, book discovery | **New** |
| `/books` | Browse all books | **Move** from Publications |
| `/books/[id]` | Book detail page | **Move** from Publications |
| `/categories` | Browse categories | **Move** from Publications |
| `/categories/[slug]` | Category books | **Move** from Publications |
| `/cart` | Shopping cart | **Move** from Publications |
| `/wishlist` | Saved books | **Move** from Publications |
| `/checkout` | Checkout flow | **New** (or enhance existing) |
| `/authors` | Browse authors | **New** |
| `/authors/[slug]` | Author profile | **Move** from Publications |
| `/blog` | Book reviews & recommendations | **Move** (reader-focused content) |
| `/blog/[slug]` | Blog article | **Move** |
| `/login` | Reader login | Keep |
| `/register` | Reader registration | Keep |
| `/forgot-password` | Password reset | Keep |
| `/reader/dashboard` | Reader dashboard | **Move** from Publications |
| `/reader/library` | Reading library | **Move** from Publications |
| `/reader/reviews` | Reader reviews | **Move** from Publications |
| `/reader/[id]` | Reader profile | **Move** from Publications |
| `/search` | Search books/authors | **New** (dedicated search page) |

**API Routes for Books:**

| Route | Purpose |
|-------|---------|
| `/api/auth/[...nextauth]` | NextAuth handler |
| `/api/books` | Book listing & creation |
| `/api/books/[id]` | Single book CRUD |
| `/api/books/[id]/reviews` | Book reviews |
| `/api/categories` | Category listing |
| `/api/search` | Global search |
| `/api/users` | User management |
| `/api/users/[id]` | Single user |
| `/api/webhooks/paystack` | Paystack webhook |
| `/api/webhooks/stripe` | Stripe webhook |

---

## 3. NAVIGATION UPDATES

### Statement Publications Header

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Utility Bar: Country | Language | Support | Contact]              │
├─────────────────────────────────────────────────────────────────────┤
│ [Logo: Statement Publications]                                     │
│                                                                     │
│ Home | About | Services | Blog | Contact                           │
│                                                                     │
│ [Author Dashboard] [Admin Dashboard] [Sign In]                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Changes:**
- Remove "Store" from nav
- Remove wishlist/cart icons
- Add "Author Dashboard" and "Admin Dashboard" links
- Logo reads "Statement Publications" (not just "Statement")
- Hero section promotes publishing, not book buying
- CTA buttons: "Start Publishing" / "View Our Services"

### Statement Books Header

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Utility Bar: Country | Language | Support | Contact]              │
├─────────────────────────────────────────────────────────────────────┤
│ [Logo: Statement Books]                                            │
│                                                                     │
│ Home | Books | Categories | Authors | Blog                         │
│                                                                     │
│ [Search] [Wishlist ♥] [Cart 🛒] [Sign In]                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Changes:**
- Logo reads "Statement Books"
- Nav focused on discovery: Books, Categories, Authors, Blog
- Search bar prominent in header
- Wishlist and Cart icons with badges
- CTA buttons: "Browse Books" / "New Releases"

### Statement Publications Footer

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Statement Publications]                                           │
│                                                                     │
│ Publishing        Services           Resources        Company      │
│ ├── Start         ├── Editing        ├── Blog         ├── About    │
│ ├── Process       ├── Cover Design   ├── Author       ├── Contact  │
│ ├── Packages      ├── ISBN           │   Resources    ├── Careers  │
│ └── Pricing       ├── Proofreading   ├── Publishing   └── Press    │
│                   └── Marketing      │   Process                 │
│                                      └── FAQ                       │
│                                                                     │
│ [Facebook] [YouTube] [Instagram] [TikTok]                         │
│ © 2026 Statement Publications                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Statement Books Footer

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Statement Books]                                                  │
│                                                                     │
│ Browse             Categories         Account          Company     │
│ ├── All Books      ├── Fiction        ├── Orders       ├── About   │
│ ├── New Releases   ├── Non-Fiction    ├── Wishlist     ├── Contact │
│ ├── Bestsellers    ├── Academic       ├── Reviews      ├── Terms   │
│ └── Authors        ├── Children       └── Settings     └── Privacy │
│                    └── ...                                        │
│                                                                     │
│ [Facebook] [YouTube] [Instagram] [TikTok]                         │
│ © 2026 Statement Books — A product of Statement Publications      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. DATABASE ARCHITECTURE

### Strategy: Single Database, Shared Schema

Both platforms connect to the **same Neon PostgreSQL database**. The Prisma schema remains in `packages/database/` as the single source of truth.

### No Schema Changes Required

The existing 30 models already cover both platforms:

| Model | Used By Publications | Used By Books |
|-------|---------------------|---------------|
| User | ✓ (authors, admins) | ✓ (readers) |
| AuthorProfile | ✓ | ✓ (display) |
| ReaderProfile | | ✓ |
| Book | ✓ (manage) | ✓ (browse/buy) |
| Category | ✓ (manage) | ✓ (browse) |
| Order | | ✓ |
| OrderItem | | ✓ |
| Payment | | ✓ |
| Review | ✓ (moderate) | ✓ (create/read) |
| Wishlist | | ✓ |
| Purchase | | ✓ |
| Royalty | ✓ | |
| Wallet | ✓ | |
| Withdrawal | ✓ | |
| Notification | ✓ | ✓ |
| BlogPost | ✓ | ✓ |
| BlogComment | ✓ | ✓ |
| Coupon | ✓ | ✓ |
| Affiliate | ✓ | ✓ |
| ReadingProgress | | ✓ |
| Bookmark | | ✓ |
| Highlight | | ✓ |
| Note | | ✓ |
| SiteContent | ✓ | |
| Announcement | ✓ | |
| AnalyticsEvent | ✓ | ✓ |
| AuditLog | ✓ | |

### Cross-Platform Data Access

```
Statement Publications                    Statement Books
        │                                       │
        ▼                                       ▼
   ┌─────────────────────────────────────────────────┐
   │           Shared Prisma Client                   │
   │         (packages/database/src/client.ts)        │
   └─────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Neon PostgreSQL     │
              │   (Single Database)   │
              └───────────────────────┘
```

### Environment Variables

Both apps share:
```env
DATABASE_URL=postgresql://...        # Same Neon database
NEXTAUTH_SECRET=...                  # Same secret for SSO
NEXTAUTH_URL=...                     # Different per app
```

---

## 5. MIGRATION STRATEGY

### Phase 1: Monorepo Setup (Day 1)

1. Initialize monorepo with Turborepo
2. Create `packages/database`, `packages/auth`, `packages/shared-ui`, `packages/shared-utils`, `packages/shared-hooks`
3. Move shared code into packages
4. Verify both apps can import from packages
5. Ensure existing tests still pass

### Phase 2: Create Statement Books App (Day 1-2)

1. Create `apps/books/` Next.js app
2. Move store-related pages:
   - `(store)/books/` → `(marketplace)/books/`
   - `(store)/books/[id]/` → `(marketplace)/books/[id]/`
   - `(store)/cart/` → `(marketplace)/cart/`
   - `(store)/wishlist/` → `(marketplace)/wishlist/`
   - `(store)/categories/` → `(marketplace)/categories/`
   - `(store)/categories/[slug]/` → `(marketplace)/categories/[slug]/`
3. Move reader dashboard pages:
   - `(dashboard)/reader/` → `(dashboard)/reader/`
4. Move related components:
   - Cart/wishlist contexts
   - Book card, book detail components
   - Search components
5. Create Books-specific header and footer
6. Create Books homepage

### Phase 3: Clean Up Publications App (Day 2)

1. Remove store-related pages from Publications
2. Remove reader dashboard from Publications
3. Remove cart/wishlist contexts from Publications
4. Update Publications header (remove Store nav, cart/wishlist icons)
5. Update Publications footer (remove Store links)
6. Update Publications homepage (publishing-focused content)
7. Add cross-platform links:
   - "Browse Books on Statement Books" link in footer
   - Author profiles link to their books on Statement Books

### Phase 4: Navigation & Linking (Day 2-3)

1. Update all internal links
2. Implement cross-platform SSO (shared NextAuth session)
3. Add "Published on Statement Books" links for authors
4. Add "Written by [Author]" links on Books that link to Publications
5. Test all navigation flows

### Phase 5: Deployment (Day 3)

1. Deploy Statement Publications to `statement-publications.vercel.app`
2. Deploy Statement Books to `books.statementpublications.com`
3. Configure Vercel domains
4. Test production deployments
5. Set up redirect rules if needed

---

## 6. CROSS-PLATFORM LINKING STRATEGY

### Shared Authentication (SSO)

Both platforms share the same NextAuth configuration:
- Same `NEXTAUTH_SECRET`
- Same database (sessions table)
- Users can log in on either platform
- Session cookies are domain-scoped

**Implementation:**
```typescript
// packages/auth/src/config.ts
export const authOptions = {
  providers: [/* ... */],
  callbacks: {
    jwt: ({ token, user }) => {
      // Same token structure on both platforms
      token.role = user.role;
      return token;
    },
  },
};
```

### Cross-Platform Links

| From | To | Link Text | Location |
|------|----|-----------|----------|
| Publications Homepage | Books Homepage | "Explore Our Books" | CTA button |
| Publications Footer | Books | "Statement Books" | Footer nav |
| Publications Author Profile | Books Author Page | "View Books" | Author profile |
| Books Homepage | Publications | "Publish With Us" | CTA button |
| Books Footer | Publications | "Statement Publications" | Footer nav |
| Books Book Detail | Publications Author | "About the Author" | Book page |
| Books Author Page | Publications Author | "Author Profile" | Author page |

### URL Pattern for Cross-Platform Links

```typescript
// From Publications to Books
const booksUrl = process.env.NEXT_PUBLIC_BOOKS_URL; // https://books.statementpublications.com

// From Books to Publications
const publicationsUrl = process.env.NEXT_PUBLIC_PUBLICATIONS_URL; // https://statement-publications.vercel.app

// Example links
`${booksUrl}/books/${book.slug}`           // View book on Books
`${booksUrl}/authors/${author.slug}`       // View author on Books
`${publicationsUrl}/author/${author.slug}` // View author on Publications
```

---

## 7. REUSABLE SHARED COMPONENTS STRATEGY

### Package: `packages/shared-ui`

All 27 shadcn/ui components remain shared:

```
packages/shared-ui/src/ui/
├── accordion.tsx
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── checkbox.tsx
├── command.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── popover.tsx
├── progress.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── skeleton.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toast.tsx
├── toaster.tsx
└── tooltip.tsx
```

### Package: `packages/shared-utils`

```typescript
// packages/shared-utils/src/utils.ts
export function cn(...inputs: ClassValue[]) { /* ... */ }
export function formatCurrency(amount: number, currency?: string) { /* ... */ }
export function slugify(text: string) { /* ... */ }
export function generateOrderNumber() { /* ... */ }
export function formatDate(date: Date) { /* ... */ }
export function getInitials(name: string) { /* ... */ }
```

### Package: `packages/shared-hooks`

```typescript
// Available to both apps
export { useMediaQuery } from './use-media-query';
export { useDebounce } from './use-debounce';
export { useClickOutside } from './use-click-outside';
export { useIntersectionObserver } from './use-intersection-observer';
export { useLocalStorage } from './use-local-storage';
```

### Package: `packages/shared-types`

```typescript
// Shared TypeScript types
export type { User, AuthorProfile, ReaderProfile, Book, Category } from './types';
export type { ApiResponse, PaginatedResponse } from './types';
```

### Components That Stay App-Specific

| Publications-Only | Books-Only |
|-------------------|------------|
| Dashboard layout | Cart context |
| Sidebar (admin/author) | Wishlist context |
| Admin pages | Book detail page |
| Author dashboard | Checkout flow |
| Blog components | Search dialog |
| Animated hero bg | Reader dashboard |
| Service pages | Category showcase |

---

## 8. DEPLOYMENT STRATEGY

### Vercel Configuration

**Statement Publications:**
- Project: `statement-publications`
- Domain: `statement-publications.vercel.app`
- Framework: Next.js 16
- Root Directory: `apps/publications`
- Build Command: `cd ../.. && turbo run build --filter=publications`
- Output: `.next`

**Statement Books:**
- Project: `statement-books`
- Domain: `books.statementpublications.com`
- Framework: Next.js 16
- Root Directory: `apps/books`
- Build Command: `cd ../.. && turbo run build --filter=books`
- Output: `.next`

### Turborepo Build Pipeline

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Environment Variables (Vercel)

**Publications:**
```env
DATABASE_URL=<neon-connection-string>
NEXTAUTH_SECRET=<shared-secret>
NEXTAUTH_URL=https://statement-publications.vercel.app
NEXT_PUBLIC_BOOKS_URL=https://books.statementpublications.com
```

**Books:**
```env
DATABASE_URL=<neon-connection-string>
NEXTAUTH_SECRET=<shared-secret>
NEXTAUTH_URL=https://books.statementpublications.com
NEXT_PUBLIC_PUBLICATIONS_URL=https://statement-publications.vercel.app
```

### CI/CD Pipeline

```
Push to master
     │
     ├──→ Turbo detects changed packages
     │
     ├──→ Build publications (if packages/* changed)
     │    └──→ Vercel auto-deploys publications
     │
     └──→ Build books (if packages/* changed)
          └──→ Vercel auto-deploys books
```

---

## 9. FUTURE SCALING STRATEGY

### Phase 3: Enhanced Features (Future)

**Statement Publications:**
- Publishing workflow automation
- ISBN management integration
- Cover design marketplace
- Manuscript review system
- Royalty calculation engine
- Multi-language publishing
- Audiobook production tools
- Institutional publishing portal

**Statement Books:**
- Reading app (web-based e-reader)
- Book subscription service
- Book clubs feature
- Reading challenges
- Social reading features
- Book recommendation AI
- Library integration (OverDrive/Libby)
- School/library bulk purchasing

### Phase 4: Additional Platforms (Future)

```
Statement Publications Group
├── Statement Publications (Publishing Platform)
├── Statement Books (Book Marketplace)
├── Statement Audio (Audiobook Platform)     ← Future
├── Statement Learn (Educational Content)    ← Future
└── Statement Press (Traditional Publishing) ← Future
```

### Scaling Architecture

```
                    ┌─────────────────────┐
                    │   Vercel Edge       │
                    │   (CDN + Functions) │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Publications│ │  Books   │ │  Audio   │
        │ (Next.js)│   │ (Next.js)│   │ (Next.js)│
        └─────┬────┘   └────┬─────┘   └────┬─────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────┴────────┐
                    │   Neon Postgres  │
                    │   (Serverless)  │
                    └─────────────────┘
```

### Performance Considerations

1. **Vercel Edge**: Both apps deploy to Vercel's edge network
2. **Neon Serverless**: Database scales automatically
3. **Static Generation**: Blog pages, category pages pre-rendered
4. **ISR**: Book pages revalidate every 60 seconds
5. **CDN**: Static assets served from Vercel's CDN
6. **Middleware**: Auth checks at edge, not origin

---

## IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [ ] Review this plan with stakeholders
- [ ] Confirm Vercel project setup for two apps
- [ ] Confirm Neon database connection strings
- [ ] Set up Turborepo locally

### Phase 1: Monorepo Setup
- [ ] Initialize monorepo structure
- [ ] Create packages/database
- [ ] Create packages/auth
- [ ] Create packages/shared-ui
- [ ] Create packages/shared-utils
- [ ] Create packages/shared-hooks
- [ ] Configure turbo.json
- [ ] Verify builds work

### Phase 2: Create Statement Books
- [ ] Create apps/books Next.js app
- [ ] Move store pages to Books
- [ ] Move reader dashboard to Books
- [ ] Move cart/wishlist contexts to Books
- [ ] Create Books header component
- [ ] Create Books footer component
- [ ] Create Books homepage
- [ ] Configure Books API routes
- [ ] Test all Books functionality

### Phase 3: Clean Up Publications
- [ ] Remove store pages from Publications
- [ ] Remove reader dashboard from Publications
- [ ] Remove cart/wishlist from Publications
- [ ] Update Publications header
- [ ] Update Publications footer
- [ ] Update Publications homepage
- [ ] Test all Publications functionality

### Phase 4: Cross-Platform Integration
- [ ] Implement shared auth/SSO
- [ ] Add cross-platform links
- [ ] Test navigation between platforms
- [ ] Verify data sharing works

### Phase 5: Deployment
- [ ] Deploy Publications to Vercel
- [ ] Deploy Books to Vercel
- [ ] Configure custom domains
- [ ] Test production environments
- [ ] Set up monitoring

---

*This plan preserves all existing functionality while properly separating the publishing platform from the reader marketplace.*
