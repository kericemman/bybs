const Cohort = require("../models/Cohort");
const cloudinary = require("../config/cloudinary");

exports.createCohort = async (req, res) => {
  const { title, description, startDate, endDate, status } = req.body;

  const gallery = req.files?.map(file => ({
    url: file.path,
    public_id: file.filename,
  })) || [];

  const cohort = await Cohort.create({
    title,
    description,
    startDate,
    endDate,
    status,
    gallery,
    createdBy: req.admin._id,
  });

  res.status(201).json(cohort);
};

exports.getCohorts = async (req, res) => {
  const cohorts = await Cohort.find().sort({ createdAt: -1 });
  res.json(cohorts);
};

exports.updateCohort = async (req, res) => {
  const cohort = await Cohort.findById(req.params.id);
  if (!cohort) return res.status(404).json({ message: "Not found" });

  if (req.files?.length) {
    const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    cohort.gallery.push(...newImages);
  }

  Object.assign(cohort, req.body);
  await cohort.save();

  res.json(cohort);
};

exports.deleteCohort = async (req, res) => {
  const cohort = await Cohort.findById(req.params.id);
  if (!cohort) return res.status(404).json({ message: "Not found" });

  for (const img of cohort.gallery) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await cohort.deleteOne();
  res.json({ message: "Deleted" });
};
