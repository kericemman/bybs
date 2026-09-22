export const cohortStage = (cohort) => {
  if (!cohort)
    return {
      key: "unannounced",
      label: "Next cohort to be announced",
      tone: "bg-gray-100 text-gray-700",
    };
  if (cohort.status === "completed")
    return { key: "completed", label: "Cohort completed", tone: "bg-emerald-50 text-emerald-700" };
  if (cohort.status === "ongoing")
    return { key: "underway", label: "Cohort underway", tone: "bg-blue-50 text-blue-700" };
  if (cohort.applicationStatus === "open")
    return { key: "open", label: "Applications open", tone: "bg-emerald-50 text-emerald-700" };
  if (cohort.applicationStatus === "opening-soon")
    return {
      key: "opening-soon",
      label: "Applications opening soon",
      tone: "bg-amber-50 text-amber-800",
    };
  if (cohort.applicationStatus === "invite-only")
    return {
      key: "invite-only",
      label: "Applications by invitation",
      tone: "bg-violet-50 text-violet-700",
    };
  return { key: "closed", label: "Applications closed", tone: "bg-gray-100 text-gray-700" };
};

const stagePriority = {
  open: 0,
  "opening-soon": 1,
  underway: 2,
  closed: 3,
  "invite-only": 4,
  completed: 5,
  unannounced: 6,
};

export const orderCohorts = (cohorts = []) =>
  [...cohorts].sort((a, b) => {
    const stageDifference = stagePriority[cohortStage(a).key] - stagePriority[cohortStage(b).key];
    if (stageDifference) return stageDifference;
    return new Date(b.startDate || b.createdAt || 0) - new Date(a.startDate || a.createdAt || 0);
  });

export const currentCohort = (cohorts = []) => orderCohorts(cohorts)[0] || null;

export const cohortAction = (cohort) => {
  const stage = cohortStage(cohort);
  if (stage.key === "open" && cohort?.slug) {
    return {
      type: "link",
      label: "Apply to this cohort",
      to: `/programs/fellowship/cohorts/${cohort.slug}/apply`,
    };
  }
  if (stage.key === "underway" && cohort?.slug) {
    return {
      type: "link",
      label: "View the current cohort",
      to: `/programs/fellowship/cohorts/${cohort.slug}`,
    };
  }
  return {
    type: "waitlist",
    label:
      stage.key === "opening-soon" ? "Get application updates" : "Join the next cohort waitlist",
  };
};
