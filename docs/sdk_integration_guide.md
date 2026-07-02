# Global Backend CMS — Frontend Integration Guide

Complete step-by-step guide for connecting any Next.js (App Router) frontend to the Global Backend Headless CMS.

---

## Prerequisites

Before starting, make sure you have:
- **Node.js 18+** installed
- **MySQL or PostgreSQL** database server running locally
- **Global Backend** cloned and running (see [Backend Setup](#backend-setup) below)
- A **Next.js 13+ App Router** frontend project ready

---

## Part 1: Backend Setup (First Time Only)

### Step 1 — Clone & Install

```bash
git clone <backend-repository-url> global_backend
cd global_backend
npm install
```

### Step 2 — Configure Environment

Create a `.env` file in the root of `global_backend`:

```env
# Database connection (MySQL example)
DATABASE_URL="mysql://root:@localhost:3306/global_database"

# Auth secret (generate any random string)
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Your frontend URL
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3001"

# Cloudinary (for media uploads — optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Step 3 — Create the Database

Open your MySQL client and run:

```sql
CREATE DATABASE global_database;
```

### Step 4 — Push Schema & Seed

```bash
# Create all database tables
npm run db:push

# Create default admin user and site
npm run db:seed
```

> Default login credentials after seeding:
> - **Email**: `admin@example.com`
> - **Password**: `Admin@123`

### Step 5 — Start the Backend

```bash
npm run dev
```

The backend admin dashboard will be available at `http://localhost:3000`.

---

## Part 2: Register Your Site Workspace

### Step 1 — Log into the Dashboard

Navigate to `http://localhost:3000` and log in with the seeded credentials.

### Step 2 — Create a Site Workspace

If no sites exist, you will see a **"Create Your First Site Workspace"** form directly on the dashboard.

Fill in:
- **Site Name**: The name of your frontend website (e.g., `My Company Blog`)
- **Domain** *(optional)*: Your domain (e.g., `localhost` or `myblog.com`)

Click **Create Site Workspace**.

### Step 3 — Copy Your Site ID

After creation, a success box will appear showing your **Site ID** (e.g., `cmr1tur660001uh0kxrxvyam8`). **Copy this value** — you will need it in your frontend configuration.

> You can also find the Site ID at any time by:
> - Looking at the **Dashboard Overview** header subtitle
> - Navigating to **Sites** in the sidebar

### Step 4 — Generate Your Integration Key

1. In the sidebar, click **Developer Tools** (under System Settings).
2. Find the **Content Sync Key** panel.
3. Click **Generate Key**.
4. Copy the generated key — you will add this to your frontend `.env` file.

---

## Part 3: Frontend Integration

### Step 1 — Install the SDK

Copy the SDK package file (`yourcompany-global-backend-next-1.0.6.tgz`) into the root directory of your frontend project and run:

```bash
npm install ./yourcompany-global-backend-next-1.0.6.tgz
```

### Step 2 — Configure Environment Variables

Create a `.env` (or `.env.local`) file in the root of your frontend project:

```env
# The Site ID you copied from the CMS Dashboard
NEXT_PUBLIC_SITE_ID="your-copied-site-id"

# URL of the running Global Backend CMS
NEXT_PUBLIC_CMS_BASE_URL="http://localhost:3000"

# Secret key for automatic route syncing (must match the generated Integration Key)
CMS_INTEGRATION_KEY="your-generated-integration-key"

# Optional — if you configure reCAPTCHA
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
```

### Step 3 — Wrap Next.js Config

Update your `next.config.mjs` to use the SDK wrapper:

```js
import { withCMS } from "@yourcompany/global-backend-next";

/** @type {import('next').NextConfig} */
const nextConfig = withCMS({
  reactCompiler: true,
  transpilePackages: ["@yourcompany/global-backend-next"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
});

export default nextConfig;
```

> `withCMS` automatically adds:
> - `/crm` → redirects to backend CRM dashboard
> - `/dashboard` → redirects to backend admin dashboard
> - `/admin` → redirects to backend admin login

### Step 4 — Add SDK Components to Root Layout

In `src/app/layout.js`, import and render the SDK components:

```js
import {
  GlobalAnalytics,
  CookieConsentBanner,
  OneSignalScript,
} from "@yourcompany/global-backend-next/components";

export default async function RootLayout({ children }) {
  // Fetch layout settings from the CMS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/api/settings?siteId=${process.env.NEXT_PUBLIC_SITE_ID}`,
    { cache: "no-store" }
  );
  const { data: settings } = await res.json();

  return (
    <html lang="en">
      <head>
        {/* Injects Google Analytics, GTM, and custom scripts from dashboard settings */}
        <GlobalAnalytics settings={settings} />

        {/* OneSignal push notification listener */}
        <OneSignalScript settings={settings} />
      </head>
      <body>
        {children}

        {/* GDPR Cookie Consent banner (auto-hides if already accepted) */}
        <CookieConsentBanner
          complianceSettings={settings?.compliance}
          siteId={process.env.NEXT_PUBLIC_SITE_ID}
          baseUrl={process.env.NEXT_PUBLIC_CMS_BASE_URL}
        />
      </body>
    </html>
  );
}
```

### Step 5 — Initialize the CMS Client

Create `src/lib/cms.js` in your frontend project:

```js
import { createCMS } from "@yourcompany/global-backend-next";

export const cms = createCMS({
  endpoint: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID,
});
```

### Step 6 — Start the Frontend

```bash
npm run dev
```

On startup, the SDK automatically syncs all your Next.js routes (`/about`, `/contact`, etc.) to the backend dashboard. You will see this in the terminal:

```
[CMS SDK] ✅ Route sync complete — 1 created, 3 updated, 0 removed
```

---

## Part 4: Using the SDK in Pages & Components

### Fetch Pages & Content

```js
import { cms } from "@/lib/cms";

// Fetch a static page
const page = await cms.getPage("about");

// Fetch blog posts (paginated)
const posts = await cms.getPosts({ page: 1, limit: 10 });

// Fetch a single post by slug
const post = await cms.getPost("my-article-slug");
```

### Newsletter Signup

```js
import { cms } from "@/lib/cms";

async function handleSubscribe(email, name) {
  const result = await cms.subscribeNewsletter({
    email,
    name,
    metadata: { source: "homepage-footer" },
  });
  return result;
}
```

### Ad Serving & Click Tracking

```js
import { cms } from "@/lib/cms";

// Fetch ads for a zone defined in the CMS
const ads = await cms.getAds("homepage-banner");

// Track an impression when the ad enters the viewport
await cms.trackAdEvent(adId, "impression");

// Track a click when the user clicks the ad
await cms.trackAdEvent(adId, "click");
```

---

## Part 5: Dashboard Features Available After Integration

Once connected, these features are available directly from the backend dashboard:

| Feature | Dashboard Location |
|---|---|
| Edit site settings & branding | Settings |
| Manage blog posts & pages | Blogs / Pages |
| Header & footer builder | Header / Footer |
| Email campaigns & subscribers | CRM → Campaigns |
| Cookie consent configuration | CRM → Cookie Consent |
| Visitor analytics | CRM → Analytics |
| Push notifications (OneSignal) | CRM → Push Notifications |
| Google Analytics ID setup | Settings → SEO & Analytics |
| SMTP / SendGrid / Resend email | CRM → Email Settings |
| API keys & integration key | Developer Tools |

---

## Troubleshooting

### "Site not found" error on frontend startup
- Verify `NEXT_PUBLIC_SITE_ID` in your frontend `.env` matches the Site ID shown in the backend dashboard.
- Make sure the backend server is running and accessible at `NEXT_PUBLIC_CMS_BASE_URL`.

### Route sync not working
- Check that `CMS_INTEGRATION_KEY` in your frontend `.env` matches the key generated in **Developer Tools** on the backend.
- Restart the frontend dev server after updating `.env`.

### Cookie banner not showing
- Enable it in the backend dashboard under **Settings → Cookie Consent**.
- Clear any previous consent from the browser console:
  ```js
  localStorage.removeItem('cookie_consent');
  location.reload();
  ```

### Analytics script not loading
- Make sure you have entered your **Google Analytics Measurement ID** (e.g., `G-XXXXXXXXXX`) in **Settings → SEO & Analytics** on the backend dashboard.
- Confirm the user has accepted cookies if your compliance settings require consent before loading analytics.
