import prisma from "@/lib/prisma";

import { cookies } from "next/headers";

/**
 * Resolves the active site for a given authenticated user.
 * Supporting cookie-based workspace selection switcher.
 *
 * @param {object} user - User object from requireAuth()
 * @returns {Promise<object|null>} Prisma Site record or null
 */
export async function getSiteForUser(user) {
  if (!user) return null;

  try {
    const cookieStore = await cookies();
    const selectedSiteId = cookieStore.get("active_site_id")?.value;

    if (selectedSiteId) {
      const isSuper = user.globalRole === "SUPERADMIN" || user.globalRole === "ADMIN";
      const membership = isSuper
        ? true
        : await prisma.siteUser.findFirst({
            where: { userId: user.id, siteId: selectedSiteId },
          });

      if (membership) {
        const site = await prisma.site.findUnique({
          where: { id: selectedSiteId },
        });
        if (site && !site.deletedAt) {
          return site;
        }
      }
    }
  } catch (e) {
    console.error("Error reading active_site_id cookie:", e);
  }

  const fallbackSiteId = process.env.NEXT_PUBLIC_SITE_ID || process.env.SITE_ID || "infinium";
  const site = await prisma.site.findUnique({
    where: { id: fallbackSiteId },
  });
  if (site) return site;

  return prisma.site.findFirst({
    where: { isActive: true, deletedAt: null },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Convenience wrapper that returns just the siteId string.
 */
export async function getSiteIdForUser(user) {
  const site = await getSiteForUser(user);
  return site?.id || null;
}
