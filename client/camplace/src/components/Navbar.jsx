import { Link, NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { User, LogIn, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./AuthModal";
import ProfileSidebar from "./ProfileSidebar";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthModalOpen, authMode, openAuthModal, closeAuthModal } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Opportunities", path: "/jobs" },
    { name: "Our Network", path: "/network" },
    { name: "Notices", path: "/notices" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavClick = (e, path) => {
    if (path === '/jobs' && !user) {
      e.preventDefault();
      openAuthModal('login');
      return;
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="page-container">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-secondary font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter">CamPlace</span>
          </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-secondary/70"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="h-6 w-px bg-black/10 mx-2" />
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 flex items-center justify-end gap-1 mt-1">
                      {user.role === 'admin' && <Shield size={10} />}
                      {user.role}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  >
                    <User size={20} />
                  </button>
                  <NotificationBell />
                </div>
              ) : (
                <button 
                  onClick={() => openAuthModal('login')}
                  className="btn-secondary !py-2 !px-4 flex items-center gap-2"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
              )}
            </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-black/5 px-4 py-6 flex flex-col gap-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className="text-lg font-medium text-secondary/70 hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-black/5">
            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsSidebarOpen(true);
                }}
                className="flex items-center justify-center gap-2 btn-secondary w-full"
              >
                <User size={18} />
                <span>Profile Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal('login');
                }}
                className="flex items-center justify-center gap-2 btn-secondary w-full"
              >
                <LogIn size={18} />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

    </nav>
    <AuthModal 
      key={isAuthModalOpen ? 'open' : 'closed'}
      isOpen={isAuthModalOpen} 
      onClose={closeAuthModal} 
      initialMode={authMode}
    />
    <ProfileSidebar 
      isOpen={isSidebarOpen} 
      onClose={() => setIsSidebarOpen(false)} 
    />
  </>
);
}
