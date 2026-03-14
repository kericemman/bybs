import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../../library/supabaseClient'; // Adjust path as needed

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Insert into your 'subscribers' table
      const { error } = await supabase
        .from('subscribers')
        .insert([{ 
          email: email,
          subscribed_at: new Date().toISOString(),
          source: 'website_cta'
        }]);

      if (error) throw error;

      setMessage({ 
        text: 'Thanks for subscribing! Check your email for confirmation.', 
        type: 'success' 
      });
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ 
        text: error.message || 'Subscription failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-white py-5 md:py-14 overflow-hidden">
      {/* Background elements remain the same */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F7D9D9] opacity-20 mix-blend-multiply filter blur-3xl -translate-x-1/3 -translate-y-1/3 animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#00337C] opacity-10 mix-blend-multiply filter blur-3xl translate-x-1/3 translate-y-1/3 animate-float"></div>
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] p-8 md:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#00337C]/20"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#00337C] mb-6">Ready for 1:1 Support?</h3>
            <p className="text-gray-700 mb-8 text-l">
              Book a coaching session today and let's create a <span className="font-semibold">personalized plan</span> that fits your life, goals, and growth pace.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#00337C] to-[#1E4B9E] hover:from-[#1E4B9E] hover:to-[#00337C] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                Book a Session
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </span>
            </motion.button>
          </motion.div>

        {/* Mailing List CTA - Updated */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#FFF0F0] to-[#F5F9FF] p-8 md:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#B76E79]/20"
        >
          <h3 className="text-lg md:text-xl font-bold text-[#B76E79] mb-6">Not Quite Ready?</h3>
          <p className="text-gray-700 mb-6 text-l">
            Get <span className="font-semibold">weekly insights</span>, tools, and motivation delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address" 
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00337C] focus:border-transparent text-gray-700"
              required
            />
            
            {message.text && (
              <p className={`text-sm ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {message.text}
              </p>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#B76E79] to-[#C66D02] hover:from-[#C66D02] hover:to-[#B76E79] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Join the Mailing List'}
            </motion.button>
          </form>
        </motion.div>

      
      </div>
      </div>
    </section>
  );
}