export interface BlogAuthor {
  name: string;
  avatar: string;
  bio: string;
}

export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  replies?: BlogComment[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  date: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isEditorsPick: boolean;
}

export type BlogCategory = {
  name: string;
  slug: string;
  description: string;
  postCount: number;
  icon: string;
};

export const categories: BlogCategory[] = [
  { name: "Writing Tips", slug: "writing-tips", description: "Craft compelling stories and sharpen your writing skills", postCount: 4, icon: "pen-tool" },
  { name: "Self Publishing", slug: "self-publishing", description: "Navigate the world of independent publishing", postCount: 4, icon: "book-open" },
  { name: "Book Marketing", slug: "book-marketing", description: "Promote your book and grow your readership", postCount: 3, icon: "megaphone" },
  { name: "Author Success Stories", slug: "author-success-stories", description: "Inspiring journeys from aspiring authors to published writers", postCount: 3, icon: "trophy" },
  { name: "Industry News", slug: "industry-news", description: "Stay updated with the latest in publishing", postCount: 3, icon: "newspaper" },
  { name: "Editing & Proofreading", slug: "editing-proofreading", description: "Polish your manuscript to perfection", postCount: 3, icon: "check-circle" },
  { name: "Book Design", slug: "book-design", description: "Create stunning covers and interiors", postCount: 3, icon: "palette" },
  { name: "Academic Publishing", slug: "academic-publishing", description: "Publish scholarly works and research", postCount: 3, icon: "graduation-cap" },
  { name: "Research & Journals", slug: "research-journals", description: "Navigate academic research and journal submissions", postCount: 2, icon: "search" },
  { name: "Digital Publishing", slug: "digital-publishing", description: "Master eBooks, audiobooks, and digital formats", postCount: 3, icon: "monitor" },
];

export const blogPosts: BlogPost[] = [
  // ── Writing Tips ────────────────────────────────────
  {
    id: "1",
    title: "7 Storytelling Techniques That Hook Readers From Page One",
    slug: "7-storytelling-techniques-hook-readers",
    excerpt: "Master the art of narrative hooks with these proven storytelling techniques used by bestselling authors worldwide.",
    content: `<h2>Why Your Opening Matters More Than You Think</h2>
<p>Research shows that readers decide whether to continue a book within the first three pages. Your opening isn't just an introduction — it's a contract with your reader promising something worth their time.</p>

<h3>1. Start In Medias Res</h3>
<p>Begin in the middle of the action. Instead of setting up your world with pages of backstory, drop readers into a moment of tension. Consider starting with a character running, arguing, or making a decision they can't take back.</p>

<p>In Toni Morrison's "Beloved," the novel opens with the famous line "124 was spiteful." We don't know what 124 is, but we know something is wrong. That mystery pulls us forward.</p>

<h3>2. Open With a Provocative Question</h3>
<p>Questions engage the reader's mind automatically. When you open with "Have you ever wondered what happens to the people left behind?" you create an immediate curiosity gap that demands resolution.</p>

<h3>3. Use Sensory Details to Ground the Reader</h3>
<p>Don't just tell us where we are — make us feel it. The smell of rain on hot asphalt, the taste of copper in a frightened mouth, the sound of a floorboard creaking in an empty house. Sensory details create immersion faster than any amount of exposition.</p>

<h3>4. Establish Stakes Early</h3>
<p>Readers need to understand what can be lost. Whether it's a relationship, a life, or a dream, stakes create tension. The higher the stakes, the more invested your reader becomes.</p>

<h3>5. Create an Unreliable Narrator</h3>
<p>When readers sense that the narrator might not be telling the whole truth, they lean in closer. Unreliable narrators create a delicious tension between what's said and what's real.</p>

<h3>6. End Chapters on Cliffhangers</h3>
<p>Each chapter should end with a question that the next chapter promises to answer. This "page-turner" effect is what keeps readers up past midnight.</p>

<h3>7. Use the "But/Therefore" Method</h3>
<p>Instead of connecting scenes with "and then," use "but" or "therefore." This creates因果 relationships that drive the narrative forward with purpose.</p>

<h2>Putting It All Together</h2>
<p>Great storytelling isn't about following rules — it's about understanding why certain techniques work and then breaking them purposefully. Start with these seven techniques, practice them until they become instinct, and then trust your creative intuition.</p>`,
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop",
    category: "Writing Tips",
    tags: ["storytelling", "writing craft", "narrative", "fiction writing"],
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", bio: "Bestselling author and writing coach with 15 years of experience helping writers craft compelling narratives." },
    date: "2026-06-05",
    readTime: 8,
    viewCount: 2847,
    likeCount: 194,
    commentCount: 3,
    isFeatured: true,
    isEditorsPick: true,
  },
  {
    id: "2",
    title: "How to Write Dialogue That Sounds Real (And Moves the Story Forward)",
    slug: "write-dialogue-that-sounds-real",
    excerpt: "Great dialogue does double duty — it reveals character while advancing the plot. Here's how to master this essential skill.",
    content: `<h2>The Art of Authentic Conversation</h2>
<p>Real people don't speak in complete sentences. They interrupt, trail off, change subjects, and say one thing while meaning another. Your dialogue should capture this rhythm while serving a narrative purpose.</p>

<h3>Read Your Dialogue Aloud</h3>
<p>This is the simplest and most effective test. If it sounds stilted when spoken, it will read stilted on the page. Your ear catches awkwardness that your eyes miss.</p>

<h3>Give Each Character a Distinct Voice</h3>
<p>A professor speaks differently than a teenager. A New Yorker sounds different from someone in rural Montana. Word choice, sentence length, and rhythm should vary between characters.</p>

<h3>Use Subtext</h3>
<p>The most powerful dialogue is about what isn't said. When a character says "I'm fine," the reader should understand they're anything but. Layer your conversations with unspoken meaning.</p>

<h3>Cut the Pleasantries</h3>
<p>Real conversations start with "Hi, how are you?" but fiction shouldn't. Start scenes in the middle of the conversation and trust readers to fill in the social niceties.</p>

<h3>Use Dialogue Tags Sparingly</h3>
<p>"Said" is invisible to readers. Avoid "exclaimed," "retorted," or "opined" — they draw attention to themselves and slow the reading pace. Let the dialogue itself convey the emotion.</p>`,
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop",
    category: "Writing Tips",
    tags: ["dialogue", "fiction writing", "character development"],
    author: { name: "Marcus Williams", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", bio: "Screenwriter and novelist whose works have been adapted for film and television." },
    date: "2026-06-02",
    readTime: 6,
    viewCount: 1923,
    likeCount: 142,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "3",
    title: "The Complete Guide to Writing Your First Novel in 90 Days",
    slug: "complete-guide-writing-first-novel-90-days",
    excerpt: "A structured, day-by-day plan to take your novel from idea to first draft without burning out.",
    content: `<h2>Why 90 Days Works</h2>
<p>The 90-day novel isn't about speed — it's about momentum. By committing to consistent daily progress, you bypass the perfectionism that paralyzes so many aspiring novelists.</p>

<h3>Phase 1: Foundation (Days 1-14)</h3>
<p>Spend the first two weeks on pre-writing. Develop your characters, outline your plot, and build your world. This investment pays dividends when you're writing at 11 PM on day 47 and need direction.</p>

<h3>Phase 2: Drafting (Days 15-75)</h3>
<p>Write 1,500 words per day minimum. Don't edit. Don't reread. Just write forward. The goal is a complete draft, not a perfect one. You can't fix a blank page.</p>

<h3>Phase 3: Rest and Review (Days 76-80)</h3>
<p>Step away from your manuscript for five days. When you return, read the entire draft in one sitting and make notes. This fresh perspective is invaluable.</p>

<h3>Phase 4: Revision Plan (Days 81-90)</h3>
<p>Create a detailed revision plan based on your read-through. Identify structural issues, character arcs that need work, and scenes that can be cut. This plan becomes your roadmap for the next phase.</p>`,
    coverImage: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=500&fit=crop",
    category: "Writing Tips",
    tags: ["novel writing", "writing schedule", "first draft", "productivity"],
    author: { name: "Elena Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", bio: "Author of three bestselling novels and founder of the 90-Day Novel Workshop." },
    date: "2026-05-28",
    readTime: 12,
    viewCount: 4215,
    likeCount: 312,
    commentCount: 5,
    isFeatured: false,
    isEditorsPick: true,
  },
  {
    id: "4",
    title: "Finding Your Voice: Why Authenticity Is Your Greatest Writing Asset",
    slug: "finding-your-voice-authenticity-writing",
    excerpt: "Your unique voice is what sets you apart from millions of other writers. Here's how to discover and develop it.",
    content: `<h2>What Is "Voice" in Writing?</h2>
<p>Voice is the quality that makes your writing uniquely yours. It's not just about style — it's about perspective, rhythm, word choice, and the intangible essence that makes a reader feel they're in capable hands.</p>

<h3>Stop Trying to Sound Like Someone Else</h3>
<p>Early in your writing journey, imitation is natural and useful. But eventually, you must let go of the voices you admire and trust your own. Your authentic voice emerges when you stop performing and start expressing.</p>

<h3>Write What Scares You</h3>
<p>Vulnerability creates connection. The passages you're afraid to write — the ones that feel too personal, too honest, too raw — are often the ones that resonate most deeply with readers.</p>

<h3>Read Widely, Write Narrowly</h3>
<p>Consume literature across genres, cultures, and time periods. But when you write, focus on what you know deeply. Your unique combination of experiences, interests, and perspectives creates a voice no one else can replicate.</p>`,
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop",
    category: "Writing Tips",
    tags: ["writing voice", "authenticity", "creative writing", "self-expression"],
    author: { name: "David Okafor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", bio: "Literary fiction author and creative writing professor at Columbia University." },
    date: "2026-05-20",
    readTime: 7,
    viewCount: 1654,
    likeCount: 128,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Self Publishing ─────────────────────────────────
  {
    id: "5",
    title: "Self-Publishing in 2026: The Complete Author's Roadmap",
    slug: "self-publishing-2026-complete-roadmap",
    excerpt: "From manuscript to bestseller status, here's everything you need to know about self-publishing this year.",
    content: `<h2>The Self-Publishing Landscape Has Changed</h2>
<p>Self-publishing is no longer the "alternative" to traditional publishing. It's a legitimate, profitable career path that gives authors complete control over their work. But the landscape evolves rapidly, and staying informed is essential.</p>

<h3>Step 1: Finish Your Manuscript</h3>
<p>This sounds obvious, but many aspiring authors jump into publishing before their manuscript is ready. Complete your draft, then let it rest for at least two weeks before revision.</p>

<h3>Step 2: Professional Editing Is Non-Negotiable</h3>
<p>Developmental editing, copyediting, and proofreading are investments that separate amateur publications from professional ones. Budget at least $1,000-3,000 for editing, depending on your manuscript length.</p>

<h3>Step 3: Invest in Cover Design</h3>
<p>Readers absolutely judge books by their covers. A professional cover design costs $300-1,500 and can make the difference between a click and a scroll-past.</p>

<h3>Step 4: Format for Multiple Platforms</h3>
<p>Your book should look great as an eBook, paperback, and hardcover. Use professional formatting tools or hire a formatter to ensure consistency across formats.</p>

<h3>Step 5: Distribution Strategy</h3>
<p>Go wide or go exclusive — each has pros and cons. Amazon's KDP Select offers visibility but requires exclusivity. Going wide through distributors like Draft2Digital reaches more readers but requires more marketing effort.</p>`,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop",
    category: "Self Publishing",
    tags: ["self-publishing", "indie authors", "publishing guide", "2026"],
    author: { name: "James Mitchell", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", bio: "Self-publishing consultant and author of 'The Indie Author's Complete Guide.'" },
    date: "2026-06-01",
    readTime: 15,
    viewCount: 5832,
    likeCount: 421,
    commentCount: 5,
    isFeatured: true,
    isEditorsPick: true,
  },
  {
    id: "6",
    title: "KDP vs. IngramSpark: Which Platform Is Right for Your Book?",
    slug: "kdp-vs-ingramspark-comparison",
    excerpt: "A detailed comparison of the two biggest self-publishing platforms to help you make the right choice.",
    content: `<h2>Understanding Your Options</h2>
<p>Choosing the right publishing platform is one of the most important decisions you'll make as an indie author. Both KDP and IngramSpark have their strengths, and many successful authors use both.</p>

<h3>Amazon KDP: The Pros</h3>
<p>KDP offers unparalleled reach in the world's largest bookstore. With 70% royalty on eBooks priced $2.99-$9.99 and access to millions of Amazon Prime readers, it's the obvious starting point for most authors.</p>

<h3>Amazon KDP: The Cons</h3>
<p>The exclusivity requirement of KDP Select means your eBook can only be sold on Amazon. If you want to reach readers on Apple Books, Kobo, or Barnes & Noble, you'll need to publish outside KDP Select.</p>

<h3>IngramSpark: The Pros</h3>
<p>IngramSpark distributes to over 40,000 retailers and libraries worldwide. Their print quality is excellent, and they offer both hardcover and paperback options with wide distribution.</p>

<h3>IngramSpark: The Cons</h3>
<p>IngramSpark charges setup fees and returns can eat into your profits. Their platform is also less user-friendly than KDP, and customer service can be slow.</p>

<h3>The Hybrid Approach</h3>
<p>Many successful indie authors use KDP for their eBook (taking advantage of KDP Select's promotional tools) while using IngramSpark for print distribution to bookstores and libraries. This gives you the best of both worlds.</p>`,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=500&fit=crop",
    category: "Self Publishing",
    tags: ["KDP", "IngramSpark", "publishing platforms", "comparison"],
    author: { name: "Amanda Foster", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", bio: "Independent publisher and founder of IndiePress Consulting." },
    date: "2026-05-25",
    readTime: 10,
    viewCount: 3456,
    likeCount: 267,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "7",
    title: "How to Price Your Book for Maximum Profit and Sales",
    slug: "how-to-price-your-book-maximum-profit",
    excerpt: "Pricing strategy can make or break your book's success. Learn the psychology and mathematics behind effective book pricing.",
    content: `<h2>The Psychology of Book Pricing</h2>
<p>Price isn't just a number — it's a signal. Too cheap, and readers question quality. Too expensive, and you lose impulse buyers. Finding the sweet spot requires understanding your market and your goals.</p>

<h3>The $4.99 Sweet Spot</h3>
<p>For eBooks, research consistently shows that $4.99 performs well for fiction. It's low enough for impulse purchases but high enough to signal quality. For non-fiction, $9.99-$14.99 works well when you've established authority.</p>

<h3>The Permafree Strategy</h3>
<p>Making the first book in a series permanently free is one of the most effective marketing strategies in indie publishing. It lowers the barrier to entry and lets readers discover your work risk-free.</p>

<h3>Launch Pricing</h3>
<p>Consider launching at $0.99 or $2.99 to generate reviews and sales velocity, then raising the price once you have social proof. This "discount launch" strategy has launched many bestsellers.</p>`,
    coverImage: "https://images.unsplash.com/photo-1553729459-afe8f2e2f456?w=800&h=500&fit=crop",
    category: "Self Publishing",
    tags: ["book pricing", "strategy", "royalties", "sales"],
    author: { name: "Rachel Kim", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", bio: "Data-driven publishing consultant specializing in book marketing and pricing strategy." },
    date: "2026-05-18",
    readTime: 8,
    viewCount: 2891,
    likeCount: 198,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "8",
    title: "Understanding ISBNs: Do You Really Need One?",
    slug: "understanding-isbns-do-you-need-one",
    excerpt: "ISBNs can be confusing for new authors. Here's a clear guide to when you need one and when you don't.",
    content: `<h2>What Is an ISBN?</h2>
<p>An International Standard Book Number is a unique identifier for your book. Think of it as your book's Social Security number — it identifies your specific edition in databases worldwide.</p>

<h3>When You Need an ISBN</h3>
<p>If you plan to sell through bookstores, libraries, or non-Amazon retailers, you need an ISBN. Amazon provides free ASINs for KDP, but these only work within Amazon's ecosystem.</p>

<h3>When You Don't Need an ISBN</h3>
<p>If you're only selling on Amazon through KDP, you don't need your own ISBN. Amazon assigns an ASIN automatically. However, this limits your distribution options.</p>

<h3>Buying ISBNs in Bulk</h3>
<p>In the US, Bowker sells single ISBNs for $125 or blocks of 10 for $295. If you plan to publish multiple books or multiple formats (eBook, paperback, hardcover), buying in bulk saves money.</p>`,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=500&fit=crop",
    category: "Self Publishing",
    tags: ["ISBN", "publishing basics", "book identification"],
    author: { name: "Thomas Grant", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", bio: "Publishing industry veteran with 20 years of experience in book distribution." },
    date: "2026-05-10",
    readTime: 6,
    viewCount: 1876,
    likeCount: 134,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Book Marketing ──────────────────────────────────
  {
    id: "9",
    title: "The Author's Guide to Book Launches That Actually Sell",
    slug: "authors-guide-book-launches-that-sell",
    excerpt: "A book launch isn't just a date — it's a campaign. Here's how to plan and execute a launch that generates real sales.",
    content: `<h2>Why Most Book Launches Fail</h2>
<p>The average self-published book sells fewer than 250 copies. The difference between those books and bestsellers often comes down to the launch strategy. A well-planned launch can generate more sales in one week than most books earn in a year.</p>

<h3>Start Building Your List 6 Months Early</h3>
<p>Your email list is your most powerful launch tool. Start building it months before your launch with free chapters, behind-the-scenes content, and exclusive updates.</p>

<h3>Create a Street Team</h3>
<p>Recruit 50-200 dedicated readers who receive advance copies in exchange for honest reviews on launch day. Reviews create social proof that drives organic sales.</p>

<h3>Plan Your Launch Week</h3>
<p>Day 1: Email blast to your list. Day 2: Social media blitz. Day 3: Blog tour. Day 4: Podcast appearances. Day 5: Giveaway. Day 6: Price promotion. Day 7: Thank you and results sharing.</p>`,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=500&fit=crop",
    category: "Book Marketing",
    tags: ["book launch", "marketing strategy", "sales", "promotion"],
    author: { name: "Nicole Patel", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", bio: "Book marketing strategist who has helped launch over 200 titles to bestseller status." },
    date: "2026-06-03",
    readTime: 11,
    viewCount: 4123,
    likeCount: 356,
    commentCount: 5,
    isFeatured: true,
    isEditorsPick: false,
  },
  {
    id: "10",
    title: "Social Media for Authors: Where to Focus in 2026",
    slug: "social-media-authors-where-to-focus-2026",
    excerpt: "Not all social platforms are equal for authors. Here's where to invest your time for maximum reader engagement.",
    content: `<h2>The Platforms That Matter for Authors</h2>
<p>With dozens of social media platforms competing for attention, authors need to be strategic about where they spend their limited marketing time.</p>

<h3>BookTok (TikTok): Still King</h3>
<p>BookTok continues to drive massive book sales. Short, authentic videos about books — reviews, recommendations, aesthetic content — regularly push titles to bestseller status. If you're not on BookTok, you're missing the biggest discovery platform in publishing.</p>

<h3>Instagram: Visual Storytelling</h3>
<p>Instagram remains strong for authors who can create visually appealing content. Reels, carousel posts, and Stories allow for creative book promotion that feels organic rather than salesy.</p>

<h3>Newsletter: Your Most Valuable Asset</h3>
<p>Social media platforms come and go, but your email list is yours forever. An engaged newsletter converts readers into fans and fans into advocates. Focus on growing this above all else.</p>`,
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
    category: "Book Marketing",
    tags: ["social media", "BookTok", "Instagram", "marketing"],
    author: { name: "Jordan Blake", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face", bio: "Digital marketing specialist focused on author brand building and social media strategy." },
    date: "2026-05-22",
    readTime: 9,
    viewCount: 3678,
    likeCount: 289,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: true,
  },
  {
    id: "11",
    title: "Building an Author Platform From Scratch",
    slug: "building-author-platform-from-scratch",
    excerpt: "You don't need thousands of followers to build an effective author platform. Here's how to start from zero.",
    content: `<h2>What Is an Author Platform?</h2>
<p>Your author platform is everything that connects you to potential readers: your website, social media, email list, speaking engagements, and media appearances. It's how readers find and follow you.</p>

<h3>Start With Your Website</h3>
<p>A professional author website is your home base. It should include your books, bio, blog, and a way to join your email list. Keep it clean, professional, and mobile-friendly.</p>

<h3>Consistency Over Volume</h3>
<p>It's better to post on one platform consistently than to spread yourself thin across five. Choose one social platform where your readers gather and show up there regularly.</p>

<h3>Provide Value Beyond Your Books</h3>
<p>Share insights about your writing process, recommend books you love, and engage with your community. People follow authors, not just books.</p>`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    category: "Book Marketing",
    tags: ["author platform", "brand building", "online presence"],
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", bio: "Bestselling author and writing coach with 15 years of experience helping writers craft compelling narratives." },
    date: "2026-05-15",
    readTime: 7,
    viewCount: 2345,
    likeCount: 187,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Author Success Stories ──────────────────────────
  {
    id: "12",
    title: "From Rejection Letters to Bestseller: How Maria Torres Found Her Audience",
    slug: "maria-torres-rejection-to-bestseller",
    excerpt: "After 47 rejections, Maria Torres self-published her debut novel. It became a New York Times bestseller.",
    content: `<h2>The Beginning</h2>
<p>Maria Torres spent three years writing her debut novel, "The Light We Carry." When she finally finished, she sent it to every literary agent she could find. The rejections poured in — 47 in total.</p>

<h3>The Turning Point</h3>
<p>"I was devastated," Maria recalls. "But I believed in this book. I knew readers would connect with it if they could just find it." She decided to self-publish.</p>

<h3>The Self-Publishing Journey</h3>
<p>Maria invested in professional editing and cover design. She built an email list by offering the first chapter free on her website. She reached out to book bloggers and BookTok creators.</p>

<h3>The Breakout</h3>
<p>Three months after launch, a popular BookTok creator reviewed "The Light We Carry." The video went viral, driving thousands of sales overnight. Within a week, the novel hit the New York Times bestseller list.</p>

<h3>The Lesson</h3>
<p>"Rejection doesn't mean your work isn't valuable," Maria says. "It means you haven't found your audience yet. Sometimes you have to go find them yourself."</p>`,
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop",
    category: "Author Success Stories",
    tags: ["success story", "self-publishing", "BookTok", "inspiration"],
    author: { name: "David Okafor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", bio: "Literary fiction author and creative writing professor at Columbia University." },
    date: "2026-06-04",
    readTime: 9,
    viewCount: 6789,
    likeCount: 543,
    commentCount: 5,
    isFeatured: false,
    isEditorsPick: true,
  },
  {
    id: "13",
    title: "Quitting His Day Job: How One Author Built a Six-Figure Writing Career",
    slug: "quitting-day-job-six-figure-writing-career",
    excerpt: "Brian Lawson went from cubicle dweller to full-time author in just 18 months. Here's exactly how he did it.",
    content: `<h2>The 9-to-5 Dream That Wasn't</h2>
<p>Brian Lawson worked in corporate finance for twelve years. Every morning, he woke up dreading the day ahead. Every evening, he wrote — slowly building a backlist of self-published thrillers.</p>

<h3>The Numbers That Changed Everything</h3>
<p>In his third year of self-publishing, Brian earned $45,000 from his books — enough to cover his basic expenses. He negotiated a four-day work week with his employer, then three days, then finally took the leap.</p>

<h3>What Full-Time Writing Actually Looks Like</h3>
<p>"People think it's all coffee shops and inspiration," Brian laughs. "I write 3,000 words a day, five days a week. I treat it like a job because it is one."</p>

<h3>Building Sustainable Income</h3>
<p>Brian's secret is series fiction. Each new book in a series boosts sales of all previous books. His six-book Marcus Kane thriller series generates consistent monthly income.</p>`,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop",
    category: "Author Success Stories",
    tags: ["career change", "full-time author", "income", "thriller"],
    author: { name: "Nicole Patel", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", bio: "Book marketing strategist who has helped launch over 200 titles to bestseller status." },
    date: "2026-05-27",
    readTime: 10,
    viewCount: 5432,
    likeCount: 412,
    commentCount: 5,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "14",
    title: "The Power of Persistence: An Author's Journey Through 200 Rejections",
    slug: "power-of-persistence-200-rejections",
    excerpt: "When most authors would have given up, Rachel Torres kept going. Her persistence paid off in ways she never imagined.",
    content: `<h2>The Mountain of Rejection</h2>
<p>Rachel Torres kept every rejection letter. She has a folder with 200 of them — spanning five years, three manuscripts, and countless hours of doubt.</p>

<h3>Why She Didn't Quit</h3>
<p>"Every rejection meant someone read my work," Rachel explains. "That alone was progress. And occasionally, I'd get a personal note saying they loved the writing but it wasn't right for their list. That kept me going."</p>

<h3>The Manuscript That Changed Everything</h3>
<p>Her third manuscript, "Whispers in the Walls," caught the attention of an agent who had almost passed on it. "I almost rejected it too," the agent admitted. "But something about the voice stayed with me."</p>

<h3>The Payoff</h3>
<p>"Whispers in the Walls" sold at auction to three major publishers. Rachel signed a two-book deal worth six figures. Her debut spent twelve weeks on the bestseller list.</p>`,
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop",
    category: "Author Success Stories",
    tags: ["persistence", "traditional publishing", "debut novel", "inspiration"],
    author: { name: "Marcus Williams", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", bio: "Screenwriter and novelist whose works have been adapted for film and television." },
    date: "2026-05-12",
    readTime: 8,
    viewCount: 4567,
    likeCount: 378,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Industry News ───────────────────────────────────
  {
    id: "15",
    title: "The Rise of AI in Publishing: What Authors Need to Know",
    slug: "rise-of-ai-in-publishing-authors-need-to-know",
    excerpt: "AI is transforming the publishing industry. Here's what it means for authors, agents, and readers.",
    content: `<h2>AI Is Already Here</h2>
<p>From cover design tools to manuscript editors, artificial intelligence is reshaping how books are created, published, and marketed. Understanding these changes is essential for modern authors.</p>

<h3>AI in Manuscript Editing</h3>
<p>Tools like Grammarly and ProWritingAid use AI to catch errors and suggest improvements. While they can't replace human editors for developmental work, they're invaluable for first-pass editing.</p>

<h3>AI-Generated Content</h3>
<p>The debate around AI-generated books continues. Most retailers and publishers now require disclosure of AI involvement, and readers are increasingly vocal about wanting human-created stories.</p>

<h3>AI in Marketing</h3>
<p>AI-powered tools can analyze reader data, optimize ad campaigns, and even suggest book descriptions. Authors who embrace these tools gain a competitive edge.</p>

<h3>What Authors Should Do</h3>
<p>Stay informed, be ethical, and focus on what makes your work uniquely human. AI can assist with process, but it can't replicate genuine human creativity and emotion.</p>`,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    category: "Industry News",
    tags: ["AI", "publishing trends", "technology", "future"],
    author: { name: "James Mitchell", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", bio: "Self-publishing consultant and author of 'The Indie Author's Complete Guide.'" },
    date: "2026-06-06",
    readTime: 10,
    viewCount: 7234,
    likeCount: 567,
    commentCount: 5,
    isFeatured: true,
    isEditorsPick: true,
  },
  {
    id: "16",
    title: "Print-on-Demand vs. Offset Printing: A 2026 Cost Analysis",
    slug: "print-on-demand-vs-offset-printing-2026",
    excerpt: "Which printing method makes sense for your book? We break down the costs, quality, and logistics.",
    content: `<h2>The Printing Revolution</h2>
<p>Print-on-demand technology has improved dramatically, but offset printing still has its place. The right choice depends on your book's genre, expected sales volume, and distribution strategy.</p>

<h3>Print-on-Demand: The Economics</h3>
<p>POD has no upfront costs and no inventory risk. You pay per unit printed, typically $3-5 for a standard paperback. The trade-off is lower per-unit profit margins.</p>

<h3>Offset Printing: The Economics</h3>
<p>Offset printing requires upfront investment — usually $2,000-5,000 for a typical print run of 500-1,000 copies. But the per-unit cost drops dramatically, often to $1-2 per book.</p>

<h3>Quality Comparison</h3>
<p>Modern POD quality is excellent for most genres. However, offset printing still offers superior paper options, binding quality, and color accuracy — important for illustrated books and coffee table editions.</p>

<h3>The Hybrid Strategy</h3>
<p>Many authors use POD for initial releases and distribution, then switch to offset once they've confirmed steady sales. This minimizes risk while maximizing long-term profits.</p>`,
    coverImage: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=500&fit=crop",
    category: "Industry News",
    tags: ["printing", "POD", "offset", "cost analysis"],
    author: { name: "Thomas Grant", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", bio: "Publishing industry veteran with 20 years of experience in book distribution." },
    date: "2026-05-30",
    readTime: 9,
    viewCount: 2345,
    likeCount: 178,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "17",
    title: "Global Publishing Trends: What 2026 Tells Us About the Future",
    slug: "global-publishing-trends-2026",
    excerpt: "From audiobook growth to international markets, these trends are shaping the future of publishing.",
    content: `<h2>The State of Publishing in 2026</h2>
<p>The publishing industry continues to evolve at breakneck speed. Authors who understand these trends can position themselves for success.</p>

<h3>Audiobooks Continue to Soar</h3>
<p>Audiobook revenue has grown 25% year-over-year for the past three years. Authors who ignore audio are leaving money on the table.</p>

<h3>International Markets Are Booming</h3>
<p>English-language books are finding massive audiences in India, Southeast Asia, and Latin America. Translation rights and multilingual publishing present huge opportunities.</p>

<h3>Direct Sales Are Growing</h3>
<p>More authors are selling directly through their websites, bypassing retailer fees. Platforms like Shopify and Gumroad make this easier than ever.</p>

<h3>Sustainability Matters</h3>
<p>Readers increasingly care about environmental impact. Print-on-demand reduces waste, and eco-friendly printing options are becoming more affordable.</p>`,
    coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168d9c?w=800&h=500&fit=crop",
    category: "Industry News",
    tags: ["trends", "audiobooks", "international", "future"],
    author: { name: "Amanda Foster", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", bio: "Independent publisher and founder of IndiePress Consulting." },
    date: "2026-05-14",
    readTime: 11,
    viewCount: 3123,
    likeCount: 234,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Editing & Proofreading ──────────────────────────
  {
    id: "18",
    title: "The Essential Guide to Self-Editing Your Manuscript",
    slug: "essential-guide-self-editing-manuscript",
    excerpt: "Before you hire an editor, learn how to self-edit effectively. These techniques will polish your draft and save you money.",
    content: `<h2>Why Self-Editing Matters</h2>
<p>Professional editing is essential, but self-editing before you hire an editor saves time and money. The more polished your manuscript is when it reaches your editor, the more they can focus on deeper issues.</p>

<h3>The Cool-Down Period</h3>
<p>After finishing your draft, wait at least two weeks before editing. This distance helps you see your work with fresh eyes, catching issues you'd otherwise miss.</p>

<h3>Read Aloud</h3>
<p>Reading your manuscript aloud forces you to slow down and hear every word. Awkward phrasing, run-on sentences, and dialogue issues become immediately apparent.</p>

<h3>The Chapter Audit</h3>
<p>Summarize each chapter in one sentence. If you can't, the chapter may lack focus. Every chapter should advance the plot or develop character — ideally both.</p>

<h3>Search and Destroy</h3>
<p>Use your word processor's search function to find your crutch words — "just," "really," "very," "suddenly." Eliminate them ruthlessly. Your writing will be stronger for it.</p>`,
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop",
    category: "Editing & Proofreading",
    tags: ["self-editing", "manuscript", "revision", "writing process"],
    author: { name: "Elena Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", bio: "Author of three bestselling novels and founder of the 90-Day Novel Workshop." },
    date: "2026-05-29",
    readTime: 10,
    viewCount: 3876,
    likeCount: 298,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "19",
    title: "Developmental Editing vs. Copyediting: What's the Difference?",
    slug: "developmental-editing-vs-copyediting",
    excerpt: "Understanding the different types of editing helps you choose the right service for your manuscript's needs.",
    content: `<h2>The Editing Spectrum</h2>
<p>Editing isn't one-size-fits-all. Different stages of editing address different aspects of your manuscript, and understanding these differences helps you invest wisely.</p>

<h3>Developmental Editing</h3>
<p>This is the big-picture edit. A developmental editor looks at structure, character arcs, pacing, theme, and plot consistency. They might suggest moving chapters, cutting scenes, or developing characters more fully.</p>

<h3>Line Editing</h3>
<p>Line editing focuses on the sentence level — word choice, rhythm, clarity, and style. A line editor polishes your prose without changing the story's structure.</p>

<h3>Copyediting</h3>
<p>Copyediting catches grammar, punctuation, spelling, and consistency errors. This is the technical edit that ensures your manuscript is error-free.</p>

<h3>Proofreading</h3>
<p>The final pass. A proofreader catches any remaining typos, formatting issues, or inconsistencies before publication.</p>

<h3>Which Do You Need?</h3>
<p>First drafts benefit from developmental editing. Revised drafts need copyediting. Final drafts require proofreading. Most manuscripts go through all three stages.</p>`,
    coverImage: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&h=500&fit=crop",
    category: "Editing & Proofreading",
    tags: ["editing types", "developmental editing", "copyediting", "proofreading"],
    author: { name: "Rachel Kim", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", bio: "Data-driven publishing consultant specializing in book marketing and pricing strategy." },
    date: "2026-05-16",
    readTime: 8,
    viewCount: 2567,
    likeCount: 189,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "20",
    title: "10 Common Grammar Mistakes That Undermine Your Writing",
    slug: "10-common-grammar-mistakes-undermine-writing",
    excerpt: "Even experienced writers make these grammar errors. Learn to spot and fix them before they reach your reader.",
    content: `<h2>Grammar Matters</h2>
<p>While rules are sometimes meant to be broken, certain grammar mistakes pull readers out of the story and undermine your credibility as a writer.</p>

<h3>1. Comma Splices</h3>
<p>Running two independent clauses together with just a comma is the most common error. Use a period, semicolon, or conjunction instead.</p>

<h3>2. Subject-Verb Agreement</h3>
<p>"The group of authors were..." should be "The group of authors was..." The subject is "group," not "authors."</p>

<h3>3. Dangling Modifiers</h3>
<p>"Walking to the store, the rain started" implies the rain was walking. Rewrite to clarify who's performing the action.</p>

<h3>4. Its vs. It's</h3>
<p>"Its" is possessive. "It's" is a contraction of "it is." This mistake is embarrassingly common even in published books.</p>

<h3>5. Who vs. Whom</h3>
<p>"Who" is a subject pronoun. "Whom" is an object pronoun. When in doubt, rephrase the sentence with "he" or "him" — if "him" works, use "whom."</p>`,
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop",
    category: "Editing & Proofreading",
    tags: ["grammar", "writing mistakes", "proofreading", "editing tips"],
    author: { name: "David Okafor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", bio: "Literary fiction author and creative writing professor at Columbia University." },
    date: "2026-05-08",
    readTime: 7,
    viewCount: 4321,
    likeCount: 312,
    commentCount: 5,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Book Design ─────────────────────────────────────
  {
    id: "21",
    title: "Book Cover Design Trends Dominating 2026",
    slug: "book-cover-design-trends-2026",
    excerpt: "From minimalist typography to bold illustrations, these cover trends are defining the year's best-selling books.",
    content: `<h2>Your Cover Is Your First Impression</h2>
<p>Readers spend an average of 3 seconds looking at a book cover before deciding to learn more. Understanding current design trends helps your book compete in a crowded marketplace.</p>

<h3>Minimalist Typography</h3>
<p>Clean, bold typography on solid backgrounds continues to dominate literary fiction and memoir. The trend toward simplicity signals sophistication and confidence.</p>

<h3>Bold Illustrations</h3>
<p>Illustrated covers are having a moment, especially in romance, fantasy, and literary fiction. Hand-drawn elements add warmth and personality that photographs can't match.</p>

<h3>Neon and Glow Effects</h3>
<p>Sci-fi and thriller covers increasingly use neon colors and glowing effects to create visual impact. These covers pop on screen and catch the eye in thumbnail size.</p>

<h3>Nostalgic Aesthetics</h3>
<p>Retro-inspired designs — 70s color palettes, vintage textures, classic typography — appeal to readers' sense of nostalgia while feeling fresh and contemporary.</p>`,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop",
    category: "Book Design",
    tags: ["cover design", "trends", "2026", "visual design"],
    author: { name: "Jordan Blake", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face", bio: "Digital marketing specialist focused on author brand building and social media strategy." },
    date: "2026-06-02",
    readTime: 8,
    viewCount: 3456,
    likeCount: 267,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: true,
  },
  {
    id: "22",
    title: "Interior Formatting: Making Your eBook Look Professional",
    slug: "interior-formatting-ebook-professional",
    excerpt: "A beautifully formatted interior improves readability and gives your eBook a professional edge.",
    content: `<h2>Why Formatting Matters</h2>
<p>Even the best writing can be undermined by poor formatting. Readers expect a professional experience, and formatting issues — inconsistent fonts, awkward spacing, broken layouts — signal amateur work.</p>

<h3>Font Selection</h3>
<p>Stick to classic, readable fonts like Georgia, Garamond, or Minion Pro for body text. Avoid decorative fonts for body copy — save those for chapter headings and display text.</p>

<h3>Chapter Formatting</h3>
<p>Start each chapter on a new page. Use consistent heading styles, and consider adding a brief scene-break indicator (like a centered asterisk or ornamental divider) between scenes.</p>

<h3>Responsive Design</h3>
<p>eBooks need to look good on everything from a phone screen to a desktop monitor. Use relative sizing and avoid fixed-width layouts.</p>

<h3>The Table of Contents</h3>
<p>A clickable, well-formatted table of contents is essential for eBooks. It helps readers navigate and signals professionalism.</p>`,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=500&fit=crop",
    category: "Book Design",
    tags: ["formatting", "eBook design", "interior layout", "typography"],
    author: { name: "Nicole Patel", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", bio: "Book marketing strategist who has helped launch over 200 titles to bestseller status." },
    date: "2026-05-19",
    readTime: 9,
    viewCount: 2134,
    likeCount: 156,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "23",
    title: "Typography for Authors: A Beginner's Guide",
    slug: "typography-authors-beginners-guide",
    excerpt: "Understanding typography fundamentals helps you make better design decisions for your books.",
    content: `<h2>Typography Is Communication</h2>
<p>Typography isn't just about making text look pretty — it's about making text readable and conveying tone. The right typeface can make your book feel serious, playful, elegant, or urgent.</p>

<h3>Serif vs. Sans-Serif</h3>
<p>Serif fonts (with small decorative strokes) are traditional for book body text. Sans-serif fonts (without strokes) work well for headings and modern designs. The debate continues, but serif still dominates long-form reading.</p>

<h3>Kerning, Leading, and Tracking</h3>
<p>Kerning is the space between individual letters. Leading is the space between lines. Tracking is the overall letter spacing. Proper adjustments to these create comfortable, readable text.</p>

<h3>The 65-Character Rule</h3>
<p>The ideal line length for body text is 65-75 characters per line. Too short, and the eye jumps too often. Too long, and readers lose their place when moving to the next line.</p>`,
    coverImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=500&fit=crop",
    category: "Book Design",
    tags: ["typography", "design basics", "font selection", "readability"],
    author: { name: "Amanda Foster", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", bio: "Independent publisher and founder of IndiePress Consulting." },
    date: "2026-05-11",
    readTime: 7,
    viewCount: 1876,
    likeCount: 134,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Academic Publishing ─────────────────────────────
  {
    id: "24",
    title: "Publishing Your First Academic Book: A Step-by-Step Guide",
    slug: "publishing-first-academic-book-guide",
    excerpt: "From proposal to publication, here's everything you need to know about publishing an academic book.",
    content: `<h2>The Academic Publishing Journey</h2>
<p>Publishing an academic book is different from publishing trade nonfiction. The process is more structured, the standards are higher, and the timeline is longer — but the professional rewards are significant.</p>

<h3>Step 1: Develop Your Proposal</h3>
<p>Academic publishers want detailed proposals, not finished manuscripts. Your proposal should include a market analysis, chapter outline, sample chapters, and your CV.</p>

<h3>Step 2: Choose the Right Publisher</h3>
<p>Research publishers in your field. University presses are prestigious but slow. Commercial academic publishers like Routledge or Springer offer faster timelines and broader distribution.</p>

<h3>Step 3: Navigate Peer Review</h3>
<p>Most academic books go through peer review. This can take 3-6 months and may result in required revisions. Be open to feedback and patient with the process.</p>

<h3>Step 4: Production and Publication</h3>
<p>Once accepted, the production process takes 6-12 months. You'll work with developmental editors, copyeditors, and designers to produce a polished final product.</p>`,
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop",
    category: "Academic Publishing",
    tags: ["academic books", "university press", "peer review", "scholarly"],
    author: { name: "Thomas Grant", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", bio: "Publishing industry veteran with 20 years of experience in book distribution." },
    date: "2026-05-26",
    readTime: 12,
    viewCount: 1987,
    likeCount: 145,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "25",
    title: "Open Access vs. Traditional Publishing: Making the Right Choice",
    slug: "open-access-vs-traditional-publishing",
    excerpt: "The open access movement is changing academic publishing. Here's how to decide which model is right for your research.",
    content: `<h2>The Open Access Revolution</h2>
<p>Open access publishing makes research freely available to everyone. While this democratizes knowledge, it also raises questions about funding, quality, and career impact.</p>

<h3>Traditional Publishing Advantages</h3>
<p>Traditional academic publishers offer prestige, rigorous peer review, and established distribution. For tenure-track faculty, publication in respected journals and presses remains crucial.</p>

<h3>Open Access Advantages</h3>
<p>Open access articles receive more citations, have broader reach, and contribute to public knowledge. Many funding agencies now require open access publication for funded research.</p>

<h3>The Cost Consideration</h3>
<p>Open access often requires article processing charges (APCs) ranging from $1,000-5,000. Some institutions have agreements with publishers that cover these costs.</p>

<h3>Making Your Decision</h3>
<p>Consider your career stage, funding requirements, and goals. Early-career researchers may benefit from traditional prestige, while established scholars can afford the open access route.</p>`,
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop",
    category: "Academic Publishing",
    tags: ["open access", "academic journals", "research publishing", "APC"],
    author: { name: "Elena Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", bio: "Author of three bestselling novels and founder of the 90-Day Novel Workshop." },
    date: "2026-05-13",
    readTime: 10,
    viewCount: 1654,
    likeCount: 123,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "26",
    title: "Writing a Compelling Academic Book Proposal",
    slug: "writing-compelling-academic-book-proposal",
    excerpt: "Your book proposal is your first impression with publishers. Make it count with these proven strategies.",
    content: `<h2>Anatomy of a Winning Proposal</h2>
<p>An academic book proposal is a business document. It needs to convince editors and peer reviewers that your book deserves to exist and will find an audience.</p>

<h3>The Market Analysis</h3>
<p>Identify competing books and explain how yours is different. Don't just list competitors — analyze their weaknesses and show how your work fills a gap.</p>

<h3>Chapter Outline</h3>
<p>Each chapter should have a clear description, key arguments, and word count estimate. This shows the editor that you've planned the book thoroughly.</p>

<h3>Sample Chapters</h3>
<p>Include 2-3 polished chapters that showcase your writing and argumentation. Choose chapters that demonstrate the book's range and depth.</p>

<h3>Your Credentials</h3>
<p>Explain why you're the right person to write this book. Relevant publications, research experience, and professional credentials all strengthen your proposal.</p>`,
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop",
    category: "Academic Publishing",
    tags: ["book proposal", "academic writing", "publisher pitch"],
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", bio: "Bestselling author and writing coach with 15 years of experience helping writers craft compelling narratives." },
    date: "2026-05-05",
    readTime: 9,
    viewCount: 1432,
    likeCount: 98,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Research & Journals ─────────────────────────────
  {
    id: "27",
    title: "Navigating the Journal Submission Process",
    slug: "navigating-journal-submission-process",
    excerpt: "From choosing the right journal to handling rejection, here's a comprehensive guide to getting published in academic journals.",
    content: `<h2>The Journal Publishing Landscape</h2>
<p>Getting published in a reputable academic journal is a milestone for any researcher. Understanding the process reduces frustration and increases your chances of acceptance.</p>

<h3>Choosing the Right Journal</h3>
<p>Match your paper to the journal's scope, impact factor, and audience. A perfectly good paper can be rejected simply because it's submitted to the wrong journal.</p>

<h3>Preparing Your Manuscript</h3>
<p>Follow the journal's submission guidelines exactly. Format your references correctly, include all required sections, and write a compelling abstract that captures the essence of your research.</p>

<h3>The Peer Review Process</h3>
<p>Peer review typically takes 2-6 months. Reviewers will provide detailed feedback — some constructive, some confusing. Address all comments thoroughly in your revision.</p>

<h3>Handling Rejection</h3>
<p>Rejection is normal. Even top researchers face it regularly. Read the feedback, improve your paper, and submit to another journal. Persistence pays off in academic publishing.</p>`,
    coverImage: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&h=500&fit=crop",
    category: "Research & Journals",
    tags: ["journal submission", "peer review", "academic publishing"],
    author: { name: "James Mitchell", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", bio: "Self-publishing consultant and author of 'The Indie Author's Complete Guide.'" },
    date: "2026-05-23",
    readTime: 11,
    viewCount: 2345,
    likeCount: 178,
    commentCount: 4,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "28",
    title: "Research Data Management: Best Practices for Academic Authors",
    slug: "research-data-management-best-practices",
    excerpt: "Proper data management is essential for reproducibility and increasingly required by journals and funders.",
    content: `<h2>Why Data Management Matters</h2>
<p>Research data management isn't just about organization — it's about reproducibility, compliance, and the long-term value of your work. Funders and journals increasingly require data availability statements.</p>

<h3>Organize from the Start</h3>
<p>Create a clear folder structure before you begin collecting data. Use consistent file naming conventions and maintain a data dictionary that explains your variables and codes.</p>

<h3>Version Control</h3>
<p>Track changes to your data files just as you would with your manuscript. Tools like Git or DVC (Data Version Control) help you maintain a complete history of your data.</p>

<h3>Data Sharing</h3>
<p>Many journals now require data to be deposited in public repositories. Plan for this from the beginning by choosing appropriate repositories for your data type.</p>

<h3>Long-term Preservation</h3>
<p>Consider the long-term accessibility of your data. Use open file formats, document your methods thoroughly, and ensure someone else could understand and use your data years from now.</p>`,
    coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168d9c?w=800&h=500&fit=crop",
    category: "Research & Journals",
    tags: ["data management", "reproducibility", "research practices"],
    author: { name: "Jordan Blake", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face", bio: "Digital marketing specialist focused on author brand building and social media strategy." },
    date: "2026-05-07",
    readTime: 8,
    viewCount: 1543,
    likeCount: 112,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },

  // ── Digital Publishing ──────────────────────────────
  {
    id: "29",
    title: "The Complete Guide to Audiobook Production in 2026",
    slug: "complete-guide-audiobook-production-2026",
    excerpt: "Audiobooks are the fastest-growing segment in publishing. Here's how to produce a professional audiobook.",
    content: `<h2>The Audio Revolution</h2>
<p>Audiobook revenue surpassed $2 billion in 2025 and continues to grow. Authors who ignore audio are missing a massive opportunity to reach new readers.</p>

<h3>Option 1: Professional Narration</h3>
<p>Hiring a professional narrator costs $200-400 per finished hour. A typical 8-hour audiobook costs $1,600-3,200. The investment is worth it for quality and distribution access.</p>

<h3>Option 2: ACX (Audiobook Creation Exchange)</h3>
<p>ACX connects authors with narrators and handles distribution to Audible, Apple Books, and Amazon. You can pay upfront or split royalties with your narrator.</p>

<h3>Option 3: DIY Narration</h3>
<p>If you narrate your own book, invest in a quality microphone ($200-500), sound treatment, and editing software. Practice reading aloud before recording.</p>

<h3>Distribution</h3>
<p>Through ACX, your audiobook reaches Audible, Apple Books, and Amazon. For wider distribution, consider Findaway Voices, which reaches 40+ platforms.</p>`,
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231cb64?w=800&h=500&fit=crop",
    category: "Digital Publishing",
    tags: ["audiobook", "production", "ACX", "narration"],
    author: { name: "Marcus Williams", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", bio: "Screenwriter and novelist whose works have been adapted for film and television." },
    date: "2026-06-01",
    readTime: 13,
    viewCount: 4567,
    likeCount: 345,
    commentCount: 5,
    isFeatured: true,
    isEditorsPick: true,
  },
  {
    id: "30",
    title: "eBook Formatting: Ensuring Your Book Looks Great on Every Device",
    slug: "ebook-formatting-every-device",
    excerpt: "From Kindle to iPad to Kobo, your eBook needs to look perfect everywhere. Here's how to achieve device-agnostic formatting.",
    content: `<h2>The Multi-Device Challenge</h2>
<p>Readers access eBooks on everything from smartphones to large tablets. Your formatting needs to adapt gracefully to all screen sizes and reading apps.</p>

<h3>EPUB vs. MOBI vs. KF8</h3>
<p>EPUB is the universal standard, supported by most devices except older Kindles. MOBI is Amazon's legacy format. KF8 (Kindle Format 8) is Amazon's current standard with advanced features.</p>

<h3>Reflowable vs. Fixed Layout</h3>
<p>Most fiction and non-fiction should use reflowable layout, which adapts to screen size and user font preferences. Fixed layout is only for illustrated books where precise positioning matters.</p>

<h3>Testing Your eBook</h3>
<p>Test on multiple devices and apps: Kindle (phone, tablet, desktop), Apple Books, Kobo, and Google Play Books. Each renders slightly differently.</p>

<h3>Common Formatting Pitfalls</h3>
<p>Avoid images that don't scale, nested tables, complex layouts, and proprietary fonts. Keep it simple and let the content shine.</p>`,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop",
    category: "Digital Publishing",
    tags: ["eBook formatting", "EPUB", "Kindle", "digital formats"],
    author: { name: "Rachel Kim", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", bio: "Data-driven publishing consultant specializing in book marketing and pricing strategy." },
    date: "2026-05-21",
    readTime: 9,
    viewCount: 2876,
    likeCount: 213,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
  {
    id: "31",
    title: "Distributing Your eBook Globally: Platforms and Strategies",
    slug: "distributing-ebook-globally-platforms",
    excerpt: "Reach readers around the world with the right distribution strategy. Here's a comprehensive guide to global eBook distribution.",
    content: `<h2>Thinking Global</h2>
<p>The English-language eBook market extends far beyond the US and UK. India, Australia, Canada, and emerging markets represent significant growth opportunities.</p>

<h3>Amazon KDP</h3>
<p>KDP reaches 13 Amazon marketplaces worldwide. You can set pricing for each market individually, and Amazon handles currency conversion. KDP Select offers additional promotional tools but requires exclusivity.</p>

<h3>Going Wide</h3>
<p>Draft2Digital, PublishDrive, and StreetLib distribute to dozens of retailers globally. Going wide means your book is available on Apple Books, Kobo, Barnes & Noble, Google Play, and hundreds of smaller retailers.</p>

<h3>Direct Sales</h3>
<p>Selling through your website using platforms like Payhip, Gumroad, or Shopify lets you keep 95-100% of revenue. The trade-off is that you handle all marketing and customer service.</p>

<h3>Pricing Strategy</h3>
<p>Research pricing norms in different markets. What works in the US may be too expensive for India or too cheap for Australia. Localization matters.</p>`,
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop",
    category: "Digital Publishing",
    tags: ["distribution", "global", "eBook retailers", "going wide"],
    author: { name: "Thomas Grant", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", bio: "Publishing industry veteran with 20 years of experience in book distribution." },
    date: "2026-05-09",
    readTime: 10,
    viewCount: 1987,
    likeCount: 145,
    commentCount: 3,
    isFeatured: false,
    isEditorsPick: false,
  },
];

export const allAuthors = [
  { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", bio: "Bestselling author and writing coach with 15 years of experience helping writers craft compelling narratives." },
  { name: "Marcus Williams", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", bio: "Screenwriter and novelist whose works have been adapted for film and television." },
  { name: "Elena Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", bio: "Author of three bestselling novels and founder of the 90-Day Novel Workshop." },
  { name: "David Okafor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", bio: "Literary fiction author and creative writing professor at Columbia University." },
  { name: "James Mitchell", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", bio: "Self-publishing consultant and author of 'The Indie Author's Complete Guide.'" },
  { name: "Amanda Foster", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", bio: "Independent publisher and founder of IndiePress Consulting." },
  { name: "Rachel Kim", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", bio: "Data-driven publishing consultant specializing in book marketing and pricing strategy." },
  { name: "Thomas Grant", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", bio: "Publishing industry veteran with 20 years of experience in book distribution." },
  { name: "Nicole Patel", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", bio: "Book marketing strategist who has helped launch over 200 titles to bestseller status." },
  { name: "Jordan Blake", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face", bio: "Digital marketing specialist focused on author brand building and social media strategy." },
];

export const sampleComments: Record<string, BlogComment[]> = {
  "1": [
    { id: "c1", author: "Emily Hart", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", date: "2026-06-05", content: "The 'but/therefore' method is a game-changer. I've been using 'and then' for years and wondering why my pacing felt flat. This completely reframed how I approach scene transitions.", likes: 12 },
    { id: "c2", author: "Ryan Torres", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", date: "2026-06-05", content: "Great article! I'd add that starting in medias res doesn't mean you need action or danger. You can start in the middle of an emotional moment — a decision, a realization, a conversation. The key is tension, not explosions.", likes: 8 },
    { id: "c3", author: "Lisa Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", date: "2026-06-06", content: "I teach creative writing and I'm sharing this with my students. The Toni Morrison example is perfect for showing how mystery in the opening line creates an instant hook.", likes: 15 },
  ],
  "5": [
    { id: "c4", author: "Michael Brooks", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", date: "2026-06-01", content: "This is the most comprehensive self-publishing guide I've read. The section on cover design is especially important — I've seen so many great books fail because of amateur covers.", likes: 23 },
    { id: "c5", author: "Jennifer Walsh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", date: "2026-06-02", content: "I'd add that beta readers are invaluable before professional editing. They catch story issues that editors might miss because they're focused on the reader experience.", likes: 17 },
    { id: "c6", author: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face", date: "2026-06-02", content: "The budget breakdown is really helpful. I'd budget even more for marketing though — at least $500-1,000 for launch promotions. The book is only half the battle.", likes: 11 },
  ],
  "15": [
    { id: "c7", author: "Dr. Amanda Lewis", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", date: "2026-06-06", content: "Finally, a balanced take on AI in publishing. The key point about disclosure is crucial. Readers deserve to know when AI was involved in creating content.", likes: 19 },
    { id: "c8", author: "Kevin Park", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", date: "2026-06-06", content: "I use AI tools for first-pass editing and they're incredible for catching typos and suggesting word alternatives. But they still can't understand story structure the way a human editor can.", likes: 14 },
    { id: "c9", author: "Maria Santos", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face", date: "2026-06-07", content: "The section on AI in marketing is really practical. I've been using AI-generated ad copy and the results are mixed — it's a starting point but always needs a human touch.", likes: 9 },
  ],
};

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === categorySlug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.isFeatured);
}

export function getEditorsPicks(): BlogPost[] {
  return blogPosts.filter((p) => p.isEditorsPick);
}

export function getTrendingPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8);
}

export function getRecentPosts(count: number = 6): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, count);
}

export function getRelatedPosts(post: BlogPost, count: number = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, count);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
