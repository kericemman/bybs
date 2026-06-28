const Subscriber = require("../models/Subscriber");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


// =======================
// PUBLIC SUBSCRIBE
// =======================
exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
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
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 });

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

    const subscribers = await Subscriber.find({ isActive: true });

    const emails = subscribers.map(s => s.email);

    await resend.emails.send({
      from: "BYBS Updates <no-reply@updates.buildyourbestself.org>",
      to: emails,
      subject,
      html: `
        <div style="font-family:sans-serif;">
          ${message}
          <br/>
          <p style="font-size:12px;">
            If you wish to unsubscribe, reply to this email.
          </p>
        </div>
      `
    });

    res.json({ message: "Campaign sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Campaign failed" });
  }
};
