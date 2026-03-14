import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, Users, Target, ArrowRight, Star, Award, Briefcase, Sparkles, ChevronRight, Calendar } from 'lucide-react';

export default function EmpowerHerInitiative() {
    const [showContact, setShowContact] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        setShowContact(false);
        setFormData({ name: '', email: '', message: '' });
        alert('Thank you for your interest! We will contact you soon.');
    };

    const threeStepModel = [
        {
            number: "01",
            title: "Mindset Preparation",
            subtitle: "Building Inner Foundation",
            description: "Transformative sessions focused on self-awareness, confidence, and overcoming limiting beliefs before skill training begins.",
            features: [
                "Self-awareness & identity work",
                "Confidence-building exercises",
                "Overcoming limiting beliefs",
                "Goal setting and clarity",
                "Resilience mindset training"
            ],
            icon: <Heart className="w-8 h-8" />,
            color: "from-[#B76E79] to-[#D4A5A5]"
        },
        {
            number: "02",
            title: "Skill Training Partnerships",
            subtitle: "Practical Capacity Building",
            description: "Partnerships with trusted vocational trainers in income-generating skills for sustainable economic growth.",
            features: [
                "Baking & food production",
                "Tailoring & fashion skills",
                "Handcrafts & creative arts",
                "ICT basics & digital literacy",
                "Small business management"
            ],
            icon: <Briefcase className="w-8 h-8" />,
            color: "from-[#00337C] to-[#1E4B9E]"
        },
        {
            number: "03",
            title: "Startup Support",
            subtitle: "From Learning to Launching",
            description: "Comprehensive support system ensuring graduates don't just learn — they successfully launch and grow.",
            features: [
                "Mentorship from experienced entrepreneurs",
                "Business setup guidance",
                "Pricing & marketing strategies",
                "Starter kits for selected participants",
                "Ongoing community support"
            ],
            icon: <Target className="w-8 h-8" />,
            color: "from-[#06D6A0] to-[#83F9C0]"
        }
    ];

    const impactStats = [
        { number: "100+", label: "Women Empowered", description: "Across multiple communities" },
        { number: "85%", label: "Business Launch Rate", description: "Of trained participants" },
        { number: "3x", label: "Income Increase", description: "Average for graduates" },
        { number: "3+", label: "Partner Organizations", description: "Collaborating for impact" }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-8 bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-[#B76E79] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD166] rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                       <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span>Build Your Best Self Initiative</span>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-light mb-6 leading-tight tracking-tight">
                            Empowerher 
                            <span className="px-3 font-bold bg-gradient-to-r from-[#FFD166] to-[#B76E79] bg-clip-text text-transparent">
                                Initiative
                            </span>
                        </h1>
                        
                        <p className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                            Economic Empowerment for Women, From Inner Strength to Sustainable Impact
                        </p>
                        
                        
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                            The women's economic empowerment arm of Build Your Best Self,
                            strengthening both mindset and skills for women to thrive in today's world.
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                         <button
                            onClick={() => setShowContact(true)}
                            className="px-8 py-4 bg-white text-[#00337C] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Get Involved
                        </button>
                       
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-8 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-2xl font-light text-[#00337C] mb-6">
                                More Than Skills, Starting with the Person
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-[#B76E79] to-[#00337C] mb-8"></div>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Unlike traditional vocational programs that focus only on training, 
                                <span className="font-medium text-[#B76E79]"> EmpowerHer begins with the person behind the skills</span>.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Because when a woman's mindset shifts, her whole life expands. We nurture confidence, 
                                build capacity, and open doors to real economic opportunity — from the inside out.
                            </p>
                            <div className="bg-gradient-to-r from-[#FFF0F0] to-[#F5F9FF] p-6 rounded-xl border-l-4 border-[#B76E79]">
                                <p className="text-gray-700 italic">
                                    "EmpowerHer is not a training center. It's a bridge between a woman's potential and her opportunity."
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] p-8 rounded-2xl shadow-lg">
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { icon: <Heart className="w-6 h-6" />, text: "Inner Growth First", color: "text-[#B76E79]" },
                                        { icon: <Users className="w-6 h-6" />, text: "Community Support", color: "text-[#00337C]" },
                                        { icon: <Target className="w-6 h-6" />, text: "Practical Skills", color: "text-[#06D6A0]" },
                                        { icon: <Award className="w-6 h-6" />, text: "Sustainable Impact", color: "text-[#FFD166]" }
                                    ].map((item, index) => (
                                        <div key={index} className="text-center p-4">
                                            <div className={`w-12 h-12 mx-auto rounded-full ${item.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                                                {item.icon}
                                            </div>
                                            <p className="font-medium text-gray-700">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Three-Step Model */}
            <section id="model" className="py-8 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-light text-[#00337C] mb-4">
                            The Three-Step Empowerment Model
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            A structured approach that nurtures confidence, builds capacity, and creates real economic opportunity.
                        </p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {threeStepModel.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00337C] to-[#B76E79] rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
                                    {step.number}
                                </div>
                                
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                                    
                                    <div className="p-8">
                                        
                                        
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-[#B76E79] font-medium mb-4">{step.subtitle}</p>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                                        
                                        <ul className="space-y-3">
                                            {step.features.map((feature, i) => (
                                                <li key={i} className="flex items-start text-gray-700">
                                                    <div className="w-2 h-2 bg-[#00337C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-8 bg-gradient-to-br from-[#00337C] to-[#1E4B9E] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-light mb-4">Creating Lasting Impact</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-white to-[#FFD166] mx-auto mb-8"></div>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Transforming lives through sustainable economic empowerment
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {impactStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-[#FFD166] bg-clip-text text-transparent">
                                    {stat.number}
                                </div>
                                <div className="text-lg font-medium mb-1">{stat.label}</div>
                                <div className="text-sm text-white/70">{stat.description}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pathway Section */}
            <section className="py-8 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#FFF0F0] to-[#F5F9FF] rounded-2xl p-8 md:p-12 border border-[#B76E79]/20"
                    >
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-light text-[#00337C] mb-6">
                                Where Belief Meets Action
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-[#B76E79] to-[#00337C] mx-auto mb-8"></div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                EmpowerHer supports inner growth, equips with valuable skills, and stands with women 
                                as they take their first steps into entrepreneurship. This creates a ripple effect 
                                in their families and communities.
                            </p>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                                <p className="text-gray-800 text-xl italic">
                                    "The program is intentionally designed to help women thrive both mentally and 
                                    economically — building the futures they deserve."
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setShowContact(true)}
                                    className="px-8 py-3 bg-[#B76E79] text-white font-medium rounded-lg hover:bg-[#D4A5A5] transition-all duration-300 inline-flex items-center justify-center"
                                >
                                    Partner With Us <Users className="ml-2 w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowContact(true)}
                                    className="px-8 py-3 border-2 border-[#00337C] text-[#00337C] font-medium rounded-lg hover:bg-[#00337C]/10 transition-all duration-300 inline-flex items-center justify-center"
                                >
                                    Support a Woman <Heart className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Modal */}
            {showContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full"
                    >
                        <h3 className="text-2xl font-light text-[#00337C] mb-4">Get Involved</h3>
                        <p className="text-gray-600 mb-6">
                            Tell us how you'd like to be part of the EmpowerHer Initiative.
                        </p>
                        
                        <form onSubmit={handleContactSubmit}>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            />
                            
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Your Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            />
                            
                            <select
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            >
                                <option value="">How would you like to be involved?</option>
                                <option value="participant">I want to participate as a woman</option>
                                <option value="partner">I represent an organization/partner</option>
                                <option value="volunteer">I want to volunteer</option>
                                <option value="supporter">I want to support financially</option>
                                <option value="other">Other</option>
                            </select>
                            
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#B76E79] text-white py-3 rounded-lg font-medium"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowContact(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            
           
        </div>
    );
}