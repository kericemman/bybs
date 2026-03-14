import { Link } from 'react-router-dom';

export default function QuizResults() {
  // Sample result data - in a real app this would come from your quiz logic
  const resultType = "seeker"; // Can be 'seeker', 'rebuilder', 'planner', or 'aligned'
  
  const results = {
    seeker: {
      title: "The Seeker",
      subtitle: "You're in the Season of Rediscovery",
      image: "",
      description: "Right now, you're standing at the edge of something new—but it's not clear yet. You may feel lost, uncertain, or disconnected from your purpose.",
      questions: [
        "Who am I now?",
        "What do I want next?",
        "Is this all there is?"
      ],
      experience: [
        "A sense of restlessness or confusion",
        "A shift in identity, roles, or values",
        "Feeling like your current life doesn't fully reflect who you're becoming"
      ],
      needs: [
        "Tools for reflection and identity work",
        "Space to explore possibilities without pressure",
        "Encouragement to trust your intuition and timing"
      ],
      resources: [
        {
          title: "Self-Awareness Starter Guide",
          description: "A beautifully designed workbook to help you ask better questions and uncover deeper clarity.",
          link: "/products/self-awareness-guide",
          type: "download"
        },
        {
          title: "Career Clarity Blog Series",
          description: "Start with 'What No One Tells You About Career Clarity' and 'Feeling Stuck? 5 Questions to Move Forward'.",
          link: "/blog/career-clarity",
          type: "read"
        },
        {
          title: "1:1 Discovery Session",
          description: "Let's walk through this together. One step, one truth at a time.",
          link: "/book/discovery-session",
          type: "book"
        }
      ]
    },
    rebuilder: {
      title: "The Rebuilder",
      subtitle: "You're in the Season of Healing & Confidence Rebuilding",
      image: "/assets/rebuild.jpg",
      description: "You've been through something that shook you. Now, you're rising—but the pieces still feel scattered.",
      experience: [
        "Inner dialogue filled with shame or self-doubt",
        "Emotional exhaustion that lingers",
        "A desire to trust yourself again, but not knowing how"
      ],
      needs: [
        "Gentle, encouraging tools to rebuild self-trust",
        "A safe space to process and be affirmed",
        "Structure that supports emotional healing"
      ],
      resources: [
        {
          title: "Confidence Builder Workbook",
          description: "A practical but heart-centered guide to help you reflect, reset, and reclaim your worth.",
          link: "/products/confidence-workbook",
          type: "download"
        },
        {
          title: "Rebuilding Confidence Blog",
          description: "Real talk and real tools from someone who's been there.",
          link: "/blog/rebuilding-confidence",
          type: "read"
        },
        {
          title: "Confidence Coaching Session",
          description: "Begin your healing work together—without judgment or pressure.",
          link: "/book/confidence-session",
          type: "book"
        }
      ]
    },
    planner: {
      title: "The Planner",
      subtitle: "You're in the Season of Focus & Flow",
      image: "/assets/planner.jpg",
      description: "You're ambitious but carrying too much. Too many tabs open in your brain. Too many to-dos. Too much pressure.",
      experience: [
        "Decision fatigue and chronic overwhelm",
        "Difficulty following through on plans",
        "Guilt about slowing down—even when you need to"
      ],
      needs: [
        "A planning method that aligns with your natural flow",
        "Boundaries around time and energy",
        "Encouragement to celebrate small wins"
      ],
      resources: [
        {
          title: "Gentle Productivity Planner",
          description: "Ditch the hustle and plan based on your energy, not just deadlines.",
          link: "/products/productivity-planner",
          type: "download"
        },
        {
          title: "Gentle Productivity Blog",
          description: "This will feel like a hug and a strategy session.",
          link: "/blog/gentle-productivity",
          type: "read"
        },
        {
          title: "Productivity Reset Session",
          description: "Co-create a custom workflow that brings calm to your calendar.",
          link: "/book/productivity-session",
          type: "book"
        }
      ]
    },
    aligned: {
      title: "The Aligned One",
      subtitle: "You're in the Season of Intentional Living",
      image: "/assets/aligned.jpg",
      description: "You've done the work. Now your desire isn't 'more'—it's maintenance. You want rhythm and rituals that honor your peace.",
      experience: [
        "A craving for simplicity and soul-aligned habits",
        "A need to reconnect with your vision",
        "Tension between your growth and outside expectations"
      ],
      needs: [
        "Daily tools that anchor you in your truth",
        "Supportive community and accountability",
        "Structure that protects your peace"
      ],
      resources: [
        {
          title: "Intentional Living Workbook",
          description: "Design rhythms and boundaries that reflect your values—not the noise.",
          link: "/products/intentional-living",
          type: "download"
        },
        {
          title: "Life Design Blog Series",
          description: "Start with 'How to Build a Life That Feels Like You'.",
          link: "/blog/life-design",
          type: "read"
        },
        {
          title: "Join Our Community",
          description: "Connect with like-minded women choosing alignment over achievement.",
          link: "/community",
          type: "join"
        }
      ]
    }
  };

  const result = results[resultType];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
              YOU ARE: {result.title}
            </span>
          </h1>
          <div className="flex justify-center items-center mb-8">
            <svg className="w-6 h-6 text-[#00337C] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="text-xl text-gray-600 font-medium">{result.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-gray-700 mb-12">
            <p className="text-xl mb-8">{result.description}</p>
            
            {result.questions && (
              <>
                <p className="font-medium text-[#00337C]">You're asking big questions like:</p>
                <ul className="mb-8">
                  {result.questions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 mt-1 mr-3 h-5 w-5 text-[#00337C]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
                <p className="italic mb-8 text-gray-600">This isn't a crisis. It's an awakening. You're in a sacred season of self-inquiry that will form the foundation of your next chapter.</p>
              </>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#F5F9FF] p-6 rounded-xl border border-[#00337C]/20">
                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                  <svg className="w-6 h-6 text-[#00337C] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                  </svg>
                  What You Might Be Experiencing
                </h3>
                <ul className="space-y-3">
                  {result.experience.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 mt-1 mr-3 h-5 w-5 text-[#00337C]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#FFF0F0] p-6 rounded-xl border border-[#B76E79]/20">
                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                  <svg className="w-6 h-6 text-[#B76E79] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  What You Need Right Now
                </h3>
                <ul className="space-y-3">
                  {result.needs.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 mt-1 mr-3 h-5 w-5 text-[#B76E79]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] rounded-2xl p-8 md:p-10 mb-12 border border-[#00337C]/20">
            <h2 className="flex items-center justify-center text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              <svg className="w-8 h-8 text-[#00337C] mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Your Next Step Bundle
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {result.resources.map((resource, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
                  <div className="flex items-center mb-3">
                    {resource.type === 'download' && (
                      <svg className="w-6 h-6 text-[#00337C] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {resource.type === 'read' && (
                      <svg className="w-6 h-6 text-[#00337C] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    )}
                    {resource.type === 'book' && (
                      <svg className="w-6 h-6 text-[#00337C] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    )}
                    {resource.type === 'join' && (
                      <svg className="w-6 h-6 text-[#B76E79] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                      </svg>
                    )}
                    <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <Link
                    to={resource.link}
                    className={`inline-flex items-center font-medium transition-colors duration-200 ${
                      resource.type === 'join' ? 'text-[#B76E79] hover:text-[#9E5A63]' : 'text-[#00337C] hover:text-[#1E4B9E]'
                    }`}
                  >
                    Get started
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <Link
              to={result.resources[0].link}
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] hover:from-[#1E4B9E] hover:to-[#00337C] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin Your {result.title.includes("Seeker") ? "Rediscovery" : 
                          result.title.includes("Rebuilder") ? "Rebuilding" :
                          result.title.includes("Planner") ? "Planning" : "Alignment"} Journey →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}