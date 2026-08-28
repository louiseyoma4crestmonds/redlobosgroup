import { Request } from "express";

export interface SeoMetadata {
  title: string;
  description: string;
  robots: string;
  breadcrumb: string;
}

const siteName = "Red Lobos Group";
const defaultDescription =
  "Book premium shortlet properties and curated in-stay experiences across the UK with Red Lobos Group.";

const addonMetadata: Record<string, SeoMetadata> = {
  "1": {
    title: "Romantic Stay Setups | Red Lobos Group",
    description:
      "Create a memorable romantic stay with candlelight, rose petals, and thoughtful details from Red Lobos Group.",
    robots: "index,follow",
    breadcrumb: "Romantic Stay Setup",
  },
  "2": {
    title: "Podcast & Content Studio Hire | Red Lobos Group",
    description:
      "Book a professional podcast, content creation, or home studio setup through Red Lobos Group.",
    robots: "index,follow",
    breadcrumb: "Podcast & Content Studio",
  },
  "3": {
    title: "Proposal Setup Services | Red Lobos Group",
    description:
      "Plan an unforgettable proposal with a curated setup from Red Lobos Group.",
    robots: "index,follow",
    breadcrumb: "Proposal Setup",
  },
  "4": {
    title: "Paint & Sip Events | Red Lobos Group",
    description:
      "Unleash your creativity with a fun paint and sip experience from Red Lobos Group.",
    robots: "index,follow",
    breadcrumb: "Paint & Sip",
  },
};

export function getSeoMetadata(pathname: string): SeoMetadata {
  if (pathname === "/") {
    return {
      title: "Luxury Shortlet Stays & Experiences | Red Lobos Group",
      description:
        "Discover premium shortlet properties and curated in-stay experiences across the UK. Book your next memorable stay with Red Lobos Group.",
      robots: "index,follow",
      breadcrumb: "Home",
    };
  }

  const publicPages: Record<string, SeoMetadata> = {
    "/about": {
      title: "About Red Lobos Group | Premium UK Shortlet Stays",
      description:
        "Learn how Red Lobos Group delivers handpicked UK shortlet properties, thoughtful hospitality, and memorable guest experiences.",
      robots: "index,follow",
      breadcrumb: "About Us",
    },
    "/mission": {
      title: "Our Mission | Thoughtful UK Shortlet Hospitality",
      description:
        "Discover the Red Lobos Group mission to make every UK shortlet stay feel personal, comfortable, and unforgettable.",
      robots: "index,follow",
      breadcrumb: "Our Mission",
    },
    "/contacts": {
      title: "Contact Red Lobos Group | UK Shortlet Support",
      description:
        "Contact Red Lobos Group about premium UK shortlet stays, bookings, curated experiences, or guest support.",
      robots: "index,follow",
      breadcrumb: "Contact Us",
    },
    "/properties": {
      title: "Luxury Shortlet Properties Across the UK | Red Lobos Group",
      description:
        "Browse handpicked shortlet apartments, suites, and townhouses across the UK and find the right Red Lobos Group stay.",
      robots: "index,follow",
      breadcrumb: "Properties",
    },
    "/addOn": {
      title: "Curated In-Stay Experiences | Red Lobos Group",
      description:
        "Enhance your stay with romantic setups, proposal arrangements, paint and sip events, and studio experiences.",
      robots: "index,follow",
      breadcrumb: "Experiences",
    },
    "/privacy-policy": {
      title: "Privacy Policy | Red Lobos Group",
      description:
        "Read the Red Lobos Group Privacy Policy covering accounts, bookings, payments, cookies, and your privacy rights.",
      robots: "index,follow",
      breadcrumb: "Privacy Policy",
    },
    "/terms-and-conditions": {
      title: "Terms & Conditions | Red Lobos Group",
      description:
        "Read the Red Lobos Group Terms and Conditions for shortlet property bookings and curated in-stay experiences.",
      robots: "index,follow",
      breadcrumb: "Terms & Conditions",
    },
    "/propertyDetails": {
      title: "Luxury Shortlet Property Details | Red Lobos Group",
      description:
        "Explore property details, amenities, location, availability, and booking options for a Red Lobos Group shortlet stay.",
      robots: "index,follow",
      breadcrumb: "Property Details",
    },
    "/photoGallery": {
      title: "Property Photo Gallery | Red Lobos Group",
      description:
        "View photos of Red Lobos Group shortlet properties and discover the spaces available for your next UK stay.",
      robots: "index,follow",
      breadcrumb: "Photo Gallery",
    },
  };

  if (publicPages[pathname]) {
    return publicPages[pathname];
  }

  if (pathname.startsWith("/addOn/")) {
    return (
      addonMetadata[pathname.split("/")[2]] ?? {
        title: "Curated Experiences | Red Lobos Group",
        description: defaultDescription,
        robots: "noindex,nofollow",
        breadcrumb: "Experience",
      }
    );
  }

  if (
    pathname.startsWith("/admin") ||
    pathname === "/dashboard" ||
    pathname === "/signIn" ||
    pathname === "/reset-password" ||
    pathname === "/checkout" ||
    pathname.startsWith("/payment/")
  ) {
    return {
      title: `${siteName} | Private Area`,
      description: defaultDescription,
      robots: "noindex,nofollow",
      breadcrumb: "Private Area",
    };
  }

  return {
    title: siteName,
    description: defaultDescription,
    robots: "noindex,nofollow",
    breadcrumb: "Page",
  };
}

export function isKnownAppPath(pathname: string): boolean {
  const exactPaths = new Set([
    "/",
    "/about",
    "/mission",
    "/contacts",
    "/properties",
    "/propertyDetails",
    "/photoGallery",
    "/signIn",
    "/reset-password",
    "/dashboard",
    "/addOn",
    "/payment/success",
    "/payment/cancel",
    "/checkout",
    "/admin",
    "/admin/login",
    "/admin/accounts",
    "/privacy-policy",
    "/terms-and-conditions",
  ]);

  return (
    exactPaths.has(pathname) ||
    /^\/addOn\/[1-4]$/.test(pathname) ||
    /^\/admin\/properties\/[^/]+$/.test(pathname)
  );
}

export function getPublicOrigin(req: Request): string {
  const configuredOrigin = process.env.PRODUCTION_URL?.trim();
  if (configuredOrigin) return configuredOrigin.replace(/\/+$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value: string): string {
  return escapeHtml(value);
}

function structuredData(origin: string, pathname: string, metadata: SeoMetadata) {
  const canonicalUrl = `${origin}${pathname}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: siteName,
        url: origin,
        logo: `${origin}/redlobosLogo.png`,
        email: "prisca@redlobosgroup.com",
        telephone: "+44 7424 733629",
        address: {
          "@type": "PostalAddress",
          streetAddress: "71–75 Shelton Street",
          addressLocality: "London",
          postalCode: "WC2H 9JQ",
          addressCountry: "GB",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: siteName,
        url: origin,
        publisher: { "@id": `${origin}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${origin}/`,
          },
          ...(pathname !== "/"
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: metadata.breadcrumb,
                  item: canonicalUrl,
                },
              ]
            : []),
        ],
      },
    ],
  };
}

export function renderSeoHead(
  req: Request,
  pathname: string,
  search = ""
): string {
  const origin = getPublicOrigin(req);
  const metadata = getSeoMetadata(pathname);
  const canonicalPath = `${pathname}${search}`;
  const canonicalUrl = `${origin}${canonicalPath}`;
  const jsonLd = JSON.stringify(
    structuredData(origin, canonicalPath, metadata)
  ).replace(
    /</g,
    "\\u003c"
  );

  return `
    <title data-seo="title">${escapeHtml(metadata.title)}</title>
    <meta data-seo="description" name="description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="robots" name="robots" content="${metadata.robots}" />
    <meta data-seo="og-title" property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta data-seo="og-description" property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="og-url" property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta data-seo="og-type" property="og:type" content="website" />
    <meta data-seo="og-locale" property="og:locale" content="en_GB" />
    <meta data-seo="og-site-name" property="og:site_name" content="${siteName}" />
    <meta data-seo="twitter-card" name="twitter:card" content="summary_large_image" />
    <meta data-seo="twitter-title" name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta data-seo="twitter-description" name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <link data-seo="canonical" rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <script data-seo="jsonld" type="application/ld+json">${jsonLd}</script>
  `;
}

export function renderSeoNoscript(pathname: string): string {
  const metadata = getSeoMetadata(pathname);
  return `<h1>${escapeHtml(metadata.title.replace(` | ${siteName}`, ""))}</h1><p>${escapeHtml(metadata.description)}</p>`;
}

export function renderSitemap(origin: string, propertyIds: number[]): string {
  const staticPaths = [
    "/",
    "/about",
    "/mission",
    "/contacts",
    "/properties",
    "/addOn",
    "/addOn/1",
    "/addOn/2",
    "/addOn/3",
    "/addOn/4",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  const propertyPaths = propertyIds.map(
    (id) => `/propertyDetails?id=${encodeURIComponent(String(id))}`
  );
  const urls = [...staticPaths, ...propertyPaths];
  const entries = urls
    .map((url) => `  <url><loc>${escapeXml(`${origin}${url}`)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}