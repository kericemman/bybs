const Cohort = require("../models/Cohort");
const cloudinary = require("../config/cloudinary");

const arrayFields = [
  "features",
  "facilitators",
  "eligibility",
  "curriculum",
  "outcomes",
  "whoIsItFor",
  "whoCanApply",
  "commitment",
  "successStories",
  "previousCohorts",
  "achievements",
  "impactHighlights",
];

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (_error) {
    return String(value)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const buildCohortPayload = (body) => {
  const payload = { ...body };

  arrayFields.forEach((field) => {
    payload[field] = parseArrayField(body[field]);
  });

  ["capacity", "price"].forEach((field) => {
    if (payload[field] === "" || payload[field] === undefined) {
      delete payload[field];
    } else {
      payload[field] = Number(payload[field]);
    }
  });

  ["startDate", "endDate", "applicationDeadline"].forEach((field) => {
    if (!payload[field]) delete payload[field];
  });

  if (payload.isPublished !== undefined) {
    payload.isPublished = payload.isPublished === true || payload.isPublished === "true";
  }

  return payload;
};

const getUploadedFiles = (req, fieldName) => {
  if (Array.isArray(req.files)) return req.files;
  return req.files?.[fieldName] || [];
};

const buildGalleryImages = (files) =>
  files.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));

const destroyImage = async (publicId) => {
  if (publicId) await cloudinary.uploader.destroy(publicId);
};

exports.createCohort = async (req, res) => {
  try {
    const payload = buildCohortPayload(req.body);
    const coverImage = getUploadedFiles(req, "coverImage")[0];
    const galleryFiles = [
      ...getUploadedFiles(req, "gallery"),
      ...getUploadedFiles(req, "graduateGallery"),
    ];

    if (!payload.title) {
      return res.status(400).json({ message: "Cohort title is required." });
    }

    const cohort = await Cohort.create({
      ...payload,
      status: payload.status || "upcoming",
      coverImage: coverImage
        ? { url: coverImage.path, public_id: coverImage.filename }
        : undefined,
      gallery: buildGalleryImages(galleryFiles),
      createdBy: req.admin._id,
    });

    res.status(201).json(cohort);
  } catch (error) {
    console.error("Create cohort error:", error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A cohort with this title already exists." });
    }
    res.status(500).json({ message: "Unable to create cohort." });
  }
};

exports.getCohorts = async (req, res) => {
  try {
    const cohorts = await Cohort.find().sort({ createdAt: -1 });
    res.json(cohorts);
  } catch (error) {
    console.error("Get cohorts error:", error);
    res.status(500).json({ message: "Unable to fetch cohorts." });
  }
};

exports.updateCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) return res.status(404).json({ message: "Not found" });

    const payload = buildCohortPayload(req.body);
    const coverImage = getUploadedFiles(req, "coverImage")[0];
    const galleryFiles = [
      ...getUploadedFiles(req, "gallery"),
      ...getUploadedFiles(req, "graduateGallery"),
    ];

    if (coverImage) {
      await destroyImage(cohort.coverImage?.public_id);
      cohort.coverImage = {
        url: coverImage.path,
        public_id: coverImage.filename,
      };
    }

    if (galleryFiles.length) {
      cohort.gallery.push(...buildGalleryImages(galleryFiles));
    }

    Object.assign(cohort, payload);
    await cohort.save();

    res.json(cohort);
  } catch (error) {
    console.error("Update cohort error:", error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A cohort with this title already exists." });
    }
    res.status(500).json({ message: "Unable to update cohort." });
  }
};

exports.deleteCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) return res.status(404).json({ message: "Not found" });

    await destroyImage(cohort.coverImage?.public_id);

    for (const img of cohort.gallery) {
      await destroyImage(img.public_id);
    }

    await cohort.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete cohort error:", error);
    res.status(500).json({ message: "Unable to delete cohort." });
  }
};

exports.deleteCohortGalleryImage = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) return res.status(404).json({ message: "Not found" });

    const image = cohort.gallery.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await destroyImage(image.public_id);
    image.deleteOne();
    await cohort.save();

    res.json(cohort);
  } catch (error) {
    console.error("Delete cohort gallery image error:", error);
    res.status(500).json({ message: "Unable to delete gallery image." });
  }
};
