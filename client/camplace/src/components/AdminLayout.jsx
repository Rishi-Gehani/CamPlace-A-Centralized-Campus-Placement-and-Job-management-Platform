import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  BarChart3, 
  UserCircle, 
  LogOut,
  Shield,
  Menu,
  X,
  History,
  MessageSquare,
  Bell
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "motion/react";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Jobs & Internships", path: "/admin/jobs", icon: Briefcase },
    { name: "Applications", path: "/admin/applications", icon: FileText },
    { name: "Placement Records", path: "/admin/records", icon: History },
    { name: "Interview Resources", path: "/admin/reports", icon: BarChart3 },
    { name: "Notices", path: "/admin/notices", icon: Bell },
    { name: "Query Resolution", path: "/admin/queries", icon: MessageSquare },
    { name: "Profile", path: "/admin/profile", icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-secondary text-white fixed inset-y-0 left-0 z-50 overflow-y-auto scrollbar-hide">
        <div className="p-8 shrink-0">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="text-secondary" size={24} />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">CamPlace</span>
          </Link>
          <div className="mt-2 px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary text-secondary font-bold shadow-lg shadow-primary/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary font-bold">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-secondary text-white flex items-center justify-between px-6 z-[60]">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-secondary" size={18} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">CamPlace</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white/5 rounded-xl"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-secondary text-white z-[80] lg:hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Shield className="text-secondary" size={24} />
                  </div>
                  <span className="text-2xl font-display font-bold tracking-tight">CamPlace</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                        isActive 
                          ? "bg-primary text-secondary font-bold shadow-lg shadow-primary/10" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <item.icon size={20} />
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-6 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 bg-red-500/5 font-bold"
                >
                  <LogOut size={20} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-72 pt-24 lg:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
