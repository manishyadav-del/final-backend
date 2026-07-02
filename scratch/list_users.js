const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  const siteUsers = await prisma.siteUser.findMany();
  console.log("USERS:", users);
  console.log("SITE_USERS:", siteUsers);
}
main().catch(console.error).finally(() => prisma.$disconnect());
