import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import CoachingCheckout from "./Cart2";

export default function CoachingPackages() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const packages = [
    {
      name: "Clarity Boost",
      price: "$35",
      description: "One honest conversation. One deep breath. One clear next step.",
      subtitle: "For when you need space to breathe and see clearly",
      features: [
        "60-minute 1:1 session",
        "Customized action plan",
        "Email follow-up",
        "Perfect for quick breakthroughs",
      ],
      popular: false,
      quantity: 1,
      type: "coaching",
    },
    {
      name: "Breakthrough Bundle",
      price: "$90",
      description:
        "Three sessions to create momentum and sustainable change in one key area.",
      subtitle: "For real change that sticks",
      features: [
        "Three 60-minute sessions",
        "Personalized growth plan",
        "Between-session support",
        "Accountability structure",
      ],
      popular: false,
      quantity: 1,
      type: "coaching",
    },
    {
      name: "Transformation Journey",
      price: "$165",
      description:
        "A six-session container for holistic personal transformation.",
      subtitle: "For rewriting your story on your own terms",
      features: [
        "Six 60-minute sessions",
        "Comprehensive assessment",
        "Weekly check-ins",
        "Custom resources",
        "Priority email access",
      ],
      popular: true,
      quantity: 1,
      type: "coaching",
    },
  ];

  const descriptions = [
    {
      title: "Clarity Boost",
      subtitle: "For when you are overwhelmed and spinning in your head",
      description:
        "A focused session for emotional relief, decision support, and a clear next step.",
      points: [
        "You are stuck between two big decisions",
        "You are holding emotions you have not fully processed",
        "You feel off but cannot explain why",
        "You need someone to listen and ask the right questions",
      ],
      outcome: "Emotional relief, mental clarity, and a personalized clarity map.",
    },
    {
      title: "Breakthrough Bundle",
      subtitle: "For when you are tired of doing it alone",
      description:
        "A steady guided shift from self-doubt to self-trust, and from confusion to aligned action.",
      points: [
        "You are constantly second-guessing yourself",
        "Fear, perfectionism, or people-pleasing gets in the way",
        "You are moving through a life transition",
        "You want to shift how you show up",
      ],
      outcome:
        "Clarity, a personalized growth map, accountability, and tools for lasting change.",
    },
    {
      title: "Transformation Journey",
      subtitle: "For when you have outgrown your old story",
      description:
        "A deeper journey for coming home to yourself with truth, gentleness, and power.",
      points: [
        "You are navigating a major transition",
        "You are rebuilding confidence and self-trust",
        "You are tired of just coping",
        "You are ready to live with clarity and intention",
      ],
      outcome:
        "A full growth assessment, emotional release, mindset rewiring, and comprehensive support.",
    },
  ];

  const handleBookNow = (pkg) => {
    setSelectedPackage({
      ...pkg,
      price: parseFloat(pkg.price.replace("$", "")),
    });
    setShowCheckout(true);
  };

  if (showCheckout && selectedPackage) {
    return <CoachingCheckout selectedProduct={selectedPackage} />;
  }

  return (
    <div className="bg-white">
      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container text-center max-w-3xl">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="public-eyebrow mb-5">Coaching</p>
            <h1 className="public-heading text-3xl md:text-6xl mb-6">
              Choose the level of support your season needs.
            </h1>
            <p className="public-copy text-lg">
              Each coaching path offers a different depth of support. Choose
              what feels right for your current moment.
            </p>
          </Motion.div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {packages.map((pkg, index) => (
              <Motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={`public-card relative p-6 md:p-7 flex flex-col ${
                  pkg.popular ? "border-[#00337C]/35" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-[#00337C] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most popular
                  </div>
                )}

                <div className="mb-6 pr-20">
                  <h3 className="text-2xl font-light text-[#00337C] mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-3xl font-light text-[#B76E79]">
                    {pkg.price}
                  </p>
                </div>

                <p className="text-sm italic text-gray-500 mb-4">
                  {pkg.subtitle}
                </p>
                <p className="public-copy mb-6">{pkg.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBookNow(pkg)}
                  className="public-button-primary w-full px-5 py-3"
                >
                  Book now
                </button>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container max-w-5xl">
          <div className="max-w-2xl mb-5">
            <p className="public-eyebrow mb-5">What to expect</p>
            <h2 className="public-heading text-3xl md:text-5xl">
              Practical support, matched to your real life.
            </h2>
          </div>

          <div className="space-y-5">
            {descriptions.map((section, index) => (
              <Motion.div
                key={section.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="public-card p-6 md:p-8"
              >
                <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
                  <div>
                    <h3 className="text-2xl font-light text-[#00337C] mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-500 italic mb-4">
                      {section.subtitle}
                    </p>
                    <p className="public-copy">{section.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#00337C] mb-3">
                      This is for you if:
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-[#B76E79] rounded-full mt-2 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-lg bg-[#F5F9FF] border border-[#00337C]/10 p-4">
                      <p className="text-sm font-semibold text-[#00337C] mb-1">
                        You will walk away with
                      </p>
                      <p className="text-sm text-gray-600 leading-6">
                        {section.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
