import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LogOut,
  BookOpen,
  DollarSign,
  Users,
  Settings,
  Home,
  BarChart3,
  FileText,
  Shield,
  ChevronRight,
  ShoppingBag,
  GraduationCap,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const Sidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!admin) return null;

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      exact: true
    },
    {
      path: "/admin/articles",
      label: "Articles",
      icon: <FileText className="w-5 h-5" />,
      
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: <DollarSign className="w-5 h-5" />,
    
    },

    {
      path: "/admin/charity-merch",
      label: "Charity Merch",
      icon: <Heart className="w-5 h-5" />,
    },
   
   
    {
      path: "/admin/cohorts",
      label: "Cohorts",
      icon: <GraduationCap className="w-5 h-5" />,
      
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      path: "/admin/waitlist",
      label: "Waitlist",
      icon: <BarChart3 className="w-5 h-5" />
    }, 

    {
      path: "/admin/subscribers",
      label: "Subscribers",
      icon: <Users className="w-5 h-5" />
    }
  ];

  const toggleMenu = (path) => {
    setExpandedMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleNavClick = (item) => {
    if (item.children && isMobile) {
      toggleMenu(item.path);
    } else if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Mobile Toggle Button
  const MobileToggle = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white p-2 rounded-lg shadow-lg"
    >
      {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex items-center justify-center shadow-lg flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-light tracking-tight truncate">BYBS Admin</h1>
            <p className="text-xs text-gray-400 hidden md:block">Content Management System</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4A5A5] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {admin.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin.role}</p>
              <p className="text-xs text-gray-400 truncate">{admin.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 md:py-6">
        <div className="px-2 md:px-4 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const expanded = expandedMenus[item.path] || (active && !isMobile);
            
            return (
              <div key={item.path} className="mb-1">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={() => handleNavClick(item)}
                  className={({ isActive: navActive }) =>
                    `flex items-center justify-between px-3 md:px-4 py-3 rounded-lg transition-all duration-200 group ${
                      navActive
                        ? 'bg-gradient-to-r from-[#00337C]/20 to-[#1E4B9E]/20 text-white border-l-2 md:border-l-4 border-[#00337C]'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div className={`transition-colors ${active ? 'text-[#00337C]' : 'text-gray-400 group-hover:text-[#00337C]'}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </div>
                  {item.children && (
                    <div className="flex items-center">
                      {isMobile ? (
                        expanded ? (
                          <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-2" />
                        )
                      ) : (
                        <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                      )}
                    </div>
                  )}
                </NavLink>
                
                {/* Submenu */}
                <AnimatePresence>
                  {item.children && expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`ml-3 md:ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3 md:pl-4 ${isMobile ? 'overflow-hidden' : ''}`}
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end
                          onClick={() => isMobile && setIsMobileOpen(false)}
                          className={({ isActive: childActive }) =>
                            `block py-2 px-3 text-xs rounded transition-all duration-200 ${
                              childActive
                                ? 'text-[#00337C] font-medium bg-[#00337C]/10'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 md:p-6 border-t border-gray-700 space-y-4">
        {/* Help Section */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-[#B76E79] flex-shrink-0" />
            <span className="text-xs font-medium">Need Help?</span>
          </div>
          <a
            href="mailto:admin@buildyourbestselfblog.com"
            className="text-xs text-gray-400 hover:text-white transition-colors block truncate"
          >
            admin@buildyourbestselfblog.com
          </a>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-90 transition-transform flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* Version Info */}
        <div className="pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            CMS v2.1 • BYBS Admin
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileToggle />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile && !isMobileOpen ? "-100%" : 0
        }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl border-r border-gray-700 ${
          isMobile ? "w-64" : "w-64"
        }`}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};

export default Sidebar;