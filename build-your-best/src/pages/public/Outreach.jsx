import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, Users, Target, ArrowRight, Star, Award, Briefcase, Sparkles, ChevronRight, Calendar, HandHeart, BookOpen, Building, Globe, Gift } from 'lucide-react';

export default function CommunityOutreach() {
    const [activeInitiative, setActiveInitiative] = useState(0);
    const [showVolunteerForm, setShowVolunteerForm] = useState(false);
    const [volunteerData, setVolunteerData] = useState({ name: '', email: '', interest: '', message: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleVolunteerSubmit = (e) => {
        e.preventDefault();
        console.log('Volunteer form submitted:', volunteerData);
        setShowVolunteerForm(false);
        setVolunteerData({ name: '', email: '', interest: '', message: '' });
        alert('Thank you for your interest in volunteering! We will contact you soon.');
    };

    const initiatives = [
        {
            id: 1,
            icon: <Gift className="w-8 h-8" />,
            title: "Hospital Donations & Care Drives",
            subtitle: "Supporting Mothers & Newborns",
            description: "Providing essential supplies and emotional support to vulnerable families during important life transitions.",
            impact: "Recently reached 50+ women in maternity wards",
            features: [
                "Baby care kits distribution",
                "Hygiene essential supplies",
                "Emotional support packages",
                "Postnatal care resources",
                "Hope & encouragement outreach"
            ],
            color: "from-[#B76E79] to-[#D4A5A5]",
            image: "hospital-care"
        },
        {
            id: 2,
            icon: <BookOpen className="w-8 h-8" />,
            title: "Wellness & Resilience Workshops",
            subtitle: "Empowering Through Education",
            description: "Interactive sessions helping youth and professionals navigate life's pressures with clarity and confidence.",
            impact: "Transforming stress into strength through practical tools",
            features: [
                "Stress management techniques",
                "Emotional resilience building",
                "Mindfulness practices",
                "Self-awareness development",
                "Healthy coping strategies"
            ],
            color: "from-[#00337C] to-[#1E4B9E]",
            image: "wellness-workshops"
        },
        {
            id: 3,
            icon: <Users className="w-8 h-8" />,
            title: "Volunteer Mentorship Partnerships",
            subtitle: "Guiding Future Leaders",
            description: "Collaborative programs with schools and community groups to foster personal and professional growth.",
            impact: "Building bridges between potential and opportunity",
            features: [
                "Career readiness guidance",
                "Personal development coaching",
                "Life skills training",
                "Goal setting workshops",
                "Confidence building sessions"
            ],
            color: "from-[#06D6A0] to-[#83F9C0]",
            image: "mentorship"
        }
    ];

    const stats = [
        { number: "100+", label: "Lives Touched", icon: <Heart className="w-6 h-6" /> },
        { number: "3+", label: "Community Partners", icon: <Building className="w-6 h-6" /> },
        { number: "5+", label: "Outreach Events", icon: <Calendar className="w-6 h-6" /> },
        { number: "50+", label: "Trained Volunteers", icon: <Users className="w-6 h-6" /> }
    ];

    const recentActivities = [
        { title: "Maternal Care Drive", location: "Juba Teaching Hospital", date: "Sep 2025", impact: "Supported 50+ new mothers" },
        { title: "Youth Resilience Workshop", location: "Community Secondary School", date: "February 2024", impact: "Empowered 100+ students" },
        { title: "Career Mentorship Program", location: "Women's Development Center", date: "January 2024", impact: "Mentored 30+ young women" }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-8 bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFD166] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#06D6A0] rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
                            <Globe className="w-4 h-4 mr-2" />
                            <span>Build Your Best Self Initiative</span>
                        </div>
                        
                        <h1 className="text-3xl md:text-6xl font-light mb-6 leading-tight">
                            Community & Outreach 
                            <span className="px-3 font-bold bg-gradient-to-r from-[#FFD166] to-[#B76E79] bg-clip-text text-transparent">
                                Initiatives
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                            Extending Transformation Beyond the Individual
                        </p>
                        
                        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Bridging personal empowerment with collective wellbeing, creating ripples of 
                            positive change in homes, schools, workplaces, and communities.
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => setShowVolunteerForm(true)}
                            className="px-8 py-4 bg-white text-[#00337C] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Volunteer With Us
                        </button>
                       
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-2xl font-light text-[#00337C] mb-6">
                                Where Personal Growth Meets<br />Collective Impact
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mb-8"></div>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                At Build Your Best Self, transformation doesn't stop with personal growth — 
                                it extends outward into homes, schools, workplaces, and communities.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                We believe that when people begin to heal, grow, and discover their inner strength, 
                                they naturally become catalysts for positive change around them.
                            </p>
                            <div className="bg-gradient-to-r from-[#F5F9FF] to-[#FFF0F0] p-6 rounded-xl border-l-4 border-[#00337C]">
                                <p className="text-gray-700 italic">
                                    "Every workshop, mentorship session, or donation drive strengthens the collective 
                                    spirit, bridges gaps, and builds healthier, more resilient communities."
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg border border-gray-100 text-center"
                                    >
                                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex items-center justify-center text-white mb-4">
                                            {stat.icon}
                                        </div>
                                        <div className="text-3xl font-bold text-[#00337C] mb-1">{stat.number}</div>
                                        <div className="text-gray-700 font-medium">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Initiatives Showcase */}
            <section id="initiatives" className="py-8 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl md:text-3xl font-light text-[#00337C] mb-4">
                            Our Community Initiatives
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Three pathways to create meaningful impact and foster collective wellbeing
                        </p>
                    </motion.div>
                    
                    {/* Initiative Tabs */}
                    <div className="mb-12">
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {initiatives.map((initiative, index) => (
                                <button
                                    key={initiative.id}
                                    onClick={() => setActiveInitiative(index)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                                        activeInitiative === index
                                            ? 'bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    
                                    {initiative.title}
                                </button>
                            ))}
                        </div>
                        
                        {/* Active Initiative Details */}
                        <motion.div
                            key={activeInitiative}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                        >
                            
                            <div className="p-8 md:p-12">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        
                                        
                                        <h3 className="text-2xl font-light text-gray-900 mb-2">
                                            {initiatives[activeInitiative].title}
                                        </h3>
                                        <p className="text-[#B76E79] font-medium text-lg mb-4">
                                            {initiatives[activeInitiative].subtitle}
                                        </p>
                                        
                                        <p className="text-gray-600 mb-8 leading-relaxed">
                                            {initiatives[activeInitiative].description}
                                        </p>
                                        
                                        <div className="mb-8">
                                            <h4 className="text-lg font-medium text-[#00337C] mb-4">What We Do:</h4>
                                            <ul className="space-y-3">
                                                {initiatives[activeInitiative].features.map((feature, i) => (
                                                    <li key={i} className="flex items-start text-gray-700">
                                                        <div className="w-2 h-2 bg-[#00337C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-[#F5F9FF] to-white p-6 rounded-xl border border-gray-100">
                                            <p className="text-gray-700 font-medium">
                                                <span className="text-[#00337C]">Recent Impact: </span>
                                                {initiatives[activeInitiative].impact}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-100 h-full">
                                            <div className="text-center mb-8">
                                                <h4 className="text-xl font-light text-[#00337C] mb-4">Get Involved</h4>
                                                <p className="text-gray-600 mb-6">
                                                    Ready to make a difference through {initiatives[activeInitiative].title.toLowerCase()}?
                                                </p>
                                                <button
                                                    onClick={() => setShowVolunteerForm(true)}
                                                    className="px-6 py-3 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 w-full"
                                                >
                                                    Volunteer for This Initiative
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <h5 className="font-medium text-gray-700">Other Ways to Support:</h5>
                                                {[
                                                    "Donate essential supplies",
                                                    "Sponsor a workshop",
                                                    "Become a mentor",
                                                    "Share your expertise",
                                                    "Host a community event"
                                                ].map((way, index) => (
                                                    <div key={index} className="flex items-center text-gray-600">
                                                        <ArrowRight className="w-4 h-4 mr-3 text-[#00337C]" />
                                                        <span>{way}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Recent Activities */}
            <section className="py-8 bg-gradient-to-br from-[#F5F9FF] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-light text-[#00337C] mb-4">
                            Recent Community Impact
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Real stories of transformation and community building
                        </p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {recentActivities.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="p-8">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex items-center justify-center text-white mb-6">
                                        {index === 0 ? <Gift className="w-6 h-6" /> : 
                                         index === 1 ? <BookOpen className="w-6 h-6" /> : 
                                         <Users className="w-6 h-6" />}
                                    </div>
                                    
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">{activity.title}</h3>
                                    <p className="text-gray-600 mb-4">{activity.location}</p>
                                    
                                    <div className="flex items-center justify-between mb-6">
                                        
                                        <span className="text-[#B76E79] font-medium">{activity.impact}</span>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-gray-600 text-sm">
                                            Creating positive impact and fostering community resilience through meaningful outreach.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ripple Effect Section */}
            <section className="py-20 bg-gradient-to-br from-[#00337C] to-[#1E4B9E] text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-8">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        
                        <h2 className="text-2xl md:text-4xl font-light mb-6">
                            A Ripple Effect of Hope
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-white to-[#FFD166] mx-auto mb-8"></div>
                        
                        
                        <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto italic">
                            "At BYBS, we are committed to ensuring that empowerment flows outward, 
                            touching lives and inspiring change wherever it goes."
                        </p>
                        
                        <button
                            onClick={() => setShowVolunteerForm(true)}
                            className="px-10 py-4 bg-white text-[#00337C] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg inline-flex items-center"
                        >
                            Create Your Ripple Effect
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Volunteer Modal */}
            {showVolunteerForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full"
                    >
                        <h3 className="text-2xl font-light text-[#00337C] mb-4">Join Our Volunteer Team</h3>
                        <p className="text-gray-600 mb-6">
                            Tell us about yourself and how you'd like to contribute to our community initiatives.
                        </p>
                        
                        <form onSubmit={handleVolunteerSubmit}>
                            <input
                                type="text"
                                value={volunteerData.name}
                                onChange={(e) => setVolunteerData({...volunteerData, name: e.target.value})}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            />
                            
                            <input
                                type="email"
                                value={volunteerData.email}
                                onChange={(e) => setVolunteerData({...volunteerData, email: e.target.value})}
                                placeholder="Your Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            />
                            
                            <select
                                value={volunteerData.interest}
                                onChange={(e) => setVolunteerData({...volunteerData, interest: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            >
                                <option value="">Primary Interest Area</option>
                                <option value="hospital-care">Hospital Donations & Care Drives</option>
                                <option value="wellness-workshops">Wellness & Resilience Workshops</option>
                                <option value="mentorship">Volunteer Mentorship</option>
                                <option value="all">All Initiatives</option>
                            </select>
                            
                            <textarea
                                value={volunteerData.message}
                                onChange={(e) => setVolunteerData({...volunteerData, message: e.target.value})}
                                placeholder="Why do you want to volunteer with us? What skills or experience can you share?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 h-32"
                                required
                            />
                            
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#00337C] text-white py-3 rounded-lg font-medium"
                                >
                                    Submit Application
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowVolunteerForm(false)}
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