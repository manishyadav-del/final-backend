import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { getSiteForUser } from "@/lib/getSiteForUser";
import { redirect } from "next/navigation";
import AdsConsole from "./AdsConsole";

export default async function AdsPage() {
  const user = await requireAuth();
  const site = await getSiteForUser(user);

  if (!site) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Advertisement Management</h1>
        <p className="mt-4 text-sm text-red-600">
          No active site found. Please configure a site in the database.
        </p>
      </div>
    );
  }

  // Pre-load ads
  const ads = await prisma.advertisement.findMany({
    where: { siteId: site.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Advertisement & Banner Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Site: <span className="font-medium text-gray-800">{site.name}</span> ({site.domain || site.id})
        </p>
      </div>

      <AdsConsole
        siteId={site.id}
        initialAds={JSON.parse(JSON.stringify(ads))}
      />
    </div>
  );
}
