

const Waitlist = require("../models/Waitlist");

exports.joinWaitlist = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existing = await Waitlist.findOne({ email });

    if (existing) {
      return res.status(200).json({
        message: "You're already on the waitlist",
      });
    }

    const entry = await Waitlist.create({
      name,
      email,
    });

    res.status(201).json({
      message: "Successfully joined the waitlist",
      entry,
    });

  } catch (error) {
    console.error("Waitlist error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};