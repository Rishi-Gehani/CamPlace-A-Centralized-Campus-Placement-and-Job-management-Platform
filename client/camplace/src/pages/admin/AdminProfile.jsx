import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Shield } from "lucide-react";

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-display font-bold text-secondary">Admin Profile</h1>
      <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-sm max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center text-primary text-4xl font-display font-bold">
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary">{user?.firstName} {user?.lastName}</h2>
            <p className="text-secondary/40 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mt-1">
              <Shield size={14} className="text-primary" /> {user?.role}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl">
            <Mail className="text-secondary/30" size={20} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40">Email Address</p>
              <p className="font-medium text-secondary">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
