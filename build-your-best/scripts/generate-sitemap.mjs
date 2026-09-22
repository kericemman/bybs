import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const loadedEnv = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const env = { ...loadedEnv, ...process.env };
const siteUrl = (env.VITE_SITE_URL || env.SITE_URL || "https://buildyourbestself.org").replace(
  /\/$/,
  ""
);
const configuredApiUrl = env.SITEMAP_API_URL || env.API_URL || env.VITE_API_URL || `${siteUrl}/api`;
const apiUrl = new URL(configuredApiUrl, `${siteUrl}/`).toString().replace(/\/$/, "");
const strictMode = env.SITEMAP_STRICT === "true";
const writeSource = process.argv.includes("--source");
const today = new Date().toISOString().slice(0, 10);
const fetchFailures = [];

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/programs", priority: "0.9", changefreq: "monthly" },
  { path: "/programs/fellowship", priority: "0.9", changefreq: "weekly" },
  { path: "/programs/mentorship", priority: "0.7", changefreq: "monthly" },
  { path: "/programs/empowerher", priority: "0.7", changefreq: "monthly" },
  { path: "/programs/outreach", priority: "0.8", changefreq: "monthly" },
  { path: "/community", priority: "0.9", changefreq: "weekly" },
  { path: "/community/reflections", priority: "0.8", changefreq: "weekly" },
  { path: "/community/stories", priority: "0.7", changefreq: "monthly" },
  { path: "/impact", priority: "0.9", changefreq: "weekly" },
  { path: "/insights", priority: "0.9", changefreq: "weekly" },
  { path: "/get-involved", priority: "0.9", changefreq: "monthly" },
  { path: "/get-involved/volunteer", priority: "0.7", changefreq: "monthly" },
  { path: "/get-involved/mentor", priority: "0.7", changefreq: "monthly" },
  { path: "/get-involved/partner", priority: "0.7", changefreq: "monthly" },
  { path: "/support", priority: "0.8", changefreq: "monthly" },
  { path: "/shop", priority: "0.8", changefreq: "weekly" },
  { path: "/discovery", priority: "0.6", changefreq: "monthly" },
  { path: "/faqs", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const absoluteUrl = (routePath) =>
  `${siteUrl}${routePath.startsWith("/") ? routePath : `/${routePath}`}`;

const fetchJson = async (endpoint) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Sitemap: skipped ${endpoint} (${error.message}).`);
    fetchFailures.push(endpoint);
    return [];
  }
};

const uniqueRoutes = (routes) => {
  const seen = new Map();

  routes.forEach((route) => {
    const key = route.path;
    if (!key || seen.has(key)) return;
    seen.set(key, route);
  });

  return Array.from(seen.values());
};

const buildSitemap = (routes) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
    <lastmod>${escapeXml(route.lastmod || today)}</lastmod>
    <changefreq>${escapeXml(route.changefreq || "monthly")}</changefreq>
    <priority>${escapeXml(route.priority || "0.5")}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const [articles, products, cohorts, reflections, impactStories] = await Promise.all([
  fetchJson("/articles"),
  fetchJson("/products"),
  fetchJson("/cohorts"),
  fetchJson("/reflections/prompts"),
  fetchJson("/community-actions?limit=50"),
]);

if (strictMode && fetchFailures.length > 0) {
  throw new Error(`Sitemap API requests failed: ${fetchFailures.join(", ")}`);
}

const dynamicRoutes = [
  ...articles
    .filter((article) => article.slug)
    .map((article) => ({
      path: `/insights/${article.slug}`,
      lastmod: article.updatedAt || article.createdAt || today,
      priority: "0.8",
      changefreq: "monthly",
    })),
  ...products
    .filter((product) => product.slug)
    .map((product) => ({
      path: `/shop/${product.slug}`,
      lastmod: product.updatedAt || product.createdAt || today,
      priority: "0.7",
      changefreq: "weekly",
    })),
  ...cohorts
    .filter((cohort) => cohort.slug)
    .flatMap((cohort) => [
      {
        path: `/programs/fellowship/cohorts/${cohort.slug}`,
        lastmod: cohort.updatedAt || cohort.createdAt || today,
        priority: "0.7",
        changefreq: "monthly",
      },
      ...(cohort.applicationStatus === "open"
        ? [
            {
              path: `/programs/fellowship/cohorts/${cohort.slug}/apply`,
              lastmod: cohort.updatedAt || cohort.createdAt || today,
              priority: "0.6",
              changefreq: "monthly",
            },
          ]
        : []),
    ]),
  ...reflections
    .filter((reflection) => reflection.slug)
    .map((reflection) => ({
      path: `/community/reflections/${reflection.slug}`,
      lastmod: reflection.updatedAt || reflection.createdAt || today,
      priority: "0.7",
      changefreq: "weekly",
    })),
  ...impactStories
    .filter((story) => story.slug)
    .map((story) => ({
      path: `/impact/${story.slug}`,
      lastmod: story.updatedAt || story.createdAt || today,
      priority: "0.8",
      changefreq: "monthly",
    })),
];

const routes = uniqueRoutes([...staticRoutes, ...dynamicRoutes]);
const sitemap = buildSitemap(routes);
const targets = [path.resolve("dist/sitemap.xml")];
if (writeSource) targets.push(path.resolve("public/sitemap.xml"));

for (const target of targets) {
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, sitemap, "utf8");
  } catch (error) {
    console.warn(`Sitemap: could not write ${target} (${error.message}).`);
  }
}

console.log(`Sitemap generated with ${routes.length} URLs.`);
