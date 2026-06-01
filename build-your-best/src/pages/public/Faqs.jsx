import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const faqCategories = [
  {
    title: "General Questions",
    questions: [
      {
        question: "What makes your coaching approach unique?",
        answer:
          "The BYBS approach blends self-awareness, practical tools, and personal reflection to help people rebuild self-trust from the inside out.",
      },
      {
        question: "How do I know if coaching is right for me?",
        answer:
          "Coaching is helpful if you are ready for change but feel stuck, overwhelmed, or unsure how to move forward with clarity.",
      },
      {
        question: "What is your coaching philosophy?",
        answer:
          "Lasting transformation comes from combining self-awareness with intentional action. We help you develop your own inner guidance system.",
      },
    ],
  },
  {
    title: "Process & Logistics",
    questions: [
      {
        question: "How often do coaching sessions occur?",
        answer:
          "Most clients meet weekly or bi-weekly. Individual sessions typically last 60 minutes.",
      },
      {
        question: "What happens in a typical coaching session?",
        answer:
          "Sessions begin with a check-in, then focus on your current priority using reflection, strategy, and clear next steps.",
      },
      {
        question: "Do you offer packages or single sessions?",
        answer:
          "Yes. BYBS offers focused single sessions as well as multi-session coaching packages for deeper transformation.",
      },
    ],
  },
  {
    title: "Payments & Privacy",
    questions: [
      {
        question: "How do payments and cancellations work?",
        answer:
          "Payments are processed securely. If you need to reschedule, please give as much notice as possible so the session can be moved.",
      },
      {
        question: "Is my information kept confidential?",
        answer:
          "Yes. What you share in coaching is treated with care and confidentiality, except where safety or legal obligations require otherwise.",
      },
    ],
  },
  {
    title: "Results & Expectations",
    questions: [
      {
        question: "How soon will I see results?",
        answer:
          "Many clients notice early shifts in perspective within a few sessions. Deeper behavioral change depends on consistency and practice.",
      },
      {
        question: "Do you provide resources between sessions?",
        answer:
          "Yes. Coaching may include reflection prompts, exercises, resources, or action steps tailored to your goals.",
      },
    ],
  },
];

export default function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return faqCategories;

    return faqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) =>
            item.question.toLowerCase().includes(term) ||
            item.answer.toLowerCase().includes(term)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [query]);

  const toggleAccordion = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  return (
    <div className="bg-white">
      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container max-w-4xl text-center">
          <p className="public-eyebrow mb-5">FAQs</p>
          <h1 className="public-heading text-4xl md:text-6xl mb-6">
            Questions before you begin?
          </h1>
          <p className="public-copy text-lg mb-8">
            Find quick answers about coaching, sessions, payments, privacy, and
            what to expect from BYBS.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00337C]/10 focus:border-[#00337C] outline-none"
            />
          </div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container max-w-5xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-[#F7F9FC] rounded-lg">
              <p className="text-gray-600">No questions match your search.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((category, catIndex) => (
                <div key={category.title}>
                  <h2 className="text-2xl font-light text-[#00337C] mb-5">
                    {category.title}
                  </h2>

                  <div className="space-y-3">
                    {category.questions.map((item, index) => {
                      const questionId = `${catIndex}-${index}`;
                      const open = activeIndex === questionId;

                      return (
                        <div
                          key={item.question}
                          className="public-card overflow-hidden"
                        >
                          <button
                            className="flex justify-between items-center gap-4 w-full px-5 md:px-6 py-5 text-left"
                            onClick={() => toggleAccordion(questionId)}
                          >
                            <span className="font-semibold text-[#00337C]">
                              {item.question}
                            </span>
                            {open ? (
                              <ChevronUp className="w-5 h-5 text-[#00337C] flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#00337C] flex-shrink-0" />
                            )}
                          </button>

                          {open && (
                            <div className="px-5 md:px-6 pb-5 text-gray-600 leading-7 border-t border-gray-100 pt-5">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
