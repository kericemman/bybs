import { motion } from 'framer-motion';
import WaitlistModal from "../../components/modal/WaitlistModal";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Calendar, Target, Heart, Star, Award, ChevronRight, Sparkles } from 'lucide-react';

export default function FellowshipLanding() {
    const [waitlistOpen, setWaitlistOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        "Weekly guided sessions with trained facilitators",
        "Personal mentorship and coaching",
        "Interactive self-discovery exercises",
        "Supportive community of like-minded individuals",
        "Lifetime access to fellowship resources",
        "Graduation certificate and celebration ceremony"
    ];

    const pillars = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Emotional Intelligence & Self-Awareness",
            description: "Understand your emotions, patterns, and inner beliefs shaping your decisions.",
            color: "bg-gradient-to-br from-[#B76E79] to-[#D4A5A5]"
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Mindset Transformation & Resilience",
            description: "Shift from survival mode to growth mode with confidence-building habits.",
            color: "bg-gradient-to-br from-[#00337C] to-[#1E4B9E]"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Purpose Discovery & Goal Setting",
            description: "Reconnect with your strengths and create aligned, meaningful goals.",
            color: "bg-gradient-to-br from-[#FFD166] to-[#FFE8A5]"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Intentional Living & Leadership",
            description: "Live with clarity and lead from the inside out with daily habits.",
            color: "bg-gradient-to-br from-[#06D6A0] to-[#83F9C0]"
        }
    ];

    const journeyPhases = [
        {
            title: "Foundation & Self-Discovery",
            description: "Build emotional intelligence and self-awareness foundations",
            period: "Weeks 1-4"
        },
        {
            title: "Mindset Reset & Resilience Building",
            description: "Transform limiting beliefs and build confidence",
            period: "Weeks 5-8"
        },
        {
            title: "Purpose Alignment & Leadership",
            description: "Define your vision and step into personal leadership",
            period: "Weeks 9-12"
        },
        {
            title: "Celebration & Integration",
            description: "Reflect on growth and step boldly into your next chapter",
            period: "Graduation"
        }
    ];

    const readyIfList = [
        "Seeking clarity about who you are and where you're going",
        "Tired of repeating emotional or mindset cycles",
        "Looking for guidance, support, and structured transformation",
        "Ready to heal, evolve, and live intentionally",
        "Committed to showing up for yourself consistently"
    ];

    const promiseList = [
        "A stronger sense of self and emotional clarity",
        "A mindset rooted in resilience and possibility",
        "Goals that align with your future, not your fears",
        "A community that sees you and grows with you",
        "A renewed belief in your capacity to thrive"
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-[#B76E79] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD166] rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span>Build Your Best Self Fellowship</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
                            Applications Are Currently{' '}
                            <span className="font-bold bg-gradient-to-r from-[#FFD166] to-[#B76E79] bg-clip-text text-transparent">
                                Closed
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                            The next cohort will open soon. Join our waitlist and be the first to know when applications reopen.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setWaitlistOpen(true)}
                                className="px-8 py-4 bg-white text-[#00337C] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Join the Waitlist
                            </button>

                            <Link
                                to="/cohorts"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#00337C] transition-all duration-300 transform hover:scale-105"
                            >
                                View Previous Cohorts
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What Makes It Unique */}
            <section className="py-5 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-4xl font-light text-[#00337C] mb-4">
                            What Makes This Fellowship Unique
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            A signature fellowship blending self-awareness, mindset re-alignment, emotional mastery, 
                            and purposeful living into an interactive learning journey.
                        </p>
                    </motion.div>
                    
                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-[#00337C] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-gray-700">{benefit}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Four Pillars */}
            <section className="py-5 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-4xl font-light text-[#00337C] mb-4">
                            The Four Pillars of Transformation
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`h-2 ${pillar.color}`}></div>
                                <div className="p-8">
                                    <div className={`w-12 h-12 rounded-full ${pillar.color} flex items-center justify-center text-white mb-6`}>
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-3">{pillar.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Flow */}
            <section className="py-5 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-4xl font-light text-[#00337C] mb-4">
                            Your 3-Month Journey
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {journeyPhases.map((phase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-xl p-6 border border-gray-100 relative"
                            >
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-[#00337C] to-[#B76E79] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-[#B76E79]">{phase.period}</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{phase.title}</h3>
                                <p className="text-sm text-gray-600">{phase.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who It's For */}
            <section className="py-5 bg-gradient-to-br from-gray-50 to-[#F5F9FF]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-4xl font-light text-[#00337C] mb-4">
                            Who This Fellowship Is For
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            This program is designed for women and youth who are ready for deep transformation.
                        </p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <h3 className="text-2xl font-light text-[#00337C] mb-6">You're Ready If:</h3>
                            <ul className="space-y-4">
                                {readyIfList.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="w-6 h-6 bg-[#00337C] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-[#00337C] to-[#1E4B9E] p-8 rounded-2xl text-white"
                        >
                            <h3 className="text-2xl font-light mb-6">The Promise</h3>
                            <p className="text-white/90 leading-relaxed mb-6">
                                By the end of 3 months, you'll walk away with:
                            </p>
                            <ul className="space-y-3">
                                {promiseList.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-5 bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-4xl font-light mb-6">
                            Ready to Begin Your Transformation?
                        </h2>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Apply for the next Cohort and take the first step towards building your best self.
                        </p>
                        
                        <button
                                onClick={() => setWaitlistOpen(true)}
                                className="px-8 py-4 bg-white text-[#00337C] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Join the Waitlist
                            </button>
                        
                        <p className="text-white/70 mt-6 text-sm">
                            Limited spots available. Early registrants receive priority access.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Waitlist Modal */}
            <WaitlistModal
                open={waitlistOpen}
                onClose={() => setWaitlistOpen(false)}
            />
        </div>
    );
}