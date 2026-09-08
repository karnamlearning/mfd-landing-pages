export const site = {
  name: "Nila Investment Services",
  legalName: "Nila Investment Services",
  shortName: "Nila",
  tagline: "Plan your goals. Invest with confidence.",
  amfiMark: {
    tagline: "AMFI Registered Mutual Fund Distributor",
  },
  description:
    "Mutual fund distribution, insurance, and FD & bond services - helping investors select, execute, monitor, and stay serviced.",
  foundedYear: 2014,
  url: "https://www.nilainvestmentservices.com",
  email: "nilainvestmentservices@gmail.com",
  advisorEmail: "nilainvestmentservices@gmail.com",
  phone: "+91 98950 96596",
  phoneHref: "tel:+919895096596",
  whatsapp: "https://wa.me/919895096596",
  hours: "Mon – Sat, 9:30 AM – 6:30 PM",
  address: {
    lines: [
      "Nila Investment Services",
      "Building No-66/1858 AI, Veekshnam Road,",
      "Ernakulam, Kerala 682018",
    ],
    city: "Ernakulam",
    mapUrl:
      "https://maps.google.com/?q=Building+No-66%2F1858+AI%2C+Veekshnam+Road%2C+Ernakulam+682018",
  },
  /** AMFI registrations, each with the employee unique identification number (EUIN). */
  registrations: [
    {
      label: "AMFI Registration",
      value: "ARN-131835",
      detail: "EUIN E008304",
    },
    {
      label: "AMFI Registration",
      value: "ARN-97263",
      detail: "EUIN E111790",
    },
  ],
  /**
   * Home page stat band. `value` is a number so it can count up on screen;
   * prefix/suffix carry the currency sign and the "+". `icon` keys into
   * statIcons in components/icons.tsx.
   */
  stats: [
    {
      icon: "years",
      value: 12,
      suffix: "+",
      label: "Years of experience",
      note: "Advising families since 2014",
    },
    {
      icon: "families",
      value: 552,
      suffix: "",
      label: "Investors",
      note: "Families and individuals we service",
    },
    {
      icon: "assets",
      value: 156,
      prefix: "₹",
      suffix: " Cr",
      label: "Assets under management",
      note: "Mutual fund assets we service",
    },
    {
      icon: "amcs",
      value: 40,
      suffix: "+",
      label: "Fund houses",
      note: "Open architecture, no house bias",
    },
  ],
  social: [
    { name: "LinkedIn", href: "https://www.linkedin.com/" },
    { name: "X", href: "https://x.com/" },
    { name: "Instagram", href: "https://www.instagram.com/" },
    { name: "YouTube", href: "https://www.youtube.com/" },
  ],
  portal: {
    login: "https://nilainvestment.themfbox.com/",
    signup: "#signup",
  },
  scores: "https://scores.sebi.gov.in/",
  smartOdr: "https://smartodr.in/",
} as const;

export type SiteStat = (typeof site.stats)[number];

export type NavChild = { label: string; href: string; description?: string };

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "About Us",
        href: "/about",
        description: "Our story, mission, and way of working",
      },
      {
        label: "Our Team",
        href: "/about/team",
        description: "The advisors and planners behind your plan",
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Mutual Funds",
        href: "/services#mutual-funds",
        description: "Onboarding to portfolio monitoring as an AMFI-registered MFD",
      },
      {
        label: "Insurance",
        href: "/services#insurance",
        description: "Needs analysis, policies, renewals, and claims assistance",
      },
      {
        label: "FD & Bonds",
        href: "/services#fd-bonds",
        description: "Fixed deposits, bonds, ladders, and maturity planning",
      },
      {
        label: "All services",
        href: "/services",
        description: "Full catalogue across mutual funds, insurance, and fixed income",
      },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "SIP Calculator", href: "/tools#sip-calculator", description: "Calculator" },
      { label: "Lumpsum Calculator", href: "/tools#lumpsum-calculator", description: "Calculator" },
      { label: "Child Education Planner", href: "/tools#child-education-planner", description: "Calculator" },
      { label: "Retirement Planner", href: "/tools#retirement-planner", description: "Calculator" },
      { label: "Goal Setting Calculator", href: "/tools#goal-setting-calculator", description: "Calculator" },
      { label: "SWP Calculator", href: "/tools#swp-calculator", description: "Calculator" },
      { label: "Trailing Returns", href: "/tools#trailing-returns", description: "Research" },
      { label: "MF SIP Returns", href: "/tools#mf-sip-returns", description: "Research" },
      { label: "MF Lumpsum Returns", href: "/tools#mf-lumpsum-returns", description: "Research" },
      { label: "SWP Return Calculator", href: "/tools#swp-return-calculator", description: "Research" },
    ],
  },
  {
    label: "Insights",
    href: "/blog",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
      { label: "Mutual Funds", href: "/mutual-funds" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about/team" },
    { label: "Contact Us", href: "/contact" },
    { label: "Commission Disclosures", href: "/disclosures" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  offerings: [
    { label: "Mutual Funds", href: "/services#mutual-funds" },
    { label: "Insurance", href: "/services#insurance" },
    { label: "FD & Bonds", href: "/services#fd-bonds" },
    { label: "Calculators", href: "/tools#sip-calculator" },
    { label: "Research", href: "/tools#trailing-returns" },
    { label: "Blog", href: "/blog" },
    { label: "News", href: "/news" },
  ],
  learn: [
    { label: "Mutual Funds", href: "/mutual-funds" },
    { label: "Blog", href: "/blog" },
    { label: "News", href: "/news" },
  ],
};

export const incomeRanges = [
  "Below ₹15 Lakhs",
  "₹15 Lakhs – ₹50 Lakhs",
  "₹50 Lakhs – ₹1 Crore",
  "Above ₹1 Crore",
] as const;

export const netWorthRanges = [
  "Below ₹1 Crore",
  "₹1 Crore – ₹5 Crores",
  "₹5 Crores – ₹25 Crores",
  "Above ₹25 Crores",
] as const;

export const horizons = [
  "Short term (3 – 5 years)",
  "Mid term (5 – 10 years)",
  "Long term (10+ years)",
] as const;
