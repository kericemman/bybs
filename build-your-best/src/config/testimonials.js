export const TESTIMONIAL_MIN_WORDS = 25;
export const TESTIMONIAL_MAX_WORDS = 150;

export const TESTIMONIAL_CATEGORIES = [
  { value: "mentee", label: "Mentee" },
  { value: "mentor", label: "Mentor" },
  { value: "partner", label: "Partner" },
  { value: "volunteer", label: "Volunteer" },
  { value: "fellowship-graduate", label: "Fellowship graduate" },
  { value: "programme-participant", label: "Programme participant" },
  { value: "community-member", label: "Community member" },
  { value: "supporter", label: "Supporter" },
];

export const testimonialCategoryLabel = (value) =>
  TESTIMONIAL_CATEGORIES.find((category) => category.value === value)?.label || "BYBS community";

export const countTestimonialWords = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

export const FALLBACK_TESTIMONIALS = [
  {
    _id: "kajokare-santos-evans",
    name: "Kajokare Santos Evans",
    category: "fellowship-graduate",
    testimonial:
      "The BYBS Fellowship provided a safe space for me to learn personal resilience, emotional intelligence, networking techniques, and much more. The mentors were supportive and encouraging, guiding me through exercises that challenged my self-perceptions.",
  },
  {
    _id: "gabriel-garang-garang",
    name: "Gabriel Garang Garang",
    category: "fellowship-graduate",
    testimonial:
      "From the first sessions, I was challenged to reflect on my values, strengths, and purpose. The Fellowship helped me realise that a career is not only about earning a living; it is about discovering who you are and aligning your passion with service.",
  },
  {
    _id: "taluga-robin-druku",
    name: "Taluga Robin Druku",
    category: "fellowship-graduate",
    testimonial:
      "BYBS taught us how to remain persistent even when things get hard. Looking back at the assignments and different learning styles, I can see how much the process stretched and strengthened me.",
  },
];
