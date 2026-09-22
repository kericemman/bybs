const ImpactMetric = require("../models/ImpactMetric");

const CATEGORIES = ["general", "fellowship", "community", "volunteer", "mentor", "partner"];
const clean = (value) => String(value || "").trim();

const buildPayload = (body) => {
  const value = clean(body.value) === "" ? undefined : Number(body.value);
  const displayOrder = Number(body.displayOrder);
  return {
    label: clean(body.label),
    value: Number.isFinite(value) ? value : undefined,
    suffix: clean(body.suffix),
    description: clean(body.description),
    category: CATEGORIES.includes(body.category) ? body.category : "general",
    displayOrder: Number.isFinite(displayOrder) && displayOrder >= 0 ? displayOrder : 0,
    status: body.status === "published" ? "published" : "draft",
    verificationNote: clean(body.verificationNote),
    verifiedAt: body.verifiedAt || undefined,
  };
};

const validate = (payload) => {
  if (!payload.label || payload.value === undefined || payload.value < 0) {
    return "A label and non-negative verified value are required.";
  }
  if (payload.status === "published") {
    if (!payload.verificationNote)
      return "Add an internal verification note before publishing this metric.";
    const date = new Date(payload.verifiedAt);
    if (Number.isNaN(date.getTime()))
      return "Add the date this metric was verified before publishing.";
  }
  return "";
};

exports.getPublicImpactMetrics = async (_req, res) => {
  try {
    const metrics = await ImpactMetric.find({ status: "published" })
      .select("label value suffix description category displayOrder verifiedAt updatedAt")
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json(metrics);
  } catch (error) {
    console.error("Public impact metrics fetch error:", error);
    res.status(500).json({ message: "Unable to fetch impact statistics." });
  }
};

exports.getAdminImpactMetrics = async (_req, res) => {
  try {
    const metrics = await ImpactMetric.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(metrics);
  } catch (error) {
    console.error("Admin impact metrics fetch error:", error);
    res.status(500).json({ message: "Unable to fetch impact statistics." });
  }
};

exports.createImpactMetric = async (req, res) => {
  try {
    const payload = buildPayload(req.body);
    const validationError = validate(payload);
    if (validationError) return res.status(400).json({ message: validationError });
    const metric = await ImpactMetric.create({
      ...payload,
      createdBy: req.admin._id,
      updatedBy: req.admin._id,
    });
    res.status(201).json(metric);
  } catch (error) {
    console.error("Create impact metric error:", error);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to create this impact statistic." });
  }
};

exports.updateImpactMetric = async (req, res) => {
  try {
    const metric = await ImpactMetric.findById(req.params.id);
    if (!metric) return res.status(404).json({ message: "Impact statistic not found." });
    const payload = buildPayload(req.body);
    const validationError = validate(payload);
    if (validationError) return res.status(400).json({ message: validationError });
    Object.assign(metric, payload, { updatedBy: req.admin._id });
    await metric.save();
    res.json(metric);
  } catch (error) {
    console.error("Update impact metric error:", error);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to update this impact statistic." });
  }
};

exports.deleteImpactMetric = async (req, res) => {
  try {
    const metric = await ImpactMetric.findById(req.params.id);
    if (!metric) return res.status(404).json({ message: "Impact statistic not found." });
    await metric.deleteOne();
    res.json({ message: "Impact statistic deleted." });
  } catch (error) {
    console.error("Delete impact metric error:", error);
    res.status(500).json({ message: "Unable to delete this impact statistic." });
  }
};
