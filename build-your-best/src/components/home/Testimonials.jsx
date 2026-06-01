import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      summary: "Transformed through resilience and emotional intelligence",
      fullText:
        "The BYBS fellowship provided a safe space for me to learn personal resilience, emotional intelligence, networking techniques and many more others. The mentors were supportive and encouraging, guiding me through exercises that challenged my self-perceptions.",
      author: "Kajokare Santos Evans",
    },
    {
      id: 2,
      summary: "Discovering purpose beyond career",
      fullText:
        "From the first sessions, I was challenged to reflect on my values, strengths, and purpose. The fellowship helped me realize that a career is not just about earning a living; it is about discovering who you are and aligning your passion with service.",
      author: "Gabriel Garang Garang",
    },
    {
      id: 3,
      summary: "Learning persistence through challenges",
      fullText:
        "BYBS taught us how to remain persistent even when things get hard. Looking back at all the assignments and different learning styles, I can see how much the process stretched and strengthened me.",
      author: "Taluga Robin Druku",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="public-section bg-white">
      <div className="public-container">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="public-eyebrow mb-5">Transformation stories</p>
          <h2 className="public-heading text-3xl md:text-5xl mb-5">
            Real growth, told by the people who lived it.
          </h2>
          <p className="public-copy text-lg">
            Hear from those who have walked the journey of reconnection,
            healing, and growth.
          </p>
        </Motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="public-card p-7 md:p-10"
            >
              <p className="text-5xl text-[#B76E79]/35 leading-none mb-4">
                “
              </p>
              <h3 className="text-2xl font-light text-[#00337C] mb-5">
                {testimonials[currentTestimonial].summary}
              </h3>
              <p className="public-copy text-lg mb-8">
                {testimonials[currentTestimonial].fullText}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-6 border-t border-gray-100">
                <div>
                  <p className="font-semibold text-[#00337C]">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-sm text-gray-500">
                    BYBS Fellowship Graduate
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentTestimonial
                          ? "bg-[#00337C]"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Show story ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </Motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={nextTestimonial}
              className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/fellowship" className="public-button-primary px-6 py-3">
            Join our next cohort
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
