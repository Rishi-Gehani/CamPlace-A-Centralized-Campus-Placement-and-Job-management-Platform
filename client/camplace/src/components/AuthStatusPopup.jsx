import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, LogOut, UserPlus, LogIn } from "lucide-react";

export default function AuthStatusPopup({ status }) {
  if (!status) return null;

  const { message, type } = status;

  const icons = {
    login: <LogIn className="text-emerald-500" size={24} />,
    logout: <LogOut className="text-red-500" size={24} />,
    register: <UserPlus className="text-emerald-500" size={24} />,
    loading: <Loader2 className="text-primary animate-spin" size={24} />
  };

  const bgColors = {
    login: "bg-emerald-500/10",
    logout: "bg-red-500/10",
    register: "bg-emerald-500/10",
    loading: "bg-primary/10"
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl border border-black/5 text-center max-w-sm w-full space-y-6"
        >
          <div className={`w-20 h-20 ${bgColors[type] || 'bg-primary/10'} rounded-[2rem] flex items-center justify-center mx-auto`}>
            {icons[type] || <CheckCircle2 className="text-primary" size={24} />}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold text-secondary">
              {type === 'logout' ? 'Logging Out' : 'Success'}
            </h3>
            <p className="text-secondary/60 font-medium leading-relaxed">
              {message}
            </p>
          </div>
          {type === 'logout' && (
            <div className="pt-4">
              <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
