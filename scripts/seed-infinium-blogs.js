require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const postsData = [
  {
    title: "MCA vs Loan vs Line of Credit vs Factoring",
    urlSlug: "mca-vs-loan-vs-line-of-credit-vs-factoring",
    category: "Business Funding",
    summary: "Compare Merchant Cash Advances, business loans, lines of credit, and invoice factoring to determine which financing solution best matches your business goals.",
    contentBody: "<p>Businesses today have more financing options than ever before. Merchant Cash Advances provide fast access to working capital by purchasing future receivables, while traditional loans offer structured repayment schedules with fixed interest rates. Lines of credit provide flexible borrowing, allowing businesses to draw funds only when needed, and invoice factoring converts unpaid invoices into immediate cash.</p><p>Each funding option serves a unique purpose depending on the company's financial position, industry, cash flow stability, and growth objectives. Understanding the differences helps business owners avoid costly financing mistakes and choose the most sustainable solution for long-term success.</p><p>Before accepting any financing offer, merchants should carefully evaluate repayment structures, fees, eligibility requirements, and the total cost of capital.</p>",
    metaTitle: "MCA vs Loan vs Line of Credit vs Factoring | The Infinium",
    metaDescription: "Compare Merchant Cash Advances, business loans, lines of credit, and invoice factoring to choose the best financing solution.",
    canonicalUrl: "https://theinfinium.com/mca-vs-loan-vs-line-of-credit-vs-factoring",
  },
  {
    title: "Choosing the Right Funding Solution for Seasonal Businesses",
    urlSlug: "choosing-the-right-funding-solution-seasonal-businesses",
    category: "Business Funding",
    summary: "Seasonal businesses require financing solutions that align with fluctuating cash flow and changing revenue cycles.",
    contentBody: "<p>Retail stores, tourism companies, landscaping businesses, and holiday service providers often experience significant seasonal revenue changes. Financing products that work well for year-round businesses may create unnecessary pressure during slower months.</p><p>Flexible funding options like revolving credit facilities and Merchant Cash Advances can help bridge temporary cash flow gaps while preserving operational stability. Business owners should analyze historical revenue trends before selecting a funding product.</p><p>Choosing financing that matches seasonal income patterns reduces financial stress and improves long-term profitability.</p>",
    metaTitle: "Funding Solutions for Seasonal Businesses | The Infinium",
    metaDescription: "Learn how seasonal businesses can choose financing options that align with fluctuating revenue and cash flow.",
    canonicalUrl: "https://theinfinium.com/choosing-the-right-funding-solution-seasonal-businesses",
  },
  {
    title: "Understanding UCC Filings for Business Financing",
    urlSlug: "understanding-ucc-filings-business-financing",
    category: "Credit & Compliance",
    summary: "Understand how Uniform Commercial Code filings affect business financing and lender security interests.",
    contentBody: "<p>Uniform Commercial Code (UCC) filings allow lenders to publicly record their security interest in business assets when financing is provided. These filings help establish priority among creditors and reduce financing disputes.</p><p>Businesses seeking multiple financing products should understand how existing UCC filings may affect future funding opportunities. Lenders typically review outstanding liens before approving new financing.</p><p>Properly managing UCC filings improves transparency and helps businesses maintain healthy lender relationships.</p>",
    metaTitle: "Understanding UCC Filings | The Infinium",
    metaDescription: "Learn how UCC filings work and why they are important for commercial lending and business financing.",
    canonicalUrl: "https://theinfinium.com/understanding-ucc-filings-business-financing",
  },
  {
    title: "How Business Credit Scores Impact Funding Decisions",
    urlSlug: "how-business-credit-scores-impact-funding-decisions",
    category: "Credit & Compliance",
    summary: "Business credit profiles play a significant role in determining financing approvals, pricing, and available funding options.",
    contentBody: "<p>Business credit scores provide lenders with valuable insight into a company's financial reliability. Payment history, outstanding debt, utilization ratios, and public records all contribute to creditworthiness.</p><p>Companies with stronger credit profiles generally receive better financing terms, lower fees, and higher approval rates. Maintaining healthy financial practices improves access to both traditional and alternative funding products.</p><p>Monitoring business credit regularly allows owners to identify issues before they impact future financing applications.</p>",
    metaTitle: "Business Credit Scores & Funding Decisions | The Infinium",
    metaDescription: "Discover how business credit scores influence loan approvals, financing costs, and lender confidence.",
    canonicalUrl: "https://theinfinium.com/how-business-credit-scores-impact-funding-decisions",
  },
  {
    title: "Cash Flow Strategies Every Startup Founder Should Know",
    urlSlug: "cash-flow-strategies-every-startup-founder-should-know",
    category: "Founders & Finance",
    summary: "Healthy cash flow is the foundation of every successful startup. Learn practical strategies to manage revenue, expenses, and growth capital.",
    contentBody: "<p>Many startups fail not because of poor ideas but because they run out of cash. Founders should prioritize cash flow forecasting, maintain emergency reserves, negotiate favorable payment terms with vendors, and closely monitor monthly burn rates.</p><p>Using financial dashboards and forecasting software can help identify problems before they become critical. Understanding cash conversion cycles allows founders to make informed hiring, marketing, and investment decisions.</p><p>Strong cash flow management creates resilience during economic uncertainty and positions businesses for sustainable long-term growth.</p>",
    metaTitle: "Cash Flow Strategies for Startup Founders | The Infinium",
    metaDescription: "Discover practical cash flow strategies that help startup founders build financially sustainable businesses.",
    canonicalUrl: "https://theinfinium.com/cash-flow-strategies-every-startup-founder-should-know",
  },
  {
    title: "Financial Metrics Every Founder Should Monitor",
    urlSlug: "financial-metrics-every-founder-should-monitor",
    category: "Founders & Finance",
    summary: "Revenue alone doesn't measure success. Learn which financial KPIs every founder should track to build a healthy business.",
    contentBody: "<p>Successful founders monitor more than sales numbers. Gross profit margin, customer acquisition cost, lifetime customer value, operating cash flow, debt ratios, and recurring revenue all provide valuable insight into business health.</p><p>Tracking key performance indicators consistently enables faster decision-making and helps identify operational inefficiencies before they become expensive problems.</p><p>Modern financial dashboards make it easier than ever to visualize performance and support strategic planning.</p>",
    metaTitle: "Financial Metrics Every Founder Should Monitor | The Infinium",
    metaDescription: "Learn the essential financial metrics and KPIs every entrepreneur should monitor to drive business growth.",
    canonicalUrl: "https://theinfinium.com/financial-metrics-every-founder-should-monitor",
  },
  {
    title: "Purchase of Future Receivables in the Merchant Cash Advance Industry",
    urlSlug: "purchase-of-future-receivables-merchant-cash-advance",
    category: "MCA & Lending",
    summary: "Understand why Merchant Cash Advances are structured as purchases of future receivables rather than traditional loans.",
    contentBody: "<p>The defining characteristic of a Merchant Cash Advance is that it represents the purchase of future business receivables instead of a loan with fixed interest. Repayment fluctuates with business performance, distinguishing MCA products from conventional lending.</p><p>This legal structure has significant implications for underwriting, contract drafting, regulatory compliance, and litigation. Businesses should understand these distinctions before entering any financing agreement.</p><p>Proper education reduces misunderstandings between merchants and funding providers while encouraging responsible financing practices.</p>",
    metaTitle: "Purchase of Future Receivables Explained | The Infinium",
    metaDescription: "Learn how Merchant Cash Advances operate through the purchase of future receivables instead of traditional lending.",
    canonicalUrl: "https://theinfinium.com/purchase-of-future-receivables-merchant-cash-advance",
  },
  {
    title: "How Merchant Cash Advance Underwriting Works",
    urlSlug: "how-merchant-cash-advance-underwriting-works",
    category: "MCA & Lending",
    summary: "Explore the underwriting process used by Merchant Cash Advance providers to evaluate business funding applications.",
    contentBody: "<p>MCA underwriting focuses heavily on business cash flow rather than traditional credit scoring alone. Underwriters review bank statements, average daily balances, revenue consistency, NSF activity, processing volume, and existing obligations.</p><p>Advanced technology and automated risk models have significantly accelerated funding decisions, allowing providers to approve qualified merchants within hours instead of weeks.</p><p>Understanding underwriting criteria helps business owners prepare stronger funding applications and improve approval outcomes.</p>",
    metaTitle: "Merchant Cash Advance Underwriting Guide | The Infinium",
    metaDescription: "Learn how Merchant Cash Advance providers evaluate funding applications using cash flow and risk analysis.",
    canonicalUrl: "https://theinfinium.com/how-merchant-cash-advance-underwriting-works",
  },
  {
    title: "10 Financial Habits Every Small Business Owner Should Develop",
    urlSlug: "financial-habits-every-small-business-owner-should-develop",
    category: "Merchant Resources",
    summary: "Strong financial habits help business owners improve cash flow, reduce unnecessary expenses, and prepare for future growth opportunities.",
    contentBody: "<p>Running a successful business requires more than generating revenue. Owners should review financial statements monthly, separate business and personal expenses, maintain emergency reserves, reconcile accounts regularly, and monitor cash flow carefully.</p><p>Building these habits creates financial discipline while making tax preparation, financing applications, and strategic planning significantly easier. Small improvements in financial management often produce long-term business stability.</p><p>Business owners who understand their numbers make faster and more confident decisions that contribute to sustainable growth.</p>",
    metaTitle: "Financial Habits Every Business Owner Should Develop | The Infinium",
    metaDescription: "Discover essential financial habits that help business owners improve profitability, cash flow, and long-term stability.",
    canonicalUrl: "https://theinfinium.com/financial-habits-every-small-business-owner-should-develop",
  },
  {
    title: "Preparing Your Business Before Applying for Funding",
    urlSlug: "preparing-your-business-before-applying-for-funding",
    category: "Merchant Resources",
    summary: "Proper preparation significantly increases the chances of receiving business financing on favorable terms.",
    contentBody: "<p>Before applying for funding, businesses should organize financial statements, verify tax filings, review credit reports, prepare recent bank statements, and clearly define how the funds will be used.</p><p>Lenders and funding providers value organized applicants who demonstrate financial responsibility and operational stability. Preparation reduces delays during underwriting and improves approval odds.</p><p>A well-prepared funding application also allows business owners to compare multiple financing options with confidence.</p>",
    metaTitle: "How to Prepare Before Applying for Business Funding | The Infinium",
    metaDescription: "Learn how to prepare your business before applying for funding and improve your chances of approval.",
    canonicalUrl: "https://theinfinium.com/preparing-your-business-before-applying-for-funding",
  },
  {
    title: "Federal Regulatory Changes Impacting Alternative Lending in 2026",
    urlSlug: "federal-regulatory-changes-impacting-alternative-lending-2026",
    category: "News & Policy",
    summary: "Alternative business finance continues evolving as policymakers introduce new compliance expectations and disclosure requirements.",
    contentBody: "<p>Regulatory oversight of alternative lending continues to increase as governments seek greater transparency within commercial finance markets. Disclosure standards, licensing requirements, and consumer protection measures are expanding across multiple jurisdictions.</p><p>Funding providers and merchants alike should remain informed about policy developments to ensure ongoing compliance and reduce legal risk.</p><p>Staying ahead of regulatory changes supports sustainable growth while maintaining trust throughout the lending ecosystem.</p>",
    metaTitle: "Alternative Lending Regulatory Updates 2026 | The Infinium",
    metaDescription: "Explore the latest policy developments and regulatory changes affecting alternative business lending in 2026.",
    canonicalUrl: "https://theinfinium.com/federal-regulatory-changes-impacting-alternative-lending-2026",
  },
  {
    title: "Economic Trends Shaping Small Business Financing",
    urlSlug: "economic-trends-shaping-small-business-financing",
    category: "News & Policy",
    summary: "Interest rates, inflation, technology, and economic conditions continue influencing business funding decisions across the lending industry.",
    contentBody: "<p>Macroeconomic conditions directly affect financing availability and borrowing costs for businesses. Inflation, central bank policies, employment data, and consumer demand all contribute to lender risk assessments.</p><p>Alternative financing providers continue adapting their underwriting models to changing economic environments while expanding access to businesses underserved by traditional banking institutions.</p><p>Understanding these broader trends helps entrepreneurs make informed financing decisions during periods of economic uncertainty.</p>",
    metaTitle: "Economic Trends Affecting Business Financing | The Infinium",
    metaDescription: "Learn how economic conditions influence business funding, lending decisions, and alternative finance markets.",
    canonicalUrl: "https://theinfinium.com/economic-trends-shaping-small-business-financing",
  },
  {
    title: "AI Is Transforming Business Lending and Underwriting",
    urlSlug: "ai-transforming-business-lending-underwriting",
    category: "Tech & Tools",
    summary: "Artificial intelligence is enabling faster underwriting, better fraud detection, and more accurate risk assessments across the alternative lending industry.",
    contentBody: "<p>Artificial intelligence has become one of the most impactful technologies in business lending. Modern underwriting systems can analyze thousands of financial data points within seconds, allowing funding providers to make faster and more informed decisions.</p><p>Machine learning algorithms identify risk patterns, detect fraudulent applications, and improve approval accuracy by evaluating bank transactions, cash flow consistency, payment histories, and industry benchmarks. These technologies reduce operational costs while providing merchants with quicker access to capital.</p><p>As AI continues to evolve, lenders are expected to deliver increasingly personalized funding solutions while maintaining strong compliance and risk management standards.</p>",
    metaTitle: "AI in Business Lending & Underwriting | The Infinium",
    metaDescription: "Discover how artificial intelligence is transforming underwriting, fraud detection, and business lending decisions.",
    canonicalUrl: "https://theinfinium.com/ai-transforming-business-lending-underwriting",
  },
  {
    title: "The Essential Technology Stack for Modern Lending Companies",
    urlSlug: "essential-technology-stack-modern-lending-companies",
    category: "Tech & Tools",
    summary: "Successful lending companies rely on integrated CRMs, underwriting platforms, analytics tools, and automation software to improve operational efficiency.",
    contentBody: "<p>Technology has become the backbone of modern lending operations. Customer relationship management systems, automated underwriting engines, document verification platforms, digital signatures, fraud detection services, and business intelligence dashboards work together to create efficient funding workflows.</p><p>Cloud-based infrastructure enables lenders to scale operations while maintaining security, compliance, and performance. Automation reduces manual tasks, allowing teams to focus on customer relationships and strategic growth.</p><p>Organizations investing in modern technology consistently deliver faster approvals, improved customer experiences, and stronger operational performance.</p>",
    metaTitle: "Technology Stack for Modern Lending Companies | The Infinium",
    metaDescription: "Explore the essential software and technology powering today's business lending and alternative finance companies.",
    canonicalUrl: "https://theinfinium.com/essential-technology-stack-modern-lending-companies",
  },
  {
    title: "How One Retail Business Recovered Through Strategic Financing",
    urlSlug: "retail-business-recovery-through-strategic-financing",
    category: "Turnaround Stories",
    summary: "A struggling retail company successfully restored cash flow and profitability by selecting the right financing strategy at the right time.",
    contentBody: "<p>Following several months of declining revenue, a regional retail business faced inventory shortages and mounting supplier obligations. Traditional financing options proved too slow to address immediate operational challenges.</p><p>By securing working capital through an alternative financing solution, the company replenished inventory, negotiated improved supplier terms, and launched targeted marketing campaigns. Within twelve months, revenue stabilized and profitability returned.</p><p>This case demonstrates how strategic financing, combined with disciplined financial management, can help businesses overcome temporary setbacks and position themselves for sustainable growth.</p>",
    metaTitle: "Retail Business Turnaround Story | The Infinium",
    metaDescription: "Read how strategic financing helped a retail business recover from financial challenges and return to growth.",
    canonicalUrl: "https://theinfinium.com/retail-business-recovery-through-strategic-financing",
  },
  {
    title: "From Cash Flow Crisis to Sustainable Growth: A Merchant Success Story",
    urlSlug: "cash-flow-crisis-to-sustainable-growth-merchant-success-story",
    category: "Turnaround Stories",
    summary: "Effective financial planning and responsible funding helped a small business transform a severe cash flow crisis into long-term stability.",
    contentBody: "<p>A growing service business experienced rapid customer demand but struggled with delayed receivable payments and limited working capital. Without immediate financing, expansion plans were at risk.</p><p>After implementing structured cash flow forecasting, improving operational efficiency, and securing flexible business funding, the company stabilized operations and continued expanding into new markets.</p><p>The experience highlights the importance of financial planning, responsible borrowing, and proactive business management when navigating periods of rapid growth.</p>",
    metaTitle: "Merchant Success Story: From Cash Flow Crisis to Growth | The Infinium",
    metaDescription: "Discover how one merchant overcame cash flow challenges through better planning and strategic business financing.",
    canonicalUrl: "https://theinfinium.com/cash-flow-crisis-to-sustainable-growth-merchant-success-story",
  },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function main() {
  const siteId = "infinium";

  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error("No user found. Run the base seed first: npm run db:seed");
  }
  console.log(`\n✅ Using author: ${user.email} (${user.id})\n`);

  for (const post of postsData) {
    const categorySlug = slugify(post.category);

    // 1. Upsert category
    const category = await prisma.category.upsert({
      where: { siteId_slug: { siteId, slug: categorySlug } },
      update: { name: post.category },
      create: { siteId, name: post.category, slug: categorySlug },
    });

    // 2. Upsert post
    await prisma.post.upsert({
      where: { siteId_slug: { siteId, slug: post.urlSlug } },
      update: {
        title: post.title,
        content: post.contentBody,
        excerpt: post.summary,
        status: "PUBLISHED",
        authorId: user.id,
        seoTitle: post.metaTitle,
        seoDescription: post.metaDescription,
        canonicalUrl: post.canonicalUrl,
        publishedAt: new Date(),
        categories: { set: [{ id: category.id }] },
      },
      create: {
        siteId,
        title: post.title,
        slug: post.urlSlug,
        content: post.contentBody,
        excerpt: post.summary,
        status: "PUBLISHED",
        authorId: user.id,
        seoTitle: post.metaTitle,
        seoDescription: post.metaDescription,
        canonicalUrl: post.canonicalUrl,
        publishedAt: new Date(),
        categories: { connect: [{ id: category.id }] },
      },
    });

    console.log(`  📝 "${post.title}" → [${post.category}]`);
  }

  console.log(`\n✨ Done! ${postsData.length} posts seeded for site: ${siteId}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
