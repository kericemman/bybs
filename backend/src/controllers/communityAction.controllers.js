const CommunityAction = require("../models/CommunityAction");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const toBoolean = (value) => value === true || value === "true";
const CONTENT_TYPES = [
  "outreach",
  "fellowship",
  "transformation",
  "volunteer",
  "partnership",
  "programme",
];
const toArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const safeCtaUrl = (value = "") => {
  const url = String(value).trim();
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch (_error) {
    return "";
  }
};

const buildPayload = (body) => {
  const participantCount =
    body.participantCount === "" || body.participantCount === undefined
      ? undefined
      : Number(body.participantCount);
  const beneficiaryCount =
    body.beneficiaryCount === "" || body.beneficiaryCount === undefined
      ? undefined
      : Number(body.beneficiaryCount);

  return {
    title: String(body.title || "").trim(),
    summary: String(body.summary || "").trim(),
    contentType: CONTENT_TYPES.includes(body.contentType) ? body.contentType : "outreach",
    story: String(body.story || "").trim(),
    whatHappened: String(body.whatHappened || "").trim(),
    whyItMattered: String(body.whyItMattered || "").trim(),
    actionDate: body.actionDate || undefined,
    location: String(body.location || "").trim(),
    participantCount:
      Number.isFinite(participantCount) && participantCount >= 0 ? participantCount : undefined,
    participantsDescription: String(body.participantsDescription || "").trim(),
    beneficiaryCount:
      Number.isFinite(beneficiaryCount) && beneficiaryCount >= 0 ? beneficiaryCount : undefined,
    beneficiaries: String(body.beneficiaries || "").trim(),
    partners: toArray(body.partners),
    resourcesContributed: toArray(body.resourcesContributed),
    outcomes: toArray(body.outcomes),
    relatedProgramme: String(body.relatedProgramme || "").trim(),
    quote: {
      text: String(body.quoteText || "").trim(),
      attribution: String(body.quoteAttribution || "").trim(),
    },
    ctaLabel: String(body.ctaLabel || "Learn more").trim(),
    ctaUrl: safeCtaUrl(body.ctaUrl),
    status: body.status === "published" ? "published" : "draft",
    isFeatured: toBoolean(body.isFeatured),
    seoTitle: String(body.seoTitle || "").trim(),
    metaDescription: String(body.metaDescription || "").trim(),
  };
};

const uploadedFiles = (req, field) => req.files?.[field] || [];

const toImage = (file) => ({
  url: file.path,
  public_id: file.filename,
});

const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Community action image cleanup error:", error);
  }
};

const destroyUploadedFiles = async (req) => {
  const files = Object.values(req.files || {}).flat();
  await Promise.all(files.map((file) => destroyImage(file.filename)));
};

const validateForPublication = (payload, coverImage) => {
  if (!payload.title || !payload.summary) return "Title and summary are required.";
  if (payload.status === "published" && !coverImage) {
    return "A cover image is required before publishing.";
  }
  if (payload.status === "published" && !payload.actionDate) {
    return "Add the story date before publishing.";
  }
  if (payload.status === "published" && !payload.story && !payload.whatHappened) {
    return "Add the full story or what happened before publishing.";
  }
  if (payload.isFeatured && payload.status !== "published") {
    return "Only published community actions can be featured.";
  }
  return "";
};

const unfeatureOtherActions = (actionId) =>
  CommunityAction.updateMany(
    { _id: mongoose.trusted({ $ne: actionId }), isFeatured: true },
    { $set: { isFeatured: false } }
  );

exports.getAdminCommunityActions = async (_req, res) => {
  try {
    const actions = await CommunityAction.find().sort({ actionDate: -1, createdAt: -1 });
    res.json(actions);
  } catch (error) {
    console.error("Admin community actions fetch error:", error);
    res.status(500).json({ message: "Unable to fetch community actions." });
  }
};

exports.createCommunityAction = async (req, res) => {
  let actionCreated = false;
  try {
    if (req.body.ctaUrl && !safeCtaUrl(req.body.ctaUrl)) {
      await destroyUploadedFiles(req);
      return res
        .status(400)
        .json({ message: "Button destination must be a site path or a valid http(s) URL." });
    }
    const payload = buildPayload(req.body);
    const coverFile = uploadedFiles(req, "coverImage")[0];
    const validationError = validateForPublication(payload, coverFile);
    if (validationError) {
      await destroyUploadedFiles(req);
      return res.status(400).json({ message: validationError });
    }

    const action = await CommunityAction.create({
      ...payload,
      coverImage: coverFile ? toImage(coverFile) : undefined,
      gallery: uploadedFiles(req, "gallery").map(toImage),
      createdBy: req.admin._id,
    });
    actionCreated = true;

    if (action.isFeatured) await unfeatureOtherActions(action._id);
    res.status(201).json(action);
  } catch (error) {
    console.error("Create community action error:", error);
    if (!actionCreated) await destroyUploadedFiles(req);
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "A community action with this title already exists." });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Unable to create community action." });
  }
};

exports.updateCommunityAction = async (req, res) => {
  let actionSaved = false;
  try {
    const action = await CommunityAction.findById(req.params.id);
    if (!action) return res.status(404).json({ message: "Community action not found." });

    if (req.body.ctaUrl && !safeCtaUrl(req.body.ctaUrl)) {
      await destroyUploadedFiles(req);
      return res
        .status(400)
        .json({ message: "Button destination must be a site path or a valid http(s) URL." });
    }

    const payload = buildPayload(req.body);
    const coverFile = uploadedFiles(req, "coverImage")[0];
    const validationError = validateForPublication(payload, coverFile || action.coverImage?.url);
    if (validationError) {
      await destroyUploadedFiles(req);
      return res.status(400).json({ message: validationError });
    }

    const previousCoverId = coverFile ? action.coverImage?.public_id : "";
    Object.assign(action, payload);
    if (coverFile) action.coverImage = toImage(coverFile);

    const galleryFiles = uploadedFiles(req, "gallery");
    if (galleryFiles.length) action.gallery.push(...galleryFiles.map(toImage));

    await action.save();
    actionSaved = true;
    if (previousCoverId) await destroyImage(previousCoverId);
    if (action.isFeatured) await unfeatureOtherActions(action._id);

    res.json(action);
  } catch (error) {
    console.error("Update community action error:", error);
    if (!actionSaved) await destroyUploadedFiles(req);
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "A community action with this title already exists." });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Unable to update community action." });
  }
};

exports.deleteCommunityActionGalleryImage = async (req, res) => {
  try {
    const action = await CommunityAction.findById(req.params.id);
    if (!action) return res.status(404).json({ message: "Community action not found." });

    const image = action.gallery.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found." });

    const publicId = image.public_id;
    image.deleteOne();
    await action.save();
    await destroyImage(publicId);
    res.json(action);
  } catch (error) {
    console.error("Delete community action gallery image error:", error);
    res.status(500).json({ message: "Unable to delete gallery image." });
  }
};

exports.deleteCommunityAction = async (req, res) => {
  try {
    const action = await CommunityAction.findById(req.params.id);
    if (!action) return res.status(404).json({ message: "Community action not found." });

    const imageIds = [
      action.coverImage?.public_id,
      ...action.gallery.map((image) => image.public_id),
    ].filter(Boolean);
    await action.deleteOne();
    await Promise.all(imageIds.map(destroyImage));
    res.json({ message: "Community action deleted." });
  } catch (error) {
    console.error("Delete community action error:", error);
    res.status(500).json({ message: "Unable to delete community action." });
  }
};

exports.getPublishedCommunityActions = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
    const filter = { status: "published" };
    if (CONTENT_TYPES.includes(req.query.type)) filter.contentType = req.query.type;
    const actions = await CommunityAction.find(filter)
      .sort({ isFeatured: -1, actionDate: -1, createdAt: -1 })
      .limit(limit);
    res.json(actions);
  } catch (error) {
    console.error("Public community actions fetch error:", error);
    res.status(500).json({ message: "Unable to fetch community actions." });
  }
};

exports.getPublishedCommunityAction = async (req, res) => {
  try {
    const action = await CommunityAction.findOne({ slug: req.params.slug, status: "published" });
    if (!action) return res.status(404).json({ message: "Impact story not found." });
    res.json(action);
  } catch (error) {
    console.error("Public impact story fetch error:", error);
    res.status(500).json({ message: "Unable to fetch this impact story." });
  }
};

exports.getFeaturedCommunityAction = async (_req, res) => {
  try {
    const action = await CommunityAction.findOne({ status: "published", isFeatured: true }).sort({
      actionDate: -1,
      createdAt: -1,
    });
    res.json(action || null);
  } catch (error) {
    console.error("Featured community action fetch error:", error);
    res.status(500).json({ message: "Unable to fetch the featured community action." });
  }
};
