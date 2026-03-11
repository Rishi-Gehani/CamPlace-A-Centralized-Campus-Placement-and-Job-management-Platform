import { motion } from "motion/react";

export default function StudentManagement() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-display font-bold text-secondary">Student Management</h1>
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm min-h-[500px] flex flex-col items-center justify-center gap-4">
        <p className="text-secondary/40 font-medium italic text-lg">Student List & Management Placeholder</p>
        <button className="btn-primary !py-3 !px-8">Add New Student</button>
      </div>
    </motion.div>
  );
}
