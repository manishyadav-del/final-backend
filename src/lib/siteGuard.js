export function getSiteId(req) {
  return process.env.NEXT_PUBLIC_SITE_ID || process.env.SITE_ID || "infinium";
}
