import { motion } from "motion/react";

export default function ReportsAnalytics() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-display font-bold text-secondary">Reports & Analytics</h1>
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm min-h-[500px] flex items-center justify-center">
        <p className="text-secondary/40 font-medium italic text-lg">Visual Analytics & Reports Placeholder</p>
      </div>
    </motion.div>
  );
}
