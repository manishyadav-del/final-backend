export function getSiteId(req) {
  const searchParams = req.nextUrl?.searchParams;
  const siteId =
    req.headers.get("x-site-id") ||
    searchParams?.get("siteId") ||
    searchParams?.get("site_id");

  return siteId || process.env.NEXT_PUBLIC_SITE_ID || process.env.SITE_ID || "infinium";
}
