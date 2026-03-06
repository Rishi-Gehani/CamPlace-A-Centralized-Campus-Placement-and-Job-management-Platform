import { Link, NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { User, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = false; // Mock state for now

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Opportunities", path: "/jobs" },
    { name: "Our Partners", path: "/partners" },
    { name: "Forum", path: "/forum" },
    { name: "Contact", path: "/contact" },
  ];

  return (
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
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn-secondary !py-2 !px-4 flex items-center gap-2">
                <User size={18} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-secondary !py-2 !px-4 flex items-center gap-2">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
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
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-secondary/70 hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-black/5">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 btn-secondary w-full"
            >
              <LogIn size={18} />
              <span>Login / Register</span>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
