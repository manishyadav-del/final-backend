const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const sites = await prisma.site.findMany();
  console.log("SITES IN DB:", sites);
}
main().catch(console.error).finally(() => prisma.$disconnect());
