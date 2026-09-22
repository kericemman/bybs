const test = require("node:test");
const assert = require("node:assert/strict");

const sanitizeEmailContent = require("../src/utils/sanitizeEmailContent");
const sanitizeRichText = require("../src/utils/sanitizeRichText");
const renderSeoHtml = require("../src/utils/renderSeoHtml");
const {
  cleanText,
  escapeHtml,
  isValidEmail,
  normalizeEmail,
} = require("../src/utils/inputValidation");

test("article HTML keeps supported content and removes executable markup", () => {
  const result = sanitizeRichText(`
    <h2 onclick="alert(1)">Heading</h2>
    <ul><li>Item</li></ul>
    <a href="javascript:alert(1)">Unsafe</a>
    <script>alert(1)</script>
    <iframe src="https://www.youtube-nocookie.com/embed/abc" onload="alert(1)"></iframe>
  `);

  assert.match(result, /<h2>Heading<\/h2>/);
  assert.match(result, /<ul><li>Item<\/li><\/ul>/);
  assert.match(result, /youtube-nocookie\.com\/embed\/abc/);
  assert.doesNotMatch(result, /script|onclick|onload|javascript:/i);
});

test("email HTML removes embeds and unsafe links", () => {
  const result = sanitizeEmailContent(
    '<p>Hello</p><iframe src="https://example.com"></iframe><a href="javascript:alert(1)">link</a>'
  );

  assert.equal(result, "<p>Hello</p><a>link</a>");
});

test("public input helpers normalize bounded text and email addresses", () => {
  assert.equal(normalizeEmail("  Person@Example.COM "), "person@example.com");
  assert.equal(isValidEmail("person@example.com"), true);
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(cleanText("a\u0000b", 2), "ab");
  assert.equal(escapeHtml('<a href="x">'), "&lt;a href=&quot;x&quot;&gt;");
});

test("SEO HTML uses page metadata and escapes database content", () => {
  const template = `<!doctype html><html><head>
    <link rel="canonical" href="https://example.com/" />
    <meta name="description" content="Generic" />
    <meta property="og:title" content="Generic" />
    <meta property="og:image" content="generic.png" />
    <script id="seo-jsonld" type="application/ld+json">{}</script>
    <title>Generic</title>
  </head><body><noscript><h1 data-seo-heading>Generic</h1><p data-seo-description>Generic</p></noscript></body></html>`;
  const result = renderSeoHtml(template, {
    title: 'A useful article <script>alert("x")</script>',
    description: 'An article about "real" growth & progress.',
    canonical: "https://example.com/insights/useful-article",
    heading: "A useful article",
    image: "https://images.example.com/cover.jpg",
    siteName: "Build Your Best Self",
    type: "article",
    schema: { "@context": "https://schema.org", headline: "A useful article </script>" },
  });

  assert.match(result, /<title>A useful article &lt;script&gt;/);
  assert.match(result, /canonical" href="https:\/\/example\.com\/insights\/useful-article/);
  assert.match(result, /og:image" content="https:\/\/images\.example\.com\/cover\.jpg/);
  assert.match(result, /content="An article about &quot;real&quot; growth &amp; progress\./);
  assert.match(result, /A useful article \\u003c\/script>/);
  assert.doesNotMatch(result, /<script>alert\("x"\)<\/script>/);

  const noSchemaResult = renderSeoHtml(template, {
    title: "Missing page",
    description: "This page does not exist.",
    canonical: "https://example.com/missing",
    image: "https://example.com/logo.png",
    siteName: "Build Your Best Self",
    noindex: true,
  });
  assert.match(noSchemaResult, /name="robots" content="noindex,follow"/);
  assert.doesNotMatch(noSchemaResult, /id="seo-jsonld"/);
});
