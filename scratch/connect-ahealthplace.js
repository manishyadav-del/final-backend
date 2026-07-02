const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:@localhost:3306/global_database"
    }
  }
});

async function main() {
  console.log("Adding ahealthplace site to global database...");

  const site = await prisma.site.upsert({
    where: { id: "ahealthplace_website_id_123" },
    update: {},
    create: {
      id: "ahealthplace_website_id_123",
      name: "Ahealthplace Website",
      domain: "localhost:3001",
      isActive: true,
    }
  });
  console.log("Site created/verified:", site);

  const apiKey = await prisma.apiKey.upsert({
    where: { key: "gbl_api_key_ahealthplace_2026" },
    update: {
      isActive: true,
      deletedAt: null
    },
    create: {
      siteId: "ahealthplace_website_id_123",
      name: "Ahealthplace Frontend API Key",
      key: "gbl_api_key_ahealthplace_2026",
      isActive: true,
    }
  });
  console.log("API Key created/verified:", apiKey);

  const user = await prisma.user.findFirst({
    where: { email: "admin@example.com" }
  });

  if (user) {
    await prisma.siteUser.upsert({
      where: {
        siteId_userId: {
          siteId: site.id,
          userId: user.id
        }
      },
      update: {},
      create: {
        siteId: site.id,
        userId: user.id,
        role: "ADMIN"
      }
    });
    console.log("Linked admin user to site.");
  }
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
