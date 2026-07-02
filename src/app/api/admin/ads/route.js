import { NextResponse } from "next/server";
import { checkSitePermission } from "@/lib/apiAuth";
import prisma from "@/lib/prisma";
import { handleApiError, apiSuccess, ValidationError } from "@/core/errors";

export async function GET(req) {
  const auth = await checkSitePermission(req, "EDITOR");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const ads = await prisma.advertisement.findMany({
      where: {
        siteId: auth.siteId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(apiSuccess({ ads }));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req) {
  const auth = await checkSitePermission(req, "EDITOR");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { name, type, adsenseCode, imageUrl, targetUrl, position, active } = body;

    if (!name) throw new ValidationError("Advertisement Name is required");
    if (!type || (type !== "BANNER" && type !== "ADSENSE")) {
      throw new ValidationError("Type must be 'BANNER' or 'ADSENSE'");
    }
    if (!position) throw new ValidationError("Position is required");

    const ad = await prisma.advertisement.create({
      data: {
        siteId: auth.siteId,
        name,
        type,
        adsenseCode: type === "ADSENSE" ? adsenseCode : null,
        imageUrl: type === "BANNER" ? imageUrl : null,
        targetUrl: type === "BANNER" ? targetUrl : null,
        position,
        active: active ?? true,
      },
    });

    return NextResponse.json(apiSuccess({ ad }));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req) {
  const auth = await checkSitePermission(req, "EDITOR");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { id, name, type, adsenseCode, imageUrl, targetUrl, position, active } = body;

    if (!id) throw new ValidationError("Advertisement ID is required");

    const existing = await prisma.advertisement.findFirst({
      where: { id, siteId: auth.siteId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ error: "Advertisement not found" }, { status: 404 });
    }

    const updated = await prisma.advertisement.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        type: type !== undefined ? type : undefined,
        adsenseCode: type === "ADSENSE" ? adsenseCode : (type === "BANNER" ? null : undefined),
        imageUrl: type === "BANNER" ? imageUrl : (type === "ADSENSE" ? null : undefined),
        targetUrl: type === "BANNER" ? targetUrl : (type === "ADSENSE" ? null : undefined),
        position: position !== undefined ? position : undefined,
        active: active !== undefined ? active : undefined,
      },
    });

    return NextResponse.json(apiSuccess({ ad: updated }));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req) {
  const auth = await checkSitePermission(req, "EDITOR");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new ValidationError("Advertisement ID is required");

    const existing = await prisma.advertisement.findFirst({
      where: { id, siteId: auth.siteId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ error: "Advertisement not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.advertisement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(apiSuccess({ success: true }));
  } catch (err) {
    return handleApiError(err);
  }
}
