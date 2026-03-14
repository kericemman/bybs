const Contact = require("../models/Contact");
const resend = require("../utils/resendClient");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ✅ Save message in MongoDB
    const newMessage = await Contact.create({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
    });

    // ✅ Send email notifications with rate limiting
    const adminEmail = process.env.ADMIN_EMAIL;

    try {
      // User confirmation email first
      await sendEmailWithRetry({
        from: "Build Your Best Self <admin@updates.buildyourbestselfblog.com>",
        to: [email],
        subject: `Thank you for reaching out, ${name}!`,
        html: getUserConfirmationTemplate(name, email, subject, message),
      });

      // Wait 1.5 seconds before sending admin email
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Admin notification email
      await sendEmailWithRetry({
        from: "Build Your Best Self <admin@updates.buildyourbestselfblog.com>",
        to: [adminEmail],
        subject: `📩 New Contact: ${name} - ${subject || 'General Inquiry'}`,
        html: getAdminNotificationTemplate(name, email, subject, message),
      });

    } catch (emailErr) {
      console.warn("Email sending warning:", emailErr.message);
      // Don't fail the contact submission if emails fail
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (err) {
    console.error("❌ Contact form error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

// ✅ EMAIL TEMPLATES
const getUserConfirmationTemplate = (name, email, subject, message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #00337C 0%, #1E4B9E 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">
          Build Your Best Self
        </h1>
        <p style="color: #E8F0FF; margin: 8px 0 0 0; font-size: 16px;">
          Thank You for Reaching Out
        </p>
      </td>
    </tr>

    <!-- Confirmation Icon -->
    <tr>
      <td style="padding: 40px 30px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #dbeafe; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="color: #1e40af;">
            <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <h2 style="color: #00337C; text-align: center; margin: 0 0 16px 0; font-size: 24px; font-weight: 400;">
          We've Received Your Message!
        </h2>
        <p style="color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
          Hi ${name}, thank you for contacting Build Your Best Self. We're excited to connect with you!
        </p>

        <!-- Message Summary -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 0 0 30px 0;">
          <h3 style="color: #00337C; margin: 0 0 16px 0; font-size: 18px; font-weight: 500;">Your Message Summary</h3>
          <table width="100%" style="color: #475569;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Subject:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${subject || 'General Inquiry'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>From:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${email}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>Submitted:</strong>
              </td>
              <td style="padding: 8px 0; text-align: right;">
                ${new Date().toLocaleDateString()}
              </td>
            </tr>
          </table>
        </div>

        <!-- Message Content -->
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
          <h4 style="color: #0369a1; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">Your Message</h4>
          <div style="color: #475569; line-height: 1.6; font-style: italic; background: white; padding: 16px; border-radius: 4px; border-left: 4px solid #00337C;">
            ${message}
          </div>
        </div>

        <!-- Next Steps -->
        <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.5;">
          <p style="margin: 0 0 16px 0;">
            <strong>What happens next?</strong><br>
            Our team will review your message and get back to you within 24-48 hours.
          </p>
          <p style="margin: 0;">
            In the meantime, feel free to explore our resources and begin your growth journey.
          </p>
        </div>
      </td>
    </tr>

    

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 30px; text-align: center;">
        <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">
          Build Your Best Self<br>
          Empowering your personal growth journey
        </p>
        <p style="color: #94a3b8; margin: 0; font-size: 12px;">
          © ${new Date().getFullYear()} Build Your Best Self. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getAdminNotificationTemplate = (name, email, subject, message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #00337C 0%, #1E4B9E 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300;">
          New Contact Message
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 0 0 25px 0;">
          <p style="color: #92400e; margin: 0; text-align: center; font-weight: 500;">
            📩 New contact form submission requires your attention
          </p>
        </div>

        <h2 style="color: #00337C; margin: 0 0 20px 0; font-size: 20px; font-weight: 400;">
          Contact Details
        </h2>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
          <table width="100%" style="color: #475569;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Name:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${name}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Email:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <a href="mailto:${email}" style="color: #00337C;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Subject:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${subject || 'General Inquiry'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>Submitted:</strong>
              </td>
              <td style="padding: 8px 0;">
                ${new Date().toLocaleString()}
              </td>
            </tr>
          </table>
        </div>

        <!-- Message Content -->
        <h3 style="color: #00337C; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">Message Content</h3>
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 16px; margin: 0 0 25px 0;">
          <div style="color: #475569; line-height: 1.6; white-space: pre-wrap;">
            ${message}
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="background-color: #dcfce7; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 0 0 25px 0;">
          <h4 style="color: #166534; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">Quick Actions</h4>
          <p style="color: #166534; margin: 0; font-size: 13px;">
            • <a href="mailto:${email}?subject=Re: ${subject || 'Your inquiry'}" style="color: #166534; text-decoration: underline;">Reply to ${name}</a><br>
            • Customer has been automatically notified of receipt
          </p>
        </div>

        <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
          This message has been saved to the database for tracking purposes.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 20px; text-align: center;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          Build Your Best Self - Contact Management<br>
          © ${new Date().getFullYear()} All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ✅ RATE LIMITING HELPER
const sendEmailWithRetry = async (emailData, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await resend.emails.send(emailData);
    } catch (error) {
      if (error.statusCode === 429 && i < retries - 1) {
        const waitTime = 1500 * (i + 1); // 1.5s, then 3s
        console.log(`Rate limited. Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
};

module.exports = { sendContactMessage };