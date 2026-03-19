import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import { 
  LayoutDashboard, TrendingUp, CheckCircle, XCircle, Clock, 
  Filter, Calendar, RefreshCw, BarChart
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../hooks/useSocket";

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#6366f1"];

export default function StudentDashboard() {
  const { showToast } = useToast();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear().toString()
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3000/api/applications/stats?${queryParams}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      showToast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (socket) {
      socket.on("analyticsUpdated", fetchStats);
      socket.on("applicationUpdate", fetchStats);
      return () => {
        socket.off("analyticsUpdated", fetchStats);
        socket.off("applicationUpdate", fetchStats);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      month: "",
      year: new Date().getFullYear().toString()
    });
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Your Analytics</h1>
            <p className="text-secondary/60 mt-1">Track your application performance and trends</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-black/5">
              <Calendar size={18} className="text-primary ml-2" />
              <select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pr-8"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-black/5">
              <Filter size={18} className="text-primary ml-2" />
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pr-8"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="p-3 bg-white hover:bg-gray-50 text-secondary/60 rounded-xl shadow-sm border border-black/5 transition-colors"
              title="Clear Filters"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Applications", value: stats?.total || 0, icon: LayoutDashboard, color: "bg-blue-500" },
            { label: "Selected", value: stats?.charts?.status?.find(s => s.name === 'Selected')?.value || 0, icon: CheckCircle, color: "bg-emerald-500" },
            { label: "Rejected", value: stats?.charts?.status?.find(s => s.name === 'Rejected')?.value || 0, icon: XCircle, color: "bg-red-500" },
            { label: "In Progress", value: stats?.charts?.status?.find(s => s.name === 'In Progress')?.value || 0, icon: Clock, color: "bg-amber-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-black/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm font-medium text-secondary/40 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Application Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-bold">Application Pipeline Progress</h3>
            </div>
            <div className="text-sm font-bold text-secondary/40 uppercase tracking-widest">
              {stats?.charts?.status?.find(s => s.name === 'In Progress')?.value || 0} Active Applications
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="flex h-full w-full">
                {stats?.charts?.status?.map((s) => {
                  const percentage = stats.filteredTotal > 0 ? (s.value / stats.filteredTotal) * 100 : 0;
                  return (
                    <motion.div
                      key={s.name}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${
                        s.name === 'Selected' ? 'bg-emerald-500' :
                        s.name === 'Rejected' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`}
                      title={`${s.name}: ${s.value} (${percentage.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center">
              {stats?.charts?.status?.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    s.name === 'Selected' ? 'bg-emerald-500' :
                    s.name === 'Rejected' ? 'bg-red-500' :
                    'bg-amber-500'
                  }`} />
                  <span className="text-sm font-bold text-secondary">{s.name}</span>
                  <span className="text-xs font-medium text-secondary/40">({s.value})</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Trends */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xl font-bold">Application Trends</h3>
            </div>
            <div className="h-[350px] w-full">
              {stats?.charts?.trends?.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.charts?.trends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-secondary/40">
                  <TrendingUp size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">No trend data available for selected filters</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <BarChart size={20} />
              </div>
              <h3 className="text-xl font-bold">Status Distribution</h3>
            </div>
            <div className="h-[350px] w-full">
              {stats?.charts?.status?.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.charts?.status}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats?.charts?.status?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-secondary/40">
                  <BarChart size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">No application data available for selected filters</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
