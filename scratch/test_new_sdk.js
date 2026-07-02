const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const site = await prisma.site.findFirst();
  if (!site) {
    console.error("No site found in database. Run seeds first.");
    process.exit(1);
  }

  console.log(`Using site: ${site.name} (${site.id})`);

  // We will call the new endpoint directly using node-fetch or standard fetch
  const testEmail = `tester-${Date.now()}@example.com`;

  console.log(`1. Testing Newsletter Subscribe with email: ${testEmail}`);
  const subscribeRes = await fetch(`http://localhost:3000/api/newsletter/subscribe?siteId=${site.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-site-id": site.id
    },
    body: JSON.stringify({
      email: testEmail,
      name: "SDK Test Subscriber"
    })
  });

  const subscribeData = await subscribeRes.json();
  console.log("Subscribe API Response:", subscribeData);

  if (!subscribeRes.ok || subscribeData.error !== null) {
    console.error("Failed to subscribe via newsletter subscribe API");
    process.exit(1);
  }

  // Verify in database
  let dbSub = await prisma.subscriber.findUnique({
    where: {
      siteId_email: {
        siteId: site.id,
        email: testEmail
      }
    }
  });

  if (dbSub && dbSub.name === "SDK Test Subscriber" && dbSub.status === "active") {
    console.log("SUCCESS: Subscriber created in database with active status!");
  } else {
    console.error("FAILED: Subscriber not found in database or metadata mismatch", dbSub);
    process.exit(1);
  }

  // 2. Test unsubscribe newsletter
  console.log(`2. Testing Unsubscribe for email: ${testEmail}`);
  const unsubscribeRes = await fetch(`http://localhost:3000/api/crm/subscribers?siteId=${site.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-site-id": site.id
    },
    body: JSON.stringify({
      email: testEmail,
      status: "unsubscribed"
    })
  });

  const unsubscribeData = await unsubscribeRes.json();
  console.log("Unsubscribe API Response:", unsubscribeData);

  if (!unsubscribeRes.ok || unsubscribeData.error !== null) {
    console.error("Failed to unsubscribe via subscribers API");
    process.exit(1);
  }

  // Verify in database
  dbSub = await prisma.subscriber.findUnique({
    where: {
      siteId_email: {
        siteId: site.id,
        email: testEmail
      }
    }
  });

  if (dbSub && dbSub.status === "unsubscribed") {
    console.log("SUCCESS: Subscriber status successfully updated to unsubscribed!");
  } else {
    console.error("FAILED: Subscriber status is not unsubscribed", dbSub);
    process.exit(1);
  }

  // Cleanup
  await prisma.subscriber.delete({
    where: {
      id: dbSub.id
    }
  });
  console.log("Cleanup complete: deleted test subscriber.");
  console.log("ALL TESTS PASSED SUCCESSFULLY.");
}

main().catch(err => {
  console.error("Error running test:", err);
  process.exit(1);
});
