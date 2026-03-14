import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function CommunityPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
                            Join Our Community
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Growth is better together. Find support, inspiration, and accountability in our community.
                    </motion.p>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="relative py-5 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="prose prose-lg text-gray-700 mb-10 text-center mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Join Us?</h2>
                        <p className="text-xl">
                            The Build Your Best Self community is a safe space for women committed to intentional growth. 
                            Here you'll find like-minded women sharing resources, celebrating wins, and supporting each 
                            other through challenges.
                        </p>
                    </motion.div>

                    {/* Community Description */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] rounded-2xl p-8 md:p-10 mb-16 border border-[#00337C]/20"
                    >
                        <h3 className="text-2xl font-bold text-[#00337C] mb-6 text-start md:text-center">Who This Community Is For</h3>
                        <ul className="grid md:grid-cols-2 gap-6">
                            {[
                                "Women seeking meaningful connections",
                                "Those tired of going it alone",
                                "Anyone craving accountability",
                                "Women ready to invest in their growth",
                                "Those who value safe, supportive spaces",
                                "Women at all stages of their journey"
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-start"
                                >
                                    <div className="flex-shrink-0 mt-1 mr-4 text-[#00337C]">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-lg text-gray-700">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Join Options */}
            <section className="relative py-5 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ways to Connect</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto"></div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Email List Option */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#00337C]/20"
                        >
                            <div className="p-8">
                                <div className="flex justify-center mb-6">
                                    <svg className="w-12 h-12 text-[#00337C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Join Our Email List</h3>
                                <p className="text-gray-600 mb-6">
                                    Get weekly inspiration, resources, and exclusive content. Sign up and receive our free 
                                    <span className="font-semibold text-[#00337C]"> "5-Day Self-Discovery Guide"</span> as a welcome gift.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-[#00337C] to-[#1E4B9E] hover:from-[#1E4B9E] hover:to-[#00337C] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg"
                                >
                                    Join Mailing List
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* WhatsApp Option */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#B76E79]/20"
                        >
                            <div className="p-8">
                                <div className="flex justify-center mb-6">
                                    <svg className="w-12 h-12 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">WhatsApp Community</h3>
                                <p className="text-gray-600 mb-6">
                                    Join our private chat group for daily motivation, quick tips, and real-time support 
                                    from Brenda and fellow members.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full border-2 border-[#00337C] text-[#00337C] hover:bg-[#00337C]/10 px-6 py-3 rounded-xl font-bold transition-all duration-300"
                                >
                                    Request to Join Chat Group
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Social Media */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Connect On Social Media</h3>
                        <div className="flex justify-center gap-6">
                            {[
                                { 
                                    icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z", 
                                    name: "Facebook", 
                                    url: "https://www.facebook.com/share/15rD2aArYn/?mibextid=wwXIfr",
                                    color: "from-[#1877F2] to-[#00337C]"
                                },
                                { 
                                    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", 
                                    name: "Instagram", 
                                    url: "https://www.instagram.com/buildyourbestself_25?igsh=ZmFjcTlrMDdtc2Fk",
                                    color: "from-[#E1306C] to-[#B76E79]"
                                }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`bg-gradient-to-br ${social.color} p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
                                >
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">{social.name}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}