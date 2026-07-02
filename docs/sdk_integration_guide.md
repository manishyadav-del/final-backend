# Global Backend Headless CMS SDK Integration Guide

This guide details how to integrate the `@yourcompany/global-backend-next` SDK into any Next.js (App Router) frontend project.

---

## 1. Installation

Add the local SDK package to your frontend project's dependencies:

```json
"dependencies": {
  "@yourcompany/global-backend-next": "file:relative/path/to/yourcompany-global-backend-next-1.0.6.tgz"
}
```

Then run `npm install`.

---

## 2. Environment Variables

Create or update your `.env` (or `.env.local`) file in the root of your frontend project:

```env
# URL of the Headless CMS admin panel backend
NEXT_PUBLIC_CMS_BASE_URL="http://localhost:3000"

# Unique identifier for this frontend site
NEXT_PUBLIC_SITE_ID="infinium"

# Security Token (Integration Key) for route manifest sync
CMS_INTEGRATION_KEY="your-secure-integration-key"
```

---

## 3. Next.js Config Integration

Wrap your configuration in `next.config.mjs` (or `next.config.js`) with the SDK's `withCMS` helper. This enables transpilation and automatically sets up `/crm`, `/dashboard`, and `/admin` redirect routes:

```javascript
import { withCMS } from "@yourcompany/global-backend-next";

/** @type {import('next').NextConfig} */
const nextConfig = withCMS({
  reactCompiler: true,
  transpilePackages: ["@yourcompany/global-backend-next"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
});

export default nextConfig;
```

---

## 4. Root Layout Integration

Import and render the unified analytics, cookie compliance, and push notification components inside `src/app/layout.js`:

```javascript
import { 
  GlobalAnalytics, 
  CookieConsentBanner, 
  OneSignalScript 
} from "@yourcompany/global-backend-next/components";
import { getLayoutData } from "../services/layout.service";

export default async function RootLayout({ children }) {
  const layout = await getLayoutData(); // Fetches settings from /api/settings

  return (
    <html lang="en">
      <head>
        {/* Unified SDK script tags (analytics, tag managers, search consoles, scripts) */}
        <GlobalAnalytics settings={layout.rawSettings} />
        
        {/* OneSignal client subscription listener */}
        <OneSignalScript settings={layout.rawSettings} />
      </head>
      <body>
        {children}

        {/* GDPR Cookie Consent banner */}
        <CookieConsentBanner 
          complianceSettings={layout.rawSettings?.compliance} 
          siteId={process.env.NEXT_PUBLIC_SITE_ID} 
          baseUrl={process.env.NEXT_PUBLIC_CMS_BASE_URL} 
        />
      </body>
    </html>
  );
}
```

---

## 5. API Client Initialization

Create a helper file `src/lib/cms.js` to initialize the client singleton:

```javascript
import { createCMS } from "@yourcompany/global-backend-next";

const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";

export const cms = createCMS({
  endpoint: baseUrl,
  siteId: siteId
});
```

---

## 6. Query Examples (Using the SDK Client)

### Fetch Pages & Posts
```javascript
import { cms } from "@/lib/cms";

// Retrieve a page content
const page = await cms.getPage("about");

// Fetch posts/articles
const posts = await cms.getPosts({ page: 1, limit: 10 });
```

### Newsletter Signup Form submission
```javascript
import { cms } from "@/lib/cms";

async function handleSubscribe(email, name) {
  await cms.subscribeNewsletter({
    email,
    name,
    metadata: { source: "homepage-footer" }
  });
}
```

### Ad Serving & Viewport Tracking
```javascript
import { cms } from "@/lib/cms";

// 1. Fetch available ads for a zone
const ads = await cms.getAds("homepage-top");

// 2. Log impression when ad enters viewport
await cms.trackAdEvent(adId, "impression");

// 3. Log click when user clicks the banner
await cms.trackAdEvent(adId, "click");
```

---

## 7. Automatic Route Sync (Optional)

To automatically notify the backend CMS of your frontend routes whenever the Next.js server starts, create `src/instrumentation.js` with this single line:

```javascript
export { register } from "@yourcompany/global-backend-next/instrumentation";
```
