const ParticipationApplication = require("../models/ParticipationApplication");
const resend = require("../utils/resendClient");

const TYPES = ["volunteer", "mentor", "partner", "support"];
const STATUSES = ["new", "reviewing", "contacted", "accepted", "active", "inactive", "declined"];
const VOLUNTEER_TYPES = ["one-time", "project-based", "ongoing"];
const FROM_EMAIL = process.env.FROM_EMAIL || "BYBS <no-reply@updates.buildyourbestself.org>";

const clean = (value) => String(value || "").trim();
const toBoolean = (value) => value === true || value === "true" || value === "1" || value === "on";
const toArray = (value) => {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(items.map(clean).filter(Boolean))];
};
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeHtml = (value) =>
  clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const safeUrl = (value) => {
  const url = clean(value);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch (_error) {
    return "";
  }
};

const commonPayload = (body, type) => ({
  type,
  name: clean(body.name),
  email: clean(body.email).toLowerCase(),
  phone: clean(body.phone),
  country: clean(body.country),
  city: clean(body.city),
  consent: toBoolean(body.consent),
  source: "website",
});

const buildPayload = (body) => {
  const type = clean(body.type).toLowerCase();
  const payload = commonPayload(body, type);

  if (type === "volunteer") {
    Object.assign(payload, {
      skills: toArray(body.skills),
      interestAreas: toArray(body.interestAreas),
      availability: clean(body.availability),
      experience: clean(body.experience),
      motivation: clean(body.motivation),
      profileUrl: safeUrl(body.profileUrl),
      volunteerType: clean(body.volunteerType),
    });
  }

  if (type === "mentor") {
    Object.assign(payload, {
      professionalBackground: clean(body.professionalBackground),
      expertise: toArray(body.expertise),
      yearsExperience: Number(body.yearsExperience),
      availability: clean(body.availability),
      mentorshipInterests: toArray(body.mentorshipInterests),
      profileUrl: safeUrl(body.profileUrl),
      motivation: clean(body.motivation),
    });
  }

  if (type === "partner") {
    Object.assign(payload, {
      organizationName: clean(body.organizationName),
      organizationType: clean(body.organizationType),
      roleTitle: clean(body.roleTitle),
      partnershipAreas: toArray(body.partnershipAreas),
      organizationWebsite: safeUrl(body.organizationWebsite),
      proposal: clean(body.proposal),
    });
  }

  if (type === "support") {
    Object.assign(payload, {
      organizationName: clean(body.organizationName),
      roleTitle: clean(body.roleTitle),
      supportArea: clean(body.supportArea),
      contributionDetails: clean(body.contributionDetails),
    });
  }

  return payload;
};

const validatePayload = (payload, body) => {
  if (!TYPES.includes(payload.type)) return "Please select a valid participation pathway.";
  if (!payload.name || !isEmail(payload.email) || !payload.phone || !payload.country) {
    return "Name, email, phone, and country are required.";
  }
  if (!payload.consent) return "Consent is required before you submit.";
  if (body.profileUrl && !payload.profileUrl)
    return "Please provide a valid http(s) LinkedIn or portfolio link.";
  if (body.organizationWebsite && !payload.organizationWebsite)
    return "Please provide a valid http(s) organization website.";

  if (payload.type === "volunteer") {
    if (
      !payload.skills.length ||
      !payload.interestAreas.length ||
      !payload.availability ||
      !payload.experience ||
      payload.motivation.length < 30
    ) {
      return "Please complete your skills, area of interest, availability, experience, and motivation.";
    }
    if (!VOLUNTEER_TYPES.includes(payload.volunteerType))
      return "Please select a preferred volunteer type.";
  }

  if (payload.type === "mentor") {
    if (
      !payload.professionalBackground ||
      !payload.expertise.length ||
      clean(body.yearsExperience) === "" ||
      !Number.isFinite(payload.yearsExperience) ||
      !payload.availability ||
      !payload.mentorshipInterests.length ||
      payload.motivation.length < 30
    ) {
      return "Please complete your professional background, expertise, experience, availability, mentorship interests, and motivation.";
    }
  }

  if (payload.type === "partner") {
    if (
      !payload.organizationName ||
      !payload.organizationType ||
      !payload.roleTitle ||
      !payload.partnershipAreas.length ||
      payload.proposal.length < 30
    ) {
      return "Please complete the organization details, partnership areas, and proposed collaboration.";
    }
  }

  if (payload.type === "support") {
    if (!payload.supportArea || payload.contributionDetails.length < 20) {
      return "Please select a support area and tell us how you would like to help.";
    }
  }

  return "";
};

const sendAcknowledgements = async (application) => {
  if (!process.env.RESEND_API_KEY) return;
  const label = application.type.charAt(0).toUpperCase() + application.type.slice(1);
  const name = escapeHtml(application.name);
  const adminEmail = process.env.ADMIN_EMAIL;
  const confirmation = resend.emails.send({
    from: FROM_EMAIL,
    to: [application.email],
    subject: `We received your BYBS ${application.type} enquiry`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; padding: 28px; color: #1f2937;">
        <h1 style="color: #00337C; font-size: 24px;">Thank you, ${name}</h1>
        <p style="line-height: 1.7;">
          Your ${escapeHtml(label.toLowerCase())} submission has been received. The BYBS team will
          review it and contact you using the details you provided if there is a suitable next step.
        </p>
        <p style="line-height: 1.7;">Warmly,<br><strong>BYBS Team</strong></p>
      </div>
    `,
  });
  const notification = adminEmail
    ? resend.emails.send({
        from: FROM_EMAIL,
        to: [adminEmail],
        subject: `New BYBS ${application.type} submission`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; padding: 28px; color: #1f2937;">
            <h1 style="color: #00337C; font-size: 24px;">
              New ${escapeHtml(label)} submission
            </h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
            <p>
              Open the Participation area in the BYBS admin dashboard to review the full submission.
            </p>
          </div>
        `,
      })
    : Promise.resolve();

  const results = await Promise.allSettled([confirmation, notification]);
  results
    .filter((result) => result.status === "rejected")
    .forEach((result) => {
      console.error("Participation email error:", result.reason?.message || result.reason);
    });
};

exports.createParticipationApplication = async (req, res) => {
  try {
    const payload = buildPayload(req.body);
    const validationError = validatePayload(payload, req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const application = await ParticipationApplication.create(payload);
    sendAcknowledgements(application).catch((error) =>
      console.error("Participation email error:", error)
    );
    res.status(201).json({ message: "Thank you. Your submission has been received for review." });
  } catch (error) {
    console.error("Create participation application error:", error);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Your submission could not be completed right now." });
  }
};

exports.getParticipationApplications = async (req, res) => {
  try {
    const filter = {};
    if (TYPES.includes(req.query.type)) filter.type = req.query.type;
    if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) {
      const pattern = new RegExp(escapeRegex(clean(req.query.search)), "i");
      filter.$or = [
        { name: pattern },
        { email: pattern },
        { phone: pattern },
        { country: pattern },
        { organizationName: pattern },
      ];
    }
    const applications = await ParticipationApplication.find(filter)
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Participation applications fetch error:", error);
    res.status(500).json({ message: "Unable to fetch participation submissions." });
  }
};

exports.updateParticipationApplication = async (req, res) => {
  try {
    const application = await ParticipationApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Submission not found." });

    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status))
        return res.status(400).json({ message: "Invalid submission status." });
      application.status = req.body.status;
    }
    if (req.body.internalNotes !== undefined)
      application.internalNotes = clean(req.body.internalNotes);
    application.reviewedBy = req.admin._id;
    application.reviewedAt = new Date();
    await application.save();
    await application.populate("reviewedBy", "name email");
    res.json(application);
  } catch (error) {
    console.error("Participation application update error:", error);
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Unable to update this submission." });
  }
};
