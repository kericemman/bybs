import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Coaching', to: '/coaching' },
    { name: 'Articles', to: '/articles' },
    { name: 'Shop', to: '/shop' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-[#F7D9D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo/Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-row items-center group">
              <div className="text-3xl font-bold tracking-tighter text-gray-900 group-hover:text-[#00337C] transition-colors duration-200">
                BYBS
              </div>
              
              <div className="h-8 w-px bg-gray-400 mx-4"></div>
              
              <div className="text-xs lowercase tracking-[0.3em] text-left text-gray-600 whitespace-nowrap group-hover:text-[#00337C] transition-colors duration-200">
                <span>Build Your</span> <br/>
                <span className="ml-1">Best Self</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="relative px-4 py-2 text-[#3A3A3A] hover:text-[#00337C] font-medium rounded-lg transition-all duration-200 group"
              >
                {item.name}
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-[#C66D02] group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300"></span>
              </Link>
            ))}
            <div className="ml-2 pl-4 border-l border-gray-200">
              <a
                href="https://calendly.com/buildyourbestselfblog-info"
                className="flex items-center gap-2 bg-gradient-to-r from-[#00337C] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#00337C] text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                Book Session
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#3A3A3A] hover:text-[#C66D02] focus:outline-none transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-2 pb-6 px-4 space-y-2 bg-white shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="block px-4 py-3 text-[#3A3A3A] hover:text-[#00337C] hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="https://calendly.com/buildyourbestselfblog-info"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#00337C] to-[#1E40AF] text-white px-4 py-3.5 rounded-lg font-medium mt-2 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Book a Session
            <FiArrowRight />
          </a>
        </div>
      </div>
    </nav>
  );
}