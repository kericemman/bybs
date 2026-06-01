import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const programs = [
    {
      id: 1,
      title: "Coaching & Mentorship",
      purpose:
        "One-on-one or group sessions for clarity, mindset, career, and purpose.",
      cta: "Explore coaching",
      link: "/coaching",
      image: "/assets/men.jpg",
    },
    {
      id: 2,
      title: "BYBS Fellowship",
      purpose:
        "A guided transformation journey for women and youth ready to grow.",
      cta: "About fellowship",
      link: "/fellowship",
      image: "/assets/fell.jpg",
    },
    {
      id: 3,
      title: "EmpowerHer Initiative",
      purpose:
        "Mindset, skills, and startup support for women building forward.",
      cta: "Support EmpowerHer",
      link: "/empowerher",
      image: "/assets/empower.jpg",
    },
    {
      id: 4,
      title: "Community Outreach",
      purpose:
        "Resilience workshops, donation drives, and youth mentorship in action.",
      cta: "Learn more",
      link: "/outreach",
      image: "/assets/commu.jpg",
    },
  ];

  return (
    <section className="public-section bg-white">
      <div className="public-container">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <p className="public-eyebrow mb-5">Core programs</p>
            <h2 className="public-heading text-3xl md:text-5xl mb-5">
              Growth pathways for every stage of the journey.
            </h2>
            <p className="public-copy text-lg">
              Explore programs designed to help people reconnect, heal, grow,
              and build lives aligned with purpose.
            </p>
          </div>

          <Link to="/coaching" className="public-button-secondary px-5 py-3">
            View programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((program, index) => (
            <Motion.div
              key={program.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group"
            >
              <Link to={program.link} className="public-card block overflow-hidden h-full">
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex flex-col min-h-56">
                  <h3 className="text-xl font-semibold text-[#00337C] mb-3">
                    {program.title}
                  </h3>
                  <p className="public-copy text-sm flex-1">{program.purpose}</p>

                  <div className="mt-5 pt-4 border-t border-gray-100 text-sm font-semibold text-[#00337C] inline-flex items-center gap-2">
                    {program.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
