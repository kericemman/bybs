const FellowshipApplication = require("../models/FellowshipApplication");
const resend = require("../utils/resendClient");

const allowedStatuses = ["new", "reviewing", "shortlisted", "accepted", "invited", "declined"];
const FROM_EMAIL = process.env.FROM_EMAIL || "BYBS <admin@campaign.buildyourbestself.org>";

const normalize = (value) => (typeof value === "string" ? value.trim() : value);
const normalizeBoolean = (value) => value === true || value === "true" || value === "1" || value === "on";

const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "country",
  "motivation",
  "growthGoals",
  "challenge",
  "availability",
];

const arrayFields = ["focusAreas"];

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
};

const buildInviteTemplate = ({ name, cohort, message }) => `
  <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:30px 0;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#00337C;color:#ffffff;padding:28px 30px;">
        <h1 style="margin:0;font-size:24px;font-weight:400;">${cohort}</h1>
        <p style="margin:8px 0 0;color:#dbeafe;">Application invitation</p>
      </div>
      <div style="padding:30px;color:#1f2937;line-height:1.7;">
        <p>Hello ${name},</p>
        <div>${message.replace(/\n/g, "<br/>")}</div>
        <p style="margin-top:28px;">Warmly,<br/><strong>BYBS Team</strong></p>
      </div>
    </div>
  </div>
`;

exports.createFellowshipApplication = async (req, res) => {
  let payload = {};

  try {
    payload = Object.fromEntries(
      Object.entries(req.body || {}).map(([key, value]) => [key, normalize(value)])
    );

    arrayFields.forEach((field) => {
      payload[field] = normalizeArray(req.body[field]);
    });
    payload.consent = normalizeBoolean(payload.consent);

    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return res.status(400).json({ message: "Please complete all required fields." });
    }

    if (!payload.consent) {
      return res.status(400).json({ message: "Consent is required before submitting." });
    }

    const application = await FellowshipApplication.create({
      ...payload,
      cohort: payload.cohort || "BYBS Fellowship Cohort 4",
      cohortSlug: payload.cohortSlug || "bybs-fellowship-cohort-4",
      source: payload.source || "website",
      email: payload.email.toLowerCase(),
    });

    return res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Create fellowship application error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: `You have already submitted an application for ${payload.cohort || "this cohort"}.`,
      });
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: "Please check your application details." });
    }

    return res.status(500).json({ message: "Unable to submit application right now." });
  }
};

exports.getFellowshipApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (req.query.cohortSlug) {
      filter.cohortSlug = req.query.cohortSlug;
    }

    if (req.query.cohort) {
      filter.cohort = req.query.cohort;
    }

    if (search) {
      const pattern = new RegExp(search, "i");
      filter.$or = [
        { firstName: pattern },
        { lastName: pattern },
        { email: pattern },
        { phone: pattern },
        { country: pattern },
        { occupation: pattern },
      ];
    }

    const applications = await FellowshipApplication.find(filter).sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    console.error("Get fellowship applications error:", error);
    return res.status(500).json({ message: "Unable to fetch applications." });
  }
};

exports.updateFellowshipApplication = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updates = {};

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid application status." });
      }
      updates.status = status;
    }

    if (adminNotes !== undefined) {
      updates.adminNotes = normalize(adminNotes);
    }

    const application = await FellowshipApplication.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    return res.json(application);
  } catch (error) {
    console.error("Update fellowship application error:", error);
    return res.status(500).json({ message: "Unable to update application." });
  }
};

exports.sendFellowshipInvite = async (req, res) => {
  try {
    const application = await FellowshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const subject = normalize(req.body.subject) || `Invitation: ${application.cohort}`;
    const message = normalize(req.body.message) ||
      `Congratulations ${application.firstName},\n\nAfter reviewing your application, we would like to invite you to the next step for ${application.cohort}. Please reply to this email to confirm your availability and receive onboarding details.`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [application.email],
      subject,
      html: buildInviteTemplate({
        name: application.firstName,
        cohort: application.cohort,
        message,
      }),
    });

    application.status = "invited";
    application.inviteSentAt = new Date();
    application.inviteSentBy = req.admin._id;
    application.inviteSubject = subject;
    application.inviteMessage = message;
    await application.save();

    return res.json({
      message: "Invite sent successfully.",
      application,
    });
  } catch (error) {
    console.error("Send fellowship invite error:", error);
    return res.status(500).json({ message: "Unable to send invite." });
  }
};

exports.deleteFellowshipApplication = async (req, res) => {
  try {
    const application = await FellowshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    await application.deleteOne();
    return res.json({ message: "Application deleted." });
  } catch (error) {
    console.error("Delete fellowship application error:", error);
    return res.status(500).json({ message: "Unable to delete application." });
  }
};
