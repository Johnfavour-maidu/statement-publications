export interface Leader {
  slug: string;
  name: string;
  role: string;
  image: string;
  shortBio: string;
  fullBio: string;
  color: string;
  expertise: string[];
  philosophy: string;
  achievements: string[];
  social?: { platform: string; url: string }[];
  accentBorder: string;
  accentGlow: string;
  accentBg: string;
  accentText: string;
  accentIcon: string;
}

export const leaders: Leader[] = [
  {
    slug: "chief-executive-officer",
    name: "Ama Serwaa",
    role: "Founder & Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    shortBio: "A former literary agent with over 15 years in the publishing industry, Ama founded Statement Publications to democratize publishing for every author.",
    fullBio: "Ama Serwaa is the Founder and Chief Executive Officer of Statement Publications. With over 15 years of experience in the publishing industry, she has dedicated her career to making publishing accessible, fair, and empowering for independent authors worldwide.\n\nBefore founding Statement Publications, Ama worked as a literary agent at one of the world's leading publishing houses, where she represented award-winning authors and bestsellers. Her deep understanding of the industry's challenges — particularly for independent voices — inspired her to create a platform that would level the playing field.\n\nUnder her leadership, Statement Publications has grown from a startup idea to a global platform serving thousands of authors across 50+ countries. Ama is a frequent speaker at publishing conferences and literary events, advocating for author rights and innovation in digital publishing.",
    color: "from-amber-500 to-orange-600",
    expertise: ["Publishing Strategy", "Business Development", "Author Relations", "Literary Agent Experience"],
    philosophy: "Every author has a story worth telling, and every story deserves to find its readers. Our job is to make that connection possible.",
    achievements: [
      "Founded Statement Publications in 2021",
      "Grew platform to 10,000+ published books",
      "Built global distribution network across 50+ countries",
      "Featured in Publishing Weekly's 'Top 40 Under 40'",
      "Keynote speaker at Global Publishing Summit 2024",
    ],
    social: [
      { platform: "Twitter", url: "https://twitter.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    accentBorder: "border-blue-400",
    accentGlow: "shadow-blue-400/30",
    accentBg: "bg-blue-50",
    accentText: "text-blue-700",
    accentIcon: "text-blue-600",
  },
  {
    slug: "chief-technology-officer",
    name: "Kwame Asante",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    shortBio: "A tech visionary with a passion for digital publishing, Kwame leads the engineering team in building the most intuitive author platform in the industry.",
    fullBio: "Kwame Asante serves as Chief Technology Officer at Statement Publications, where he leads the engineering team in building and scaling the platform that powers thousands of authors worldwide.\n\nWith a background in computer science and over 12 years of experience in software engineering, Kwame brings deep technical expertise and a passion for creating elegant, user-friendly solutions. Before joining Statement Publications, he held senior engineering roles at leading tech companies, where he built distributed systems serving millions of users.\n\nKwame's vision for Statement's technology is centered on simplicity and power — making complex publishing workflows feel effortless. He has pioneered the use of AI-assisted formatting tools, real-time analytics dashboards, and seamless global distribution integrations that set Statement apart from competitors.\n\nHe holds a Master's degree in Computer Science from the University of Ghana and has contributed to open-source publishing tools used by developers worldwide.",
    color: "from-[#D8B27A] to-[#EBC9A8]",
    expertise: ["Platform Architecture", "AI & Machine Learning", "Product Innovation", "Distributed Systems"],
    philosophy: "Technology should empower, not intimidate. We build tools that make the complex simple, so authors can focus on what they do best — writing.",
    achievements: [
      "Architected Statement's core publishing platform",
      "Led development of AI-assisted formatting tools",
      "Built real-time analytics dashboard for authors",
      "Scaled platform to handle 10,000+ published books",
      "Contributed to open-source publishing tools",
    ],
    social: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "GitHub", url: "https://github.com" },
    ],
    accentBorder: "border-emerald-400",
    accentGlow: "shadow-emerald-400/30",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-700",
    accentIcon: "text-emerald-600",
  },
  {
    slug: "head-of-author-relations",
    name: "Efua Mensah",
    role: "Head of Author Relations",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    shortBio: "With a background in creative writing and community building, Efua ensures every author receives personalized support and guidance throughout their journey.",
    fullBio: "Efua Mensah is the Head of Author Relations at Statement Publications, where she leads the team responsible for supporting authors from manuscript upload to global distribution.\n\nWith a background in creative writing and community building, Efua brings a unique perspective to her role. She holds an MFA in Creative Writing from Columbia University and has published two critically acclaimed novels. Her experience as an independent author gives her deep empathy for the challenges writers face.\n\nAt Statement, Efua has built a world-class author support system that includes personalized onboarding, editorial consultations, marketing guidance, and community events. She personally reviews feedback from authors to ensure the platform continuously evolves to meet their needs.\n\nEfua is a passionate advocate for diverse voices in literature and leads Statement's Emerging Authors Program, which provides additional support and mentorship to first-time writers from underrepresented communities.",
    color: "from-blue-500 to-indigo-600",
    expertise: ["Community Building", "Author Support", "Creative Writing", "Mentorship Programs"],
    philosophy: "Every author deserves a champion. My role is to be that champion — listening, supporting, and helping every writer find their path to readers.",
    achievements: [
      "Built author support team from 2 to 15 members",
      "Launched Emerging Authors Program",
      "Achieved 98% author satisfaction rating",
      "Organized 50+ author community events",
      "Published two critically acclaimed novels",
    ],
    social: [
      { platform: "Twitter", url: "https://twitter.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    accentBorder: "border-amber-400",
    accentGlow: "shadow-amber-400/30",
    accentBg: "bg-amber-50",
    accentText: "text-amber-700",
    accentIcon: "text-amber-600",
  },
];

export function getLeaderBySlug(slug: string): Leader | undefined {
  return leaders.find((l) => l.slug === slug);
}
