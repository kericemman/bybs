const axios = require("axios");
const Coaching = require("../models/Coaching");
const resend = require("../utils/resendClient");

// ✅ INITIATE COACHING PAYMENT
const initiateCoaching = async (req, res) => {
  const { fullName, email, phone, amount, productName, sessionType, preferredDate } = req.body;

  try {
    const numericAmount = Number(amount);

    if (!fullName || !email || !phone || !productName || !numericAmount) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, package, and amount are required",
      });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Payment is not configured",
      });
    }

    const amountInKobo = Math.round(numericAmount * 100);

    // Initialize Paystack payment
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo,
        currency: "USD",
        callback_url: `${process.env.FRONTEND_URL}/coaching-success`,
        metadata: { 
          fullName, 
          phone, 
          productName,
          sessionType,
          preferredDate 
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save record in MongoDB
    await Coaching.create({
      fullName,
      email,
      phone,
      amount: numericAmount,
      productName,
      sessionType,
      preferredDate,
      status: "pending",
      reference: response.data.data.reference,
    });

    res.status(200).json({
      success: true,
      data: response.data.data,
    });
  } catch (err) {
    console.error("❌ Coaching payment init error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to initialize payment" });
  }
};

// ✅ VERIFY COACHING PAYMENT
const verifyCoaching = async (req, res) => {
  const { reference } = req.body;
  if (!reference)
    return res.status(400).json({ success: false, message: "Reference required" });

  try {
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = verifyRes.data.data;

    if (data.status === "success") {
      // Update payment in DB
      const updatedBooking = await Coaching.findOneAndUpdate(
        { reference, status: { $ne: "completed" } },
        { status: "completed" },
        { new: true }
      );

      if (!updatedBooking) {
        const existingBooking = await Coaching.findOne({ reference });

        if (!existingBooking) {
          return res.status(404).json({
            success: false,
            message: "Booking not found",
          });
        }

        return res.status(200).json({
          success: true,
          booking: {
            fullName: existingBooking.fullName,
            email: existingBooking.email,
            phone: existingBooking.phone,
            productName: existingBooking.productName,
            sessionType: existingBooking.sessionType,
            preferredDate: existingBooking.preferredDate,
            price: existingBooking.amount,
            reference: existingBooking.reference,
          },
        });
      }

      // ✅ Send confirmation emails with rate limiting
      try {
        // Send customer email first
        await sendEmailWithRetry({
          from: "Build Your Best Self <admin@updates.buildyourbestselfblog.com>",
          to: [updatedBooking.email],
          subject: `🎉 Your Coaching Session is Confirmed!`,
          html: getCustomerEmailTemplate(updatedBooking),
        });

        // Wait 1.5 seconds before sending admin email
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Send admin email
        await sendEmailWithRetry({
          from: "Build Your Best Self <admin@updates.buildyourbestselfblog.com>",
          to: [process.env.ADMIN_EMAIL],
          subject: `📅 New Coaching Booking: ${updatedBooking.productName}`,
          html: getAdminEmailTemplate(updatedBooking),
        });

      } catch (mailErr) {
        console.warn("📭 Email sending warning:", mailErr.message);
        // Don't fail payment verification if emails fail
      }

      res.status(200).json({
        success: true,
        booking: {
          fullName: updatedBooking.fullName,
          email: updatedBooking.email,
          phone: updatedBooking.phone,
          productName: updatedBooking.productName,
          sessionType: updatedBooking.sessionType,
          preferredDate: updatedBooking.preferredDate,
          price: updatedBooking.amount,
          reference: updatedBooking.reference,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("❌ Verify error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

// ✅ EMAIL TEMPLATES
const getCustomerEmailTemplate = (booking) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coaching Session Confirmed</title>
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
          Transformative Coaching & Personal Growth
        </p>
      </td>
    </tr>

    <!-- Success Icon -->
    <tr>
      <td style="padding: 40px 30px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="color: #16a34a;">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <h2 style="color: #00337C; text-align: center; margin: 0 0 16px 0; font-size: 24px; font-weight: 400;">
          Your Coaching Session is Confirmed!
        </h2>
        <p style="color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
          Hi ${booking.fullName}, we're excited to support you on your growth journey!
        </p>

        <!-- Booking Details Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 0 0 30px 0;">
          <h3 style="color: #00337C; margin: 0 0 20px 0; font-size: 18px; font-weight: 500;">Session Details</h3>
          
          <table width="100%" style="color: #475569;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Program:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${booking.productName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Session Type:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${booking.sessionType || 'One-on-One Coaching'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Preferred Date:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                ${booking.preferredDate || 'To be scheduled'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Amount Paid:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #B76E79; font-weight: 500;">
                $${booking.amount}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>Reference:</strong>
              </td>
              <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 14px;">
                ${booking.reference}
              </td>
            </tr>
          </table>
        </div>

        <!-- Next Steps -->
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
          <h4 style="color: #0369a1; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">What Happens Next?</h4>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Our team will contact you within 24 hours to schedule your session</li>
            <li>You'll receive a calendar invitation with meeting details</li>
            <li>Prepare any questions or topics you'd like to discuss</li>
            <li>Look out for a pre-session questionnaire</li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.5;">
          <p style="margin: 0 0 16px 0;">
            <strong>Need to reschedule or have questions?</strong><br>
            Reply to this email or contact us at ${process.env.ADMIN_EMAIL}
          </p>
        </div>
      </td>
    </tr>

    

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 30px; text-align: center;">
        <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">
          Build Your Best Self Coaching<br>
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

const getAdminEmailTemplate = (booking) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Coaching Booking</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #00337C 0%, #1E4B9E 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300;">
          New Coaching Booking
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <div style="background-color: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 25px 0;">
          <p style="color: #166534; margin: 0; text-align: center; font-weight: 500;">
            🎉 New coaching booking received and payment confirmed!
          </p>
        </div>

        <h2 style="color: #00337C; margin: 0 0 20px 0; font-size: 20px; font-weight: 400;">
          Booking Summary
        </h2>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
          <table width="100%" style="color: #475569;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Client:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${booking.fullName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Email:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${booking.email}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Phone:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${booking.phone}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Program:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${booking.productName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Session Type:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${booking.sessionType || 'One-on-One Coaching'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Preferred Date:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${booking.preferredDate || 'To be scheduled'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Amount:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                $${booking.amount}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>Reference:</strong>
              </td>
              <td style="padding: 8px 0;">
                ${booking.reference}
              </td>
            </tr>
          </table>
        </div>

        <!-- Action Required -->
        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 16px; margin: 0 0 25px 0;">
          <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">Action Required</h4>
          <p style="color: #92400e; margin: 0; font-size: 13px;">
            Please contact the client within 24 hours to schedule their session.
          </p>
        </div>

        <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
          Client has been automatically notified of their booking confirmation.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 20px; text-align: center;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          Build Your Best Self - Coaching Dashboard<br>
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

module.exports = { initiateCoaching, verifyCoaching };
