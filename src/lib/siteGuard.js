export function getSiteId(req) {
  const searchParams = req.nextUrl?.searchParams;
  const siteId =
    req.headers.get("x-site-id") ||
    searchParams?.get("siteId") ||
    searchParams?.get("site_id");

  return siteId || "ahealthplace_website_id_123";
}
