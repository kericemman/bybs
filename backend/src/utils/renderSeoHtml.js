const escapeAttribute = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeText = (value = "") =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const escapePattern = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const replaceMeta = (html, attribute, key, content) => {
  const pattern = new RegExp(
    `<meta\\b[^>]*\\b${attribute}=["']${escapePattern(key)}["'][^>]*>`,
    "i"
  );

  if (!content) return html.replace(pattern, "");

  const tag = `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(content)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
};

const replaceCanonical = (html, canonical) => {
  const pattern = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeAttribute(canonical)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
};

const replaceJsonLd = (html, schema) => {
  const pattern = /<script\b[^>]*\bid=["']seo-jsonld["'][^>]*>[\s\S]*?<\/script>/i;
  if (!schema) return html.replace(pattern, "");

  const serialized = JSON.stringify(schema).replaceAll("<", "\\u003c");
  const script = `<script id="seo-jsonld" type="application/ld+json">${serialized}</script>`;
  return pattern.test(html)
    ? html.replace(pattern, script)
    : html.replace("</head>", `    ${script}\n  </head>`);
};

const renderSeoHtml = (template, metadata) => {
  const robots = metadata.noindex
    ? "noindex,follow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeText(metadata.title)}</title>`
  );

  html = replaceCanonical(html, metadata.canonical);
  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "keywords", metadata.keywords);
  html = replaceMeta(html, "name", "robots", robots);
  html = replaceMeta(html, "name", "googlebot", robots);
  html = replaceMeta(html, "property", "og:site_name", metadata.siteName);
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "property", "og:type", metadata.type || "website");
  html = replaceMeta(html, "property", "og:url", metadata.canonical);
  html = replaceMeta(html, "property", "og:image", metadata.image);
  html = replaceMeta(html, "property", "og:image:alt", metadata.imageAlt || metadata.title);
  html = replaceMeta(html, "name", "twitter:card", "summary_large_image");
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);
  html = replaceMeta(html, "name", "twitter:image", metadata.image);
  html = replaceMeta(html, "name", "twitter:image:alt", metadata.imageAlt || metadata.title);

  for (const meta of metadata.extraMeta || []) {
    html = replaceMeta(html, meta.attribute || "property", meta.key, meta.content);
  }

  html = replaceJsonLd(html, metadata.schema);
  html = html.replace(
    /<h1\b[^>]*data-seo-heading[^>]*>[\s\S]*?<\/h1>/i,
    `<h1 data-seo-heading>${escapeText(metadata.heading || metadata.title)}</h1>`
  );
  html = html.replace(
    /<p\b[^>]*data-seo-description[^>]*>[\s\S]*?<\/p>/i,
    `<p data-seo-description>${escapeText(metadata.description)}</p>`
  );

  return html;
};

module.exports = renderSeoHtml;
