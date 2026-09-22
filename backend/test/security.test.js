const test = require("node:test");
const assert = require("node:assert/strict");

const sanitizeEmailContent = require("../src/utils/sanitizeEmailContent");
const sanitizeRichText = require("../src/utils/sanitizeRichText");
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
