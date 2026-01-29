import { BusinessIdea, Capital, TimeAvailable } from "./types";

const IDEAS: BusinessIdea[] = [
  // SERVICE IDEAS ($0 capital)
  {
    id: "svc-1",
    title: "FREELANCE COPYWRITER",
    description:
      "Write sales pages, emails, and ads for businesses. No portfolio needed - write a sample cold email and send it to 10 local businesses today.",
    firstStep:
      "Open Google Maps, find 10 local businesses with bad websites, write them each a better homepage headline, and email it to them for free.",
    category: "service",
  },
  {
    id: "svc-2",
    title: "SOCIAL MEDIA MANAGER",
    description:
      "Run Instagram/TikTok for small businesses who are too busy to post. Most local businesses post garbage or nothing at all.",
    firstStep:
      "Walk into 5 local restaurants or shops, ask to speak to the owner, and offer to run their Instagram for 2 weeks free as a trial.",
    category: "service",
  },
  {
    id: "svc-3",
    title: "VIRTUAL ASSISTANT",
    description:
      "Handle email, scheduling, and admin work for overwhelmed entrepreneurs. They exist in every Facebook group begging for help.",
    firstStep:
      "Post in 3 entrepreneur Facebook groups: 'I'll handle your email inbox for 1 week free. DM me.' Get your first client today.",
    category: "service",
  },
  {
    id: "svc-4",
    title: "COLD EMAIL OUTREACH AGENCY",
    description:
      "Write and send cold emails for B2B companies. Every SaaS startup needs leads but hates writing emails. You do it for them.",
    firstStep:
      "Find 5 small SaaS companies on ProductHunt launched this month. Email the founder: 'I'll write and send 100 cold emails for you. Pay me only if you get meetings.'",
    category: "service",
  },
  {
    id: "svc-5",
    title: "RESUME WRITING SERVICE",
    description:
      "Rewrite resumes for job seekers. Most people have terrible resumes and will pay $50-150 to fix them. LinkedIn is full of desperate job seekers.",
    firstStep:
      "Post on r/resumes offering 3 free resume rewrites in exchange for testimonials. Use those testimonials to charge $75 per resume by next week.",
    category: "service",
  },
  {
    id: "svc-6",
    title: "BOOKKEEPING FOR FREELANCERS",
    description:
      "Organize finances for freelancers and small businesses using free tools like Wave. Most freelancers dread their taxes because their books are a mess.",
    firstStep:
      "Post in 3 freelancer communities: 'I'll organize your 2024 expenses into a clean spreadsheet for $50. Takes me 2 hours, saves you 20.'",
    category: "service",
  },
  {
    id: "svc-7",
    title: "LOCAL BUSINESS GOOGLE ADS MANAGER",
    description:
      "Set up and manage Google Ads for local businesses. Plumbers, dentists, and lawyers waste thousands on bad ads. You fix that.",
    firstStep:
      "Google 'plumber [your city]' and find one with no ads running. Call them: 'I can get you 10 new leads this month with Google Ads. I'll set it up free, you just pay the ad budget.'",
    category: "service",
  },
  {
    id: "svc-8",
    title: "WEBSITE BUILDER FOR LOCAL BUSINESSES",
    description:
      "Build simple websites using Carrd or WordPress for businesses still using Facebook as their homepage. Charge $300-500 per site.",
    firstStep:
      "Build a sample site for a fake pizza shop in 2 hours. Then walk into 5 real local businesses without websites and show it to them on your phone.",
    category: "service",
  },

  // LOW-COST IDEAS ($100 capital)
  {
    id: "low-1",
    title: "PRINT-ON-DEMAND NICHE STORE",
    description:
      "Sell custom t-shirts, mugs, or hoodies to a hyper-specific audience. No inventory. Printful/Printify prints and ships for you.",
    firstStep:
      "Pick one niche you know (nurses, programmers, dog owners). Design 3 funny shirts on Canva. Set up a free Etsy shop and list them today.",
    category: "low-cost",
  },
  {
    id: "low-2",
    title: "CAR DETAILING",
    description:
      "Hand-wash and detail cars in your neighborhood. $50-100 per car, 3 cars a day. Buy supplies for under $100 at Walmart.",
    firstStep:
      "Buy basic supplies (soap, microfiber cloths, tire shine). Detail your own car, take before/after photos. Post on Nextdoor and offer $40 first-time deals.",
    category: "low-cost",
  },
  {
    id: "low-3",
    title: "DIGITAL PRODUCT: NOTION TEMPLATES",
    description:
      "Build and sell Notion templates for specific use cases. Students, freelancers, and project managers buy these for $5-29 on Gumroad.",
    firstStep:
      "Build one Notion template that solves a problem you have (job tracker, budget planner, content calendar). List it on Gumroad for $9. Share in 3 relevant subreddits.",
    category: "low-cost",
  },
  {
    id: "low-4",
    title: "PRESSURE WASHING",
    description:
      "Rent a pressure washer for $50/day and clean driveways, decks, and siding. Charge $100-200 per job. Satisfying work, fast money.",
    firstStep:
      "Rent a pressure washer from Home Depot. Clean your own driveway, film a 30-second before/after video. Post it on Nextdoor with a $99 introductory price.",
    category: "low-cost",
  },
  {
    id: "low-5",
    title: "NEWSLETTER BUSINESS",
    description:
      "Curate and write a niche email newsletter. Monetize with sponsorships once you hit 1,000 subscribers. Free to start with Beehiiv or Substack.",
    firstStep:
      "Pick a niche topic you can write about weekly (AI tools, local food, startup lessons). Write your first issue. Share it in 5 online communities where your audience hangs out.",
    category: "low-cost",
  },

  // MEDIUM IDEAS ($500 capital)
  {
    id: "med-1",
    title: "VENDING MACHINE OPERATOR",
    description:
      "Buy a used vending machine for $300-500. Place it in a high-traffic location. Passive income of $100-300/month per machine.",
    firstStep:
      "Search Facebook Marketplace for used vending machines under $400. Call 5 local gyms or laundromats and ask if you can place one for a revenue split.",
    category: "medium",
  },
  {
    id: "med-2",
    title: "AFFILIATE REVIEW BLOG",
    description:
      "Build a niche review website targeting buyer-intent keywords. Review products, earn commissions. $500 covers domain + hosting + basic tools.",
    firstStep:
      "Pick a product category you use (standing desks, headphones, meal kits). Buy a domain, set up WordPress. Write and publish 3 'Best X for Y' articles this week.",
    category: "medium",
  },
  {
    id: "med-3",
    title: "SMALL BATCH FOOD PRODUCT",
    description:
      "Make and sell one food product at farmer's markets. Hot sauce, cookies, granola - pick one thing and make it better than the grocery store version.",
    firstStep:
      "Perfect your recipe this week. Check your state's cottage food laws. Sign up for the nearest farmer's market (usually $25-50 per day). Show up with 50 units.",
    category: "medium",
  },
  {
    id: "med-4",
    title: "LOCAL EVENT PHOTOGRAPHER",
    description:
      "Photograph local events, headshots, and small business product photos. A used DSLR + one lens is all you need to start.",
    firstStep:
      "Shoot a free headshot session for 3 friends. Post the best photos on Instagram. DM 10 local businesses: 'I'll shoot your product photos for $150. Here's my portfolio.'",
    category: "medium",
  },
  {
    id: "med-5",
    title: "DROPSHIPPING ONE PRODUCT",
    description:
      "Forget a whole store. Find ONE product that solves ONE problem. Build a single product page. Run $20/day in TikTok ads.",
    firstStep:
      "Browse AliExpress trending products. Pick one under $10 with good reviews. Build a Shopify store with just that one product. Film a 15-second TikTok-style ad.",
    category: "medium",
  },
];

export function generateIdea(
  capital: Capital,
  timeAvailable: TimeAvailable
): BusinessIdea {
  let pool: BusinessIdea[];

  if (capital === "$0") {
    pool = IDEAS.filter((i) => i.category === "service");
  } else if (capital === "$100") {
    pool = IDEAS.filter(
      (i) => i.category === "service" || i.category === "low-cost"
    );
  } else {
    pool = IDEAS;
  }

  // For limited time, prefer simpler service-based ideas
  if (timeAvailable === "<5h") {
    const serviceOnly = pool.filter((i) => i.category === "service");
    if (serviceOnly.length > 0) pool = serviceOnly;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
