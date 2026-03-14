import { NavLink } from "react-router-dom";
import { 
  Home, 
  FileText, 
  CreditCard, 
  Users, 
  ShoppingBag, 
  BookOpen, 
  BarChart3,
  Settings,
  LogOut,
  Package,
  Award,
  HeartHandshake,
  Bell,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { to: "/admin/articles", label: "Articles", icon: <FileText className="w-5 h-5" /> },
    { to: "/admin/ebooks", label: "Ebooks", icon: <BookOpen className="w-5 h-5" /> },
    { to: "/admin/merch", label: "Merchandise", icon: <ShoppingBag className="w-5 h-5" /> },
    { to: "/admin/coaching", label: "Coaching", icon: <Award className="w-5 h-5" /> },
    { to: "/admin/fellowship", label: "Fellowship", icon: <Users className="w-5 h-5" /> },
    { to: "/admin/empowerher", label: "EmpowerHer", icon: <HeartHandshake className="w-5 h-5" /> },
    { to: "/admin/outreach", label: "Outreach", icon: <Package className="w-5 h-5" /> },
    { to: "/admin/cohorts", label: "Cohorts", icon: <Users className="w-5 h-5" /> },
    { to: "/admin/payments", label: "Payments", icon: <CreditCard className="w-5 h-5" /> },
    { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { to: "/admin/notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-[#00337C] via-[#1E4B9E] to-[#00337C] text-white p-6 flex flex-col border-r border-[#00337C]/30">
      {/* Logo/Brand */}
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-light tracking-tight">Build Your Best Self</h2>
            <p className="text-xs text-white/60">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <div className={`${item.to.includes('/admin/dashboard') ? 'text-white' : 'text-white/70'}`}>
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-6 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4A5A5] flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-white/60 truncate">admin@buildyourbestself.com</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Version Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          BYBS Admin v1.0.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;