import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../context/ToastContext";
import RefreshButton from "../../components/RefreshButton";
import { DEPARTMENTS } from "../../constants/education";
import { Users, Briefcase, FileText, ShieldCheck, TrendingUp, PieChart as PieChartIcon, BarChart as BarChartIcon, Sparkles } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import AIInsightsModal from "../../components/AIInsightsModal";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const EmptyChartState = ({ message = "No data available for selected filters" }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="w-12 h-12 bg-secondary/5 text-secondary/20 rounded-full flex items-center justify-center mb-4">
      <BarChartIcon size={24} />
    </div>
    <p className="text-secondary/40 font-medium text-sm">{message}</p>
  </div>
);

const ChartCard = ({ title, icon: Icon, children, hasData }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-bold text-secondary">{title}</h3>
    </div>
    <div className="h-[300px] w-full">
      {hasData ? children : <EmptyChartState />}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const socket = useSocket();
  const [error, setError] = useState(null);
  
  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  // AI Insights State
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const departmentList = Object.keys(DEPARTMENTS);
  const courseList = useMemo(() => {
    if (selectedDept === "ALL") {
      // Return all unique courses across all departments
      const allCourses = Object.values(DEPARTMENTS).flat();
      return [...new Set(allCourses)].sort();
    }
    return DEPARTMENTS[selectedDept] || [];
  }, [selectedDept]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (selectedMonth !== "ALL") params.append('month', selectedMonth);
      if (selectedYear !== "ALL") params.append('year', selectedYear);
      if (selectedDept !== "ALL") params.append('dept', selectedDept);
      if (selectedCourse !== "ALL") params.append('course', selectedCourse);

      const res = await fetch(`http://localhost:3000/api/admin/analytics?${params.toString()}`, {
        headers: { 'x-auth-token': token }
      });

      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard analytics", err);
      setError("An unexpected error occurred while loading the dashboard.");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedDept, selectedCourse]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, selectedMonth, selectedYear, selectedDept, selectedCourse]);

  useEffect(() => {
    if (!socket) return;

    const handleAnalyticsUpdate = () => {
      fetchAnalytics();
      showToast("Dashboard analytics updated", "info");
    };

    socket.on('analyticsUpdated', handleAnalyticsUpdate);

    return () => {
      socket.off('analyticsUpdated', handleAnalyticsUpdate);
    };
  }, [socket, fetchAnalytics, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-secondary/40 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-10 rounded-[2.5rem] border border-red-100 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-secondary mb-2">Dashboard Error</h3>
          <p className="text-secondary/60 mb-8">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="btn-primary !py-3 !px-8"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, charts } = data;

  const handleAIInsights = async () => {
    try {
      setAiLoading(true);
      setAiError(null);
      setIsAIModalOpen(true);
      
      const response = await fetch('http://localhost:3000/api/admin/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          successRate: charts?.successRate?.find(d => d.name === 'Selected')?.percentage || 0,
          stageRejection: charts?.stageRejection || [],
          pipeline: charts?.pipeline || [],
          roleDistribution: charts?.roleDistribution || [],
          topHiring: charts?.topHiring || [],
          companyApps: charts?.companyApps || []
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights');
      }

      const insights = await response.json();
      setAiInsights(insights);
    } catch (err) {
      console.error("Failed to generate AI insights", err);
      setAiError("Failed to generate insights. Please check your API key or try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  const years = ["2023", "2024", "2025", "2026"];
  const months = [
    { id: '1', label: 'January' }, { id: '2', label: 'February' }, { id: '3', label: 'March' },
    { id: '4', label: 'April' }, { id: '5', label: 'May' }, { id: '6', label: 'June' },
    { id: '7', label: 'July' }, { id: '8', label: 'August' }, { id: '9', label: 'September' },
    { id: '10', label: 'October' }, { id: '11', label: 'November' }, { id: '12', label: 'December' }
  ];

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-secondary/60 font-medium text-lg">Real-time insights into recruitment and placement performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleAIInsights}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
          >
            <Sparkles size={16} />
            <span>AI Insights</span>
          </button>
          <RefreshButton onRefresh={fetchAnalytics} />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-xs font-bold text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Months</option>
            {months.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-xs font-bold text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select 
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setSelectedCourse("ALL"); // Reset course when department changes
            }}
            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-xs font-bold text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Departments</option>
            {departmentList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-xs font-bold text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Courses</option>
            {courseList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(selectedMonth !== "ALL" || selectedYear !== "ALL" || selectedDept !== "ALL" || selectedCourse !== "ALL") && (
            <button 
              onClick={() => {
                setSelectedMonth("ALL");
                setSelectedYear("ALL");
                setSelectedDept("ALL");
                setSelectedCourse("ALL");
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Application Pipeline */}
        <ChartCard 
          title="Application Pipeline" 
          icon={TrendingUp}
          hasData={charts?.pipeline?.some(d => d.value > 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.pipeline || []} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} width={100} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={30}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700, fill: '#1e293b' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
 
        {/* 2. Company-wise Applications */}
        <ChartCard 
          title="Company-wise Applications" 
          icon={BarChartIcon}
          hasData={charts?.companyApps?.length > 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.companyApps || []} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
 
        {/* 3. Placement Success Rate */}
        <ChartCard 
          title={`Placement Success Rate (Total: ${stats?.totalApplications || 0})`} 
          icon={PieChartIcon}
          hasData={stats?.totalApplications > 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts?.successRate || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {(charts?.successRate || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
 
        {/* 4. Top Hiring Companies */}
        <ChartCard 
          title="Top Hiring Companies" 
          icon={TrendingUp}
          hasData={charts?.topHiring?.length > 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.topHiring || []} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} width={100} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} barSize={30}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700, fill: '#1e293b' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
 
        {/* 5. Role Distribution */}
        <ChartCard 
          title="Role Distribution" 
          icon={PieChartIcon}
          hasData={charts?.roleDistribution?.length > 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts?.roleDistribution || []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(charts?.roleDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
 
        {/* 6. Stage-wise Rejection Analysis */}
        <ChartCard 
          title="Stage-wise Rejection Analysis" 
          icon={BarChartIcon}
          hasData={charts?.stageRejection?.some(d => d.value > 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.stageRejection || []} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                interval={0}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <AIInsightsModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        insights={aiInsights}
        loading={aiLoading}
        error={aiError}
      />
    </motion.div>
  );
}
