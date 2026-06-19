import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const AUTHOR_NAMES: string[] = [
  "Adebayo Ogundimu", "Chinwe Eze", "Emeka Nwosu", "Fatima Abubakar",
  "Grace Okafor", "Hassan Aliyu", "Ifeanyi Chukwu", "Jumoke Adeyemi",
  "Kemi Oladipo", "Lukman Ibrahim", "Mfoniso Udo", "Ngozi Okonkwo",
  "Obinna Eze", "Precious Abiodun", "Rashidat Bello", "Sade Williams",
  "Tunde Bakare", "Uche Nnamdi", "Vivian Okoro", "Yusuf Abdullahi",
  "Zainab Mohammed", "Abiodun Akindele", "Blessing Okadigbo", "Chidi Nwachukwu",
  "Doris Uche", "Eunice Ogunleye", "Felix Oyekanmi", "Gloria Nwankwo",
  "Henry Adewale", "Ibukunoluwa Taiwo", "James Okorie", "Kubra Suleiman",
  "Lekan Oyediran", "Maryam Bello", "Nnamdi Azikiwe", "Omolara Adesanya",
  "Peter Okafor", "Remi Ogunbiyi", "Sola Ajayi", "Titi Afolabi",
  "Udo Essien", "Victoria Nwosu", "Wale Balogun", "Yetunde Lawal",
  "Zubairu Musa", "Adaeze Okoli", "Bolaji Adekunle", "Chiamaka Obi",
  "David Oluwaseun", "Esther Ogundipe", "Franklin Okafor", "Halima Balarabe",
  "Ifeoma Nnadi", "Jide Sanusi", "Kehinde Olaniyan", "Lara Fashola",
  "Moses Etim", "Nneka Igwe", "Olaoluwa Fadare", "Priscilla Ojo",
  "Rotimi Amaechi", "Shade Oyelaran", "Tochukwu Ikenna", "Ucheoma Chinedu",
  "Victor Adeleke", "Wunmi Bankole", "Xavier Ogbolu", "Yemi Osinbajo",
  "Zara Abdullahi", "Afolabi Ogundipe", "Bukola Olanrewaju", "Chika Onyekachi",
  "Daniel Oluwole", "Elizabeth Oyewumi", "Femi Akinola", "Grace Ogundimu",
  "Ibrahim Suleiman", "Joy Nwachukwu", "Kenneth Ogbueze", "Lydia Okonkwo",
  "Michael Ezeugo", "Nkiru Nwosu", "Oluwatosin Bakare", "Patience Okafor",
  "Sunday Adewale", "Titilayo Ogunyemi", "Umar Faruk", "Vivian Ojiaku",
  "Williams Akinwale", "Yakubu Musa", "Amara Obiora", "Babatunde Olatunde",
  "Cecilia Nwankwo", "Damilola Ogunleye", "Emmanuel Okadigbo", "Folake Oyedele",
  "Gideon Nwachukwu", "Hauwa Bello", "Isaac Oyekan", "Janet Igwe",
  "Kunle Adeleke", "Lilian Okafor", "Musa Abubakar", "Ngozika Eze",
  "Olumide Oyelaran", "Priscilla Ogbueze", "Raphael Okolo", "Stella Oluwole",
  "Tunde Ogunbiyi", "Uchenna Nwosu", "Vivian Olatunde", "Wale Akindele",
  "Xena Ogbolu", "Yusuf Lawal", "Zainab Oyewole", "Adebisi Olowogboyega",
  "Blessing Ozonuwe", "Chinedu Okeke", "Doris Okorie", "Ebenezer Olatunde",
  "Folashade Bankole", "Godwin Okafor", "Happiness Okadigbo", "Ifeanyichukwu Okafor",
  "Jumai Suleiman", "Kayode Oyelaran", "Linda Nwachukwu", "Mojisola Ogunbiyi",
  "Nwachukwu Obiora", "Olufunke Oyedele", "Patrick Eze", "Rachael Okonkwo",
  "Samuel Olatunji", "Temitope Ogunleye", "Udochukwu Nwosu", "Veronica Okafor",
  "Wisdom Olowo", "Yewande Oyediran", "Zacheaus Ogunyemi", "Adebola Ojo",
  "Bolarinwa Akinola", "Chioma Ezeugo", "Daniel Olowu", "Elizabeth Ogundipe",
  "Felix Akindele", "Gloria Nwosu", "Henry Ogbueze", "Ifeoma Okechukwu",
  "Joseph Olatunde", "Kemi Oladipo", "Lukman Yusuf", "Mary Ajayi",
  "Nelson Nnamdi", "Olufisayo Oyekan", "Patience Ogunleye", "Richard Eze",
  "Sade Olatunji", "Tunde Ogunbiyi", "Uche Okoli", "Victoria Nwankwo",
  "Wale Oyediran", "Yemi Ogundipe", "Zainab Lawal", "Adebayo Olatunde",
  "Bimpe Oyewole", "Chibueze Okafor", "Doris Ogunyemi", "Emeka Nnamdi",
  "Funmilayo Olatunji", "Gideon Oyekan", "Halima Abubakar", "Ifeanyi Okafor",
  "Josephine Ogundipe", "Kayode Olatunde", "Lydia Obiora", "Michael Ogunleye",
  "Ngozi Eze", "Oluwaseun Bakare", "Priscilla Nwosu", "Sunday Okafor",
  "Titilola Oyelaran", "Udo Ekpo", "Victoria Olatunji", "Williams Akinwunmi",
  "Yewande Ogundipe", "Zubairu Abdullahi", "Adaeze Obi", "Babatunde Oke",
  "Chinwe Nwachukwu", "David Olatunji", "Esther Okafor",
];

interface CategoryDef {
  name: string;
  count: number;
  subcategories: string[];
}

const CATEGORIES: CategoryDef[] = [
  { name: "Business & Entrepreneurship", count: 28, subcategories: ["Startups", "Management", "Strategy", "Innovation", "Small Business"] },
  { name: "Personal Finance", count: 23, subcategories: ["Investing", "Budgeting", "Wealth Building", "Retirement", "Debt Management"] },
  { name: "Leadership", count: 23, subcategories: ["Executive", "Transformational", "Servant Leadership", "Team Building", "Vision"] },
  { name: "Self Development", count: 28, subcategories: ["Mindset", "Habits", "Confidence", "Emotional Intelligence", "Goal Setting"] },
  { name: "Productivity", count: 18, subcategories: ["Time Management", "Focus", "Systems", "Automation", "Delegation"] },
  { name: "Technology", count: 18, subcategories: ["AI", "Cybersecurity", "Software Development", "Digital Innovation", "Data Science"] },
  { name: "Marketing", count: 13, subcategories: ["Digital Marketing", "Branding", "Social Media", "Content Strategy", "SEO"] },
  { name: "Health & Wellness", count: 18, subcategories: ["Fitness", "Nutrition", "Mental Health", "Yoga", "Wellness"] },
  { name: "Religion & Inspiration", count: 23, subcategories: ["Faith", "Devotional", "Christian Living", "Prayer", "Spiritual Growth"] },
  { name: "Biography", count: 13, subcategories: ["Political", "Business", "Cultural", "Sports", "Historical"] },
  { name: "Memoir", count: 13, subcategories: ["Personal Growth", "Travel", "Family", "Career", "Adventure"] },
  { name: "Romance", count: 18, subcategories: ["Contemporary", "Historical", "Romantic Suspense", "New Adult", "Paranormal"] },
  { name: "Mystery", count: 13, subcategories: ["Crime", "Detective", "Cozy Mystery", "Psychological", "Legal"] },
  { name: "Thriller", count: 13, subcategories: ["Political", "Psychological", "Medical", "Action", "Espionage"] },
  { name: "Science Fiction", count: 10, subcategories: ["Dystopian", "Space Opera", "Cyberpunk", "Time Travel", "Hard SF"] },
  { name: "Fantasy", count: 10, subcategories: ["Epic", "Urban", "Dark", "Historical", "Mythological"] },
  { name: "Children's Books", count: 14, subcategories: ["Picture Books", "Middle Grade", "Early Readers", "Chapter Books", "Educational"] },
  { name: "Young Adult", count: 14, subcategories: ["Contemporary", "Fantasy", "Sci-Fi", "Romance", "Dystopian"] },
  { name: "Education", count: 18, subcategories: ["Pedagogy", "Curriculum", "Special Education", "Higher Ed", "Online Learning"] },
  { name: "Academic", count: 14, subcategories: ["Research", "Theory", "Methodology", "Analysis", "Reference"] },
  { name: "Poetry", count: 10, subcategories: ["Contemporary", "Classic", "Spoken Word", "Anthology", "Haiku"] },
  { name: "Cookbooks", count: 10, subcategories: ["Nigerian Cuisine", "Baking", "Healthy Cooking", "Vegan", "International"] },
  { name: "Travel", count: 10, subcategories: ["African Travel", "Guide Books", "Memoirs", "Cultural", "Adventure"] },
  { name: "History", count: 15, subcategories: ["African History", "World History", "Colonial", "Pre-Colonial", "Modern"] },
];

const BOOK_TITLES: string[] = [
  "The Art of Leadership", "Rich Dad's Journey", "Breaking Boundaries",
  "The Nigerian Dream", "Digital Transformation", "Faith and Purpose",
  "Wealth Without Limits", "The Power of Vision", "Rising Above",
  "Entrepreneurial Mindset", "The Financial Blueprint", "Leading with Heart",
  "Unstoppable Growth", "Code of Success", "Marketing Mastery",
  "The Wellness Code", "Spirit of Excellence", "A Life Unveiled",
  "Journey to Greatness", "The Innovation Playbook", "Mastering Finance",
  "Beyond the Horizon", "Purpose Driven Life", "The Resilient Mind",
  "Smart Money Moves", "The CEO's Handbook", "Winning Strategies",
  "The African Renaissance", "Future of Work", "Digital Nigeria",
  "Faith in Action", "The Complete Guide to Startups", "Leadership Lessons",
  "The Wealth Creator", "Building an Empire", "The Productivity System",
  "Data-Driven Decisions", "The Brand Builder", "Holistic Health",
  "Walking in Purpose", "Stories from Lagos", "The Midnight Garden",
  "Love in Abuja", "The Last Algorithm", "Whispers of the Savanna",
  "The Hidden Kingdom", "Tales of the Marketplace", "Dreams of Tomorrow",
  "The Courage Within", "Nigerian Giants", "Heart of Gold",
  "The Digital Frontier", "Shadows and Light", "The Great Escape",
  "Echoes of Heritage", "The Power Couple", "Destiny's Path",
  "Financial Freedom Blueprint", "The Art of Negotiation", "Hustle Smart",
  "The Balanced Life", "Mindful Leadership", "The Storyteller's Voice",
  "From Lagos to London", "The Silent Partner", "Embracing Change",
  "The Courage to Lead", "Redefining Success", "The Next Chapter",
  "Beyond Boardrooms", "The Creative Spark", "Living Intentionally",
  "The Mentor's Guide", "Legacy of Hope", "Rising Tide",
  "The Complete Entrepreneur", "Profit with Purpose", "Scaling Heights",
  "The Innovation Mindset", "Digital Mastery", "Code Red",
  "The Art of War for Business", "Wealth Tactics", "The Leadership Code",
  "Breaking the Ceiling", "The Finance Bible", "Mind Over Money",
  "The Wellness Journey", "Spirit-Led Living", "A Mother's Strength",
  "The Young Mogul", "Global Vision", "Tech for Good",
  "The Marketing Playbook", "Brand Authority", "Social Impact",
  "The Healing Power", "Walking by Faith", "Chronicles of Change",
  "The Negotiator", "Power Play", "The Game Changer",
  "Nigeria Rising", "The New Economy", "Future Forward",
  "The Digital Playbook", "Cyber Shield", "Blockchain Revolution",
  "The AI Revolution", "Smart Investing", "Crypto Basics",
  "The Real Estate Game", "Passive Income Secrets", "The Money Mindset",
  "Financial Intelligence", "The Savings Strategy", "Debt-Free Living",
  "Investing 101", "The Wealthy Mind", "Retirement Planning",
  "The Bold Leader", "Servant at Heart", "Visionary Leadership",
  "The Team Builder", "Executive Presence", "Leading Change",
  "The Influencer", "Power of Influence", "The Changemaker",
  "Habit Stacking", "The Focus Formula", "Deep Work Mastery",
  "Time Architecture", "The Systems Approach", "Automate Everything",
  "The Delegation Guide", "Peak Performance", "The Success Habit",
  "Atomic Productivity", "The Concentration Code", "Flow State",
  "The Organized Mind", "Efficiency Expert", "The Time Matrix",
  "Machine Learning Basics", "The AI Playbook", "Neural Networks",
  "Cybersecurity Now", "The Hacker's Defense", "Secure by Design",
  "Clean Code", "The Developer's Guide", "Full Stack Mastery",
  "Data Science Basics", "The Analytics Edge", "Python for Everyone",
  "Cloud Computing", "The DevOps Way", "Microservices Patterns",
  "Digital Marketing Guide", "SEO Mastery", "Content is King",
  "Social Media Strategy", "Brand Building 101", "The Copywriter's Handbook",
  "Fitness for Life", "Nutrition Essentials", "Mental Health Matters",
  "Yoga Basics", "The Wellness Blueprint", "Holistic Living",
  "Faith Foundations", "Daily Devotional", "The Prayer Journal",
  "Christian Living Guide", "Spiritual Warfare", "The Believer's Walk",
  "The Good Life", "Walking with God", "Grace Upon Grace",
  "A Father's Legacy", "Mother's Strength", "The Family Circle",
  "The Patriarch", "A Life Well Lived", "Through the Fire",
  "The Unlikely Hero", "My Story", "The Journey Home",
  "Wings of Hope", "The Survivor", "Finding My Voice",
  "The Love Connection", "Lagos Love Story", "Heartstrings",
  "The Proposal", "Forever Yours", "Love Actually",
  "The Detective's Case", "Murder on the Island", "The Missing Piece",
  "The Silent Witness", "Cold Blood", "The Alibi",
  "The Conspiracy", "The Last Witness", "Mind Games",
  "The Double Agent", "Blackout", "The Hostage",
  "Zero Day", "The Operative", "Terminal Velocity",
  "Galactic Wars", "The Star Voyager", "Beyond the Stars",
  "The Time Keeper", "Neon Dreams", "Quantum Break",
  "The Dragon's Lair", "The Mage's Quest", "Enchanted Forest",
  "The Lost Prince", "Shadow Realm", "Mythical Journey",
  "The Picture Book", "Bedtime Stories", "The Little Explorer",
  "My First ABC", "The Zoo Adventure", "Tiny Tales",
  "The Teen Diaries", "Young and Bold", "The Summer Job",
  "First Love", "The Camp Chronicles", "Growing Up",
  "Teaching Methods", "The Classroom Guide", "Education Today",
  "Learning Theory", "The Research Handbook", "Academic Writing",
  "Poetry Collection", "Words of Fire", "The Spoken Word",
  "Nigerian Cookbook", "The Chef's Table", "Healthy Plates",
  "Lagos Eats", "Travel Africa", "The Wanderer",
  "African Legends", "The History Maker", "Chronicles of Time",
  "The Art of Strategy", "Wealth Creation", "Business Mastery",
  "The Creative Mind", "Beyond Limits", "The Power of Habit",
  "Emotional Mastery", "The Confident Leader", "Goal Digger",
  "The Success Principle", "Mind Power", "The Achievement Formula",
  "The Wealth Code", "Money Matters", "The Rich Mindset",
];

const DESCRIPTIONS: string[] = [
  "A comprehensive guide to achieving success in the modern world.",
  "An inspiring story of resilience and determination against all odds.",
  "Practical strategies for building wealth and financial independence.",
  "A thought-provoking exploration of leadership in the 21st century.",
  "The definitive guide to transforming your life and career.",
  "Insights from leading entrepreneurs on building sustainable businesses.",
  "A powerful narrative about overcoming obstacles and finding purpose.",
  "Essential reading for anyone seeking to master their craft.",
  "A groundbreaking approach to personal and professional development.",
  "Lessons learned from the frontlines of innovation and disruption.",
  "A compelling look at the future of work and technology.",
  "Strategies for thriving in an increasingly complex world.",
  "A guide to unlocking your potential and achieving greatness.",
  "Real-world advice for navigating the challenges of modern life.",
  "An empowering journey of self-discovery and transformation.",
  "Proven methods for building lasting success and meaningful impact.",
  "A fresh perspective on leadership, creativity, and collaboration.",
  "The ultimate playbook for entrepreneurs and business leaders.",
  "Inspiring stories of ordinary people achieving extraordinary results.",
  "A practical guide to mastering the art of communication.",
];

type BookFormat = "EBOOK" | "PAPERBACK" | "HARDCOVER" | "AUDIOBOOK";
const FORMAT_POOL: BookFormat[] = [
  "EBOOK", "EBOOK", "EBOOK", "EBOOK",
  "PAPERBACK", "PAPERBACK", "PAPERBACK",
  "HARDCOVER", "HARDCOVER",
  "AUDIOBOOK",
];

type BookStatus = "PUBLISHED" | "SUBMITTED" | "DRAFT" | "REJECTED" | "ARCHIVED";

interface DemoBook {
  id: string;
  title: string;
  slug: string;
  isbn: string;
  status: BookStatus;
  price: number;
  format: BookFormat;
  publicationDate: string;
  coverImage: string | null;
  rejectionReason: string | null;
  category: string;
  subcategory: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  sales: number;
  rating: number;
  description: string;
  pages: number;
  language: string;
  isPublic: boolean;
  views: number;
  downloads: number;
  revenue: number;
  createdAt: string;
}

function buildDemoBooks(): DemoBook[] {
  const seed = 20250615;
  const rand = seededRandom(seed);
  const books: DemoBook[] = [];

  let bookIndex = 0;
  let titleIdx = 0;

  for (const cat of CATEGORIES) {
    for (let j = 0; j < cat.count; j++) {
      bookIndex++;
      let status: BookStatus = "PUBLISHED";
      let rejectionReason: string | null = null;
      if (bookIndex > 382 && bookIndex <= 387) {
        status = "SUBMITTED";
      } else if (bookIndex > 377 && bookIndex <= 382) {
        status = "DRAFT";
      } else if (bookIndex > 374 && bookIndex <= 377) {
        status = "REJECTED";
        rejectionReason = "Needs significant revision before publication. Content quality does not meet our standards.";
      } else if (bookIndex > 369 && bookIndex <= 374) {
        status = "ARCHIVED";
      }

      const authorIdx = bookIndex % AUTHOR_NAMES.length;
      const authorName = AUTHOR_NAMES[authorIdx];
      const authorSlug = authorName.toLowerCase().replace(/\s+/g, ".");
      const title = BOOK_TITLES[titleIdx % BOOK_TITLES.length];
      titleIdx++;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const format = FORMAT_POOL[Math.floor(rand() * FORMAT_POOL.length)];
      const year = 2020 + Math.floor(rand() * 6);
      const month = 1 + Math.floor(rand() * 12);
      const day = 1 + Math.floor(rand() * 28);
      const priceNaira = 2000 + Math.floor(rand() * 23001);
      const isbnD1 = 10000 + Math.floor(rand() * 90000);
      const isbnD2 = 100 + Math.floor(rand() * 900);
      const isbnD3 = Math.floor(rand() * 10);
      const salesRaw = rand();
      let sales: number;
      if (salesRaw < 0.05) {
        sales = 1000 + Math.floor(rand() * 4001);
      } else if (salesRaw < 0.3) {
        sales = 500 + Math.floor(rand() * 501);
      } else if (salesRaw < 0.7) {
        sales = 100 + Math.floor(rand() * 401);
      } else {
        sales = 5 + Math.floor(rand() * 96);
      }
      const ratingBase = 3.5 + rand() * 1.3;
      const rating = Math.round(Math.min(5, Math.max(3, ratingBase)) * 10) / 10;
      const pages = 150 + Math.floor(rand() * 451);
      const subIdx = j % cat.subcategories.length;
      const subcategory = cat.subcategories[subIdx];
      const descIdx = Math.floor(rand() * DESCRIPTIONS.length);

      const views = Math.floor(sales * (3 + rand() * 12));
      const downloads = Math.floor(sales * (0.2 + rand() * 0.8));
      const revenue = Math.floor(sales * (priceNaira / 100) * (0.6 + rand() * 0.4));

      books.push({
        id: `demo-book-${bookIndex}`,
        title,
        slug,
        isbn: `978-${isbnD1}-${isbnD2}-${isbnD3}`,
        status,
        price: priceNaira * 100,
        format,
        publicationDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        coverImage: null,
        rejectionReason,
        category: cat.name,
        subcategory,
        authorId: `demo-author-${authorIdx + 1}`,
        authorName,
        authorEmail: `${authorSlug}@example.com`,
        sales,
        rating,
        description: DESCRIPTIONS[descIdx],
        pages,
        language: "English",
        isPublic: status === "PUBLISHED",
        views,
        downloads,
        revenue,
        createdAt: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00.000Z`,
      });
    }
  }

  // Add 25 recent books with dates from last 7, 30, 60 days
  const now = new Date();
  const recentBookDefs = [
    { title: "The Resilient Mind: Overcoming Adversity in Modern Africa", author: "Adebayo Ogundimu", category: "Self Development", daysAgo: 3, sales: 142, revenue: 284000, views: 1850, downloads: 89, format: "EBOOK" as BookFormat },
    { title: "Digital Nigeria: The Future of Tech Entrepreneurship", author: "Chinwe Eze", category: "Technology", daysAgo: 5, sales: 87, revenue: 174000, views: 1200, downloads: 54, format: "PAPERBACK" as BookFormat },
    { title: "From Lagos to London: A Memoir of Ambition", author: "Emeka Nwosu", category: "Memoir", daysAgo: 7, sales: 231, revenue: 462000, views: 3200, downloads: 134, format: "HARDCOVER" as BookFormat },
    { title: "Wealth Building for the Next Generation", author: "Fatima Abubakar", category: "Personal Finance", daysAgo: 10, sales: 198, revenue: 396000, views: 2600, downloads: 112, format: "EBOOK" as BookFormat },
    { title: "Leadership in Uncertain Times", author: "Grace Okafor", category: "Leadership", daysAgo: 12, sales: 156, revenue: 312000, views: 2100, downloads: 95, format: "PAPERBACK" as BookFormat },
    { title: "The Art of Business Strategy", author: "Hassan Aliyu", category: "Business & Entrepreneurship", daysAgo: 14, sales: 312, revenue: 624000, views: 4100, downloads: 187, format: "EBOOK" as BookFormat },
    { title: "Faith, Hope, and Purpose: A Spiritual Journey", author: "Ifeanyi Chukwu", category: "Religion & Inspiration", daysAgo: 16, sales: 89, revenue: 178000, views: 1100, downloads: 52, format: "PAPERBACK" as BookFormat },
    { title: "Marketing Mastery: Digital Strategies That Work", author: "Jumoke Adeyemi", category: "Marketing", daysAgo: 18, sales: 267, revenue: 534000, views: 3500, downloads: 156, format: "EBOOK" as BookFormat },
    { title: "The Productivity Revolution: Do More, Stress Less", author: "Kemi Oladipo", category: "Productivity", daysAgo: 20, sales: 178, revenue: 356000, views: 2300, downloads: 108, format: "HARDCOVER" as BookFormat },
    { title: "Nigerian Recipes for Every Occasion", author: "Lukman Ibrahim", category: "Cookbooks", daysAgo: 22, sales: 345, revenue: 690000, views: 4800, downloads: 201, format: "PAPERBACK" as BookFormat },
    { title: "The Complete Guide to African Literature", author: "Mfoniso Udo", category: "Academic", daysAgo: 24, sales: 67, revenue: 134000, views: 890, downloads: 41, format: "EBOOK" as BookFormat },
    { title: "Health and Wellness: An African Perspective", author: "Ngozi Okonkwo", category: "Health & Wellness", daysAgo: 26, sales: 123, revenue: 246000, views: 1650, downloads: 76, format: "EBOOK" as BookFormat },
    { title: "Beyond the Horizon: A Travel Memoir", author: "Obinna Eze", category: "Travel", daysAgo: 28, sales: 89, revenue: 178000, views: 1200, downloads: 55, format: "PAPERBACK" as BookFormat },
    { title: "The Education Revolution: Rethinking Learning", author: "Precious Abiodun", category: "Education", daysAgo: 30, sales: 156, revenue: 312000, views: 2100, downloads: 94, format: "EBOOK" as BookFormat },
    { title: "Mysteries of the Niger Delta", author: "Rashidat Bello", category: "Mystery", daysAgo: 35, sales: 234, revenue: 468000, views: 3100, downloads: 141, format: "HARDCOVER" as BookFormat },
    { title: "The Power of Poetry: Verses for Our Time", author: "Sade Williams", category: "Poetry", daysAgo: 38, sales: 45, revenue: 90000, views: 600, downloads: 28, format: "EBOOK" as BookFormat },
    { title: "Entrepreneurial Spirit: Building from Zero", author: "Tunde Bakare", category: "Business & Entrepreneurship", daysAgo: 42, sales: 289, revenue: 578000, views: 3800, downloads: 174, format: "PAPERBACK" as BookFormat },
    { title: "The Science of Ancient African Innovation", author: "Uche Nnamdi", category: "History", daysAgo: 45, sales: 78, revenue: 156000, views: 1050, downloads: 48, format: "EBOOK" as BookFormat },
    { title: "Romance in Lagos: A Modern Love Story", author: "Vivian Okoro", category: "Romance", daysAgo: 48, sales: 312, revenue: 624000, views: 4200, downloads: 189, format: "EBOOK" as BookFormat },
    { title: "Children of the Sun: An African Fairy Tale", author: "Yusuf Abdullahi", category: "Children's Books", daysAgo: 50, sales: 198, revenue: 396000, views: 2700, downloads: 121, format: "PAPERBACK" as BookFormat },
    { title: "The Thrill of the Chase: A Nigerian Thriller", author: "Zainab Mohammed", category: "Thriller", daysAgo: 52, sales: 267, revenue: 534000, views: 3500, downloads: 161, format: "HARDCOVER" as BookFormat },
    { title: "Fantasy Worlds: African Mythology Reimagined", author: "Abiodun Akindele", category: "Fantasy", daysAgo: 55, sales: 145, revenue: 290000, views: 1950, downloads: 89, format: "EBOOK" as BookFormat },
    { title: "Young and Ambitious: Stories of Rising Stars", author: "Blessing Okadigbo", category: "Young Adult", daysAgo: 58, sales: 178, revenue: 356000, views: 2400, downloads: 108, format: "EBOOK" as BookFormat },
    { title: "The Weight of Words: A Poetry Collection", author: "Chidi Nwachukwu", category: "Poetry", daysAgo: 60, sales: 56, revenue: 112000, views: 750, downloads: 34, format: "PAPERBACK" as BookFormat },
    { title: "Leadership Lessons from African Presidents", author: "Doris Uche", category: "Leadership", daysAgo: 62, sales: 198, revenue: 396000, views: 2650, downloads: 121, format: "HARDCOVER" as BookFormat },
    { title: "The Digital Nomad: Working from Anywhere", author: "Eunice Ogunleye", category: "Technology", daysAgo: 65, sales: 134, revenue: 268000, views: 1800, downloads: 82, format: "EBOOK" as BookFormat },
  ];

  for (let i = 0; i < recentBookDefs.length; i++) {
    const def = recentBookDefs[i];
    const bookIndexRecent = 388 + i;
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - def.daysAgo);
    const pubDate = new Date(createdAt);
    pubDate.setDate(pubDate.getDate() - Math.floor(rand() * 30));

    books.push({
      id: `demo-book-${bookIndexRecent}`,
      title: def.title,
      slug: def.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      isbn: `978-${10000 + Math.floor(rand() * 90000)}-${100 + Math.floor(rand() * 900)}-${Math.floor(rand() * 10)}`,
      status: "PUBLISHED",
      price: (2000 + Math.floor(rand() * 23001)) * 100,
      format: def.format,
      publicationDate: pubDate.toISOString().split("T")[0],
      coverImage: null,
      rejectionReason: null,
      category: def.category,
      subcategory: CATEGORIES.find((c) => c.name === def.category)?.subcategories[0] || "",
      authorId: `demo-author-${AUTHOR_NAMES.indexOf(def.author) + 1}`,
      authorName: def.author,
      authorEmail: `${def.author.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      sales: def.sales,
      rating: Math.round((3.8 + rand() * 1.0) * 10) / 10,
      description: DESCRIPTIONS[Math.floor(rand() * DESCRIPTIONS.length)],
      pages: 180 + Math.floor(rand() * 320),
      language: "English",
      isPublic: true,
      views: def.views,
      downloads: def.downloads,
      revenue: def.revenue,
      createdAt: createdAt.toISOString(),
    });
  }

  return books;
}

let _demoBooksCache: DemoBook[] | null = null;
function getDemoBooks(): DemoBook[] {
  if (!_demoBooksCache) {
    _demoBooksCache = buildDemoBooks();
  }
  return _demoBooksCache;
}

function computeStats(books: DemoBook[]) {
  const publishedBooks = books.filter((b) => b.status === "PUBLISHED").length;
  const pendingReview = books.filter((b) => b.status === "SUBMITTED").length;
  const draftBooks = books.filter((b) => b.status === "DRAFT").length;
  const rejectedBooks = books.filter((b) => b.status === "REJECTED").length;
  const archivedBooks = books.filter((b) => b.status === "ARCHIVED").length;
  const totalSales = books.reduce((sum, b) => sum + b.sales, 0);
  const totalViews = books.reduce((sum, b) => sum + b.views, 0);
  const totalDownloads = books.reduce((sum, b) => sum + b.downloads, 0);

  const categoryCount: Record<string, number> = {};
  for (const b of books) {
    categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
  }
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const authorCount: Record<string, number> = {};
  for (const b of books) {
    authorCount[b.authorName] = (authorCount[b.authorName] || 0) + 1;
  }
  const topAuthor = Object.entries(authorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const categoryBreakdown: Record<string, number> = {};
  for (const b of books) {
    categoryBreakdown[b.category] = (categoryBreakdown[b.category] || 0) + 1;
  }

  const formatBreakdown: Record<string, number> = {};
  for (const b of books) {
    formatBreakdown[b.format] = (formatBreakdown[b.format] || 0) + 1;
  }

  return {
    totalBooks: books.length,
    publishedBooks,
    pendingReview,
    draftBooks,
    rejectedBooks,
    archivedBooks,
    topCategory,
    topAuthor,
    totalSales,
    totalViews,
    totalDownloads,
    categoryBreakdown,
    formatBreakdown,
  };
}

function sortDemoBooks(books: DemoBook[], sort: string): DemoBook[] {
  const sorted = [...books];
  switch (sort) {
    case "best_sellers":
      return sorted.sort((a, b) => b.sales - a.sales);
    case "most_viewed":
      return sorted.sort((a, b) => b.views - a.views);
    case "new_releases":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "title_az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "highest_rated":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "top_revenue":
      return sorted.sort((a, b) => b.revenue - a.revenue);
    default:
      return sorted.sort((a, b) => b.sales - a.sales);
  }
}

function filterDemoBooks(
  books: DemoBook[],
  search: string,
  status: string,
  category: string,
  format: string,
  authorId: string,
): DemoBook[] {
  let filtered = [...books];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.authorName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q),
    );
  }

  if (status) {
    filtered = filtered.filter((b) => b.status === status);
  }

  if (category) {
    filtered = filtered.filter((b) => b.category === category);
  }

  if (format) {
    filtered = filtered.filter((b) => b.format === format);
  }

  if (authorId) {
    filtered = filtered.filter((b) => b.authorId === authorId);
  }

  return filtered;
}

function transformDemoBook(book: DemoBook) {
  return {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    status: book.status,
    price: book.price,
    format: book.format,
    createdAt: book.createdAt,
    coverImage: book.coverImage,
    description: book.description,
    sales: book.sales,
    rating: book.rating,
    pages: book.pages,
    language: book.language,
    subcategory: book.subcategory,
    publicationDate: book.publicationDate,
    views: book.views,
    downloads: book.downloads,
    revenue: book.revenue,
    isPublic: book.isPublic,
    rejectionReason: book.rejectionReason,
    category: { id: `cat-${book.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: book.category },
    author: {
      user: {
        id: book.authorId,
        name: book.authorName,
        email: book.authorEmail,
        image: null,
      },
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const format = searchParams.get("format") || "";
    const authorId = searchParams.get("authorId") || "";
    const sort = searchParams.get("sort") || "best_sellers";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (category) where.category = { name: category };
    if (format) where.format = format;
    if (authorId) where.authorId = authorId;

    const dbBooks = await prisma.book.findMany({
      where,
      include: {
        author: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const dbCount = dbBooks.length;

    if (dbCount >= 50) {
      const total = await prisma.book.count({ where });
      const pagedBooks = await prisma.book.findMany({
        where,
        include: {
          author: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return NextResponse.json({
        success: true,
        data: {
          items: pagedBooks,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          stats: null,
        },
      });
    }

    const allDemoBooks = getDemoBooks();
    const filtered = filterDemoBooks(allDemoBooks, search, status, category, format, authorId);
    const sorted = sortDemoBooks(filtered, sort);
    const total = sorted.length;
    const start = (page - 1) * pageSize;
    const paged = sorted.slice(start, start + pageSize).map(transformDemoBook);
    const stats = computeStats(allDemoBooks);

    return NextResponse.json({
      success: true,
      data: {
        items: paged,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        stats,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { bookId, action, rejectionReason } = body;

    if (!bookId || !action) {
      return NextResponse.json(
        { success: false, error: "bookId and action are required" },
        { status: 400 },
      );
    }

    if (bookId.startsWith("demo-book-")) {
      return NextResponse.json({
        success: true,
        data: {
          message: `Demo book "${bookId}" ${action === "approve" || action === "publish" ? "approved" : action === "reject" ? "rejected" : "updated"} successfully`,
          bookId,
          action,
        },
      });
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 },
      );
    }

    const updateData: Record<string, unknown> = {
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    };

    if (action === "approve") {
      updateData.status = "APPROVED";
      updateData.isPublic = true;
    } else if (action === "reject") {
      updateData.status = "REJECTED";
      updateData.rejectionReason = rejectionReason || null;
    } else if (action === "publish") {
      updateData.status = "PUBLISHED";
      updateData.isPublic = true;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: updateData,
      include: {
        author: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: book.authorId,
        type: action === "reject" ? "BOOK_REJECTED" : "BOOK_APPROVED",
        title: action === "reject" ? "Book Rejected" : "Book Approved",
        message:
          action === "reject"
            ? `Your book "${book.title}" has been rejected. ${rejectionReason || ""}`
            : `Your book "${book.title}" has been ${action === "publish" ? "published" : "approved"}.`,
      },
    });

    return NextResponse.json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("PUT /api/admin/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update book" },
      { status: 500 },
    );
  }
}
