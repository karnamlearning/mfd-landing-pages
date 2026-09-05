export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  description: string;
  whoFor: string[];
  highlights: string[];
  illustration?: {
    title: string;
    lines: string[];
    note?: string;
  };
};

export const services: Service[] = [
  {
    slug: "investor-onboarding",
    title: "Investor Onboarding",
    shortTitle: "Onboarding",
    eyebrow: "Get started",
    summary:
      "Mutual fund account opening, KYC / CKYC, FATCA/CRS, bank and nomination details, and folio set-up - using AMFI-standard forms and processes.",
    description:
      "Buying a mutual fund starts with a clean account. We help you open the folio, complete KYC or CKYC, file FATCA/CRS where required, and register PAN, bank details, email, and mobile. We also guide nomination, contact updates, demat or non-demat choices, folio creation, and consolidation so your first investment is not held up by paperwork. AMFI provides standardised forms for KYC and investor-service requests; we walk you through them and explain the investment process before you commit money.",
    whoFor: [
      "First-time mutual fund investors",
      "NRIs completing KYC, FATCA/CRS, and NRE or NRO bank details",
      "Families consolidating folios opened across banks and apps",
    ],
    highlights: [
      "KYC / CKYC assistance and FATCA/CRS documentation",
      "PAN, bank mandate, email, and mobile registration",
      "Nomination and contact-detail updates",
      "Demat or non-demat guidance, folio creation, and consolidation",
    ],
  },
  {
    slug: "investor-profiling",
    title: "Investor Profiling & Requirements",
    shortTitle: "Profiling",
    eyebrow: "Suitability",
    summary:
      "We understand age, risk tolerance, horizon, liquidity, existing holdings, and SIP or SWP needs before any scheme is discussed.",
    description:
      "Suitability comes before selection. We take time to understand your age, risk tolerance, investment horizon, amount, liquidity needs, existing investments, and objectives - including SIP and SWP requirements and short-, medium-, and long-term goals. SEBI and AMFI expect distributors to act in the investor's interest, exercise due diligence, and ensure that what is offered is appropriate. That is why we profile first and only then talk about schemes.",
    whoFor: [
      "Anyone starting a relationship with us",
      "Investors whose goals or cash flow have changed",
      "Households with SIPs that were never mapped to a purpose",
    ],
    highlights: [
      "Age, risk tolerance, and investment horizon",
      "Investment amount and liquidity requirements",
      "Existing holdings versus stated objectives",
      "SIP, SWP, and short- to long-term needs captured in writing",
    ],
  },
  {
    slug: "scheme-selection",
    title: "Mutual Fund Scheme Selection",
    shortTitle: "Scheme Selection",
    eyebrow: "Core work",
    summary:
      "Help choosing among equity, debt, hybrid, ELSS, index, ETF, and other permitted schemes we are authorised to distribute - with investor interest first.",
    description:
      "As an AMFI-registered distributor, we help you understand and select from the mutual fund schemes we are authorised to distribute: equity, debt, and hybrid funds; solution-oriented funds and ELSS; index funds and ETFs; fund of funds; and other permitted products. We explain the investment objective, asset allocation, risk, scheme characteristics, portfolio, expense ratio, exit load, benchmarks, historical performance, fund manager, and strategy - in language you can use. We do not recommend a scheme merely because it generates commission. Under AMFI's Code of Conduct, your interest remains paramount.",
    whoFor: [
      "Investors building or rebuilding a core portfolio",
      "Savers comparing regular, direct, active, and index options",
      "Anyone who wants the trade-offs explained before they invest",
    ],
    highlights: [
      "Equity, debt, hybrid, ELSS, index, ETF, and FoF options explained",
      "Objective, allocation, risk, costs, and benchmarks discussed upfront",
      "Historical performance and manager style in context, not isolation",
      "Open architecture across fund houses; no house product to push",
    ],
  },
  {
    slug: "sip-services",
    title: "SIP Services",
    shortTitle: "SIP Services",
    eyebrow: "Systematic investing",
    summary:
      "SIP registration, mandates, pause, step-up, date changes, and goal tracking - including a SIP health review when you want one.",
    description:
      "Most long-term investing here runs through SIPs. We help with registration and bank-mandate set-up, then with the servicing that keeps the SIP alive: modify, increase or decrease, pause, restart, cancel, change the date, step-up, and top-up. We also review SIP returns, track them against goals, and look at the SIP book as a portfolio - not a set of forgotten mandates. The point is a SIP you can keep, not one that looks good on day one.",
    whoFor: [
      "Salaried investors starting or raising a monthly SIP",
      "Families who want step-up SIPs tied to income growth",
      "Anyone with SIPs spread across apps who wants one view",
    ],
    highlights: [
      "Registration and bank-mandate assistance",
      "Modify, pause, restart, cancel, and date-change requests",
      "Step-up, top-up, and amount changes",
      "SIP return analysis, goal tracking, and portfolio review",
    ],
    illustration: {
      title: "Illustration - SIP health review",
      lines: [
        "Current SIP → ₹50,000 / month",
        "Annual SIP increase → 10%",
        "Current value → ₹32 lakh",
        "Target corpus → ₹1.5 crore",
        "Estimated shortfall and suggested action → increase the SIP or extend the horizon",
      ],
      note: "Figures are educational illustrations, not a forecast or a client result. Markets, cash flow, and assumptions change.",
    },
  },
  {
    slug: "lumpsum-investments",
    title: "Lumpsum Investment Services",
    shortTitle: "Lumpsum",
    eyebrow: "One-time investing",
    summary:
      "New purchases, additional investments, NFOs, allocation across schemes, and STP, SWP, switch, or redemption support.",
    description:
      "When surplus arrives - a bonus, a sale, a maturity - we help you invest it with a plan. That includes new investments, additional purchases, NFO subscriptions where they fill a genuine gap, and allocation across schemes. We also set up STPs and SWPs, and help with switches, redemptions, and rebalancing through transactions where that is appropriate. A lumpsum is sized to your horizon and emergency buffer, not to last quarter's table-topper.",
    whoFor: [
      "Investors deploying a bonus, maturity, or sale proceeds",
      "Those moving money from a liquid fund into a longer-term mix",
      "Anyone considering an NFO against an existing scheme",
    ],
    highlights: [
      "New investments, additional purchases, and NFO support",
      "Allocation across schemes after the profile is clear",
      "STP and SWP set-up",
      "Switch, redemption, and rebalancing transactions where appropriate",
    ],
  },
  {
    slug: "transaction-execution",
    title: "Transaction Execution",
    shortTitle: "Transactions",
    eyebrow: "Online and offline",
    summary:
      "Purchase, additional purchase, switch, SIP, STP, SWP, bank mandates, and folio requests - executed with the AMC on your behalf.",
    description:
      "Execution is a core distributor service. SEBI describes the role as including help for investors to place transactions with AMCs. We handle purchase, additional purchase, switch, SIP, STP, and SWP - online and offline - along with bank-mandate set-up and nomination or folio-related service requests. You see what was placed, in which folio, and when it was confirmed.",
    whoFor: [
      "Investors who want one desk for all AMC transactions",
      "NRIs who cannot visit a branch for every request",
      "Households that prefer paper or assisted online execution",
    ],
    highlights: [
      "Purchase, additional purchase, switch, SIP, STP, and SWP",
      "Bank-mandate set-up",
      "Nomination and folio-related service requests",
      "Online and offline execution with confirmation",
    ],
  },
  {
    slug: "portfolio-monitoring",
    title: "Portfolio Monitoring",
    shortTitle: "Portfolio Monitoring",
    eyebrow: "Ongoing value",
    summary:
      "Valuation, XIRR, capital gains, scheme and category allocation, concentration, and benchmark comparison - reviewed, not only sold.",
    description:
      "This is where an MFD adds ongoing value. We move from selling a fund to servicing the book: current valuation with absolute and XIRR returns, capital gains, scheme-wise performance, asset allocation, AMC-wise and category-wise split, concentration and top holdings, schemes that are lagging, scheme-versus-benchmark comparison, and a plain-language view of portfolio risk. The relationship is continuous monitoring and service, not a one-time purchase.",
    whoFor: [
      "Investors with SIPs or lumpsums that have not been reviewed",
      "Families who want one allocation picture across AMCs",
      "Anyone who wants XIRR and gains, not only a latest NAV",
    ],
    highlights: [
      "Valuation with absolute return, XIRR, and capital gains",
      "Scheme, AMC, and category allocation",
      "Concentration, top holdings, and laggards flagged",
      "Benchmark comparison and portfolio risk discussed in reviews",
    ],
  },
  {
    slug: "goal-based-investing",
    title: "Goal-Based Investment Support",
    shortTitle: "Goal-Based Investing",
    eyebrow: "Purpose",
    summary:
      "Mutual fund investing mapped to education, marriage, retirement, a home, a vacation, an emergency corpus, or financial independence.",
    description:
      "A SIP without a job is just a debit. We help you see mutual fund investments in the context of objectives: children's education and marriage, retirement, wealth creation, a house, a vacation, an emergency corpus, or financial independence. We can show projected outcomes under different assumptions and what changes if you raise the SIP or extend the horizon. That is comprehensive investment planning around the goal - not a product pitch with a goal sticker.",
    whoFor: [
      "Parents funding education or marriage",
      "Households saving for a home or a defined corpus",
      "Anyone who wants each SIP tied to a date and an amount",
    ],
    highlights: [
      "Education, marriage, home, vacation, and emergency goals",
      "Retirement and financial-independence planning",
      "Projected outcomes under stated assumptions",
      "SIP and horizon changes explained before you make them",
    ],
    illustration: {
      title: "Illustration - education goal",
      lines: [
        "Goal → ₹1 crore for a child's education",
        "Time → 12 years",
        "Current investment → ₹15 lakh",
        "Monthly SIP → ₹40,000",
      ],
      note: "Projections use constant assumed rates for education only. They are not guaranteed and they are not investment advice.",
    },
  },
  {
    slug: "retirement-planning",
    title: "Retirement Planning Support",
    shortTitle: "Retirement Planning",
    eyebrow: "Later-life income",
    summary:
      "Corpus illustrations, SIP projections, inflation-adjusted needs, existing-corpus analysis, and SWP or retirement-income pictures.",
    description:
      "Retirement support from an MFD is about the mutual fund path to a later-life income. We prepare corpus illustrations, SIP accumulation projections, inflation-adjusted spending needs, analysis of what you already have, corpus-depletion pictures, and SWP or retirement-income illustrations. Assumptions are written down so you can see what happens if inflation, the SIP, or the retirement date changes.",
    whoFor: [
      "Professionals ten to twenty years from retirement",
      "Business owners without a formal pension",
      "Couples who want a corpus number and a withdrawal picture",
    ],
    highlights: [
      "Inflation-adjusted retirement-need illustrations",
      "SIP calculations and accumulation projections",
      "Existing-corpus and depletion analysis",
      "SWP and retirement-income illustrations",
    ],
    illustration: {
      title: "Illustration - retirement picture",
      lines: [
        "Current monthly expense → ₹1 lakh",
        "Retirement in → 15 years",
        "Inflation assumption → stated in the review",
        "Required corpus and expected SIP → worked from those inputs",
      ],
      note: "Illustrations use constant rates. They are not a promised corpus or a guaranteed withdrawal.",
    },
  },
  {
    slug: "tax-capital-gains",
    title: "Tax & Capital Gains Support",
    shortTitle: "Tax & Gains",
    eyebrow: "Information, not advice",
    summary:
      "Help reading realised and unrealised gains, STCG/LTCG classification, ELSS, and the tax implications of redemptions or switches - with a tax professional for the return.",
    description:
      "We help you understand mutual-fund-related tax information: realised and unrealised capital gains, short-term versus long-term classification, capital-gains statements, ELSS as a tax-saving investment, and the tax implications of a redemption or switch. We can pull or walk through capital-gains reports. We are not a tax advisor and may not be the right professional to file your return. Please consult a qualified tax professional before you act on tax questions.",
    whoFor: [
      "Investors preparing for a financial-year review",
      "Anyone planning a switch or redemption and wanting the tax picture first",
      "Savers considering ELSS alongside other 80C options",
    ],
    highlights: [
      "Realised and unrealised gains, with STCG / LTCG classification",
      "Capital-gains statements and reports",
      "ELSS explained as one tax-saving option, not the only one",
      "Redemption and switch implications flagged; a CA signs off the return",
    ],
  },
  {
    slug: "investor-service",
    title: "Investor Service & Support",
    shortTitle: "Investor Service",
    eyebrow: "Day to day",
    summary:
      "Statements, CAS, folio changes, nomination, KYC and FATCA updates, transmission, broker change, and grievance assistance - promptly.",
    description:
      "After the SIP is live, service is the job. We help with account statements and CAS, folio consolidation, folio information, and transaction confirmations. We process bank, address, email, and mobile changes; nomination, KYC, and FATCA updates; transmission and death-claim assistance; and change-of-broker or distributor requests. We also help you raise and track grievances. AMFI expects prompt, competent investor service and grievance handling. We treat that as the standard, not an extra.",
    whoFor: [
      "Existing clients with a change of bank, address, or nominee",
      "Families dealing with transmission or a death claim",
      "Investors moving a folio to or from another distributor",
    ],
    highlights: [
      "Statements, CAS, folio information, and confirmations",
      "Bank, address, email, mobile, nomination, KYC, and FATCA updates",
      "Transmission, death-claim, and change-of-broker assistance",
      "Grievance handling in line with AMFI expectations",
    ],
  },
];

export const servicesIntro =
  "As an AMFI-registered Mutual Fund Distributor, we do more than help you buy a scheme. The work is selecting what fits, executing the transaction, monitoring the portfolio, and staying available for service.";

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
  kicker: "AMFI-registered Mutual Fund Distributor",
  title: "A clear plan for every",
  highlight: "rupee you invest.",
  body: "As an AMFI-registered Mutual Fund Distributor, we help you select suitable schemes, execute transactions, monitor the portfolio, and stay serviced - for individuals, families, and NRIs.",
};

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

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function getPost(slug: string) {
  return [...blogPosts, ...newsItems].find((item) => item.slug === slug);
}
