import { NextResponse } from "next/server";
import { subscriberService } from "@/services/subscriber.service";
import { getSiteId } from "@/lib/siteGuard";
import { handleApiError, apiSuccess } from "@/core/errors";

export async function POST(req) {
  try {
    const siteId = getSiteId(req);
    const body = await req.json();
    const { email, name } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const subscriber = await subscriberService.createSubscriber(siteId, {
      email: email.trim(),
      name: name ? name.trim() : null,
      status: "active",
      tags: "newsletter",
    });

    return NextResponse.json(apiSuccess({ subscriber }));
  } catch (err) {
    return handleApiError(err);
  }
}
