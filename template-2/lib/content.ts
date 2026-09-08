export type {
  Service,
  ServiceCategoryId,
} from "@/lib/services";
export {
  getService,
  getServiceCategory,
  getServicesByCategory,
  serviceCategories,
  services,
  servicesIntro,
} from "@/lib/services";

export const philosophy = [
  {
    title: "Goal-based, not product-led",
    body: "Every investment is tied to a goal, a time horizon, and a risk profile. We recommend a product because it fits your plan, not because it is new or in the news.",
  },
  {
    title: "Open architecture",
    body: "Schemes are selected across fund houses on merit: consistency, risk, cost, and overlap with what you already hold. There is no in-house product to push.",
  },
  {
    title: "Transparent and reviewed",
    body: "Commissions, registrations, and risks are disclosed upfront. Portfolios are reviewed regularly and rebalanced when allocations drift from the plan.",
  },
];

export const goals = [
  "A retirement corpus that lasts",
  "Children's education and marriage",
  "Buying your first or second home",
  "Tax-efficient wealth creation",
  "Emergency fund and adequate protection",
  "Wealth transfer to the next generation",
];

export const processSteps = [
  {
    n: "01",
    title: "Understand",
    body: "We start with your income, expenses, existing investments, insurance policies, and the goals that matter most to you.",
  },
  {
    n: "02",
    title: "Plan",
    body: "You receive a written picture of your requirements, a suitable scheme mix, SIP or lumpsum amounts, and how we will execute and service the folio.",
  },
  {
    n: "03",
    title: "Invest",
    body: "We complete KYC, set up mandates, and start your SIPs on a platform where you can track everything anytime.",
  },
  {
    n: "04",
    title: "Review",
    body: "Regular reviews, rebalancing when allocations drift, and adjustments as your life and goals change.",
  },
];

export const hero = {
  kicker: "Mutual fund distributor, Mumbai",
  /** Rendered as JSX in HomeView; the words in `highlights` get the italic cut. */
  title: "You did the saving. The rest of it shouldn't be this hard.",
  highlights: ["saving.", "hard."],
  body: "We handle the fund houses, the paperwork and the follow-ups, so you can get on with your life. There is no separate fee for the plan, and nothing is ever billed to you.",
  /** Small tracked labels that scroll under the hero portrait. */
  tags: [
    "Mutual funds",
    "Monthly SIPs",
    "Term and health cover",
    "FD and bonds",
    "Retirement income",
    "NRI investing",
  ],
};

/** The "past results" band. Illustrative, and labelled as such on the page. */
export const outcomes = [
  {
    amount: "₹2.4 Cr",
    label: "Retirement corpus",
    year: "2024",
    body: "Fourteen scattered SIPs consolidated into six schemes over ten years. The corpus now pays a monthly withdrawal.",
  },
  {
    amount: "₹1.1 Cr",
    label: "Education fund",
    year: "2025",
    body: "A step-up SIP started in 2016 when the child was three. The first year's fee was paid without a loan.",
  },
  {
    amount: "₹86 L",
    label: "Insurance cover added",
    year: "2023",
    body: "Two bundled policies surrendered; pure term and a family floater put in their place at a third of the premium.",
  },
];

/** Thin promise strip under the outcomes. */
export const promises = [
  "Free first conversation",
  "No separate fee for the plan",
  "No obligation",
  "We call back the same day",
];

/** "What we handle": the scroll-revealed statement and the dark cards below it. */
export const handle = {
  statement:
    "The app will nudge you first. It is built to sound helpful, to move quickly, and to sell you whatever is trending this quarter. From the day you work with us, the plan decides what you buy.",
  cards: [
    {
      title: "The fund houses",
      body: "Forty-plus AMCs, one folio view. We pick across them on merit, and there is no in-house product to push.",
    },
    {
      title: "The paperwork",
      body: "KYC, FATCA, nominations, mandates, and the transmission nobody wants to think about. We build the file so nothing is missing later.",
    },
    {
      title: "The follow-ups",
      body: "Reviews on a calendar, rebalancing when allocations drift, and a call before you redeem in a bad week.",
    },
    {
      title: "The cover",
      body: "Term and health first, because a plan that ends with one hospital bill was never a plan.",
    },
  ],
};

/** "In their words" */
export const words = {
  intro: "We asked four families what actually helped. Not one of them said the returns.",
  note: "Every statement here is from a family we work with. We do not publish surnames, and we do not pay for reviews.",
  stats: [
    { value: "4.9", label: "Average rating" },
    { value: "212", label: "Client reviews" },
    { value: "9 in 10", label: "Stay invested through a fall" },
  ],
};

/** "Let's talk" panel between the fund houses and the arithmetic. */
export const talk = {
  title: "Thirty minutes. No forms first, and no obligation.",
  body: "The first conversation is about you, not about products. You leave with your priorities in order and a clear sense of whether we are the right fit.",
  covers: [
    "What you earn, owe, hold, and want in three, ten, and twenty-five years",
    "What you already have that is worth keeping exactly as it is",
    "What we would change first, and why, written down for you",
  ],
};

/** Home SIP calculator section */
export const homeCalculator = {
  eyebrow: "SIP calculator",
  lede:
    "See what a monthly SIP could become. Change the amount, tenure, or return assumption and the maturity figure moves with it.",
  note: "Illustrative only. Returns are not guaranteed.",
};

/** "What people ask first": six questions, each with a numbered answer and a photo. */
export const firstQuestions = [
  {
    q: "What does this cost me?",
    a: "Nothing up front and nothing as a separate bill. The fund house pays us a trail commission out of the scheme's expense ratio, and the ranges are published on this site before any work begins.",
  },
  {
    q: "Do I need a lot to start?",
    a: "No. Most families start with a monthly SIP they would not miss and raise it with each increment. The plan matters more than the first amount.",
  },
  {
    q: "How long until it shows?",
    a: "The first few years look slow on purpose. Most of the money in a twenty-year SIP arrives in the second decade, which is why we plan the exit before the entry.",
  },
  {
    q: "I already have SIPs on an app.",
    a: "That is common and usually fixable. We map each one to a goal, drop the overlaps, and consolidate the folios so there is one view instead of five logins.",
  },
  {
    q: "What if the market falls?",
    a: "Then the SIP buys more units that month. We plan for a fall before it happens, and we call you before you redeem, not after.",
  },
  {
    q: "What do you need from me?",
    a: "One conversation to begin. After that, PAN, KYC, a bank mandate, and an honest picture of what you already hold. We ask for what we need when we need it, and not before.",
  },
];

/** Core MFD services shown on the home page. The full catalogue lives on /services. */
export const homeServiceSlugs = [
  "scheme-selection",
  "sip-services",
  "portfolio-monitoring",
  "retirement-planning",
] as const;

export const partners = [
  "HDFC Mutual Fund",
  "ICICI Prudential",
  "SBI Mutual Fund",
  "Nippon India",
  "Axis Mutual Fund",
  "Kotak Mahindra",
  "Mirae Asset",
  "DSP Mutual Fund",
  "Franklin Templeton",
  "Aditya Birla Sun Life",
  "UTI Mutual Fund",
  "Tata Mutual Fund",
  "Canara Robeco",
  "Motilal Oswal",
  "PPFAS",
];

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export const team: TeamMember[] = [
  {
    name: "Ananya Mehra",
    role: "Founder & Certified Financial Planner",
    initials: "AM",
    bio: "Ananya has over 15 years of experience in financial planning and mutual fund distribution. She leads client relationships and the planning process.",
  },
  {
    name: "Rohan Iyer",
    role: "Head of Investments",
    initials: "RI",
    bio: "Rohan leads fund research and portfolio construction, evaluating schemes on consistency, risk, overlap, and cost.",
  },
  {
    name: "Sara Khan",
    role: "Financial Planner",
    initials: "SK",
    bio: "Sara builds goal-based mutual fund plans for families: education, retirement, a home, and the SIPs that fund them.",
  },
  {
    name: "Vikram Shah",
    role: "Client Services",
    initials: "VS",
    bio: "Vikram manages onboarding, KYC, SIP registrations, and ongoing servicing so that every folio stays up to date.",
  },
];

export const testimonials = [
  {
    quote:
      "I had several SIPs across banks and apps with no clear purpose. They consolidated everything, mapped each investment to a goal, and now I get a simple review every quarter.",
    name: "Neelima R.",
    role: "IT professional, Hyderabad",
  },
  {
    quote:
      "The first conversation was about my emergency fund and term insurance, not about which fund to buy. That approach gave me a lot of confidence in their advice.",
    name: "Farhan Q.",
    role: "Chartered Accountant, Ahmedabad",
  },
  {
    quote:
      "As an NRI, I needed help with NRE and NRO accounts and KYC. The onboarding was smooth, and my SIPs have been running without any hassle since.",
    name: "Latha M.",
    role: "NRI client, Dubai",
  },
  {
    quote:
      "When markets fell, they advised me to stay invested and continue my SIPs. That discipline has made a real difference to my portfolio.",
    name: "Arjun D.",
    role: "Business owner, Nashik",
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  body: string[];
  image?: string;
};

export const blogPosts: Article[] = [
  {
    slug: "term-insurance-for-women-2026",
    title: "If the household runs on two incomes, both need cover",
    excerpt:
      "A single 'main earner' term plan is a 1990s household. Here is a cleaner way to size cover when both people work, or when one person's unpaid work would be expensive to replace.",
    date: "2026-08-18",
    category: "Insurance",
    author: "Sara Khan",
    body: [
      "Plenty of families still buy one term plan in the name of whoever's salary hits the joint account. That ignores a second income, a career break, and the cost of replacing unpaid work if the other adult is gone.",
      "Start with years of support still needed, outstanding loans, and what employer cover would actually pay. The number is usually larger than the Rs. 50 lakh policy bought in a hurry at a bank desk.",
      "Riders and 'women-only' discounts are secondary. A plain term plan, a living nominee, and a review after a child or a home loan matter more.",
      "If you already pay for money-back or ULIP policies, ask what death cover that premium would buy as pure term. Under-insured on life and over-allocated to low-yield bundles is a planning error, not loyalty.",
    ],
  },
  {
    slug: "why-large-cap-funds-belong-in-a-core",
    title: "Your core can be boring. That is the point.",
    excerpt:
      "When mid-caps lead the tables, large-cap funds look slow. For a SIP you must live with through a crash, slow is often the correct setting.",
    date: "2026-07-22",
    category: "Mutual Funds",
    author: "Rohan Iyer",
    body: [
      "Large-cap funds own the top of the listed market. They will lose performance races in a mid-cap melt-up. Their job is to participate in Indian compounders without the same drawdown as the rest of the equity universe.",
      "Keep the money you cannot emotionally abandon in large-cap or a flexi-cap that truly behaves like one. Park experiments in a satellite you could pause without wrecking the plan.",
      "Watch overlap. Many 'diversified' funds already load financials or a handful of index giants. Adding another large-cap clone does not diversify you.",
      "If your horizon is beyond seven years and the emergency fund exists, 'the index looks high' is not a sell thesis by itself. Timing exits is how SIPs become stories about the year you stopped.",
    ],
  },
  {
    slug: "nomination-transmission-gifting-mutual-funds",
    title: "A folio without a nominee is a half-finished SIP",
    excerpt:
      "Units do not move themselves. Nomination, clean KYC, and a conversation about who will actually operate the account matter as much as the fund name.",
    date: "2026-06-09",
    category: "Operations",
    author: "Vikram Shah",
    body: [
      "Nomination is the cheapest estate tool in mutual funds and the one most DIY folios skip. Multiple nominees with percentages beat a vague 'we'll deal with it later'.",
      "Transmission still needs documents. The pile is smaller if KYC, PAN, and bank details are current, and if the AMC can see a nominee already on file.",
      "Gifting units while you are alive is a separate legal and tax path. For most families, nominations plus a will plus one person who knows the logins is the practical trio.",
      "Scattered folios from years of app-hopping become someone else's problem. Consolidation is advice, not housekeeping you outsource to grief.",
    ],
  },
  {
    slug: "mathematical-power-of-compounding",
    title: "Most of the money shows up in the second decade",
    excerpt:
      "A SIP illustration is not a promise. It is a reminder that interrupting year four is how year eighteen never arrives.",
    date: "2026-05-14",
    category: "Planning",
    author: "Ananya Mehra",
    image: "/images/compounding.jpg",
    body: [
      "Run a monthly SIP of Rs. 25,000 for 20 years at a 12% assumed rate and you will see the obvious: early years look small, later years do the heavy lifting. Markets will not deliver that rate on cue. The shape of the curve is still the lesson.",
      "The behaviour that breaks it is familiar: pause after a fall, chase last year's table-topper, or take a 'tactical' exit that becomes permanent. You do not get those years back.",
    ],
  },
];

export const newsCategories = [
  "All",
  "Mutual Fund",
  "NFO",
  "Share Markets",
  "Income Tax",
  "BFSI Industry",
] as const;

export const newsItems: Article[] = [
  {
    slug: "new-fund-offers-september-2026",
    title: "New fund offers are optional. Your existing SIP is not.",
    excerpt:
      "A busy NFO calendar is not a reason to reset a working allocation. Here is the short list we run before a launch earns a rupee.",
    date: "2026-09-03",
    category: "NFO",
    author: "News desk",
    image: "/images/compounding.jpg",
    body: [
      "Launches are a distribution season, not a research event by default. We ask whether the mandate is already in the book, whether the manager has done this style before, and what you pay after the teaser TER.",
      "A genuine gap (a clean index sleeve you lack) can justify an NFO. A relabelled flexi-cap cannot. Money already compounding does not need a marketing window.",
      "If you enjoy launches, keep a small opportunistic sleeve. The core SIP should stay dull on purpose.",
    ],
  },
  {
    slug: "index-and-sector-funds-watch",
    title: "A sector index is a bet, even when it is 'passive'",
    excerpt:
      "Broad market index funds have earned a place in many cores. Sector products still need an exit thesis.",
    date: "2026-09-01",
    category: "Mutual Fund",
    author: "News desk",
    body: [
      "Owning all-India at low cost is one decision. Owning one industry's cycle is another. We treat sector indexes as satellites, not set-and-forget SIPs.",
      "Check overlap with your flexi-cap before you add more financials or IT by accident.",
    ],
  },
  {
    slug: "debt-markets-and-duration",
    title: "Duration is a date question, not a yield contest",
    excerpt:
      "Rate headlines are loud. The useful prompt is still: when do you need this cash in the bank?",
    date: "2026-08-31",
    category: "Share Markets",
    author: "News desk",
    body: [
      "Money you may need inside two years belongs in liquid or short-duration funds. Stretching duration for extra yield is a rates view, not a savings account with better branding.",
      "Goal date first, credit quality second. If you use a longer bond, it should be money you can leave through mark-to-market noise.",
    ],
  },
  {
    slug: "sip-book-crosses-record-flows",
    title: "Record SIP flows say more about habit than about timing",
    excerpt:
      "Monthly contribution numbers keep setting records. That is a story about discipline, not about the level of the index.",
    date: "2026-08-28",
    category: "Mutual Fund",
    author: "News desk",
    body: [
      "A rising SIP book means more households are automating a decision they used to postpone. It does not tell you whether the market is cheap.",
      "The number worth watching is not the headline flow, it is how many of those instalments survive the next drawdown.",
    ],
  },
  {
    slug: "capital-gains-paperwork-before-march",
    title: "Do the capital gains arithmetic before March, not in July",
    excerpt:
      "Harvesting decisions are cheap in January and expensive once the return is due. A short annual review avoids most of the scramble.",
    date: "2026-08-24",
    category: "Income Tax",
    author: "News desk",
    body: [
      "Pull the realised gains statement from the registrar, not from memory. Long-term and short-term buckets behave differently and the difference is worth actual money.",
      "If a rebalance is due anyway, the tax position may decide the order in which you sell. It should rarely decide whether you rebalance at all.",
    ],
  },
  {
    slug: "expense-ratio-disclosures-tighten",
    title: "Cost disclosure is improving. Reading it is still your job.",
    excerpt:
      "Clearer expense reporting only helps if someone compares the direct and regular figures before signing.",
    date: "2026-08-20",
    category: "BFSI Industry",
    author: "News desk",
    body: [
      "We publish our commission ranges on this site for the same reason: a cost you cannot see is a cost you cannot argue with.",
      "Ask what you pay, ask what we receive, and ask what changes if you move the folio elsewhere. Any distributor should answer all three without flinching.",
    ],
  },
  {
    slug: "nomination-deadline-reminder",
    title: "The nomination deadline is a filing task, not a financial one",
    excerpt:
      "Folios without nomination details create work for the people least equipped to do it. It takes an afternoon to fix.",
    date: "2026-08-14",
    category: "Mutual Fund",
    author: "News desk",
    body: [
      "Nomination is not estate planning, but its absence turns a simple transmission into a documentation exercise at the worst possible time.",
      "Check every folio, including the ones held jointly and the ones you opened before you were married.",
    ],
  },
  {
    slug: "volatility-and-the-pause-button",
    title: "A pause button beats a panic redemption",
    excerpt:
      "When cash flow cracks, stopping contributions for a quarter costs far less than liquidating the corpus.",
    date: "2026-08-08",
    category: "Share Markets",
    author: "News desk",
    body: [
      "Most SIPs can be paused rather than cancelled. The distinction matters, because restarting a paused mandate is administrative while rebuilding a redeemed folio is not.",
      "Call before you redeem. There is usually a smaller lever available.",
    ],
  },
];

export const faqs = {
  "mutual-funds": [
    {
      q: "Do you guarantee mutual fund returns?",
      a: "No. Markets move. We plan with ranges and behaviour, not promised percentages. Past performance is not a forecast.",
    },
    {
      q: "SIP or lumpsum: which one should I use?",
      a: "A SIP is a fixed amount on a schedule, usually monthly. A lumpsum is once. SIPs help if cash arrives every month; lumpsums can make sense when surplus is sitting idle and the horizon is long.",
    },
    {
      q: "How do I know the monthly amount is sane?",
      a: "Work backwards from the goal and the years you have, then check it still fits after rent, EMIs, emergency savings, and insurance. The calculators here are illustrations, not advice.",
    },
    {
      q: "Can I pause a SIP without selling units?",
      a: "Usually yes. Pausing or cancelling the mandate stops new purchases. Units you already hold stay yours until you redeem.",
    },
    {
      q: "Who decides the tax on my funds?",
      a: "Category and holding period, and the law can change. We flag placement; a tax advisor signs off on your return. Read the scheme documents.",
    },
  ],
  nri: [
    {
      q: "Can I invest from overseas?",
      a: "Most schemes are open to NRIs with FATCA/CRS, KYC, and the right bank account (NRE or NRO). Some AMCs block certain countries. We check before onboarding.",
    },
    {
      q: "NRE or NRO: which account funds the SIP?",
      a: "NRE is typically for repatriable money; NRO for rupee income in India. The source of funds and whether you need to take money out later decide it. We flag the FEMA/banking question early.",
    },
    {
      q: "Must I fly to India for KYC?",
      a: "Often no. Attested documents and KRA-accepted verification can work. The checklist depends on where you live.",
    },
    {
      q: "Will tax be cut when I redeem?",
      a: "TDS can apply by fund type and holding period. Treaties may help. Use a cross-border tax advisor; we do not replace that.",
    },
  ],
  planning: [
    {
      q: "What happens in the first meeting?",
      a: "A picture of cash flow, existing products, debts, and the goals that matter in 3, 10, and 25 years. You leave with priorities, not a stack of forms.",
    },
    {
      q: "How are you paid?",
      a: "As an AMFI-registered distributor, trail commission from AMCs is the usual model, disclosed on this site. We say so if a lawyer or another specialist needs a separate fee.",
    },
    {
      q: "How often do we look at the portfolio?",
      a: "At least once a year, and after marriage, a child, a home, a job change, or an inheritance. A loud market week is not automatically a reason to reshuffle.",
    },
    {
      q: "Will you try to time the market for me?",
      a: "No. We may stagger a fresh lumpsum or rebalance. The default is that you stay invested through the cycle.",
    },
  ],
} as const;

export const commissionRows = [
  ["Aditya Birla", "0.75-1.10", "0.40-0.75", "0.07-0.08", "0.35-0.40"],
  ["Axis", "0.70-1.15", "0.40-0.50", "0.02-0.05", "0.40-0.55"],
  ["DSP", "0.65-1.20", "0.70-1.15", "0.10-0.25", "0.10-0.20"],
  ["HDFC", "0.72-1.30", "0.50-1.00", "0.10-0.10", "0.45-0.75"],
  ["ICICI Prudential", "0.40-0.80", "0.30-0.55", "0.05-0.05", "0.45-0.50"],
  ["Kotak", "0.90-1.40", "0.70-1.15", "0.03-0.08", "0.50-0.90"],
  ["Mirae Asset", "0.80-1.25", "0.75-1.20", "0.05-0.10", "0.35-0.40"],
  ["Nippon India", "0.85-1.30", "0.35-1.20", "0.05-0.08", "0.25-0.90"],
  ["PPFAS", "0.75-1.10", "0.30-0.45", "0.05-0.10", "-"],
  ["SBI", "0.80-1.30", "0.70-0.95", "0.08-0.10", "0.35-0.55"],
] as const;

export function getPost(slug: string) {
  return [...blogPosts, ...newsItems].find((item) => item.slug === slug);
}
