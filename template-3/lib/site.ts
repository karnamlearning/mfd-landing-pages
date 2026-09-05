export const site = {
  name: "Aarohan Wealth",
  legalName: "Aarohan Wealth Advisors LLP",
  shortName: "Aarohan",
  /** Small line under the name in the logo. Keep it to two or three words. */
  logoTagline: "Mutual Fund Distributor",
  tagline: "Plan your goals. Invest with confidence.",
  description:
    "AMFI-registered mutual fund distributor helping investors with onboarding, scheme selection, SIPs, transactions, portfolio monitoring, and ongoing service.",
  foundedYear: 2014,
  url: "https://www.aarohanwealth.in",
  email: "hello@aarohanwealth.in",
  advisorEmail: "advisor@aarohanwealth.in",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "https://wa.me/919876543210",
  hours: "Mon – Sat, 9:30 AM – 6:30 PM",
  address: {
    lines: [
      "Aarohan Wealth Advisors LLP",
      "4th Floor, Meridian House,",
      "Plot 12, Bandra Kurla Complex,",
      "Mumbai, Maharashtra 400051",
    ],
    city: "Mumbai",
    mapUrl: "https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai",
  },
  registrations: [
    {
      label: "AMFI Registration",
      value: "ARN-248761",
      detail: "Firm registration",
      validTill: "31 Jan 2028",
    },
    {
      label: "AMFI Registration",
      value: "ARN-136842",
      detail: "Principal Officer",
      validTill: "30 Nov 2027",
    },
    {
      label: "APMI Registration",
      value: "APRN01840",
      detail: "Portfolio Management distribution",
      validTill: "28 Feb 2027",
    },
    {
      label: "FPSB India",
      value: "IN-48210",
      detail: "Certified Financial Planner",
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
      value: 2500,
      suffix: "+",
      label: "Families served",
      note: "Across India and overseas",
    },
    {
      icon: "assets",
      value: 350,
      prefix: "₹",
      suffix: " Cr+",
      label: "Client investments",
      note: "SIPs and folios we service",
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
    login: "#login",
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
      { label: "Investor Onboarding", href: "/services/investor-onboarding" },
      { label: "Investor Profiling", href: "/services/investor-profiling" },
      { label: "Scheme Selection", href: "/services/scheme-selection" },
      { label: "SIP Services", href: "/services/sip-services" },
      { label: "Lumpsum Investments", href: "/services/lumpsum-investments" },
      { label: "Transaction Execution", href: "/services/transaction-execution" },
      { label: "Portfolio Monitoring", href: "/services/portfolio-monitoring" },
      { label: "Goal-Based Investing", href: "/services/goal-based-investing" },
      { label: "Retirement Planning", href: "/services/retirement-planning" },
      { label: "Tax & Capital Gains", href: "/services/tax-capital-gains" },
      { label: "Investor Service", href: "/services/investor-service" },
    ],
  },
  {
    label: "Calculators",
    href: "/calculators",
    children: [
      { label: "Become a Crorepati", href: "/calculators/become-a-crorepati" },
      { label: "SIP Return Calculator", href: "/calculators/sip-return" },
      {
        label: "Retirement Planning",
        href: "/calculators/retirement-planning",
      },
      { label: "SIP Step-Up Calculator", href: "/calculators/sip-step-up" },
      { label: "Lumpsum Target", href: "/calculators/lumpsum-target" },
      {
        label: "Children Education Planner",
        href: "/calculators/children-education",
      },
      { label: "Target Amount SIP", href: "/calculators/target-amount-sip" },
    ],
  },
  {
    label: "Insights",
    href: "/blog",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
      { label: "FAQs", href: "/faqs" },
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
    { label: "Calculators", href: "/calculators" },
    { label: "Blog", href: "/blog" },
    { label: "News", href: "/news" },
    { label: "Our Services", href: "/services" },
  ],
  faqs: [
    { label: "Mutual Fund FAQs", href: "/faqs#mutual-funds" },
    { label: "NRI Corner FAQs", href: "/faqs#nri" },
    { label: "Financial Planning", href: "/faqs#planning" },
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
