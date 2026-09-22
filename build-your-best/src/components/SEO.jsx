import { useEffect } from "react";
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, absoluteUrl, truncate } from "../lib/seo";

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      element.removeAttribute(key);
      return;
    }
    element.setAttribute(key, String(value));
  });
};

const upsertLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const upsertJsonLd = (id, schema) => {
  let element = document.getElementById(id);

  if (!schema) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(schema);
};

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  imageAlt,
  type = "website",
  noindex = false,
  keywords,
  schema,
}) {
  useEffect(() => {
    const cleanTitle = title || SITE_NAME;
    const cleanDescription = truncate(description || DEFAULT_DESCRIPTION, 160);
    const canonicalUrl = canonical || absoluteUrl(window.location.pathname);
    const imageUrl = absoluteUrl(image || DEFAULT_IMAGE);
    const cleanImageAlt = truncate(imageAlt || cleanTitle, 120);
    const robots = noindex ? "noindex,follow" : "index,follow,max-image-preview:large";

    document.title = cleanTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: cleanDescription,
    });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[name="googlebot"]', { name: "googlebot", content: robots });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: cleanTitle });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: cleanDescription,
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: cleanImageAlt,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: cleanTitle });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: cleanDescription,
    });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: cleanImageAlt,
    });

    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords || "" });

    upsertLink("canonical", canonicalUrl);
    upsertJsonLd("seo-jsonld", schema);
  }, [canonical, description, image, imageAlt, keywords, noindex, schema, title, type]);

  return null;
}
