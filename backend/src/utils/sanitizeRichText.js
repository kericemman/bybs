const sanitizeHtml = require("sanitize-html");

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  "div",
  "figure",
  "figcaption",
  "img",
  "iframe",
];

const sanitizeRichText = (html = "") =>
  sanitizeHtml(String(html), {
    allowedTags,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "title", "allow", "allowfullscreen", "frameborder", "data-video-embed"],
      div: ["class", "data-video-embed", "style"],
      p: ["class", "style"],
      h1: ["id", "class", "style"],
      h2: ["id", "class", "style"],
      h3: ["id", "class", "style"],
      h4: ["id", "class", "style"],
      h5: ["id", "class", "style"],
      h6: ["id", "class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          loading: attribs.loading || "lazy",
        },
      }),
    },
  });

module.exports = sanitizeRichText;
