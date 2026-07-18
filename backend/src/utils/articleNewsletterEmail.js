const Subscriber = require("../models/Subscriber");
const resend = require("./resendClient");

const FROM_EMAIL =
  process.env.ARTICLE_NEWSLETTER_FROM_EMAIL ||
  process.env.FROM_EMAIL ||
  "BYBS Newsletter <no-reply@updates.buildyourbestself.org>";
const FRONTEND_URL = (process.env.FRONTEND_URL || "https://buildyourbestself.org").replace(/\/$/, "");
const BATCH_SIZE = 100;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const stripHtml = (html = "") =>
  String(html)
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const createPreview = (article, maxLength = 360) => {
  const plainText = stripHtml(article.excerpt || article.description || article.content);

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
};

const chunk = (items, size) => {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

const normalizeEmailIds = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.map((item) => item.id).filter(Boolean);
  if (Array.isArray(data.data)) return data.data.map((item) => item.id).filter(Boolean);
  if (data.id) return [data.id];
  return [];
};

const buildArticleNewsletterHtml = ({ article, subscriber, articleUrl, preview }) => {
  const title = escapeHtml(article.title);
  const safePreview = escapeHtml(preview);
  const greeting = subscriber.name ? `Hello ${escapeHtml(subscriber.name)},` : "Hello,";
  const coverImage = article.coverImage?.url
    ? `
      <tr>
        <td>
          <img src="${escapeHtml(article.coverImage.url)}" alt="${title}" style="display:block;width:100%;max-height:360px;object-fit:cover;border:0;" />
        </td>
      </tr>
    `
    : "";

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#172033;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border:1px solid #e5eaf2;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:26px 30px;background:#00337C;color:#ffffff;">
                  <p style="margin:0 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#bfdbfe;">BYBS Article</p>
                  <h1 style="margin:0;font-size:28px;line-height:1.25;font-weight:500;">${title}</h1>
                </td>
              </tr>
              ${coverImage}
              <tr>
                <td style="padding:30px;">
                  <p style="margin:0 0 18px;color:#475569;font-size:15px;line-height:1.7;">${greeting}</p>
                  <p style="margin:0 0 18px;color:#475569;font-size:16px;line-height:1.8;">A new article is live on Build Your Best Self. Here is a preview:</p>
                  <div style="margin:0 0 26px;padding:20px;border-left:4px solid #00337C;background:#f8fafc;color:#1f2937;font-size:16px;line-height:1.8;">
                    ${safePreview}
                  </div>
                  <p style="margin:0 0 26px;color:#64748b;font-size:14px;line-height:1.7;">Continue reading the full article on the website.</p>
                  <a href="${articleUrl}" style="display:inline-block;background:#00337C;color:#ffffff;text-decoration:none;border-radius:8px;padding:14px 22px;font-size:15px;font-weight:700;">
                    Read the full article
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 30px;background:#f8fafc;border-top:1px solid #e5eaf2;color:#64748b;font-size:12px;line-height:1.6;">
                  You are receiving this because you subscribed to Build Your Best Self updates. If you no longer want these emails, reply to this email with "unsubscribe".
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const buildArticleNewsletterText = ({ article, articleUrl, preview }) =>
  `${article.title}\n\n${preview}\n\nRead the full article: ${articleUrl}`;

const sendArticleNewsletter = async (article) => {
  const subscribers = await Subscriber.find({ isActive: true, email: { $exists: true, $ne: "" } })
    .select("email name")
    .lean();
  const validSubscribers = subscribers.filter((subscriber) => isValidEmail(subscriber.email));
  const invalidCount = subscribers.length - validSubscribers.length;

  if (!validSubscribers.length) {
    return {
      sent: true,
      recipientCount: 0,
      failedCount: invalidCount,
      emailIds: [],
      message: subscribers.length
        ? "No active subscribers had a valid email address."
        : "No active subscribers to notify.",
    };
  }

  const articleUrl = `${FRONTEND_URL}/articles/${article.slug}`;
  const preview = createPreview(article);
  const subject = `New article: ${article.title}`;
  const emailPayloads = validSubscribers.map((subscriber) => ({
    from: FROM_EMAIL,
    to: [subscriber.email],
    subject,
    html: buildArticleNewsletterHtml({ article, subscriber, articleUrl, preview }),
    text: buildArticleNewsletterText({ article, articleUrl, preview }),
  }));

  const emailIds = [];
  const batchErrors = [];

  for (const payloadChunk of chunk(emailPayloads, BATCH_SIZE)) {
    const { data, error } =
      payloadChunk.length === 1
        ? await resend.emails.send(payloadChunk[0])
        : await resend.batch.send(payloadChunk, { batchValidation: "permissive" });

    if (error) {
      const message = error.message || "Resend rejected the article newsletter.";
      const detail = error.name ? `${error.name}: ${message}` : message;
      throw new Error(detail);
    }

    emailIds.push(...normalizeEmailIds(data));

    if (Array.isArray(data?.errors) && data.errors.length) {
      batchErrors.push(...data.errors);
    }
  }

  const failedCount = invalidCount + batchErrors.length;

  return {
    sent: true,
    recipientCount: validSubscribers.length - batchErrors.length,
    failedCount,
    emailIds,
    articleUrl,
    error: failedCount
      ? `${failedCount} subscriber email${failedCount === 1 ? "" : "s"} could not be sent.`
      : "",
  };
};

module.exports = {
  sendArticleNewsletter,
};
