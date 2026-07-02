const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking Global Backend Database...");

  // 1. Get all sites in the backend
  const sites = await prisma.site.findMany({
    select: {
      id: true,
      name: true,
      domain: true,
      isActive: true
    }
  });
  console.log("\n--- Sites configured in Global Backend ---");
  console.log(sites);

  // 2. Count contacts, leads, subscribers, and visitor logs for each site
  for (const site of sites) {
    const contactsCount = await prisma.contactFormSubmission.count({ where: { siteId: site.id } });
    const leadsCount = await prisma.lead.count({ where: { siteId: site.id } });
    const subscribersCount = await prisma.subscriber.count({ where: { siteId: site.id } });
    const visitorsCount = await prisma.visitorLog.count({ where: { siteId: site.id } });
    const activeVisitors = await prisma.visitorLog.count({
      where: {
        siteId: site.id,
        createdAt: { gte: new Date(Date.now() - 30 * 1000) } // Active in last 30s
      }
    });

    console.log(`\n--- Stats for site: ${site.name} (${site.id}) ---`);
    console.log(`- Contact Submissions: ${contactsCount}`);
    console.log(`- CRM Leads: ${leadsCount}`);
    console.log(`- CRM Subscribers: ${subscribersCount}`);
    console.log(`- Visitor Logs: ${visitorsCount}`);
    console.log(`- Active Visitors (last 30s): ${activeVisitors}`);
  }

  // 3. Show a few recent items of each type
  console.log("\n--- Recent Contact Submissions ---");
  const recentContacts = await prisma.contactFormSubmission.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  });
  console.log(recentContacts);

  console.log("\n--- Recent Leads ---");
  const recentLeads = await prisma.lead.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  });
  console.log(recentLeads);

  console.log("\n--- Recent Subscribers ---");
  const recentSubscribers = await prisma.subscriber.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  });
  console.log(recentSubscribers);

  console.log("\n--- Recent Visitor Logs ---");
  const recentVisitors = await prisma.visitorLog.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  });
  console.log(recentVisitors);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
