import { motion } from "framer-motion";

const WhoWeServe = () => {
  const groups = [
    {
      title: "Women",
      description: "balancing identity, family, work, and purpose. We empower you to reclaim your voice and vision",
      icon: "♀"
    },
    {
      title: "Youth",
      description: "searching for clarity, direction, and confidence. We help you discover your path and strength",
      icon: "🌱"
    },
    {
      title: "Professionals",
      description: "striving but silently overwhelmed or disconnected. Well help you find balance and purpose",
      icon: "💼"
    },
    {
      title: "Leaders",
      description: "who have achieved much but seek deeper fulfillment and grounding. Our programs help you lead with authenticity and impact",
      icon: "⭐"
    }
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#00337C] mb-4">
            Who We Serve
          </h2>
          <div className="w-16 h-0.5 bg-[#B76E79] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We walk with those ready to transform their lives from the inside out
          </p>
        </motion.div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {groups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 border border-gray-100 hover:border-[#00337C]/20 transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                
                <div>
                  <h3 className="text-xl font-normal text-[#00337C] mb-2">
                    {group.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default WhoWeServe;