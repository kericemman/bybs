const mongoose = require("mongoose");
const WeeklyReflectionPrompt = require("../models/WeeklyReflectionPrompt");
const ReflectionSubmission = require("../models/ReflectionSubmission");
const cloudinary = require("../config/cloudinary");

const PROMPT_STATUSES = ["draft", "active", "closed", "archived"];
const SUBMISSION_STATUSES = ["pending", "approved", "featured", "rejected", "archived"];
const RELATIONSHIPS = [
  "Current Fellow",
  "Alumni",
  "Volunteer",
  "Mentor",
  "Supporter",
  "Partner",
  "Community Member",
  "Visitor / Friend of BYBS",
];

const clean = (value) => String(value || "").trim();
const toBoolean = (value) => value === true || value === "true" || value === "1" || value === "on";
const toImage = (file) => (file ? { url: file.path, public_id: file.filename } : undefined);

const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Reflection image cleanup error:", error);
  }
};

const safeUrl = (value = "") => {
  const url = clean(value);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch (_error) {
    return "";
  }
};

const promptPayload = (body) => ({
  title: clean(body.title),
  question: clean(body.question),
  description: clean(body.description),
  weekLabel: clean(body.weekLabel),
  reflectionDate: body.reflectionDate || undefined,
  opensAt: body.opensAt || undefined,
  closesAt: body.closesAt || undefined,
  status: PROMPT_STATUSES.includes(body.status) ? body.status : "draft",
});

const validatePrompt = (payload) => {
  if (!payload.title || !payload.question || !payload.weekLabel) {
    return "Title, question, and week label are required.";
  }
  const reflectionDate = new Date(payload.reflectionDate);
  const opensAt = new Date(payload.opensAt);
  const closesAt = new Date(payload.closesAt);
  if ([reflectionDate, opensAt, closesAt].some((date) => Number.isNaN(date.getTime()))) {
    return "Reflection date, opening date, and closing date are required.";
  }
  if (closesAt <= opensAt) return "Closing date must be after the opening date.";
  return "";
};

const publicPrompt = (prompt) => ({
  _id: prompt._id,
  title: prompt.title,
  slug: prompt.slug,
  question: prompt.question,
  description: prompt.description,
  weekLabel: prompt.weekLabel,
  reflectionDate: prompt.reflectionDate,
  opensAt: prompt.opensAt,
  closesAt: prompt.closesAt,
  status: prompt.status,
  featuredImage: prompt.featuredImage,
  updatedAt: prompt.updatedAt,
  createdAt: prompt.createdAt,
  canSubmit:
    prompt.status === "active" &&
    new Date(prompt.opensAt) <= new Date() &&
    new Date(prompt.closesAt) >= new Date(),
});

const publicSubmission = (submission) => {
  const anonymous = submission.anonymousRequested || submission.publishAnonymously;
  return {
    _id: submission._id,
    displayName: anonymous ? "Anonymous community member" : submission.name,
    relationship: anonymous ? "BYBS community" : submission.relationship,
    country: anonymous ? "" : submission.country,
    city: anonymous ? "" : submission.city,
    reflection: submission.displayExcerpt || submission.response,
    profilePhoto: !anonymous && submission.consentToUseImage ? submission.profilePhoto : undefined,
    socialProfile: !anonymous ? submission.socialProfile : "",
    status: submission.status,
    publishedAt: submission.publishedAt || submission.updatedAt,
  };
};

const activatePrompt = async (promptId, session) => {
  await WeeklyReflectionPrompt.updateMany(
    { status: "active" },
    { $set: { status: "closed" } },
    { session }
  );
  await WeeklyReflectionPrompt.updateOne(
    { _id: promptId },
    { $set: { status: "active" } },
    { session }
  );
};

exports.getAdminPrompts = async (_req, res) => {
  try {
    const prompts = await WeeklyReflectionPrompt.find()
      .sort({ reflectionDate: -1, createdAt: -1 })
      .lean();
    const counts = await ReflectionSubmission.aggregate([
      {
        $group: {
          _id: "$prompt",
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
    ]);
    const countMap = new Map(counts.map((item) => [String(item._id), item]));
    res.json(
      prompts.map((prompt) => ({
        ...prompt,
        submissionCounts: countMap.get(String(prompt._id)) || { total: 0, pending: 0 },
      }))
    );
  } catch (error) {
    console.error("Admin reflection prompts fetch error:", error);
    res.status(500).json({ message: "Unable to fetch reflection prompts." });
  }
};

exports.createPrompt = async (req, res) => {
  let session;
  let prompt;
  let promptCreated = false;
  try {
    const payload = promptPayload(req.body);
    const validationError = validatePrompt(payload);
    if (validationError) {
      await destroyImage(req.file?.filename);
      return res.status(400).json({ message: validationError });
    }

    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      [prompt] = await WeeklyReflectionPrompt.create(
        [
          {
            ...payload,
            featuredImage: toImage(req.file),
            createdBy: req.admin._id,
          },
        ],
        { session }
      );

      if (prompt.status === "active") {
        await activatePrompt(prompt._id, session);
      }
    });

    promptCreated = true;
    res.status(201).json(prompt);
  } catch (error) {
    console.error("Create reflection prompt error:", {
      requestId: req.requestId,
      name: error?.name,
      code: error?.code,
      message: error?.message,
    });
    if (!promptCreated) await destroyImage(req.file?.filename);
    if (error?.code === 11000)
      return res.status(409).json({ message: "A prompt with this title and date already exists." });
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to create the reflection prompt." });
  } finally {
    await session?.endSession();
  }
};

exports.updatePrompt = async (req, res) => {
  let session;
  let prompt;
  let promptSaved = false;
  let previousImageId = "";
  try {
    const payload = promptPayload(req.body);
    const validationError = validatePrompt(payload);
    if (validationError) {
      await destroyImage(req.file?.filename);
      return res.status(400).json({ message: validationError });
    }

    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      prompt = await WeeklyReflectionPrompt.findById(req.params.id).session(session);
      if (!prompt) {
        const notFoundError = new Error("Reflection prompt not found.");
        notFoundError.statusCode = 404;
        throw notFoundError;
      }

      previousImageId = req.file ? prompt.featuredImage?.public_id : "";
      Object.assign(prompt, payload);
      if (req.file) prompt.featuredImage = toImage(req.file);
      await prompt.save({ session });

      if (prompt.status === "active") {
        await activatePrompt(prompt._id, session);
      }
    });

    promptSaved = true;
    if (previousImageId) await destroyImage(previousImageId);
    res.json(prompt);
  } catch (error) {
    console.error("Update reflection prompt error:", {
      requestId: req.requestId,
      name: error?.name,
      code: error?.code,
      message: error?.message,
    });
    if (!promptSaved) await destroyImage(req.file?.filename);
    if (error?.statusCode === 404) return res.status(404).json({ message: error.message });
    if (error?.code === 11000)
      return res.status(409).json({ message: "A prompt with this title and date already exists." });
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to update the reflection prompt." });
  } finally {
    await session?.endSession();
  }
};

exports.deletePrompt = async (req, res) => {
  try {
    const prompt = await WeeklyReflectionPrompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ message: "Reflection prompt not found." });
    const submissions = await ReflectionSubmission.countDocuments({ prompt: prompt._id });
    if (submissions) {
      return res
        .status(409)
        .json({ message: "Archive this prompt instead. It already has community submissions." });
    }
    await prompt.deleteOne();
    await destroyImage(prompt.featuredImage?.public_id);
    res.json({ message: "Reflection prompt deleted." });
  } catch (error) {
    console.error("Delete reflection prompt error:", error);
    res.status(500).json({ message: "Unable to delete the reflection prompt." });
  }
};

exports.getAdminSubmissions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.prompt && req.query.prompt !== "all") filter.prompt = req.query.prompt;
    if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
    if (req.query.search) {
      const pattern = new RegExp(
        clean(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ name: pattern }, { email: pattern }, { country: pattern }];
    }
    const submissions = await ReflectionSubmission.find(filter)
      .populate("prompt", "title weekLabel slug")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Admin reflection submissions fetch error:", error);
    res.status(500).json({ message: "Unable to fetch reflection submissions." });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const submission = await ReflectionSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Reflection submission not found." });

    if (req.body.status !== undefined) {
      if (!SUBMISSION_STATUSES.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid submission status." });
      }
      submission.status = req.body.status;
    }
    if (req.body.displayExcerpt !== undefined)
      submission.displayExcerpt = clean(req.body.displayExcerpt);
    if (req.body.internalNotes !== undefined)
      submission.internalNotes = clean(req.body.internalNotes);
    if (req.body.publishAnonymously !== undefined) {
      submission.publishAnonymously =
        submission.anonymousRequested || toBoolean(req.body.publishAnonymously);
    }
    if (req.body.scheduledFor !== undefined)
      submission.scheduledFor = req.body.scheduledFor || undefined;

    if (["approved", "featured"].includes(submission.status)) {
      if (!submission.consentToPublish)
        return res.status(400).json({ message: "This person did not consent to publication." });
      submission.publishedAt = submission.publishedAt || new Date();
    }
    submission.reviewedBy = req.admin._id;
    submission.reviewedAt = new Date();
    await submission.save();

    if (submission.status === "featured") {
      await ReflectionSubmission.updateMany(
        {
          _id: mongoose.trusted({ $ne: submission._id }),
          prompt: submission.prompt,
          status: "featured",
        },
        { $set: { status: "approved" } }
      );
    }

    await submission.populate("prompt", "title weekLabel slug");
    res.json(submission);
  } catch (error) {
    console.error("Update reflection submission error:", error);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to update the reflection submission." });
  }
};

exports.getActivePrompt = async (_req, res) => {
  try {
    const prompt = await WeeklyReflectionPrompt.findOne({ status: "active" })
      .sort({ reflectionDate: -1, createdAt: -1 })
      .lean();
    res.json(prompt ? publicPrompt(prompt) : null);
  } catch (error) {
    console.error("Active reflection prompt fetch error:", error);
    res.status(500).json({ message: "Unable to fetch the active reflection." });
  }
};

exports.getPublicPrompts = async (_req, res) => {
  try {
    const prompts = await WeeklyReflectionPrompt.find({
      status: mongoose.trusted({ $in: ["active", "closed"] }),
    })
      .sort({ reflectionDate: -1, createdAt: -1 })
      .lean();
    res.json(prompts.map(publicPrompt));
  } catch (error) {
    console.error("Public reflection prompts fetch error:", error);
    res.status(500).json({ message: "Unable to fetch weekly reflections." });
  }
};

exports.getPublicPrompt = async (req, res) => {
  try {
    const prompt = await WeeklyReflectionPrompt.findOne({
      slug: req.params.slug,
      status: mongoose.trusted({ $in: ["active", "closed"] }),
    }).lean();
    if (!prompt) return res.status(404).json({ message: "Weekly reflection not found." });
    res.json(publicPrompt(prompt));
  } catch (error) {
    console.error("Public reflection prompt detail error:", error);
    res.status(500).json({ message: "Unable to fetch this weekly reflection." });
  }
};

exports.getPublishedSubmissions = async (req, res) => {
  try {
    const prompt = await WeeklyReflectionPrompt.findOne({
      slug: req.params.slug,
      status: mongoose.trusted({ $in: ["active", "closed"] }),
    }).select("_id");
    if (!prompt) return res.status(404).json({ message: "Weekly reflection not found." });
    const now = new Date();
    const submissions = await ReflectionSubmission.find({
      prompt: prompt._id,
      status: mongoose.trusted({ $in: ["approved", "featured"] }),
      consentToPublish: true,
      $or: [
        { scheduledFor: mongoose.trusted({ $exists: false }) },
        { scheduledFor: null },
        { scheduledFor: mongoose.trusted({ $lte: now }) },
      ],
    }).sort({ status: -1, publishedAt: -1, createdAt: -1 });
    res.json(submissions.map(publicSubmission));
  } catch (error) {
    console.error("Published reflection submissions fetch error:", error);
    res.status(500).json({ message: "Unable to fetch featured reflections." });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    const prompt = await WeeklyReflectionPrompt.findOne({ slug: req.params.slug });
    if (!prompt) {
      await destroyImage(req.file?.filename);
      return res.status(404).json({ message: "Weekly reflection not found." });
    }

    const now = new Date();
    if (prompt.status !== "active" || now < prompt.opensAt || now > prompt.closesAt) {
      await destroyImage(req.file?.filename);
      return res.status(409).json({ message: "Submissions are not open for this reflection." });
    }

    const socialProfile = safeUrl(req.body.socialProfile);
    if (req.body.socialProfile && !socialProfile) {
      await destroyImage(req.file?.filename);
      return res
        .status(400)
        .json({ message: "Please provide a valid http(s) social profile link." });
    }

    const consentToPublish = toBoolean(req.body.consentToPublish);
    const consentToUseImage = toBoolean(req.body.consentToUseImage);
    const relationship = clean(req.body.relationship);
    const response = clean(req.body.response);
    const email = clean(req.body.email).toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (
      !clean(req.body.name) ||
      !validEmail ||
      !clean(req.body.country) ||
      !RELATIONSHIPS.includes(relationship) ||
      response.length < 40
    ) {
      await destroyImage(req.file?.filename);
      return res.status(400).json({
        message:
          "Please complete all required fields. Your reflection should be at least 40 characters.",
      });
    }
    if (!consentToPublish) {
      await destroyImage(req.file?.filename);
      return res
        .status(400)
        .json({ message: "Consent to review and publish the reflection is required." });
    }
    if (req.file && !consentToUseImage) {
      await destroyImage(req.file.filename);
      return res
        .status(400)
        .json({ message: "Please consent to image use or remove the profile photo." });
    }

    const anonymousRequested = toBoolean(req.body.publishAnonymously);
    await ReflectionSubmission.create({
      prompt: prompt._id,
      promptSlug: prompt.slug,
      name: clean(req.body.name),
      email,
      country: clean(req.body.country),
      city: clean(req.body.city),
      relationship,
      response,
      profilePhoto: toImage(req.file),
      socialProfile,
      anonymousRequested,
      publishAnonymously: anonymousRequested,
      consentToPublish,
      consentToUseImage,
      status: "pending",
    });

    res.status(201).json({ message: "Thank you. Your reflection has been received for review." });
  } catch (error) {
    console.error("Create reflection submission error:", error);
    await destroyImage(req.file?.filename);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to submit your reflection right now." });
  }
};
