import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Services= () => {
  const programs = [
    {
      id: 1,
      title: "Coaching & Mentorship",
      purpose: "One-on-one or group sessions for clarity, mindset, career & purpose",
      cta: "Explore More",
      link: "/coaching",
      image: "/assets/men.jpg",
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      title: "BYBS Fellowship",
      purpose: "3-month guided transformation journey for women & youth",
      cta: "About the Fellowship",
      link: "/fellowship",
      image: "/assets/fell.jpg",
      color: "from-purple-600 to-purple-800"
    },
    {
      id: 3,
      title: "EmpowerHer Initiative",
      purpose: "Mindset + skills + startup support for women",
      cta: "Support EmpowerHer",
      link: "/empowerher",
      image: "/assets/empower.jpg",
      color: "from-pink-600 to-pink-800"
    },
    {
      id: 4,
      title: "Community Outreach",
      purpose: "Resilience workshops, hospital donations, youth mentorship",
      cta: "Learn More",
      link: "/outreach",
      image: "/assets/commu.jpg",
      color: "from-green-600 to-green-800"
    }
  ];

  return (
    <section className="min-h-screen bg-white py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#00337C] mb-4">
            Core Programs
          </h2>
          <div className="w-16 h-0.5 bg-[#B76E79] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transformative journeys designed to help you reconnect, heal, and grow
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Link to={program.link} className="block">
                <div className="bg-white border border-gray-100 rounded-none overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    
                    {/* Program Number */}
                    
                  </div>

                  {/* Content */}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-xl font-normal text-[#00337C] mb-3 leading-tight">
                      {program.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {program.purpose}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <button className="w-full px-4 py-3 bg-[#00337C] text-white text-sm font-medium hover:bg-[#1E4B9E] transition-colors duration-300 text-center">
                        {program.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-5 pt-2 border-t border-gray-100"
        >
          
        </motion.div>
      </div>
    </section>
  );
};

export default Services;