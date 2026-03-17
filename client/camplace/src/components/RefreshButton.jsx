import { RotateCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function RefreshButton({ onRefresh, className = "" }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Small buffer effect
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isRefreshing}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all text-secondary font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Refresh Data"
    >
      <RotateCw 
        size={16} 
        className={`${isRefreshing ? "animate-spin text-primary" : "text-secondary/40"}`} 
      />
      <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
    </motion.button>
  );
}
