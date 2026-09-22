const Subscriber = require("../models/Subscriber");
const { Resend } = require("resend");
const { cleanText, isValidEmail, normalizeEmail } = require("../utils/inputValidation");
const sanitizeEmailContent = require("../utils/sanitizeEmailContent");

const resend = new Resend(process.env.RESEND_API_KEY);
const BATCH_SIZE = 100;

const chunk = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

// =======================
// PUBLIC SUBSCRIBE
// =======================
exports.subscribe = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const name = cleanText(req.body?.name, 120);

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(200).json({ message: "Subscribed successfully" });
    }

    await Subscriber.create({ email, name });

    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Subscription failed" });
  }
};

// =======================
// ADMIN GET SUBSCRIBERS
// =======================
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscribers" });
  }
};

// =======================
// ADMIN SEND EMAIL
// =======================
exports.sendCampaign = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const cleanSubject = cleanText(subject, 180);
    const cleanMessage = sanitizeEmailContent(message);

    if (!cleanSubject || !cleanMessage) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const subscribers = await Subscriber.find({ isActive: true });

    if (!subscribers.length) {
      return res.status(400).json({ message: "There are no active subscribers." });
    }

    const html = `
        <div style="font-family:sans-serif;">
          ${cleanMessage}
          <br/>
          <p style="font-size:12px;">
            If you wish to unsubscribe, reply to this email.
          </p>
        </div>
      `;

    const messages = subscribers.map((subscriber) => ({
      from: process.env.FROM_EMAIL,
      to: [subscriber.email],
      subject: cleanSubject,
      html,
    }));

    for (const messageBatch of chunk(messages, BATCH_SIZE)) {
      const { error } =
        messageBatch.length === 1
          ? await resend.emails.send(messageBatch[0])
          : await resend.batch.send(messageBatch, { batchValidation: "permissive" });
      if (error) throw error;
    }

    res.json({ message: `Campaign sent to ${subscribers.length} subscribers.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Campaign failed" });
  }
};
