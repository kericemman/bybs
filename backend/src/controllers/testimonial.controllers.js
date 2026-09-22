const Testimonial = require("../models/Testimonial");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const CATEGORIES = [
  "mentee",
  "mentor",
  "partner",
  "volunteer",
  "fellowship-graduate",
  "programme-participant",
  "community-member",
  "supporter",
];
const STATUSES = ["pending", "approved", "featured", "rejected", "archived"];
const MIN_WORDS = 25;
const MAX_WORDS = 150;

const clean = (value) => String(value || "").trim();
const toBoolean = (value) => value === true || value === "true" || value === "1" || value === "on";
const countWords = (value) => clean(value).split(/\s+/).filter(Boolean).length;
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const toImage = (file) => (file ? { url: file.path, public_id: file.filename } : undefined);

const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Testimonial image cleanup error:", error);
  }
};

const publicTestimonial = (testimonial) => ({
  _id: testimonial._id,
  name: testimonial.name,
  category: testimonial.category,
  roleTitle: testimonial.roleTitle,
  testimonial: testimonial.testimonial,
  profilePhoto: testimonial.profilePhoto,
  publishedAt: testimonial.publishedAt || testimonial.updatedAt,
  featured: testimonial.status === "featured",
});

exports.getPublicTestimonials = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 24) : 12;
    const testimonials = await Testimonial.find({
      status: mongoose.trusted({ $in: ["approved", "featured"] }),
      consentToPublish: true,
    })
      .sort({ status: -1, publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(testimonials.map(publicTestimonial));
  } catch (error) {
    console.error("Public testimonials fetch error:", error);
    res.status(500).json({ message: "Unable to load testimonials." });
  }
};

exports.createTestimonial = async (req, res) => {
  let created = false;
  try {
    const name = clean(req.body.name);
    const email = clean(req.body.email).toLowerCase();
    const category = clean(req.body.category).toLowerCase();
    const roleTitle = clean(req.body.roleTitle);
    const testimonial = clean(req.body.testimonial);
    const wordCount = countWords(testimonial);
    const consentToPublish = toBoolean(req.body.consentToPublish);

    if (!name || !isEmail(email) || !CATEGORIES.includes(category)) {
      await destroyImage(req.file?.filename);
      return res.status(400).json({
        message: "Please provide your name, a valid email, and your relationship with BYBS.",
      });
    }
    if (wordCount < MIN_WORDS || wordCount > MAX_WORDS) {
      await destroyImage(req.file?.filename);
      return res
        .status(400)
        .json({ message: `Your testimonial must be between ${MIN_WORDS} and ${MAX_WORDS} words.` });
    }
    if (!consentToPublish) {
      await destroyImage(req.file?.filename);
      return res
        .status(400)
        .json({ message: "Permission to feature your testimonial is required." });
    }

    await Testimonial.create({
      name,
      email,
      category,
      roleTitle,
      testimonial,
      wordCount,
      profilePhoto: toImage(req.file),
      consentToPublish,
      status: "pending",
    });
    created = true;
    res.status(201).json({ message: "Thank you for sharing your BYBS experience." });
  } catch (error) {
    console.error("Create testimonial error:", error);
    if (!created) await destroyImage(req.file?.filename);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Your testimonial could not be submitted right now." });
  }
};

exports.getAdminTestimonials = async (req, res) => {
  try {
    const filter = {};
    if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    if (req.query.search) {
      const pattern = new RegExp(escapeRegex(clean(req.query.search)), "i");
      filter.$or = [
        { name: pattern },
        { email: pattern },
        { roleTitle: pattern },
        { testimonial: pattern },
      ];
    }
    const testimonials = await Testimonial.find(filter)
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Admin testimonials fetch error:", error);
    res.status(500).json({ message: "Unable to load testimonial submissions." });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });

    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status))
        return res.status(400).json({ message: "Invalid testimonial status." });
      testimonial.status = req.body.status;
    }
    if (req.body.category !== undefined) {
      if (!CATEGORIES.includes(req.body.category))
        return res.status(400).json({ message: "Invalid testimonial category." });
      testimonial.category = req.body.category;
    }
    if (req.body.name !== undefined) testimonial.name = clean(req.body.name);
    if (req.body.roleTitle !== undefined) testimonial.roleTitle = clean(req.body.roleTitle);
    if (req.body.testimonial !== undefined) {
      const content = clean(req.body.testimonial);
      const wordCount = countWords(content);
      if (wordCount < MIN_WORDS || wordCount > MAX_WORDS) {
        return res.status(400).json({
          message: `The testimonial must be between ${MIN_WORDS} and ${MAX_WORDS} words.`,
        });
      }
      testimonial.testimonial = content;
      testimonial.wordCount = wordCount;
    }
    if (req.body.internalNotes !== undefined)
      testimonial.internalNotes = clean(req.body.internalNotes);

    if (["approved", "featured"].includes(testimonial.status)) {
      if (!testimonial.consentToPublish)
        return res.status(400).json({ message: "Publication permission was not provided." });
      testimonial.publishedAt = testimonial.publishedAt || new Date();
    }
    testimonial.reviewedBy = req.admin._id;
    testimonial.reviewedAt = new Date();
    await testimonial.save();

    if (testimonial.status === "featured") {
      await Testimonial.updateMany(
        { _id: mongoose.trusted({ $ne: testimonial._id }), status: "featured" },
        { $set: { status: "approved" } }
      );
    }

    await testimonial.populate("reviewedBy", "name email");
    res.json(testimonial);
  } catch (error) {
    console.error("Update testimonial error:", error);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to update this testimonial." });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });
    const imageId = testimonial.profilePhoto?.public_id;
    await testimonial.deleteOne();
    await destroyImage(imageId);
    res.json({ message: "Testimonial deleted." });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({ message: "Unable to delete this testimonial." });
  }
};
