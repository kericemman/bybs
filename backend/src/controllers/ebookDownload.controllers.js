const crypto = require("crypto");

const Product = require("../models/Product");
const EbookDownload = require("../models/EbookDownload");
const cloudinary = require("../config/cloudinary");
const resend = require("../utils/resendClient");
const { config } = require("../config/env");
const { cleanText, escapeHtml, isValidEmail, normalizeEmail } = require("../utils/inputValidation");

const FROM_EMAIL = process.env.FROM_EMAIL || "BYBS <no-reply@updates.buildyourbestself.org>";
const DOWNLOAD_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashDownloadToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const emailDownloadLink = (req, token) => {
  const relativePath = `/api/products/download/${encodeURIComponent(token)}`;
  const baseUrl = config.frontendUrl || `${req.protocol}://${req.get("host")}`;
  return {
    absolute: new URL(relativePath, `${baseUrl}/`).toString(),
    relative: relativePath,
  };
};

exports.requestFreeEbook = async (req, res) => {
  let download;

  try {
    const name = cleanText(req.body?.name, 120);
    const email = normalizeEmail(req.body?.email);

    if (!name || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide your name and a valid email address." });
    }

    const product = await Product.findOne({ slug: req.params.slug }).select(
      "title slug type price filePublicId fileName"
    );

    if (!product) return res.status(404).json({ message: "Ebook not found." });
    if (product.type !== "ebook") {
      return res.status(400).json({ message: "This product is not a downloadable ebook." });
    }
    if (Number(product.price) !== 0) {
      return res.status(400).json({ message: "This ebook is available through a paid request." });
    }
    if (!product.filePublicId) {
      return res.status(409).json({ message: "This ebook file is not available yet." });
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + DOWNLOAD_LINK_TTL_MS);
    download = await EbookDownload.create({
      product: product._id,
      productTitle: product.title,
      name,
      email,
      tokenHash: hashDownloadToken(token),
      expiresAt,
    });

    const downloadLink = emailDownloadLink(req, token);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Your BYBS ebook: ${product.title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:28px;color:#1f2937;">
          <p style="margin:0 0 12px;color:#b96500;font-size:13px;font-weight:700;text-transform:uppercase;">Build Your Best Self</p>
          <h1 style="margin:0;color:#00337c;font-size:26px;line-height:1.25;">Your ebook is ready</h1>
          <p style="margin:20px 0 0;line-height:1.7;">Hello ${escapeHtml(name)},</p>
          <p style="line-height:1.7;">Thank you for choosing <strong>${escapeHtml(product.title)}</strong>. Use the button below to download your PDF.</p>
          <p style="margin:28px 0;">
            <a href="${downloadLink.absolute}" style="display:inline-block;background:#00337c;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:700;">Download your ebook</a>
          </p>
          <p style="font-size:13px;line-height:1.6;color:#6b7280;">This private link is available for 7 days. If it expires, request the ebook again from the BYBS shop.</p>
          <p style="margin-top:28px;line-height:1.7;">Warmly,<br><strong>BYBS Team</strong></p>
        </div>
      `,
    });

    if (result.error) throw new Error(result.error.message || "Resend rejected the email.");

    download.emailStatus = "sent";
    download.emailProviderId = result.data?.id;
    await download.save();

    return res.status(201).json({
      message: "Your download link has been emailed to you.",
      downloadUrl: downloadLink.relative,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Free ebook delivery error:", error);
    if (download) {
      download.emailStatus = "failed";
      download.emailError = cleanText(error.message, 500);
      await download.save().catch(() => {});
    }
    return res.status(502).json({
      message: "We could not email your ebook right now. Please check the address and try again.",
    });
  }
};

exports.downloadFreeEbook = async (req, res) => {
  try {
    const tokenHash = hashDownloadToken(req.params.token || "");
    const download = await EbookDownload.findOne({ tokenHash }).select("+tokenHash");
    const downloadIsActive = download && download.expiresAt.getTime() > Date.now();
    const product = downloadIsActive
      ? await Product.findById(download.product).select("title type price filePublicId")
      : null;

    if (
      !product ||
      !downloadIsActive ||
      String(download.product) !== String(product._id) ||
      product.type !== "ebook" ||
      Number(product.price) !== 0 ||
      !product.filePublicId
    ) {
      return res.status(404).send("This download is no longer available.");
    }

    const publicId = product.filePublicId.replace(/\.pdf$/i, "");
    const privateUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
      resource_type: "raw",
      type: "authenticated",
      attachment: true,
      expires_at: Math.floor(Date.now() / 1000) + 5 * 60,
    });

    download.downloadCount += 1;
    download.lastDownloadedAt = new Date();
    await download.save();

    res.set("Cache-Control", "no-store");
    return res.redirect(302, privateUrl);
  } catch (error) {
    console.error("Free ebook download error:", error.message);
    return res.status(400).send("This download link is invalid or has expired.");
  }
};
