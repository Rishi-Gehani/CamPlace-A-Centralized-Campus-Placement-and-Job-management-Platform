import { motion } from "motion/react";

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary">Admin Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Students', value: '1,240', color: 'bg-blue-500' },
          { label: 'Active Jobs', value: '45', color: 'bg-emerald-500' },
          { label: 'Applications', value: '850', color: 'bg-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary/40 mb-2">{stat.label}</p>
            <p className="text-4xl font-display font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-secondary/40 font-medium italic text-lg">Dashboard Overview Placeholder</p>
      </div>
    </motion.div>
  );
}
