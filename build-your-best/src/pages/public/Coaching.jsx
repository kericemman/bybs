// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import CoachingCheckout from './Cart2';
// import { Link } from 'react-router-dom';


// export default function CoachingPackages() {
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     const [selectedPackage, setSelectedPackage] = useState(null);
//     const [showCheckout, setShowCheckout] = useState(false);

//     const packages = [
//         {
//             name: "Clarity Boost",
//             price: "$35",
//             description: "A single powerful session to gain immediate clarity on your most pressing challenge.",
//             features: [
//                 "60-minute 1:1 session",
//                 "Customized action plan",
//                 "Email follow-up",
//                 "Perfect for quick breakthroughs"
//             ],
//             popular: false,
//             link: "/book/clarity-boost",
//             quantity: 1,
//             type: "coaching"
//         },
//         {
//             name: "Transformation Journey",
//             price: "$165",
//             description: "Deep six-session container for holistic personal transformation.",
//             features: [
//                 "Six 60-minute sessions",
//                 "Comprehensive assessment",
//                 "Weekly check-ins",
//                 "Custom resources",
//                 "Priority email access"
//             ],
//             popular: true,
//             quantity: 1,
//             type: "coaching"
//         },
//         {
//             name: "Breakthrough Bundle",
//             price: "$90",
//             description: "Three sessions to create momentum and sustainable change in one key area.",
//             features: [
//                 "Three 60-minute sessions",
//                 "Personalized growth plan",
//                 "Between-session support",
//                 "Accountability structure"
//             ],
//             popular: false,
//             link: "/book/breakthrough-bundle",
//             quantity: 1,
//             type: "coaching"
//         },
        
       
//     ];

//     const handleBookNow = (pkg) => {
//         if (!pkg.comingSoon) {
//             setSelectedPackage({
//                 ...pkg,
//                 price: parseFloat(pkg.price.replace('$', '').replace('/session', ''))
//             });
//             setShowCheckout(true);
//         }
//     };

//     if (showCheckout && selectedPackage) {
//         return <CoachingCheckout selectedProduct={selectedPackage} />;
//     }

//     return (
//         <div className="bg-white">
//             {/* Hero Section */}
//             <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                     <motion.h1
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6 }}
//                         className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
//                     >
//                         <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
//                             Coaching Packages
//                         </span>
//                     </motion.h1>
//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, delay: 0.2 }}
//                         className="text-xl text-gray-600 max-w-3xl mx-auto"
//                     >
//                         Choose the support that matches where you are and where you want to go
//                     </motion.p>
//                 </div>
//             </section>

//             {/* Packages Grid */}
//             <section className="relative py-16 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         whileInView={{ opacity: 1 }}
//                         transition={{ duration: 0.6 }}
//                         viewport={{ once: true }}
//                         className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//                     >
//                         {packages.map((pkg, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 viewport={{ once: true }}
//                                 className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${pkg.popular ? 'ring-2 ring-[#00337C]' : ''}`}
//                             >
//                                 {pkg.popular && (
//                                     <div className="absolute top-0 right-0 bg-[#00337C] text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
//                                         Most Popular
//                                     </div>
//                                 )}
//                                 {pkg.comingSoon && (
//                                     <div className="absolute top-0 right-0 bg-gray-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
//                                         Coming Soon
//                                     </div>
//                                 )}
//                                 <div className="bg-white p-8 h-full flex flex-col">
//                                     <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
//                                     <p className="text-[#00337C] text-xl font-medium mb-4">{pkg.price}</p>
//                                     <p className="text-gray-600 mb-6">{pkg.description}</p>
//                                     <ul className="space-y-3 mb-8 flex-grow">
//                                         {pkg.features.map((feature, i) => (
//                                             <li key={i} className="flex items-start">
//                                                 <svg className="flex-shrink-0 mt-1 mr-3 h-5 w-5 text-[#00337C]" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                                 </svg>
//                                                 <span className="text-gray-700">{feature}</span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                     <motion.button
//                                         whileHover={{ scale: 1.03 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         onClick={() => handleBookNow(pkg)}
//                                         className={`mt-auto w-full text-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
//                                             pkg.comingSoon 
//                                                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
//                                                 : 'bg-gradient-to-r from-[#00337C] to-[#1E4B9E] hover:from-[#1E4B9E] hover:to-[#00337C] text-white shadow-lg'
//                                         }`}
//                                     >
//                                         {pkg.comingSoon ? 'Join Waitlist' : 'Book Now'}
//                                     </motion.button>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </motion.div>
//                 </div>
//             </section>

//             {/* Comparison Table */}
//             <section className="relative py-16 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         whileInView={{ opacity: 1 }}
//                         transition={{ duration: 0.6 }}
//                         viewport={{ once: true }}
//                         className="text-center mb-16"
//                     >
//                         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Package Comparison</h2>
//                         <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto"></div>
//                     </motion.div>

//                     <div className="overflow-x-auto">
//                         <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
//                             <thead>
//                                 <tr className="bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white">
//                                     <th className="py-4 px-6 text-left">Feature</th>
//                                     <th className="py-4 px-6 text-center">Clarity Boost</th>
//                                     <th className="py-4 px-6 text-center">Breakthrough Bundle</th>
//                                     <th className="py-4 px-6 text-center">Transformation</th>
                                    
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                                 {[
//                                     { feature: 'Session Length', values: ['60 min', '3x60 min', '6x60 min', ] },
//                                     { feature: 'Between-session Support', values: ['Email', 'Email + Texts', 'Priority Email'] },
//                                     { feature: 'Custom Resources', values: ['✓', '✓', '✓'] },
//                                     { feature: 'Assessment Tools', values: ['-', 'Basic', 'Comprehensive'] },
//                                     { feature: 'Accountability', values: ['-', '✓', '✓', ]},
//                                 ].map((row, rowIndex) => (
//                                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                                         <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
//                                         {row.values.map((value, colIndex) => (
//                                             <td key={colIndex} className="py-4 px-6 text-center text-gray-700">{value}</td>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </section>

//             {/* Final CTA */}
            
//         </div>
//     );
// }


import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CoachingCheckout from './Cart2';

export default function CoachingPackages() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);

    const packages = [
        {
            name: "Clarity Boost",
            price: "$35",
            description: "One honest conversation. One deep breath. One clear next step.",
            subtitle: "For when you need space to breathe and see clearly",
            features: [
                "60-minute 1:1 session",
                "Customized action plan",
                "Email follow-up",
                "Perfect for quick breakthroughs"
            ],
            popular: false,
            quantity: 1,
            type: "coaching"
        },
        {
            name: "Breakthrough Bundle",
            price: "$90",
            description: "Three sessions to create momentum and sustainable change in one key area.",
            subtitle: "For real change that sticks",
            features: [
                "Three 60-minute sessions",
                "Personalized growth plan",
                "Between-session support",
                "Accountability structure"
            ],
            popular: false,
            quantity: 1,
            type: "coaching"
        },
        {
            name: "Transformation Journey",
            price: "$165",
            description: "Deep six-session container for holistic personal transformation.",
            subtitle: "For rewriting your story on your own terms",
            features: [
                "Six 60-minute sessions",
                "Comprehensive assessment",
                "Weekly check-ins",
                "Custom resources",
                "Priority email access"
            ],
            popular: true,
            quantity: 1,
            type: "coaching"
        },
    ];

    const handleBookNow = (pkg) => {
        setSelectedPackage({
            ...pkg,
            price: parseFloat(pkg.price.replace('$', ''))
        });
        setShowCheckout(true);
    };

    if (showCheckout && selectedPackage) {
        return <CoachingCheckout selectedProduct={selectedPackage} />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-5 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                   

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200 mb-20"></div>

                    {/* Coaching Paths */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl font-light text-[#00337C] mb-4">
                            Coaching Paths You Can Choose
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Each option below is a different level of support, depending on how deep you're ready to go. 
                            None is better than the other—it's about what feels right for your current season.
                        </p>
                    </motion.div>
                </div>

                {/* Packages Grid */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (index * 0.1) }}
                                whileHover={{ y: -8 }}
                                className={`group relative bg-white border border-gray-100 hover:border-[#00337C]/30 transition-all duration-300 flex flex-col h-full ${
                                    pkg.popular ? 'ring-1 ring-[#00337C]' : ''
                                }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                        <div className="bg-[#00337C] text-white px-4 py-1 text-sm font-medium">
                                            Most Popular
                                        </div>
                                    </div>
                                )}
                                
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-light text-[#00337C] mb-2 tracking-tight">
                                            {pkg.name}
                                        </h3>
                                        <p className="text-3xl font-light text-[#B76E79] mb-2">
                                            {pkg.price}
                                        </p>
                                        <p className="text-gray-600 italic mb-4 text-sm">
                                            {pkg.subtitle}
                                        </p>
                                        <p className="text-gray-700 mb-6 leading-relaxed">
                                            {pkg.description}
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {pkg.features.map((feature, i) => (
                                                <li key={i} className="flex items-start text-gray-600">
                                                    <span className="w-1.5 h-1.5 bg-[#00337C] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    <span className="text-sm leading-relaxed">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleBookNow(pkg)}
                                        className="w-full bg-[#00337C] hover:bg-[#1E4B9E] text-white py-3 text-lg font-medium transition-colors duration-200 mt-auto"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Descriptions */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {[
                        {
                            title: "Clarity Boost",
                            subtitle: "For when you're overwhelmed and spinning in your head",
                            description: "You don't have to commit to a whole coaching journey. You just have to take one step—toward peace, toward clarity, toward yourself.",
                            points: [
                                "For when you're stuck between two big decisions",
                                "For when you're holding emotions you haven't fully processed",
                                "For when you feel off—but can't explain why",
                                "For when you need someone to listen and ask the right questions"
                            ],
                            outcome: "Emotional relief, mental clarity, and a personalized Clarity Map"
                        },
                        {
                            title: "Breakthrough Bundle",
                            subtitle: "For when you're tired of doing it alone",
                            description: "This isn't a quick fix. It's a steady, guided shift—from self-doubt to self-trust. From confusion to aligned action.",
                            points: [
                                "For when you're constantly second-guessing yourself",
                                "For when fear, perfectionism, or people-pleasing gets in the way",
                                "For when you're going through a transition",
                                "For when you want to shift how you show up in life"
                            ],
                            outcome: "Clarity, personalized growth map, gentle accountability, and tools for lasting change"
                        },
                        {
                            title: "Transformation Journey",
                            subtitle: "For when you've outgrown your old story",
                            description: "This is not about becoming someone new. It's about coming home to yourself—with more truth, gentleness, and power than ever before.",
                            points: [
                                "For navigating life transitions",
                                "For rebuilding confidence and self-trust",
                                "For when you're tired of just 'coping'",
                                "For when you're ready to live with clarity and intention"
                            ],
                            outcome: "Full personal growth assessment, emotional release, mindset rewiring, and comprehensive support"
                        }
                    ].map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`mb-16 ${index < 2 ? 'pb-16 border-b border-gray-200' : ''}`}
                        >
                            <h3 className="text-2xl font-light text-[#00337C] mb-2">{section.title}</h3>
                            <p className="text-gray-600 italic mb-6">{section.subtitle}</p>
                            <p className="text-gray-700 leading-relaxed mb-6">{section.description}</p>
                            
                            <div className="mb-6">
                                <h4 className="text-lg font-light text-[#00337C] mb-3">This is for you if:</h4>
                                <ul className="space-y-2">
                                    {section.points.map((point, i) => (
                                        <li key={i} className="flex items-start text-gray-700">
                                            <span className="w-1.5 h-1.5 bg-[#B76E79] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="bg-white border border-gray-100 p-6">
                                <h4 className="text-lg font-light text-[#00337C] mb-3">What you'll walk away with:</h4>
                                <p className="text-gray-700 leading-relaxed">{section.outcome}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            
        </div>
    );
}

