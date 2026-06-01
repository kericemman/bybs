import { motion as Motion } from "framer-motion";

const WhoWeServe = () => {
  const groups = [
    {
      title: "Women",
      description:
        "Balancing identity, family, work, and purpose while reclaiming voice and vision.",
    },
    {
      title: "Youth",
      description:
        "Searching for clarity, direction, and confidence while discovering personal strength.",
    },
    {
      title: "Professionals",
      description:
        "Striving with ambition while needing balance, grounding, and renewed purpose.",
    },
    {
      title: "Leaders",
      description:
        "Seeking deeper fulfillment, authenticity, and impact beyond achievement.",
    },
  ];

  return (
    <section className="public-section bg-[#F7F9FC]">
      <div className="public-container">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <p className="public-eyebrow mb-5">Who we serve</p>
          <h2 className="public-heading text-3xl md:text-5xl mb-5">
            For people ready to transform from the inside out.
          </h2>
          <p className="public-copy text-lg">
            We walk with individuals and groups who want clarity, healing,
            confidence, and a more intentional way to grow.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group, index) => (
            <Motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="public-card p-6 md:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00337C]/10 text-[#00337C] flex items-center justify-center font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00337C] mb-2">
                    {group.title}
                  </h3>
                  <p className="public-copy">{group.description}</p>
                </div>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeServe;
