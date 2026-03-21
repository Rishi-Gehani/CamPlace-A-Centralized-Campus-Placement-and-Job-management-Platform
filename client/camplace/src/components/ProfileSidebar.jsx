import { motion, AnimatePresence } from 'motion/react';
import { X, User, History, HelpCircle, Lock, LogOut, ChevronRight, GraduationCap, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function ProfileSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Analytics Dashboard', path: '/dashboard' },
    { icon: User, label: 'Manage Profile', path: '/profile' },
    { icon: History, label: 'Interview Resources', path: '/interview-resources' },
    { icon: HelpCircle, label: 'Help Manual', path: '/help' },
    { icon: Lock, label: 'Change Password', path: '/change-password' },
  ];

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-display font-bold">Account</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{user.firstName} {user.lastName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary/40 bg-black/5 px-2 py-1 rounded-md flex items-center gap-1">
                      {user.role === 'admin' ? <GraduationCap size={10} /> : null}
                      {user.role}
                    </span>
                    <span className="text-xs text-secondary/40">•</span>
                    <span className="text-xs text-secondary/40 truncate max-w-[120px]">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={onClose}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-black/5 rounded-xl group-hover:bg-white transition-colors">
                        <item.icon size={18} className="text-secondary/60" />
                      </div>
                      <span className="font-medium text-secondary/80">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-secondary/20 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto p-8 border-t border-black/5">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
