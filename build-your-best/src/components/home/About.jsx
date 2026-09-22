import { motion as Motion } from "framer-motion";

const pillars = ["Inspire", "Heal", "Evolve"];

const AboutSection = () => {
  return (
    <section className="public-section bg-white">
      <div className="public-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="public-eyebrow mb-5">About BYBS</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading mb-6">
              A movement for inner wholeness and practical growth.
            </h2>

            <div className="space-y-5 public-copy text-lg">
              <p>
                BYBS helps women and youth reconnect with who they are, heal what holds them back,
                and grow into the best version of themselves.
              </p>
              <p>
                We believe true success comes from wholeness. That is why our work starts inside,
                then moves outward into purpose, leadership, relationships, and meaningful action.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar}
                  className="border border-gray-100 rounded-lg px-2 py-5 text-center bg-[#F7F9FC]"
                >
                  <div className="w-8 h-8 bg-[#00337C] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-[#00337C]">{pillar}</h3>
                </div>
              ))}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <img
                src="/assets/about-1600.jpg"
                alt="Build Your Best Self personal growth journey"
                className="w-full h-full object-cover"
              />
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
