/**
 * Full services catalogue: Mutual Funds, Insurance, and FD & Bonds.
 * Detail pages and the /services index both read from here.
 */

export type ServiceCategoryId = "mutual-funds" | "insurance" | "fd-bonds";

export type Service = {
  slug: string;
  category: ServiceCategoryId;
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

export const serviceCategories: {
  id: ServiceCategoryId;
  title: string;
  eyebrow: string;
  summary: string;
  note?: string;
}[] = [
    {
      id: "mutual-funds",
      title: "Mutual Funds",
      eyebrow: "AMFI-registered MFD",
      summary:
        "As an AMFI-registered Mutual Fund Distributor in India, we do more than help you buy a scheme. The real value is selecting what fits, executing transactions, monitoring the portfolio, and staying available for ongoing service.",
    },
    {
      id: "insurance",
      title: "Insurance",
      eyebrow: "Insurance agent",
      summary:
        "As an insurance agent we offer more than selling a policy. Depending on your needs, the work covers protection planning, policy servicing, claims assistance, renewals, and periodic protection reviews.",
    },
    {
      id: "fd-bonds",
      title: "FD & Bonds",
      eyebrow: "Fixed income",
      summary:
        "As an FD and bond distributor we help you compare opportunities, select products for your requirements, complete transactions, and manage a fixed-income book - not only place a single deposit.",
      note: "Our role depends on the products and distribution arrangements we are authorised for. We distinguish product information and distribution from regulated investment advice, and we do not promise returns or understate credit, interest-rate, liquidity, reinvestment, or premature-withdrawal risks.",
    },
  ];

const mfWho = {
  onboarding: [
    "First-time mutual fund investors",
    "NRIs completing KYC, FATCA/CRS, and NRE or NRO bank details",
    "Families consolidating folios opened across banks and apps",
  ],
  profiling: [
    "Anyone starting a relationship with us",
    "Investors whose goals or cash flow have changed",
    "Households with SIPs that were never mapped to a purpose",
  ],
  selection: [
    "Investors building or rebuilding a core portfolio",
    "Savers comparing regular, direct, active, and index options",
    "Anyone who wants the trade-offs explained before they invest",
  ],
  sip: [
    "Salaried investors starting or raising a monthly SIP",
    "Families who want step-up SIPs tied to income growth",
    "Anyone with SIPs spread across apps who wants one view",
  ],
  lumpsum: [
    "Investors deploying a bonus, maturity, or sale proceeds",
    "Those moving money from a liquid fund into a longer-term mix",
    "Anyone considering an NFO against an existing scheme",
  ],
  tx: [
    "Investors who want one desk for all AMC transactions",
    "NRIs who cannot visit a branch for every request",
    "Households that prefer paper or assisted online execution",
  ],
  monitor: [
    "Investors with SIPs or lumpsums that have not been reviewed",
    "Families who want one allocation picture across AMCs",
    "Anyone who wants XIRR and gains, not only a latest NAV",
  ],
  goals: [
    "Parents funding education or marriage",
    "Households saving for a home or a defined corpus",
    "Anyone who wants each SIP tied to a date and an amount",
  ],
  retire: [
    "Professionals ten to twenty years from retirement",
    "Business owners without a formal pension",
    "Couples who want a corpus number and a withdrawal picture",
  ],
  tax: [
    "Investors preparing for a financial-year review",
    "Anyone planning a switch or redemption and wanting the tax picture first",
    "Savers considering ELSS alongside other 80C options",
  ],
  service: [
    "Existing clients with a change of bank, address, or nominee",
    "Families dealing with transmission or a death claim",
    "Investors moving a folio to or from another distributor",
  ],
} as const;

function line(
  category: ServiceCategoryId,
  slug: string,
  title: string,
  shortTitle: string,
  eyebrow: string,
  summary: string,
  description: string,
  whoFor: string[],
  highlights: string[],
  illustration?: Service["illustration"],
): Service {
  return {
    category,
    slug,
    title,
    shortTitle,
    eyebrow,
    summary,
    description,
    whoFor,
    highlights,
    illustration,
  };
}

/** Compact builder for insurance / FD rows from the service tables. */
function row(
  category: ServiceCategoryId,
  slug: string,
  title: string,
  summary: string,
  highlights: string[],
  whoFor: string[],
  eyebrow = "Service",
): Service {
  return line(
    category,
    slug,
    title,
    title.replace(/^Insurance |^FD |^Bond /i, "").slice(0, 28),
    eyebrow,
    summary,
    summary,
    whoFor,
    highlights,
  );
}

const insuranceWho = [
  "Individuals and families reviewing life and health cover",
  "Households with policies that have not been reviewed in years",
  "Business owners checking employee or property-related covers",
];

const fdWho = [
  "Investors looking for fixed-income options beyond a single bank FD",
  "Families planning for a known expense on a fixed date",
  "Anyone comparing yields, credit quality, and liquidity before investing",
];

export const services: Service[] = [
  /* ----------------------------------------------------------- Mutual Funds --- */
  line(
    "mutual-funds",
    "investor-onboarding",
    "Investor Onboarding",
    "Onboarding",
    "Get started",
    "Mutual fund account opening, KYC / CKYC, FATCA/CRS, bank and nomination details, and folio set-up - using AMFI-standard forms and processes.",
    "Buying a mutual fund starts with a clean account. We help you open the folio, complete KYC or CKYC, file FATCA/CRS where required, and register PAN, bank details, email, and mobile. We also guide nomination, contact updates, demat or non-demat choices, folio creation, and consolidation so your first investment is not held up by paperwork. AMFI provides standardised forms for KYC and investor-service requests; we walk you through them and explain the investment process before you commit money.",
    [...mfWho.onboarding],
    [
      "Mutual fund account opening",
      "KYC / CKYC assistance and FATCA/CRS documentation",
      "PAN, bank details, nomination, and contact updates",
      "Demat or non-demat guidance, folio creation, and consolidation",
    ],
  ),
  line(
    "mutual-funds",
    "investor-profiling",
    "Investor Profiling & Understanding Requirements",
    "Profiling",
    "Suitability",
    "We understand age, risk tolerance, horizon, liquidity, existing holdings, and SIP or SWP needs before any scheme is discussed.",
    "As an MFD we take time to understand age, risk tolerance, investment horizon, amount, liquidity needs, existing investments versus objectives, SIP and SWP requirements, and short-, medium-, and long-term needs. SEBI and AMFI emphasise acting in the investor's interest, exercising due diligence, and ensuring suitability. That is why we profile first and only then talk about schemes.",
    [...mfWho.profiling],
    [
      "Age, risk tolerance, and investment horizon",
      "Investment amount and liquidity requirements",
      "Existing holdings versus stated objectives",
      "SIP, SWP, and short- to long-term needs captured in writing",
    ],
  ),
  line(
    "mutual-funds",
    "scheme-selection",
    "Mutual Fund Scheme Selection",
    "Scheme Selection",
    "Core work",
    "Help choosing among equity, debt, hybrid, ELSS, index, ETF, and other permitted schemes we are authorised to distribute - with investor interest first.",
    "We help you understand and select from the mutual fund schemes we are authorised to distribute: equity, debt, and hybrid funds; solution-oriented funds and ELSS; index funds and ETFs; fund of funds; and other permitted products. We explain investment objective, asset allocation, risk, scheme characteristics, portfolio, expense ratio, exit load, benchmarks, historical performance, fund manager, and strategy. We do not recommend a scheme merely because it generates commission. Under AMFI's Code of Conduct, your interest remains paramount.",
    [...mfWho.selection],
    [
      "Equity, debt, hybrid, ELSS, index, ETF, and FoF options explained",
      "Objective, allocation, risk, costs, and benchmarks discussed upfront",
      "Historical performance and manager style in context",
      "Open architecture; investor interest ahead of commission",
    ],
  ),
  line(
    "mutual-funds",
    "sip-services",
    "SIP Services",
    "SIP Services",
    "Systematic investing",
    "SIP registration, mandates, pause, step-up, date changes, and goal tracking - including a SIP health review when you want one.",
    "We help with SIP registration and bank-mandate set-up, then with the servicing that keeps the SIP alive: modify, increase or decrease, pause, restart, cancel, change the date, step-up, and top-up. We also review SIP returns, track them against goals, and look at the SIP book as a portfolio. A SIP health review can show current SIP, annual increase, current value, target corpus, estimated shortfall, and a suggested action such as increasing the SIP or extending the horizon.",
    [...mfWho.sip],
    [
      "Registration and bank-mandate assistance",
      "Modify, pause, restart, cancel, and date-change requests",
      "Step-up, top-up, and amount changes",
      "SIP return analysis, goal tracking, and portfolio review",
    ],
    {
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
  ),
  line(
    "mutual-funds",
    "lumpsum-investments",
    "Lumpsum Investment Services",
    "Lumpsum",
    "One-time investing",
    "New purchases, additional investments, NFOs, allocation across schemes, and STP, SWP, switch, or redemption support.",
    "We assist with new investments, additional purchases, NFO investments, allocation across schemes, STP and SWP set-up, and switch or redemption transactions. Portfolio rebalancing through transactions is done where appropriate. A lumpsum is sized to your horizon and emergency buffer, not to last quarter's table-topper.",
    [...mfWho.lumpsum],
    [
      "New investments, additional purchases, and NFO support",
      "Allocation across schemes after the profile is clear",
      "STP and SWP set-up",
      "Switch, redemption, and rebalancing where appropriate",
    ],
  ),
  line(
    "mutual-funds",
    "transaction-execution",
    "Transaction Execution",
    "Transactions",
    "Online and offline",
    "Purchase, additional purchase, switch, SIP, STP, SWP, bank mandates, and folio requests - executed with the AMC on your behalf.",
    "Execution is a core distributor service. SEBI describes the role as including help for investors to place transactions with AMCs. We handle purchase, additional purchase, switch, SIP, STP, and SWP - online and offline - along with bank-mandate set-up and nomination or folio-related service requests.",
    [...mfWho.tx],
    [
      "Purchase, additional purchase, switch, SIP, STP, and SWP",
      "Bank-mandate set-up",
      "Nomination and folio-related service requests",
      "Online and offline execution with confirmation",
    ],
  ),
  line(
    "mutual-funds",
    "portfolio-monitoring",
    "Portfolio Monitoring",
    "Portfolio Monitoring",
    "Ongoing value",
    "Valuation, XIRR, capital gains, scheme and category allocation, concentration, and benchmark comparison - reviewed, not only sold.",
    "We aim to move from selling mutual funds to continuously monitoring and servicing your portfolio: current valuation with absolute and XIRR returns, capital gains, scheme-wise performance, asset allocation, AMC-wise and category-wise split, concentration and top holdings, underperforming schemes, scheme-versus-benchmark comparison, and portfolio risk analysis.",
    [...mfWho.monitor],
    [
      "Valuation with absolute return, XIRR, and capital gains",
      "Scheme, AMC, and category allocation",
      "Concentration, top holdings, and laggards flagged",
      "Benchmark comparison and portfolio risk in reviews",
    ],
  ),
  line(
    "mutual-funds",
    "goal-based-investing",
    "Goal-Based Investment Support",
    "Goal-Based Investing",
    "Purpose",
    "Mutual fund investing mapped to education, marriage, retirement, a home, a vacation, an emergency corpus, or financial independence.",
    "We help you see mutual fund investments in the context of objectives such as children's education and marriage, retirement, wealth creation, house purchase, vacation, emergency corpus, or financial independence. We can demonstrate projected outcomes under different assumptions and help you understand what changes if you raise the SIP or extend the horizon.",
    [...mfWho.goals],
    [
      "Education, marriage, home, vacation, and emergency goals",
      "Retirement and financial-independence planning",
      "Projected outcomes under stated assumptions",
      "SIP and horizon changes explained before you make them",
    ],
    {
      title: "Illustration - education goal",
      lines: [
        "Goal → ₹1 crore for a child's education",
        "Time → 12 years",
        "Current investment → ₹15 lakh",
        "Monthly SIP → ₹40,000",
      ],
      note: "Projections use constant assumed rates for education only. They are not guaranteed and they are not investment advice.",
    },
  ),
  line(
    "mutual-funds",
    "retirement-planning",
    "Retirement Planning Support",
    "Retirement Planning",
    "Later-life income",
    "Corpus illustrations, SIP projections, inflation-adjusted needs, existing-corpus analysis, and SWP or retirement-income pictures.",
    "We provide retirement corpus illustrations, SIP calculations and accumulation projections, inflation-adjusted retirement requirements, existing corpus and depletion illustrations, and SWP or retirement-income projections. Assumptions are written down so you can see what happens if inflation, the SIP, or the retirement date changes.",
    [...mfWho.retire],
    [
      "Inflation-adjusted retirement-need illustrations",
      "SIP calculations and accumulation projections",
      "Existing-corpus and depletion analysis",
      "SWP and retirement-income illustrations",
    ],
    {
      title: "Illustration - retirement picture",
      lines: [
        "Current monthly expense → ₹1 lakh",
        "Retirement in → 15 years",
        "Inflation assumption → stated in the review",
        "Required corpus and expected SIP → worked from those inputs",
      ],
      note: "Illustrations use constant rates. They are not a promised corpus or a guaranteed withdrawal.",
    },
  ),
  line(
    "mutual-funds",
    "tax-capital-gains",
    "Tax & Capital Gains Support",
    "Tax & Gains",
    "Information, not advice",
    "Help reading realised and unrealised gains, STCG/LTCG classification, ELSS, and the tax implications of redemptions or switches - with a tax professional for the return.",
    "We help you understand mutual-fund-related tax information: realised and unrealised capital gains, short-term versus long-term classification, capital-gains statements, ELSS, and the tax implications of a redemption or switch. We always suggest consulting a tax professional because as an MFD we may not be appropriately qualified to file your return.",
    [...mfWho.tax],
    [
      "Realised and unrealised gains, with STCG / LTCG classification",
      "Capital-gains statements and reports",
      "ELSS explained as one tax-saving option",
      "Redemption and switch implications flagged; a CA signs off the return",
    ],
  ),
  line(
    "mutual-funds",
    "investor-service",
    "Investor Service & Support",
    "Investor Service",
    "Day to day",
    "Statements, CAS, folio changes, nomination, KYC and FATCA updates, transmission, broker change, and grievance assistance - promptly.",
    "Day-to-day service includes account statement and CAS assistance, folio consolidation, transaction confirmations, bank/address/email/mobile changes, nomination, KYC and FATCA updates, transmission and death-claim assistance, change-of-broker processes, and grievance assistance. We follow AMFI guidance on prompt and competent investor service and grievance handling.",
    [...mfWho.service],
    [
      "Statements, CAS, folio information, and confirmations",
      "Bank, address, email, mobile, nomination, KYC, and FATCA updates",
      "Transmission, death-claim, and change-of-broker assistance",
      "Grievance handling in line with AMFI expectations",
    ],
  ),

  /* -------------------------------------------------------------- Insurance --- */
  row(
    "insurance",
    "insurance-needs-analysis",
    "Insurance Needs Analysis",
    "Understand income, liabilities, dependants, assets, and financial responsibilities to identify appropriate insurance needs.",
    [
      "Income, liabilities, and dependants mapped",
      "Assets and financial responsibilities reviewed",
      "Gaps in protection identified in plain language",
      "Needs ranked before products are discussed",
    ],
    insuranceWho,
    "Protection planning",
  ),
  row(
    "insurance",
    "life-insurance-planning",
    "Life Insurance Planning",
    "Help evaluate life insurance requirements and choose suitable protection or savings-oriented products offered by the insurer.",
    [
      "Life cover need sized to responsibilities",
      "Protection versus savings-oriented options explained",
      "Product features compared within authorised offerings",
      "Suitability checked against the needs analysis",
    ],
    insuranceWho,
    "Life cover",
  ),
  row(
    "insurance",
    "term-insurance",
    "Term Insurance",
    "Help determine an appropriate level and duration of life cover and facilitate policy purchase.",
    [
      "Sum assured and tenure discussed against goals",
      "Policy purchase facilitated with the insurer",
      "Key exclusions and claim conditions explained",
      "Renewal and review cadence agreed upfront",
    ],
    insuranceWho,
    "Life cover",
  ),
  row(
    "insurance",
    "health-insurance",
    "Health Insurance",
    "Help understand and select suitable health insurance policies, subject to the products we are authorised to distribute.",
    [
      "Cover type, sum insured, and family floater options",
      "Waiting periods, deductibles, and exclusions explained",
      "Authorised products compared for fit",
      "Purchase and onboarding support",
    ],
    insuranceWho,
    "Health",
  ),
  row(
    "insurance",
    "personal-accident-insurance",
    "Personal Accident Insurance",
    "Explain and facilitate accident-related covers available through the insurer.",
    [
      "Accident cover scope explained clearly",
      "Available products facilitated with the insurer",
      "Sum insured and tenure discussed",
      "Claim documentation overview provided",
    ],
    insuranceWho,
    "Health",
  ),
  row(
    "insurance",
    "motor-insurance",
    "Motor Insurance",
    "Assist with car and two-wheeler insurance, renewals, policy changes, and claims-related support.",
    [
      "New motor policies and renewals",
      "Policy changes and endorsements",
      "Claims-related coordination with the insurer",
      "Cover options explained before you buy",
    ],
    insuranceWho,
    "General",
  ),
  row(
    "insurance",
    "travel-insurance",
    "Travel Insurance",
    "Help select travel insurance for domestic or international travel.",
    [
      "Domestic and international trip covers",
      "Medical, baggage, and trip-delay features explained",
      "Policy purchase facilitated for the trip dates",
      "Claim process overview before you travel",
    ],
    insuranceWho,
    "General",
  ),
  row(
    "insurance",
    "home-property-insurance",
    "Home / Property Insurance",
    "Help protect homes and property against risks covered under available policies.",
    [
      "Structure and contents cover discussed",
      "Available policy options explained",
      "Purchase and documentation support",
      "Renewal reminders where applicable",
    ],
    insuranceWho,
    "General",
  ),
  row(
    "insurance",
    "business-insurance",
    "Business Insurance",
    "Depending on authorisation, assist businesses with property, liability, employee-related, and other commercial covers.",
    [
      "Business protection needs scoped",
      "Authorised commercial covers explained",
      "Employee-related and liability options where available",
      "Servicing and renewal support after issue",
    ],
    insuranceWho,
    "Commercial",
  ),
  row(
    "insurance",
    "policy-comparison",
    "Policy Comparison & Selection",
    "Explain features, benefits, exclusions, premiums, and policy terms so you can make an informed choice among available products.",
    [
      "Features and benefits compared side by side",
      "Exclusions and waiting periods highlighted",
      "Premiums and tenure trade-offs explained",
      "Informed choice among authorised products",
    ],
    insuranceWho,
    "Selection",
  ),
  row(
    "insurance",
    "policy-servicing",
    "Policy Servicing",
    "Assist with address or contact updates, nominee changes, policy corrections, and other servicing requirements.",
    [
      "Address and contact updates",
      "Nominee changes and corrections",
      "Other servicing requests with the insurer",
      "Confirmation when the change is complete",
    ],
    insuranceWho,
    "Servicing",
  ),
  row(
    "insurance",
    "premium-renewal",
    "Premium Renewal Assistance",
    "Remind you about upcoming premiums and renewals and assist with the renewal process.",
    [
      "Upcoming premium and renewal reminders",
      "Assistance completing the renewal",
      "Cover continuity checked before lapse",
      "Changes in premium or terms flagged",
    ],
    insuranceWho,
    "Servicing",
  ),
  row(
    "insurance",
    "claims-assistance",
    "Claims Assistance",
    "Help you understand the claim process, documentation, and submission requirements, and coordinate with the insurer where appropriate.",
    [
      "Claim process explained step by step",
      "Documentation checklist for submission",
      "Coordination with the insurer where appropriate",
      "Status follow-up until a decision is received",
    ],
    insuranceWho,
    "Claims",
  ),
  row(
    "insurance",
    "nomination-guidance",
    "Nomination & Beneficiary Guidance",
    "Help you understand nomination requirements and keep nominee information updated.",
    [
      "Nomination requirements explained",
      "Nominee updates processed with the insurer",
      "Beneficiary records kept current",
      "Gaps flagged during policy reviews",
    ],
    insuranceWho,
    "Servicing",
  ),
  row(
    "insurance",
    "policy-review",
    "Policy Review",
    "Periodically review existing coverage to identify gaps from changes in income, family, liabilities, or financial responsibilities.",
    [
      "Existing policies reviewed on a schedule",
      "Gaps from life changes identified",
      "Over- or under-insurance discussed",
      "Recommended next steps written down",
    ],
    insuranceWho,
    "Review",
  ),
  row(
    "insurance",
    "insurance-portfolio",
    "Insurance Portfolio Management",
    "Maintain a record of your policies, premiums, maturity dates, renewals, and coverage.",
    [
      "Consolidated policy inventory",
      "Premiums, maturities, and renewals tracked",
      "Coverage summary across life, health, and general",
      "One place to see what is in force",
    ],
    insuranceWho,
    "Review",
  ),
  row(
    "insurance",
    "customer-education",
    "Customer Education",
    "Explain sum assured, exclusions, waiting periods, deductibles, riders, policy tenure, and claim conditions.",
    [
      "Core insurance terms explained plainly",
      "Exclusions and waiting periods highlighted",
      "Riders and deductibles demystified",
      "Claim conditions shared before you need them",
    ],
    insuranceWho,
    "Education",
  ),
  row(
    "insurance",
    "riders-addons",
    "Riders / Add-on Guidance",
    "Explain relevant riders or add-ons available with the insurer's products.",
    [
      "Available riders and add-ons listed",
      "Cost versus benefit discussed",
      "Fit with the base policy checked",
      "Only relevant options recommended for review",
    ],
    insuranceWho,
    "Selection",
  ),
  row(
    "insurance",
    "documentation-support",
    "Documentation Support",
    "Assist with proposal forms and required documents, while ensuring information is accurately disclosed.",
    [
      "Proposal form completion support",
      "Document checklist for submission",
      "Accurate disclosure emphasised",
      "Follow-up until the policy is issued",
    ],
    insuranceWho,
    "Onboarding",
  ),
  row(
    "insurance",
    "post-sale-relationship",
    "Post-Sale Relationship Management",
    "Continue supporting you after policy issuance through servicing, renewals, claims assistance, and periodic reviews.",
    [
      "Ongoing servicing after issuance",
      "Renewals and claims support",
      "Periodic protection reviews",
      "A relationship that outlasts the sale",
    ],
    insuranceWho,
    "Relationship",
  ),

  /* -------------------------------------------------------------- FD & Bonds --- */
  row(
    "fd-bonds",
    "fd-requirement-analysis",
    "Investment Requirement Analysis",
    "Understand amount, investment horizon, income requirement, liquidity needs, and risk preference before recommending fixed-income options.",
    [
      "Amount, horizon, and income need captured",
      "Liquidity and risk preference discussed",
      "Suitable product types shortlisted",
      "Written picture before applications start",
    ],
    fdWho,
    "Planning",
  ),
  row(
    "fd-bonds",
    "fd-product-selection",
    "FD Product Selection",
    "Help identify suitable FDs based on tenure, interest rate, issuer, and payout preference.",
    [
      "Tenure and payout preference matched",
      "Issuer and rate compared",
      "Cumulative versus periodic interest explained",
      "Selection aligned to the requirement analysis",
    ],
    fdWho,
    "Fixed deposits",
  ),
  row(
    "fd-bonds",
    "fd-rate-comparison",
    "FD Rate Comparison",
    "Compare rates across banks, financial institutions, NBFCs, and other eligible issuers available to us.",
    [
      "Rates compared across eligible issuers",
      "Tenure buckets lined up side by side",
      "Payout options contrasted",
      "Trade-offs stated before you choose",
    ],
    fdWho,
    "Fixed deposits",
  ),
  row(
    "fd-bonds",
    "corporate-fd",
    "Corporate FD Distribution",
    "Facilitate investment in corporate or NBFC fixed deposits where we are authorised to do so.",
    [
      "Authorised corporate / NBFC FDs only",
      "Issuer and tenure explained",
      "Application and documentation support",
      "Risks such as credit risk disclosed",
    ],
    fdWho,
    "Fixed deposits",
  ),
  row(
    "fd-bonds",
    "bond-selection",
    "Bond Selection",
    "Help evaluate and select bonds based on tenure, coupon, yield, credit quality, and other relevant characteristics.",
    [
      "Tenure, coupon, and yield compared",
      "Credit quality discussed plainly",
      "Cash-flow fit checked against your needs",
      "Selection among authorised offerings",
    ],
    fdWho,
    "Bonds",
  ),
  row(
    "fd-bonds",
    "government-securities",
    "Government Securities",
    "Facilitate access to eligible government securities and other government-backed fixed-income products through authorised channels.",
    [
      "Eligible G-Secs and related products",
      "Access through authorised channels",
      "Tenure and settlement explained",
      "Suitability checked against your horizon",
    ],
    fdWho,
    "Bonds",
  ),
  row(
    "fd-bonds",
    "tax-saving-fixed-income",
    "Tax-Saving Investments",
    "Help identify eligible tax-saving fixed-income products, subject to prevailing tax rules.",
    [
      "Eligible tax-saving fixed-income options",
      "Lock-ins and rules explained at a high level",
      "Fit within your wider plan discussed",
      "Tax advice limited to permitted scope",
    ],
    fdWho,
    "Planning",
  ),
  row(
    "fd-bonds",
    "regular-income-planning",
    "Regular Income Planning",
    "Help structure FD and bond investments for periodic interest income or cash-flow requirements.",
    [
      "Income need sized to expenses",
      "Payout schedules structured across holdings",
      "Cumulative versus periodic options chosen deliberately",
      "Cash-flow calendar maintained",
    ],
    fdWho,
    "Planning",
  ),
  row(
    "fd-bonds",
    "laddering-strategy",
    "Laddering Strategy",
    "Create an FD or bond ladder with different maturities to manage liquidity and reinvestment risk.",
    [
      "Maturities staggered across years",
      "Liquidity buckets planned deliberately",
      "Reinvestment risk reduced, not eliminated",
      "Ladder reviewed as rates and needs change",
    ],
    fdWho,
    "Strategy",
  ),
  row(
    "fd-bonds",
    "maturity-planning",
    "Maturity Planning",
    "Track maturity dates and help plan reinvestment of principal.",
    [
      "Maturity calendar maintained",
      "Reminders before principal returns",
      "Reinvestment options discussed in advance",
      "Idle cash gaps avoided where possible",
    ],
    fdWho,
    "Servicing",
  ),
  row(
    "fd-bonds",
    "interest-payout-planning",
    "Interest Payout Planning",
    "Help choose cumulative or periodic interest payout options according to cash-flow needs.",
    [
      "Cumulative versus periodic interest explained",
      "Payout frequency matched to expenses",
      "Tax timing implications flagged at a high level",
      "Choice recorded against the plan",
    ],
    fdWho,
    "Planning",
  ),
  row(
    "fd-bonds",
    "fi-diversification",
    "Portfolio Diversification",
    "Help diversify across issuers, maturities, and types of fixed-income instruments.",
    [
      "Issuer concentration reviewed",
      "Maturity spread checked",
      "Instrument types mixed where appropriate",
      "Diversification goals written into the plan",
    ],
    fdWho,
    "Strategy",
  ),
  row(
    "fd-bonds",
    "credit-risk-assessment",
    "Credit Risk Assessment",
    "Explain issuer credit ratings, rating changes, security or collateral, and other relevant credit-risk information.",
    [
      "Ratings and what they mean explained",
      "Rating changes monitored where relevant",
      "Security / collateral discussed when available",
      "Credit risk never understated",
    ],
    fdWho,
    "Risk",
  ),
  row(
    "fd-bonds",
    "yield-comparison",
    "Yield & Return Comparison",
    "Compare coupon rates, effective yields, and expected cash flows across available products.",
    [
      "Coupon versus effective yield clarified",
      "Cash flows compared across options",
      "Apples-to-apples tenure matching",
      "No promised or guaranteed return language",
    ],
    fdWho,
    "Selection",
  ),
  row(
    "fd-bonds",
    "liquidity-assessment",
    "Liquidity Assessment",
    "Explain lock-ins, premature withdrawal conditions, secondary-market liquidity, and other exit considerations.",
    [
      "Lock-ins and exit charges explained",
      "Premature withdrawal conditions disclosed",
      "Secondary-market liquidity discussed where relevant",
      "Exit path agreed before you invest",
    ],
    fdWho,
    "Risk",
  ),
  row(
    "fd-bonds",
    "fd-application-assistance",
    "Application & Transaction Assistance",
    "Assist with application, documentation, KYC, and transaction processing through authorised channels.",
    [
      "Application and KYC support",
      "Documentation checklist",
      "Processing through authorised channels",
      "Confirmation when the investment is placed",
    ],
    fdWho,
    "Execution",
  ),
  row(
    "fd-bonds",
    "renewal-management",
    "Renewal Management",
    "Send maturity and renewal reminders and assist in deciding whether to renew or reinvest.",
    [
      "Maturity and renewal reminders",
      "Renew versus reinvest discussed",
      "Rate changes flagged before auto-renewal",
      "Decision recorded for the next cycle",
    ],
    fdWho,
    "Servicing",
  ),
  row(
    "fd-bonds",
    "interest-maturity-tracking",
    "Interest & Maturity Tracking",
    "Maintain records of interest payments, maturity proceeds, and upcoming cash flows.",
    [
      "Interest payment log",
      "Maturity proceeds tracked",
      "Upcoming cash-flow calendar",
      "One view of the fixed-income book",
    ],
    fdWho,
    "Servicing",
  ),
  row(
    "fd-bonds",
    "tds-tax-documentation",
    "TDS / Tax Documentation Support",
    "Help understand relevant TDS certificates and tax-related documents; tax advice only within permitted scope.",
    [
      "TDS certificates and related documents",
      "High-level tax documentation support",
      "Scope limits stated clearly",
      "Referral to a tax professional when needed",
    ],
    fdWho,
    "Documentation",
  ),
  row(
    "fd-bonds",
    "bond-portfolio-management",
    "Bond Portfolio Management",
    "Maintain a consolidated view of bond holdings, coupon income, maturity dates, and outstanding principal.",
    [
      "Holdings consolidated in one view",
      "Coupon income tracked",
      "Maturity dates and principal outstanding",
      "Periodic portfolio summary shared",
    ],
    fdWho,
    "Servicing",
  ),
  row(
    "fd-bonds",
    "secondary-market-assistance",
    "Secondary Market Assistance",
    "Where the product and regulatory framework permit, assist with understanding secondary-market sale or purchase options.",
    [
      "Secondary-market options explained when available",
      "Regulatory and product constraints stated",
      "Liquidity and price risk disclosed",
      "Assistance only within authorised channels",
    ],
    fdWho,
    "Execution",
  ),
  row(
    "fd-bonds",
    "reinvestment-services",
    "Reinvestment Services",
    "Identify suitable reinvestment opportunities when FDs or bonds mature.",
    [
      "Maturing amounts flagged early",
      "Reinvestment options compared",
      "Ladder continuity maintained where desired",
      "Idle gaps between maturity and reinvestment reduced",
    ],
    fdWho,
    "Servicing",
  ),
  row(
    "fd-bonds",
    "investor-statements",
    "Investor Statements",
    "Provide consolidated statements of investments, interest income, maturities, and transactions.",
    [
      "Consolidated investment statements",
      "Interest income and maturities listed",
      "Transaction history available on request",
      "Useful for household and tax records",
    ],
    fdWho,
    "Documentation",
  ),
  row(
    "fd-bonds",
    "fi-ongoing-service",
    "Ongoing Customer Service",
    "Provide post-investment support and help resolve servicing-related issues with the issuer or platform.",
    [
      "Post-investment servicing support",
      "Issuer or platform issues followed up",
      "Queries answered promptly",
      "Relationship continues after allotment",
    ],
    fdWho,
    "Relationship",
  ),
];

export const servicesIntro =
  "Mutual funds, insurance, and fixed-income solutions under one roof - selecting what fits, executing cleanly, and staying available for service.";

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function getServicesByCategory(id: ServiceCategoryId) {
  return services.filter((item) => item.category === id);
}

export function getServiceCategory(id: ServiceCategoryId) {
  return serviceCategories.find((item) => item.id === id);
}
