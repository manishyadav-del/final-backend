import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSiteId } from "@/lib/siteGuard";
import { handleApiError, apiSuccess, ValidationError } from "@/core/errors";

export async function POST(req) {
  try {
    const siteId = getSiteId(req);
    const body = await req.json().catch(() => ({}));
    const { adId, action } = body;

    if (!adId) {
      throw new ValidationError("adId is required");
    }
    if (action !== "impression" && action !== "click") {
      throw new ValidationError("action must be either 'impression' or 'click'");
    }

    const ad = await prisma.advertisement.findFirst({
      where: { id: adId, siteId, deletedAt: null },
    });

    if (!ad) {
      return NextResponse.json({ error: "Advertisement not found" }, { status: 404 });
    }

    const updated = await prisma.advertisement.update({
      where: { id: adId },
      data: {
        impressions: action === "impression" ? { increment: 1 } : undefined,
        clicks: action === "click" ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json(apiSuccess({ success: true, ad: updated }));
  } catch (err) {
    return handleApiError(err);
  }
}
