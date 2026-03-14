const axios = require("axios");
const MerchOrder = require("../models/MerchOrder");
const resend = require("../utils/resendClient");
require("dotenv").config();

// ✅ INITIATE MERCH PAYMENT
const initiateMerchPayment = async (req, res) => {
  const { email, fullName, address, city, country, postalCode, items, amount } = req.body;

  try {
    // 1️⃣ Initialize Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        callback_url: `${process.env.FRONTEND_URL}/merch/success`,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: fullName
            },
            {
              display_name: "Items Count",
              variable_name: "items_count", 
              value: items.length
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 2️⃣ Save the new order
    const newOrder = new MerchOrder({
      userEmail: email,
      fullName,
      address,
      city,
      country,
      postalCode,
      items,
      totalAmount: amount,
      transactionRef: response.data.data.reference,
      paymentStatus: "pending",
    });

    await newOrder.save();

    // 3️⃣ Respond with Paystack URL
    res.status(200).json({
      success: true,
      data: response.data.data,
    });
  } catch (err) {
    console.error("❌ Merch Payment Init Error:", err.message);
    res.status(500).json({ message: "Failed to initialize merch payment" });
  }
};

// ✅ VERIFY MERCH PAYMENT
const verifyMerchPayment = async (req, res) => {
  const { reference } = req.body;

  try {
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const { data } = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    if (data.data.status !== "success") {
      return res.status(400).json({ success: false, message: "Payment failed" });
    }

    // 1️⃣ Update order
    const order = await MerchOrder.findOneAndUpdate(
      { transactionRef: reference },
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    // 2️⃣ Send emails with rate limiting
    try {
      // Send customer email first
      await sendEmailWithRetry({
        from: "Build Your Best Self <admin@updates.buildyourbestselfblog.com>",
        to: [order.userEmail],
        subject: `🎉 Your BYBS Order #${reference.slice(-8)} is Confirmed!`,
        html: getCustomerEmailTemplate(order, reference),
      });

      // Wait 1.5 seconds before sending admin email
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send admin email
      await sendEmailWithRetry({
        from: "Build Your Best Self <admin@updates.buildyourbestselfblog.com>",
        to: [process.env.ADMIN_EMAIL],
        subject: `📦 New Merch Order: ${order.items.length} items - $${order.totalAmount}`,
        html: getAdminEmailTemplate(order, reference),
      });

    } catch (emailErr) {
      console.warn("Email sending warning:", emailErr.message);
      // Don't fail payment verification if emails fail
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ Verification Error:", err.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// ✅ EMAIL TEMPLATES
const getCustomerEmailTemplate = (order, reference) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
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
          Wear Your Growth Journey
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
          Thank You for Your Order!
        </h2>
        <p style="color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
          Hi ${order.fullName}, your merch order has been confirmed and we're preparing it for shipment.
        </p>

        <!-- Order Details Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 0 0 30px 0;">
          <h3 style="color: #00337C; margin: 0 0 20px 0; font-size: 18px; font-weight: 500;">Order Details</h3>
          
          <!-- Order Items -->
          <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 12px; text-align: left; color: #00337C; font-weight: 500; border-bottom: 2px solid #e2e8f0;">Product</th>
                <th style="padding: 12px; text-align: center; color: #00337C; font-weight: 500; border-bottom: 2px solid #e2e8f0;">Size</th>
                <th style="padding: 12px; text-align: center; color: #00337C; font-weight: 500; border-bottom: 2px solid #e2e8f0;">Color</th>
                <th style="padding: 12px; text-align: right; color: #00337C; font-weight: 500; border-bottom: 2px solid #e2e8f0;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #00337C;">${item.name}</strong>
                    <br>
                    <span style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</span>
                  </td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #475569;">
                    ${item.selectedSize || "-"}
                  </td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #475569;">
                    ${item.selectedColor || "-"}
                  </td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #B76E79; font-weight: 500;">
                    $${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="border-top: 2px solid #e2e8f0; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #475569;">Subtotal:</span>
              <span style="color: #475569;">$${order.totalAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #475569;">Shipping:</span>
              <span style="color: #475569;">$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 500; color: #00337C; padding-top: 8px; border-top: 1px solid #e2e8f0;">
              <span>Total:</span>
              <span>$${order.totalAmount}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Info -->
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
          <h4 style="color: #0369a1; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">Shipping Address</h4>
          <p style="color: #475569; margin: 0; line-height: 1.5;">
            ${order.fullName}<br>
            ${order.address}<br>
            ${order.city}, ${order.postalCode}<br>
            ${order.country}
          </p>
        </div>

        <!-- Next Steps -->
        <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.5;">
          <p style="margin: 0 0 16px 0;">
            <strong>Order Reference:</strong> ${reference}<br>
            You'll receive another email with tracking information once your order ships.
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

const getAdminEmailTemplate = (order, reference) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Merch Order</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #00337C 0%, #1E4B9E 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300;">
          New Merchandise Order
        </h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <div style="background-color: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 25px 0;">
          <p style="color: #166534; margin: 0; text-align: center; font-weight: 500;">
            🎉 New order received and payment confirmed!
          </p>
        </div>

        <h2 style="color: #00337C; margin: 0 0 20px 0; font-size: 20px; font-weight: 400;">
          Order Summary
        </h2>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
          <table width="100%" style="color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Order ID:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${order._id}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Customer:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${order.fullName} (${order.userEmail})
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Items:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${order.items.length} products
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Total Amount:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                $${order.totalAmount}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <strong>Reference:</strong>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                ${reference}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>Order Time:</strong>
              </td>
              <td style="padding: 8px 0;">
                ${new Date().toLocaleString()}
              </td>
            </tr>
          </table>
        </div>

        <!-- Items Breakdown -->
        <h3 style="color: #00337C; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">Order Items</h3>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 0 0 25px 0;">
          <table width="100%" style="border-collapse: collapse;">
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  ${item.quantity}x ${item.name}
                  ${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''}
                  ${item.selectedColor ? ` (Color: ${item.selectedColor})` : ''}
                </td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  $${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <!-- Shipping Address -->
        <h3 style="color: #00337C; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">Shipping Address</h3>
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 16px; margin: 0 0 25px 0;">
          <p style="color: #475569; margin: 0; line-height: 1.5;">
            ${order.fullName}<br>
            ${order.address}<br>
            ${order.city}, ${order.postalCode}<br>
            ${order.country}
          </p>
        </div>

        <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
          This order is ready for processing and shipment.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 20px; text-align: center;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          Build Your Best Self - Admin Dashboard<br>
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

module.exports = { initiateMerchPayment, verifyMerchPayment };