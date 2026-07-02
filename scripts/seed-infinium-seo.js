require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const pagesToSeed = [
  {
    slug: "/",
    title: "Home",
    seoTitle: "The Infinium - Exposing Lending Lies. Empowering Business Truths.",
    seoDescription: "A research portal, compliance guide, and analysis platform dedicated to Merchant Cash Advances (MCA) and business funding transparency.",
    canonicalUrl: "https://theinfinium.com/",
  },
  {
    slug: "about",
    title: "About Us",
    seoTitle: "About Us - The Infinium",
    seoDescription: "Empowering merchants with knowledge and resources on MCA compliance, finance news, and turnaround insights.",
    canonicalUrl: "https://theinfinium.com/about",
  },
  {
    slug: "contact",
    title: "Contact Us",
    seoTitle: "Contact Us - The Infinium",
    seoDescription: "Get in touch with The Infinium. Send us inquiries, feedback, or suggestions about Merchant Cash Advances (MCA) transparency.",
    canonicalUrl: "https://theinfinium.com/contact",
  },
  {
    slug: "category/business-funding",
    title: "Business Funding Category",
    seoTitle: "Business Funding Research & Articles - The Infinium",
    seoDescription: "Compare Merchant Cash Advances, business loans, lines of credit, and invoice factoring articles.",
    canonicalUrl: "https://theinfinium.com/category/business-funding",
  },
  {
    slug: "category/credit-compliance",
    title: "Credit & Compliance Category",
    seoTitle: "Commercial Credit Compliance & Regulations - The Infinium",
    seoDescription: "Explore resources regarding commercial lending regulations, UCC filings, and state-level disclosure guidelines.",
    canonicalUrl: "https://theinfinium.com/category/credit-compliance",
  },
  {
    slug: "category/founders-finance",
    title: "Founders & Finance Category",
    seoTitle: "Startup Founders Financial KPIs & Cash Flow Strategies - The Infinium",
    seoDescription: "Essential financial metrics and cash flow strategies for entrepreneurs and business founders.",
    canonicalUrl: "https://theinfinium.com/category/founders-finance",
  },
  {
    slug: "category/mca-lending",
    title: "MCA & Lending Category",
    seoTitle: "Merchant Cash Advance Operations & Underwriting - The Infinium",
    seoDescription: "Learn how Merchant Cash Advances operate through purchase of future receivables and cash flow underwriting.",
    canonicalUrl: "https://theinfinium.com/category/mca-lending",
  },
  {
    slug: "category/merchant-resources",
    title: "Merchant Resources Category",
    seoTitle: "Small Business Financial Resources & Best Practices - The Infinium",
    seoDescription: "Discover best practices and financial habits that help business owners improve stability and cash flow.",
    canonicalUrl: "https://theinfinium.com/category/merchant-resources",
  },
  {
    slug: "category/news-policy",
    title: "News & Policy Category",
    seoTitle: "Alternative Finance Industry News & Policy Trends - The Infinium",
    seoDescription: "Follow updates on regulatory shifts, interest rates, and trends in the alternative commercial financing space.",
    canonicalUrl: "https://theinfinium.com/category/news-policy",
  },
  {
    slug: "category/tech-tools",
    title: "Tech & Tools Category",
    seoTitle: "Fintech Tools & Database Integration in Lending - The Infinium",
    seoDescription: "Explore technologies, scoring APIs, and database structures driving alternative lending platforms.",
    canonicalUrl: "https://theinfinium.com/category/tech-tools",
  },
  {
    slug: "category/turnaround-stories",
    title: "Turnaround Stories Category",
    seoTitle: "Small Business Turnaround Stories & Case Studies - The Infinium",
    seoDescription: "Inspirational stories and detailed case studies of companies overcoming debt stacks and cash flow crises.",
    canonicalUrl: "https://theinfinium.com/category/turnaround-stories",
  },
];

async function main() {
  const siteId = "infinium";
  console.log(`\n🌱 Seeding SEO page metadata for site: ${siteId}\n`);

  for (const page of pagesToSeed) {
    await prisma.page.upsert({
      where: { siteId_slug: { siteId, slug: page.slug } },
      update: {
        title: page.title,
        status: "PUBLISHED",
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        canonicalUrl: page.canonicalUrl,
      },
      create: {
        siteId,
        slug: page.slug,
        title: page.title,
        status: "PUBLISHED",
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        canonicalUrl: page.canonicalUrl,
      },
    });
    console.log(`  ✅ ${page.slug}  →  "${page.seoTitle}"`);
  }

  console.log(`\n✨ Done! ${pagesToSeed.length} pages seeded for site: ${siteId}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
