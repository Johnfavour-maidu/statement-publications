import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type SupportRequestCategory =
  | "Publishing Support"
  | "Service Orders"
  | "Royalties & Payments"
  | "Account Issues"
  | "Technical Support"
  | "General Enquiries";

type SupportRequestPriority = "Low" | "Medium" | "High" | "Urgent";
type SupportRequestStatus =
  | "Open"
  | "Awaiting Response"
  | "In Progress"
  | "Resolved"
  | "Closed";

interface Message {
  id: string;
  sender: string;
  senderRole: "admin" | "author";
  content: string;
  createdAt: string;
}

interface SupportRequest {
  id: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string | null;
  category: SupportRequestCategory;
  title: string;
  description: string;
  priority: SupportRequestPriority;
  status: SupportRequestStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const CATEGORIES: SupportRequestCategory[] = [
  "Publishing Support",
  "Service Orders",
  "Royalties & Payments",
  "Account Issues",
  "Technical Support",
  "General Enquiries",
];

const PRIORITIES: SupportRequestPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

const STATUSES: SupportRequestStatus[] = [
  "Open",
  "Awaiting Response",
  "In Progress",
  "Resolved",
  "Closed",
];

const STAFF_NAMES = [
  "Emeka Okafor",
  "Fatima Bello",
  "Chidi Nwosu",
  "Aisha Mohammed",
  "Tunde Adeyemi",
];

const AUTHOR_NAMES = [
  "Chimamanda Adichie",
  "Aminat Abiodun",
  "Olumide Adeyemi",
  "Chioma Okafor",
  "Emeka Nwosu",
  "Fatima Abubakar",
  "Tunde Olatunji",
  "Ngozi Eze",
  "Aisha Bello",
  "Obinna Okwu",
  "Zainab Mohammed",
  "Femi Falana",
  "Adaeze Nwankwo",
  "Ibrahim Suleiman",
  "Blessing Okagbare",
  "Kemi Adesina",
  "Chinedu Eze",
  "Halima Bello",
  "Oluwaseun Coker",
  "Amara Okafor",
  "Yusuf Abdullahi",
  "Ifeoma Chukwu",
  "Temitope Akinola",
  "Funke Adebanjo",
  "Chukwuemeka Obi",
  "Rashidat Aminu",
  "Nkemdirim Okeke",
  "Babatunde Lawal",
  "Esther Ogundimu",
  "Samuel Okonkwo",
  "Amina Yusuf",
  "Emmanuel Eze",
  "Grace Obi",
  "Mustapha Ibrahim",
  "Bukola Alabi",
  "Ifeanyi Nwosu",
  "Sade Ogunlesi",
  "Daniel Olawale",
  "Chidinma Eze",
  "Abdulrahman Musa",
  "Omolara Adeyemi",
  "Uche Okoro",
  "Hadiza Bala",
  "Kelechi Amadi",
  "Toyin Fashola",
  "Emeka Anyanwu",
  "Amina Dikko",
  "Chidi Okoli",
  "Folake Coker",
  "Segun Ogundimu",
];

const BOOK_TITLES = [
  "The Lion and the Jewel",
  "Half of a Yellow Sun",
  "Things Fall Apart",
  "Americanah",
  "The Famished Road",
  "Purple Hibiscus",
  "Arrow of God",
  "No Longer at Ease",
  "The Secret Lives of Baba Segi's Wives",
  "A Grain of Wheat",
  "We Need New Names",
  "The Book of Night Women",
  "An Elegy for Easterly",
  "GraceLand",
  "The Invention of Morel",
];

const PUBLISHING_SUPPORT_TITLES = [
  "Book formatting issues on Kindle",
  "Cover design revision needed",
  "Manuscript rejected - need guidance",
  "ISBN registration assistance",
  "Print quality concerns for paperback",
  "eBook conversion problems",
  "Book description not updating",
  "Category selection help needed",
  "Pre-order setup issues",
  "Series book linking problems",
  "Editorial review delay inquiry",
  "Manuscript upload failing repeatedly",
];

const PUBLISHING_SUPPORT_DESCRIPTIONS = [
  "My book was formatted correctly on the preview, but after publishing, the chapter headings are misaligned and some paragraphs have extra spacing. I need help fixing the formatting.",
  "The cover design I received doesn't match my specifications. The font is too small and the image placement is off. Can I request a revision?",
  "My manuscript was rejected with a note about formatting issues, but I followed all the guidelines. Please help me understand what needs to be changed.",
  "I need assistance registering ISBNs for my upcoming trilogy. What is the process and how long does it typically take?",
  "The print quality of my paperback orders has been inconsistent. Some copies have blurry images and the paper feels thinner than expected.",
  "I uploaded a DOCX file for eBook conversion but the resulting EPUB has broken table of contents and missing images. How do I fix this?",
  "I updated my book description three days ago but it still shows the old version on the store. When will the changes take effect?",
  "I'm unsure which categories to select for my self-help book. The options seem limited and none perfectly match my content.",
  "I set up a pre-order but the release date keeps changing. The book should have been released last week.",
  "I have three books in a series but they aren't linked on the store page. Customers can't see the other volumes.",
  "I submitted my manuscript for editorial review two weeks ago and haven't received any feedback. What is the typical turnaround time?",
  "Every time I try to upload my manuscript over 5MB, the upload fails. I've tried multiple file formats and nothing works.",
];

const SERVICE_ORDER_TITLES = [
  "Package upgrade request",
  "Editing service not received",
  "Marketing campaign delay",
  "Book launch event coordination",
  "Author website setup issues",
  "Social media promotion not started",
  "Bulk order discount inquiry",
  "Premium formatting service delay",
  "Book signing event support",
  "Translation service request",
];

const SERVICE_ORDER_DESCRIPTIONS = [
  "I purchased the Starter package but I need to upgrade to Professional for the additional editing rounds. How do I process the upgrade?",
  "I paid for the comprehensive editing service three weeks ago but my editor hasn't reached out yet. When will the editing begin?",
  "The social media marketing campaign I ordered was supposed to start last Monday but I haven't seen any posts or activity yet.",
  "I need help coordinating a book launch event in Lagos. What resources does the platform provide for this?",
  "I purchased the author website setup service but the template provided doesn't match my genre. Can I get a different design?",
  "I ordered a 30-day social media promotion package but it's been a week and nothing has been posted on my behalf.",
  "I'm looking to order 500 copies of my book for a corporate event. Is there a bulk discount available?",
  "I ordered premium formatting service but it's been over a month and I still haven't received the formatted files.",
  "I need support organizing a book signing event. What materials and promotional support can you provide?",
  "I'd like to have my book translated into French for the West African market. Do you offer translation services?",
];

const ROYALTIES_TITLES = [
  "Royalty payment not received",
  "Incorrect royalty calculation",
  "Tax withholding inquiry",
  "Payment method update needed",
  "Royalty statement discrepancy",
  "Advance payment recovery question",
  "Multi-currency payment issue",
  "Royalty split with co-author",
  "Late payment penalty inquiry",
  "Minimum payout threshold question",
];

const ROYALTIES_DESCRIPTIONS = [
  "I was supposed to receive my royalty payment by the 15th but it's now the 25th and I haven't received anything. Can you check the status?",
  "My latest royalty statement shows ₦45,000 but based on my sales dashboard, it should be closer to ₦78,000. There seems to be a calculation error.",
  "I need clarification on the 10% tax withholding. Is this applicable to all authors or only those above a certain threshold?",
  "I changed my bank account details last month but the system still shows the old account. I need to update my payment information.",
  "There's a discrepancy between the sales figures in my dashboard and the royalty statement. The numbers don't match at all.",
  "I received an advance payment last year and I'm not sure how it factors into my current royalty calculations. Can you explain?",
  "I have readers in both Nigeria and the UK. How are payments handled for different currencies? I'm seeing conversion issues.",
  "I co-authored a book with a colleague and we agreed on a 60/40 split, but the royalties are being paid to me in full. How do we set up splits?",
  "My payment was processed three days late last month. Is there a penalty or compensation for late disbursements?",
  "What is the minimum amount I need to accumulate before a payout is triggered? I want to understand the threshold.",
];

const ACCOUNT_ISSUE_TITLES = [
  "Account verification stuck",
  "Password reset not working",
  "Profile information update",
  "Two-factor authentication issue",
  "Account suspended inquiry",
  "Email address change request",
  "Duplicate account merge",
  "Banking details security concern",
  "Author bio not updating",
];

const ACCOUNT_ISSUE_DESCRIPTIONS = [
  "I submitted my ID for verification over a week ago and it still shows as pending. How long does verification usually take?",
  "I requested a password reset email but never received it. I've checked my spam folder and it's not there either.",
  "I need to update my legal name on my profile. What documents do I need to submit for this change?",
  "I enabled two-factor authentication but now I can't log in because I lost access to my authenticator app.",
  "My account was suddenly suspended without explanation. I haven't violated any terms. Please investigate.",
  "I need to change the email address associated with my account. My current email is no longer accessible.",
  "I accidentally created two accounts and I need to merge them. Both have different books published under them.",
  "I'm concerned that my banking details might be visible to other users. Can you confirm the security of my payment information?",
  "I updated my author bio two weeks ago but it still shows the old version on my public profile.",
];

const TECHNICAL_SUPPORT_TITLES = [
  "Mobile app crashing on login",
  "Dashboard not loading properly",
  "File upload timeout error",
  "Search functionality broken",
  "Notification system not working",
  "Payment gateway error",
  "Book preview not displaying",
  "Slow page load times",
];

const TECHNICAL_SUPPORT_DESCRIPTIONS = [
  "The mobile app crashes every time I try to log in on my Android device. I've tried reinstalling but the issue persists.",
  "The admin dashboard shows a blank white screen when I try to access the analytics section. Other sections work fine.",
  "I've been trying to upload my manuscript for the past hour but the upload keeps timing out at 80%. My internet connection is stable.",
  "When I search for books on the platform, the results don't match the search terms at all. The search seems completely broken.",
  "I turned on email notifications but I'm not receiving any alerts for new orders or messages. I've verified my email is correct.",
  "I tried to process a payment for a service package but got an error saying 'Payment gateway timeout'. This has happened multiple times.",
  "When customers click on my book to preview it, the page loads but the content area is completely blank. This is hurting sales.",
  "The entire platform takes over 10 seconds to load on both my phone and laptop. This started happening two days ago.",
];

const GENERAL_ENQUIRY_TITLES = [
  "Publishing timeline inquiry",
  "Platform feature suggestion",
  "Partnership opportunity question",
  "Event hosting inquiry",
  "Content policy clarification",
  "Competitor analysis request",
  "Author community access",
  "International distribution question",
];

const GENERAL_ENQUIRY_DESCRIPTIONS = [
  "I just signed up and I'm curious about the typical timeline from manuscript submission to having my book available for purchase.",
  "I have a suggestion for a new feature: the ability for authors to schedule social media posts directly from the platform.",
  "I run a literary magazine and would like to explore a partnership where we feature emerging authors from your platform.",
  "I'd like to host a virtual book launch event through the platform. What options are available for this?",
  "I'm unsure about what content is allowed on the platform. Are there restrictions on political or controversial topics?",
  "I'd like to see how my book compares to similar titles in terms of sales and reviews. Can you provide any competitive insights?",
  "Is there an author community or forum where I can connect with other writers on the platform for collaboration and support?",
  "I have readers in the US and Europe. Does the platform distribute to international markets or is it limited to Nigeria?",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateMessages(
  requestTitle: string,
  category: SupportRequestCategory,
  authorName: string,
  status: SupportRequestStatus,
  createdAt: Date,
  rand: () => number,
): Message[] {
  const messages: Message[] = [];
  const messageCount = 2 + Math.floor(rand() * 4);
  const staffName = pick(STAFF_NAMES, rand);

  const authorOpeningTemplates: Record<SupportRequestCategory, string[]> = {
    "Publishing Support": [
      `Hello, I need help with my book "${pick(BOOK_TITLES, rand)}". ${requestTitle.toLowerCase().includes("format") ? "The formatting is not rendering correctly on certain devices." : "I'm having issues that are preventing me from publishing properly."}`,
      `Hi there, I'm reaching out because ${requestTitle.toLowerCase().includes("delay") ? "I submitted my work a while ago but haven't heard back." : "I encountered a problem while trying to publish my book."}`,
      `Good day, I'm an author on the platform and I need assistance. ${requestTitle.toLowerCase().includes("cover") ? "The cover design doesn't meet my expectations." : "Could you please help me resolve this issue?"}`,
    ],
    "Service Orders": [
      `Hello, I placed an order for a service but ${requestTitle.toLowerCase().includes("not received") ? "haven't received it yet after waiting for several weeks." : "I need some changes to my current package."}`,
      `Hi, I'm writing about my service order. ${requestTitle.toLowerCase().includes("delay") ? "There seems to be a significant delay in delivery." : "I have a question about the service I purchased."}`,
      `Good day, I need assistance with a service I ordered. ${requestTitle.toLowerCase().includes("upgrade") ? "I'd like to upgrade my current package." : "The service hasn't been delivered as expected."}`,
    ],
    "Royalties & Payments": [
      `Hello, I'm writing to inquire about my royalty payments. ${requestTitle.toLowerCase().includes("not received") ? "I haven't received my payment yet this month." : "There seems to be an issue with the calculation."}`,
      `Hi, I have a concern regarding my royalties. ${requestTitle.toLowerCase().includes("incorrect") ? "The amounts don't match what I expected based on my sales." : "I need clarification on the payment details."}`,
      `Good day, I need help with a payment-related issue. ${requestTitle.toLowerCase().includes("update") ? "I need to update my payment information." : "There's a discrepancy in my royalty statement."}`,
    ],
    "Account Issues": [
      `Hello, I'm having trouble with my account. ${requestTitle.toLowerCase().includes("verification") ? "My verification has been pending for too long." : "I can't access certain features."}`,
      `Hi, I need help with my account settings. ${requestTitle.toLowerCase().includes("password") ? "I'm locked out and can't reset my password." : "Something on my profile needs to be updated."}`,
      `Good day, there's an issue with my account that needs urgent attention. ${requestTitle.toLowerCase().includes("suspended") ? "My account was suspended without warning." : "I can't seem to make changes to my settings."}`,
    ],
    "Technical Support": [
      `Hello, I'm experiencing a technical issue. ${requestTitle.toLowerCase().includes("crash") ? "The app keeps crashing when I try to use it." : "Something on the platform isn't working correctly."}`,
      `Hi, I need technical assistance. ${requestTitle.toLowerCase().includes("error") ? "I keep getting error messages when trying to complete my task." : "The platform seems to be malfunctioning."}`,
      `Good day, I'm reporting a bug. ${requestTitle.toLowerCase().includes("loading") ? "Pages aren't loading properly for me." : "I've encountered a persistent technical problem."}`,
    ],
    "General Enquiries": [
      `Hello, I have a general question about the platform. ${requestTitle.toLowerCase().includes("timeline") ? "I'd like to know how long the publishing process takes." : "I'm curious about a specific feature or service."}`,
      `Hi, I wanted to ask about something. ${requestTitle.toLowerCase().includes("suggestion") ? "I have an idea that could improve the platform." : "I need some general information."}`,
      `Good day, I have a query. ${requestTitle.toLowerCase().includes("partnership") ? "I'm interested in exploring a collaboration opportunity." : "I'd like to learn more about what you offer."}`,
    ],
  };

  const authorResponses: Record<SupportRequestStatus, string[]> = {
    Open: [
      "Thank you for the quick response. I'll try that and get back to you if I have further issues.",
      "I appreciate you looking into this. Let me know if you need any additional information from my end.",
      "Thanks for getting back to me. I'll wait for further updates.",
    ],
    "Awaiting Response": [
      "I've provided all the details you requested. Please let me know if you need anything else.",
      "Looking forward to hearing from you soon. This is quite urgent for me.",
      "I've been waiting for a response. Could you please provide an update?",
    ],
    "In Progress": [
      "Thank you for working on this. Please keep me posted on the progress.",
      "I appreciate the update. Is there anything else I can do to help resolve this?",
      "Good to know it's being handled. I'll be available if you need more details.",
    ],
    Resolved: [
      "The issue has been resolved. Thank you for your help!",
      "Everything is working perfectly now. I appreciate the quick resolution.",
      "Problem solved. Thank you for the excellent support.",
    ],
    Closed: [
      "Thank you for resolving this matter. I'm satisfied with the outcome.",
      "Great, the issue is fully resolved. Closing this ticket on my end.",
      "Everything looks good now. Thanks for the assistance.",
    ],
  };

  const adminResponses: Record<SupportRequestCategory, string[]> = {
    "Publishing Support": [
      "I've reviewed your book's settings and identified the formatting issue. Here's what you need to do to fix it.",
      "Thank you for bringing this to our attention. I've escalated this to our editorial team for immediate review.",
      "I can see the issue in your publishing dashboard. Let me walk you through the steps to resolve it.",
    ],
    "Service Orders": [
      "I've checked your order status and it appears there was a delay in processing. I've expedited it now.",
      "Your service order has been updated. You should see the changes reflected in your account shortly.",
      "I've reviewed your service request and I've assigned a team member to handle this priority order.",
    ],
    "Royalties & Payments": [
      "I've reviewed your royalty calculations and found a discrepancy. I've submitted a correction request.",
      "Your payment information has been updated successfully. The next disbursement will use these new details.",
      "I've verified your royalty statement against the sales data. Here's a detailed breakdown of the amounts.",
    ],
    "Account Issues": [
      "I've reviewed your account status and I can see why this is happening. Let me resolve this for you right away.",
      "Your account verification has been expedited. You should receive confirmation within the next 24 hours.",
      "I've reset your account access. Please try logging in with the temporary credentials I'm sending to your email.",
    ],
    "Technical Support": [
      "I've identified the technical issue and our engineering team is working on a fix. This should be resolved within 24 hours.",
      "Thank you for reporting this bug. I've logged it with our development team and they're investigating the root cause.",
      "I've tested the issue on our end and can confirm the problem. A fix has been deployed. Please clear your cache and try again.",
    ],
    "General Enquiries": [
      "Thank you for your inquiry. I'd be happy to provide more information about this topic.",
      "Great question! Let me share some details that should help clarify things for you.",
      "I appreciate your interest. Here's the information you requested about our platform.",
    ],
  };

  const authorTemplate = authorOpeningTemplates[category];
  messages.push({
    id: `msg-${Date.now()}-0`,
    sender: authorName,
    senderRole: "author",
    content: pick(authorTemplate, rand),
    createdAt: createdAt.toISOString(),
  });

  const adminReplyTime = 2 + Math.floor(rand() * 4);
  const adminReplyDate = new Date(
    createdAt.getTime() + adminReplyTime * 60 * 60 * 1000,
  );
  messages.push({
    id: `msg-${Date.now()}-1`,
    sender: staffName,
    senderRole: "admin",
    content: pick(adminResponses[category], rand),
    createdAt: adminReplyDate.toISOString(),
  });

  if (messageCount >= 3) {
    const authorReplyDelay = 1 + Math.floor(rand() * 3);
    const authorReplyDate = new Date(
      adminReplyDate.getTime() + authorReplyDelay * 60 * 60 * 1000,
    );
    messages.push({
      id: `msg-${Date.now()}-2`,
      sender: authorName,
      senderRole: "author",
      content: pick(authorResponses[status], rand),
      createdAt: authorReplyDate.toISOString(),
    });
  }

  if (messageCount >= 4) {
    const additionalAdminDelay = 3 + Math.floor(rand() * 6);
    const additionalAdminDate = new Date(
      messages[messages.length - 1].createdAt,
    );
    additionalAdminDate.setHours(
      additionalAdminDate.getHours() + additionalAdminDelay,
    );
    messages.push({
      id: `msg-${Date.now()}-3`,
      sender: staffName,
      senderRole: "admin",
      content: pick(adminResponses[category], rand),
      createdAt: additionalAdminDate.toISOString(),
    });
  }

  if (messageCount >= 5) {
    const finalAuthorDelay = 1 + Math.floor(rand() * 2);
    const finalAuthorDate = new Date(
      messages[messages.length - 1].createdAt,
    );
    finalAuthorDate.setHours(finalAuthorDate.getHours() + finalAuthorDelay);
    messages.push({
      id: `msg-${Date.now()}-4`,
      sender: authorName,
      senderRole: "author",
      content: pick(authorResponses[status], rand),
      createdAt: finalAuthorDate.toISOString(),
    });
  }

  return messages;
}

function generateSupportRequests(now: Date): {
  requests: SupportRequest[];
  stats: {
    total: number;
    open: number;
    awaitingResponse: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  categoryStats: { category: string; count: number }[];
  statusByMonth: { month: string; count: number }[];
  averageResolutionHours: number;
} {
  const seed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rand = seededRandom(seed);

  const statusPool: SupportRequestStatus[] = [
    ...Array(15).fill("Open"),
    ...Array(10).fill("Awaiting Response"),
    ...Array(12).fill("In Progress"),
    ...Array(10).fill("Resolved"),
    ...Array(8).fill("Closed"),
  ] as SupportRequestStatus[];

  const priorityPool: SupportRequestPriority[] = [
    ...Array(10).fill("Low"),
    ...Array(20).fill("Medium"),
    ...Array(15).fill("High"),
    ...Array(10).fill("Urgent"),
  ] as SupportRequestPriority[];

  const categoryTitles: Record<SupportRequestCategory, string[]> = {
    "Publishing Support": PUBLISHING_SUPPORT_TITLES,
    "Service Orders": SERVICE_ORDER_TITLES,
    "Royalties & Payments": ROYALTIES_TITLES,
    "Account Issues": ACCOUNT_ISSUE_TITLES,
    "Technical Support": TECHNICAL_SUPPORT_TITLES,
    "General Enquiries": GENERAL_ENQUIRY_TITLES,
  };

  const categoryDescriptions: Record<SupportRequestCategory, string[]> = {
    "Publishing Support": PUBLISHING_SUPPORT_DESCRIPTIONS,
    "Service Orders": SERVICE_ORDER_DESCRIPTIONS,
    "Royalties & Payments": ROYALTIES_DESCRIPTIONS,
    "Account Issues": ACCOUNT_ISSUE_DESCRIPTIONS,
    "Technical Support": TECHNICAL_SUPPORT_DESCRIPTIONS,
    "General Enquiries": GENERAL_ENQUIRY_DESCRIPTIONS,
  };

  const categoryCounts: Record<SupportRequestCategory, number> = {
    "Publishing Support": 10,
    "Service Orders": 10,
    "Royalties & Payments": 10,
    "Account Issues": 9,
    "Technical Support": 8,
    "General Enquiries": 8,
  };

  const requests: SupportRequest[] = [];
  let requestIndex = 0;

  const usedStatuses = [...statusPool];
  const usedPriorities = [...priorityPool];

  for (const category of CATEGORIES) {
    const count = categoryCounts[category];
    for (let i = 0; i < count; i++) {
      const id = `SR-${1001 + requestIndex}`;
      const authorName = pick(AUTHOR_NAMES, rand);
      const authorEmail =
        `${authorName.toLowerCase().replace(/\s+/g, ".")}@example.com`;

      const statusIdx = Math.floor(rand() * usedStatuses.length);
      const status = usedStatuses.splice(statusIdx, 1)[0];

      const priorityIdx = Math.floor(rand() * usedPriorities.length);
      const priority = usedPriorities.splice(priorityIdx, 1)[0];

      const titleOptions = categoryTitles[category];
      const descriptionOptions = categoryDescriptions[category];
      const titleIdx = requestIndex % titleOptions.length;

      const daysAgo = Math.floor(rand() * 180);
      const hoursAgo = Math.floor(rand() * 24);
      const createdAt = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000,
      );

      const updatedAtOffset = Math.floor(rand() * 72);
      const updatedAt = new Date(
        createdAt.getTime() + updatedAtOffset * 60 * 60 * 1000,
      );

      const isAssigned =
        status === "In Progress" ||
        status === "Resolved" ||
        (status === "Awaiting Response" && rand() > 0.3) ||
        (status === "Closed" && rand() > 0.5);

      const messages = generateMessages(
        titleOptions[titleIdx],
        category,
        authorName,
        status,
        createdAt,
        rand,
      );

      requests.push({
        id,
        authorName,
        authorEmail,
        authorAvatar: rand() > 0.3 ? null : null,
        category,
        title: titleOptions[titleIdx],
        description: descriptionOptions[titleIdx],
        priority,
        status,
        assignedTo: isAssigned ? pick(STAFF_NAMES, rand) : null,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        messages,
      });

      requestIndex++;
    }
  }

  const stats = {
    total: requests.length,
    open: requests.filter((r) => r.status === "Open").length,
    awaitingResponse: requests.filter((r) => r.status === "Awaiting Response")
      .length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    resolved: requests.filter((r) => r.status === "Resolved").length,
    closed: requests.filter((r) => r.status === "Closed").length,
  };

  const categoryStats = CATEGORIES.map((cat) => ({
    category: cat,
    count: requests.filter((r) => r.category === cat).length,
  }));

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const statusByMonth: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const targetMonth = now.getMonth() - i;
    const targetYear = now.getFullYear() + Math.floor(targetMonth / 12);
    const adjustedMonth =
      ((targetMonth % 12) + 12) % 12;

    const count = requests.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === adjustedMonth && d.getFullYear() === targetYear;
    }).length;

    statusByMonth.push({
      month: monthNames[adjustedMonth],
      count,
    });
  }

  const resolutionHours = requests
    .filter((r) => r.status === "Resolved" || r.status === "Closed")
    .map((r) => {
      const created = new Date(r.createdAt);
      const updated = new Date(r.updatedAt);
      return (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
    });

  const averageResolutionHours =
    resolutionHours.length > 0
      ? +(
          resolutionHours.reduce((a, b) => a + b, 0) / resolutionHours.length
        ).toFixed(1)
      : 58.4;

  return {
    requests,
    stats,
    categoryStats,
    statusByMonth,
    averageResolutionHours,
  };
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const now = new Date();
    const data = generateSupportRequests(now);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/admin/support-requests error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch support requests" },
      { status: 500 },
    );
  }
}
