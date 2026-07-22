const FellowshipApplication = require("../models/FellowshipApplication");
const resend = require("../utils/resendClient");

const allowedStatuses = ["new", "reviewing", "shortlisted", "accepted", "invited", "declined"];
const autoScreenStatuses = ["new", "reviewing", "shortlisted", "accepted", "declined"];
const FROM_EMAIL = process.env.FROM_EMAIL || "BYBS Fellowship <no-reply@updates.buildyourbestself.org>";

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

const buildApplicationEmailTemplate = ({ name, cohort, message, label = "Application update", accent = "#00337C" }) => `
  <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:30px 0;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:${accent};color:#ffffff;padding:28px 30px;">
        <h1 style="margin:0;font-size:24px;font-weight:400;">${cohort}</h1>
        <p style="margin:8px 0 0;color:#dbeafe;">${label}</p>
      </div>
      <div style="padding:30px;color:#1f2937;line-height:1.7;">
        <p>Hello ${name},</p>
        <div>${message}</div>
        <p style="margin-top:28px;">Warmly,<br/><strong>BYBS Team</strong></p>
      </div>
    </div>
  </div>
`;

const textLength = (value) => String(value || "").replace(/\s+/g, " ").trim().length;

const sanitizeEmailHtml = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+=(["']).*?\1/gi, "");

const toEmailHtml = (value = "") => {
  const clean = sanitizeEmailHtml(value);
  return /<[a-z][\s\S]*>/i.test(clean) ? clean : clean.replace(/\n/g, "<br/>");
};

const personalizeApplicationMessage = (message, application) =>
  message
    .replaceAll("{{firstName}}", application.firstName || "")
    .replaceAll("{{lastName}}", application.lastName || "")
    .replaceAll("{{fullName}}", `${application.firstName || ""} ${application.lastName || ""}`.trim())
    .replaceAll("{{cohort}}", application.cohort || "BYBS Fellowship");

const isUnsuccessfulApplication = (application) =>
  application.screeningGroup === "not_qualified" || application.status === "declined";

const sendApplicationEmail = async ({ application, subject, message, label, accent }) => {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [application.email],
    subject,
    html: buildApplicationEmailTemplate({
      name: application.firstName,
      cohort: application.cohort,
      message: personalizeApplicationMessage(message, application),
      label,
      accent,
    }),
  });

  if (error) {
    const messageText = error.message || "Resend rejected the application email.";
    const detail = error.name ? `${error.name}: ${messageText}` : messageText;
    throw new Error(detail);
  }
};

const scoreApplication = (application) => {
  let score = 0;
  const reasons = [];

  const profileComplete = [
    application.firstName,
    application.lastName,
    application.email,
    application.phone,
    application.country,
  ].every(Boolean);

  if (profileComplete) {
    score += 15;
    reasons.push("Profile and contact details are complete.");
  } else {
    reasons.push("Missing required personal or contact details.");
  }

  if (application.consent) {
    score += 5;
    reasons.push("Consent confirmed.");
  } else {
    reasons.push("Consent is missing.");
  }

  if (application.availability === "yes") {
    score += 25;
    reasons.push("Can commit to the Saturday and Sunday cohort schedule.");
  } else if (application.availability === "mostly") {
    score += 15;
    reasons.push("Mostly available for the cohort schedule.");
  } else {
    reasons.push("Cannot clearly commit to the cohort schedule.");
  }

  if (application.currentStage) {
    score += 10;
    reasons.push("Current stage of life is clear.");
  } else {
    reasons.push("Current stage of life is missing.");
  }

  const motivationLength = textLength(application.motivation);
  if (motivationLength >= 80) {
    score += 20;
    reasons.push("Motivation answer shows strong intent.");
  } else if (motivationLength >= 40) {
    score += 10;
    reasons.push("Motivation answer is present but could be deeper.");
  } else {
    reasons.push("Motivation answer is too brief.");
  }

  const goalsLength = textLength(application.growthGoals);
  if (goalsLength >= 60) {
    score += 15;
    reasons.push("Growth goals are specific enough for screening.");
  } else if (goalsLength >= 30) {
    score += 8;
    reasons.push("Growth goals are present but light.");
  } else {
    reasons.push("Growth goals are too brief.");
  }

  const challengeLength = textLength(application.challenge);
  if (challengeLength >= 50) {
    score += 10;
    reasons.push("Current challenge gives useful review context.");
  } else if (challengeLength >= 25) {
    score += 5;
    reasons.push("Current challenge is present but light.");
  } else {
    reasons.push("Current challenge answer is too brief.");
  }

  if (application.focusAreas?.length) {
    score += 10;
    reasons.push("Growth focus areas were selected.");
  } else {
    reasons.push("No growth focus areas selected.");
  }

  const meetsCoreRequirements =
    profileComplete &&
    application.consent &&
    ["yes", "mostly"].includes(application.availability) &&
    motivationLength >= 40 &&
    goalsLength >= 30 &&
    challengeLength >= 25;
  const group = meetsCoreRequirements && score >= 70 ? "accepted" : "not_qualified";

  return {
    group,
    score: Math.min(score, 100),
    reasons,
  };
};

const markScreened = (application, screening, adminId) => {
  application.screeningGroup = screening.group;
  application.screeningScore = screening.score;
  application.screeningReasons = screening.reasons;
  application.screeningMode = "auto";
  application.screenedAt = new Date();
  application.screenedBy = adminId;
  application.status = screening.group === "accepted" ? "accepted" : "declined";
};

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

    if (req.query.screeningGroup && req.query.screeningGroup !== "all") {
      filter.screeningGroup = req.query.screeningGroup;
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
    const { status, adminNotes, screeningGroup } = req.body;
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

    if (screeningGroup !== undefined) {
      if (!["unscreened", "accepted", "not_qualified"].includes(screeningGroup)) {
        return res.status(400).json({ message: "Invalid screening group." });
      }

      updates.screeningGroup = screeningGroup;
      updates.screeningMode = "manual";
      updates.screenedAt = new Date();
      updates.screenedBy = req.admin._id;
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

exports.screenFellowshipApplications = async (req, res) => {
  try {
    const filter = {
      status: { $in: autoScreenStatuses },
    };

    if (req.body.cohortSlug) {
      filter.cohortSlug = req.body.cohortSlug;
    }

    if (!req.body.force) {
      filter.$or = [
        { screeningGroup: { $exists: false } },
        { screeningGroup: "unscreened" },
      ];
    }

    const applications = await FellowshipApplication.find(filter);
    const summary = {
      screened: 0,
      accepted: 0,
      notQualified: 0,
    };

    const updatedApplications = [];

    for (const application of applications) {
      const screening = scoreApplication(application);
      markScreened(application, screening, req.admin._id);
      await application.save();

      summary.screened += 1;
      if (screening.group === "accepted") summary.accepted += 1;
      if (screening.group === "not_qualified") summary.notQualified += 1;
      updatedApplications.push(application);
    }

    return res.json({
      message: "Automated screening completed.",
      summary,
      applications: updatedApplications,
    });
  } catch (error) {
    console.error("Screen fellowship applications error:", error);
    return res.status(500).json({ message: "Unable to screen applications." });
  }
};

exports.sendFellowshipInvite = async (req, res) => {
  try {
    const application = await FellowshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const subject = normalize(req.body.subject) || `Invitation: ${application.cohort}`;
    const message = toEmailHtml(
      req.body.message ||
      req.body.messageHtml ||
      `Congratulations ${application.firstName},\n\nAfter reviewing your application, we would like to invite you to the next step for ${application.cohort}. Please reply to this email to confirm your availability and receive onboarding details.`
    );

    await sendApplicationEmail({
      application,
      subject,
      message,
      label: "Application invitation",
      accent: "#00337C",
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

exports.sendBulkFellowshipInvites = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];

    if (!ids.length) {
      return res.status(400).json({ message: "Select at least one applicant." });
    }

    const applications = await FellowshipApplication.find({
      _id: { $in: ids },
      status: { $ne: "invited" },
    });

    const subject = normalize(req.body.subject) || "Invitation: BYBS Fellowship";
    const message = toEmailHtml(
      req.body.message ||
      req.body.messageHtml ||
      "Congratulations. After reviewing your application, we would like to invite you to the next step."
    );

    const sent = [];
    const failed = [];

    for (const application of applications) {
      try {
        await sendApplicationEmail({
          application,
          subject,
          message,
          label: "Application invitation",
          accent: "#00337C",
        });

        application.status = "invited";
        application.inviteSentAt = new Date();
        application.inviteSentBy = req.admin._id;
        application.inviteSubject = subject;
        application.inviteMessage = message;
        await application.save();
        sent.push(application);
      } catch (sendError) {
        console.error("Bulk invite send error:", sendError);
        failed.push({
          id: application._id,
          email: application.email,
          message: sendError.message || "Failed to send invite.",
        });
      }
    }

    return res.json({
      message: `Sent ${sent.length} invitation${sent.length === 1 ? "" : "s"}.`,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Send bulk fellowship invites error:", error);
    return res.status(500).json({ message: "Unable to send invitations." });
  }
};

exports.sendFellowshipRegret = async (req, res) => {
  try {
    const application = await FellowshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (!isUnsuccessfulApplication(application)) {
      return res.status(400).json({
        message: "Regret emails can only be sent to declined or not qualified applicants.",
      });
    }

    if (application.regretSentAt) {
      return res.status(409).json({ message: "A regret email has already been sent to this applicant." });
    }

    const subject = normalize(req.body.subject) || `Update on your ${application.cohort} application`;
    const message = toEmailHtml(
      req.body.message ||
      req.body.messageHtml ||
      `Thank you ${application.firstName},\n\nWe are grateful for the time and thought you put into your application. After careful review, we are not able to offer you a place in this cohort. Please keep growing with the BYBS community and look out for future opportunities.`
    );

    await sendApplicationEmail({
      application,
      subject,
      message,
      label: "Application outcome",
      accent: "#7F1D1D",
    });

    application.status = "declined";
    application.screeningGroup = "not_qualified";
    application.regretSentAt = new Date();
    application.regretSentBy = req.admin._id;
    application.regretSubject = subject;
    application.regretMessage = message;
    await application.save();

    return res.json({
      message: "Regret email sent successfully.",
      application,
    });
  } catch (error) {
    console.error("Send fellowship regret error:", error);
    return res.status(500).json({ message: "Unable to send regret email." });
  }
};

exports.sendBulkFellowshipRegrets = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];

    if (!ids.length) {
      return res.status(400).json({ message: "Select at least one applicant." });
    }

    const applications = await FellowshipApplication.find({
      _id: { $in: ids },
      $and: [
        {
          $or: [
            { regretSentAt: { $exists: false } },
            { regretSentAt: null },
          ],
        },
        {
          $or: [
            { screeningGroup: "not_qualified" },
            { status: "declined" },
          ],
        },
      ],
    });

    const subject = normalize(req.body.subject) || "Update on your BYBS Fellowship application";
    const message = toEmailHtml(
      req.body.message ||
      req.body.messageHtml ||
      "Thank you for applying. After careful review, we are not able to offer you a place in this cohort. We are grateful for your courage and interest, and we encourage you to stay connected for future opportunities."
    );

    const sent = [];
    const failed = [];

    for (const application of applications) {
      try {
        await sendApplicationEmail({
          application,
          subject,
          message,
          label: "Application outcome",
          accent: "#7F1D1D",
        });

        application.status = "declined";
        application.screeningGroup = "not_qualified";
        application.regretSentAt = new Date();
        application.regretSentBy = req.admin._id;
        application.regretSubject = subject;
        application.regretMessage = message;
        await application.save();
        sent.push(application);
      } catch (sendError) {
        console.error("Bulk regret send error:", sendError);
        failed.push({
          id: application._id,
          email: application.email,
          message: sendError.message || "Failed to send regret email.",
        });
      }
    }

    return res.json({
      message: `Sent ${sent.length} regret email${sent.length === 1 ? "" : "s"}.`,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Send bulk fellowship regrets error:", error);
    return res.status(500).json({ message: "Unable to send regret emails." });
  }
};

exports.uploadFellowshipInviteImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    return res.status(201).json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload fellowship invite image error:", error);
    return res.status(500).json({ message: "Unable to upload invitation image." });
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
