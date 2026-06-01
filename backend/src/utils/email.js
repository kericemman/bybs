const { Resend } = require("resend");
const fs = require("fs");

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "BYBS <admin@campaign.buildyourbestself.org>";

// ======================================================
// Base HTML Layout
// ======================================================
const emailLayout = (content) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #00337C; margin-bottom: 20px;">
        Build Your Best Self
      </h2>

      ${content}

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} Build Your Best Self. All rights reserved.
      </p>
    </div>
  </div>
`;

// ======================================================
// Helper: Send Email with Attachment
// ======================================================
const sendEmail = async ({ to, subject, content, attachmentPath }) => {
  try {
    const attachments = attachmentPath && fs.existsSync(attachmentPath)
      ? [{
          filename: `invoice-${Date.now()}.pdf`,
          content: fs.readFileSync(attachmentPath).toString("base64"),
        }]
      : [];

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: emailLayout(content),
      attachments,
    });
  } catch (error) {
    console.error(`Email error (${subject}):`, error.message);
  }
};

// ======================================================
// 1️⃣ Ebook Purchase Email
// ======================================================
exports.sendEbookEmail = async (order, invoicePath) => {
  const ebookItem = order.items?.length
    ? order.items.find((item) => item.type === "ebook")
    : null;
  const ebookTitle = ebookItem?.title || order.product.title;
  const ebookUrl = ebookItem?.product?.fileUrl || order.product.fileUrl;

  const content = `
    <h3 style="color:#00337C;">Thank You For Your Purchase 🎉</h3>

    <p>Hello ${order.name},</p>

    <p>Your payment has been successfully received for:</p>

    <p style="font-weight:bold; font-size:16px;">${ebookTitle}</p>

    <p style="margin: 20px 0;">
      <a 
        href="${ebookUrl}" 
        style="background:#00337C; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
        Download Ebook
      </a>
    </p>

    <p>Your invoice is attached to this email.</p>

    <p>If you have any issues, reply to this email and we'll assist you.</p>

    <p style="margin-top:20px;">
      Stay intentional,<br/>
      <strong>BYBS Team</strong>
    </p>
  `;

  await sendEmail({
    to: order.email,
    subject: `Your Ebook: ${ebookTitle}`,
    content,
    attachmentPath: invoicePath,
  });
};

// ======================================================
// 2️⃣ Merch Order Confirmation Email
// ======================================================
exports.sendMerchEmail = async (order, invoicePath) => {
  const merchItems = order.items?.length
    ? order.items
    : [
        {
          title: order.product.title,
          quantity: 1,
          price: order.amount,
        },
      ];

  const itemList = merchItems
    .map(
      (item) =>
        `<li>${item.title} &times; ${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}</li>`
    )
    .join("");

  const content = `
    <h3 style="color:#00337C;">Order Confirmed 🛍️</h3>

    <p>Hello ${order.name},</p>

    <p>Your order has been successfully placed:</p>

    <ul style="padding-left:18px;">${itemList}</ul>

    <p><strong>Total:</strong> $${order.amount.toFixed(2)}</p>

    <p><strong>Shipping Address:</strong><br/>${order.shippingAddress}</p>

    <p>Our team is preparing your order for delivery.</p>

    <p>You will receive another email once it has been shipped.</p>

    <p>Your invoice is attached to this email.</p>

    <p style="margin-top:20px;">
      Thank you for supporting BYBS 💙<br/>
      <strong>BYBS Team</strong>
    </p>
  `;

  await sendEmail({
    to: order.email,
    subject: `Order Confirmation - ${order.reference}`,
    content,
    attachmentPath: invoicePath,
  });
};
