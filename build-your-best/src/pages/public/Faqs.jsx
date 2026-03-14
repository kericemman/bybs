import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaHandsHelping, FaComments, FaUserCheck, FaLock } from 'react-icons/fa';
import { GiStonePath } from 'react-icons/gi';
import { Link } from 'react-router-dom';

export default function FAQPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "General Questions",
      icon: <FaHandsHelping className="text-2xl text-[#00337C]" />,
      questions: [
        {
          question: "What makes your coaching approach unique?",
          answer: "My coaching blends evidence-based psychology with practical tools, tailored specifically for women navigating self-doubt and transition. Unlike generic programs, we focus on rebuilding self-trust from the inside out through personalized attention and actionable strategies."
        },
        {
          question: "How do I know if coaching is right for me?",
          answer: "Coaching is ideal if you're ready for change but feel stuck in implementing it. If you're tired of surface-level solutions and want to address root causes of self-doubt while developing practical skills, we'll likely be a great fit. I offer free discovery calls to help you determine this."
        },
        {
          question: "What's your coaching philosophy?",
          answer: "I believe lasting transformation comes from combining self-awareness with intentional action. My approach is strengths-based, trauma-informed, and focuses on helping you develop your own inner guidance system rather than depending on external validation."
        }
      ]
    },
    {
      title: "Process & Logistics",
      icon: <GiStonePath className="text-2xl text-[#00337C]" />,
      questions: [
        {
          question: "How often do coaching sessions occur?",
          answer: "Most clients meet with me weekly or bi-weekly. Individual sessions typically last 60 minutes, while group coaching sessions run 90 minutes bi-weekly. Consistency is key to creating meaningful change."
        },
        {
          question: "What happens in a typical coaching session?",
          answer: "Sessions begin with checking progress and challenges since our last meeting. We then focus on your current priority, using targeted exercises, reflection, and strategy development. Each session ends with clear action steps tailored to your goals and lifestyle."
        },
        {
          question: "Do you offer packages or single sessions?",
          answer: "I primarily work with clients through 3-month packages (12 sessions) as this timeframe allows for substantial transformation. Limited single sessions are available for specific needs like interview preparation or decision-making support."
        }
      ]
    },
    {
      title: "Technical Details",
      icon: <FaLock className="text-2xl text-[#00337C]" />,
      questions: [
        {
          question: "What platform do you use for sessions?",
          answer: "All sessions are conducted via Zoom for video calls. For clients who prefer audio-only, phone sessions are also available. Group coaching includes access to a private community platform for ongoing support."
        },
        {
          question: "How do payments and cancellations work?",
          answer: "Payments are processed securely through Stripe. You'll receive invoices for your package with flexible payment plans available. Cancellations require 24 hours notice to avoid being charged for the session. Emergency exceptions are always considered."
        },
        {
          question: "Is my information kept confidential?",
          answer: "Absolutely. Your privacy is protected under strict confidentiality agreements. What's shared in sessions stays between us, with the only exceptions being situations where there's risk of harm to yourself or others, as required by law."
        }
      ]
    },
    {
      title: "Group Coaching Specific",
      icon: <FaComments className="text-2xl text-[#00337C]" />,
      questions: [
        {
          question: "How are group coaching cohorts structured?",
          answer: "Each cohort includes 6-8 carefully selected members who commit to a 3-month journey. We meet bi-weekly as a group, with monthly individual check-ins. Groups are themed around specific focuses (e.g., career transitions, confidence building) to ensure shared goals."
        },
        {
          question: "What if I miss a group session?",
          answer: "All sessions are recorded (except for sensitive sharing moments) and available in our private portal. You'll also receive session summaries and can submit questions for the next meeting. However, live attendance is encouraged for maximum benefit."
        },
        {
          question: "How is privacy maintained in group settings?",
          answer: "Every member signs a confidentiality agreement before joining. We establish clear group guidelines about respect and privacy during our first session. While you control what you share, the expectation is that all personal stories remain within the group."
        }
      ]
    },
    {
      title: "Results & Expectations",
      icon: <FaUserCheck className="text-2xl text-[#00337C]" />,
      questions: [
        {
          question: "How soon will I see results?",
          answer: "Most clients notice initial shifts in perspective within 3-4 sessions. Tangible behavioral changes typically emerge around week 6-8. Of course, your commitment to the process significantly influences your progress timeline."
        },
        {
          question: "What if I don't feel the coaching is working?",
          answer: "We'll regularly assess your progress and adjust our approach as needed. If after 4 sessions you're not seeing value, I offer a prorated refund for remaining sessions. Your transformation is my priority."
        },
        {
          question: "Do you provide any resources between sessions?",
          answer: "Yes! All clients receive customized exercises, reflection prompts, and recommended readings. Many programs also include access to my resource library with worksheets, guided visualizations, and exclusive content."
        }
      ]
    }
  ];

  return (
    <div className="bg-[#F5F9FF] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#E6F0FF] to-[#F5F9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-[#00337C] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[#5A5A5A] max-w-3xl mx-auto mb-8">
            Everything you need to know about working with me
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto"></div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="relative py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-16">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full px-6 py-4 border border-[#D1D1D1] rounded-xl focus:ring-[#00337C] focus:border-[#00337C] pl-12 text-gray-700"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5A5A5A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-16">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex} className="border-b border-[#E6F0FF] pb-12 last:border-0 last:pb-0">
                <div className="flex items-center mb-8">
                 
                  <h2 className="text-2xl font-bold text-[#00337C]">{category.title}</h2>
                </div>

                <div className="space-y-6">
                  {category.questions.map((item, index) => {
                    const questionIndex = catIndex * 10 + index;
                    return (
                      <div key={index} className="border border-[#E6F0FF] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
                        <button
                          className={`flex justify-between items-center w-full px-6 py-5 text-left ${activeIndex === questionIndex ? 'bg-[#F5F9FF]' : 'bg-white'}`}
                          onClick={() => toggleAccordion(questionIndex)}
                        >
                          <span className="font-medium text-[#00337C]">{item.question}</span>
                          {activeIndex === questionIndex ? (
                            <FaChevronUp className="text-[#00337C]" />
                          ) : (
                            <FaChevronDown className="text-[#00337C]" />
                          )}
                        </button>
                        {activeIndex === questionIndex && (
                          <div className="px-6 py-5 bg-white text-[#5A5A5A] border-t border-[#E6F0FF]">
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
        </div>
      </section>

      
    </div>
  );
}