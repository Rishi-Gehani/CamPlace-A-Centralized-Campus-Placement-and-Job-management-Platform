import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Users, Briefcase, FileText, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingVerifications: 0,
    activeJobs: 45, // Placeholder for now
    applications: 850 // Placeholder for now
  });

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [allRes, pendingRes] = await Promise.all([
        fetch('/api/admin/students', {
          headers: { 'x-auth-token': token }
        }),
        fetch('/api/admin/students/pending', {
          headers: { 'x-auth-token': token }
        })
      ]);

      if (allRes.ok && pendingRes.ok) {
        const allData = await allRes.json();
        const pendingData = await pendingRes.json();
        setStats(prev => ({
          ...prev,
          totalStudents: allData.length,
          pendingVerifications: pendingData.length
        }));
      }
    } catch {
      console.error("Failed to fetch dashboard stats");
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Applications', value: stats.applications, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-secondary/60 font-medium text-lg">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm min-h-[300px]">
          <h3 className="text-xl font-bold text-secondary mb-6">Recent Activity</h3>
          <div className="flex items-center justify-center h-48 text-secondary/30 italic">
            No recent activity to show
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm min-h-[300px]">
          <h3 className="text-xl font-bold text-secondary mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-black/5 rounded-2xl text-sm font-bold text-secondary hover:bg-primary hover:text-secondary transition-all">
              Post New Job
            </button>
            <button className="p-4 bg-black/5 rounded-2xl text-sm font-bold text-secondary hover:bg-primary hover:text-secondary transition-all">
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
