import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();


 

   

  return (
    <footer className="bg-gray-800 text-[#F5EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">About BYBS</h3>
            <p className="text-sm">
              Helping women reclaim their power and build the life they deserve through purpose-led coaching and practical tools.
            </p>
            <div className="pt-2">
              <span className="text-2xl font-bold text-white">Build Your Best Self</span>
            </div>
            <p className="italic text-[#B89CA5]">
              "Build your best self, from the inside out."
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Coaching', 'Shop', 'Blogs', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm hover:text-[#1E40AF] transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Resources</h3>
            <ul className="space-y-2">
              {['FAQs', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-').replace('&', 'and')}`}
                    className="text-sm hover:text-[#1E40AF] transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Stay Connected</h3>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium text-[#F7D9D9] mb-3">Connect with us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/buildyourbestself_25?igsh=ZmFjcTlrMDdtc2Fk" 
                  className="text-[#F7D9D9] hover:text-[#1E40AF] transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/share/15rD2aArYn/?mibextid=wwXIfr" 
                  className="text-[#F7D9D9] hover:text-[#1E40AF] transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a 
                  href="https://www.tiktok.com/@buildyourbestselfblog?_t=ZM-8yf0LRoJoT2&_r=1" 
                  className="text-[#F7D9D9] hover:text-[#1E40AF] transition-colors duration-200"
                  aria-label="TikTok"
                >
                  <FaTiktok size={20} />
                </a>
                <a 
                  href="https://wa.me/211921650576" 
                  className="text-[#F7D9D9] hover:text-[#1E40AF] transition-colors duration-200"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={20} />
                </a>
                <a 
                  href="mailto:info@buildyourbestselfblog.com" 
                  className="text-[#F7D9D9] hover:text-[#1E40AF] transition-colors duration-200"
                  aria-label="Email"
                >
                  <HiOutlineMail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex flex-col md:flex-row md:space-x-4 text-center md:text-left">
              <p className='text-gray-900'>© {currentYear} Build Your Best — All rights reserved.</p>
              <div className="hidden md:block text-gray-900">|</div>
              <a href="/privacy" className="text-gray-900 transition-colors duration-200">Privacy Policy</a>
              <div className="hidden md:block text-gray-900">|</div>
              <a href="/terms" className="text-gray-900 transition-colors duration-200">Terms of Service</a>
            </div>
            <p className="mt-2 md:mt-0 text-gray-900">
              Designed by <a href="https://www.linkedin.com/in/emmanuelkerich/">Emmanuel Kerich 😉</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}