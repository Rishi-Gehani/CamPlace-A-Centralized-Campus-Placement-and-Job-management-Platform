import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Search, XCircle, AlertCircle, ArrowRight, Download, Filter } from "lucide-react";
import * as XLSX from 'xlsx';
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../context/ToastContext";
import RefreshButton from "../../components/RefreshButton";
import { DEPARTMENTS } from "../../constants/education";

const STAGES = [
  { id: 'APPLIED', label: 'Applied' },
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'INTERVIEW_ROUND_1', label: 'Aptitude' },
  { id: 'INTERVIEW_ROUND_2', label: 'Technical' },
  { id: 'INTERVIEW_ROUND_3', label: 'HR' },
  { id: 'SELECTED', label: 'Selected' },
  { id: 'REJECTED', label: 'Rejected' }
];

export default function ApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const socket = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/applications/admin', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        showToast("Failed to fetch applications", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewApplication = () => {
      fetchApplications();
      showToast("New application received!", "info");
    };

    const handleApplicationUpdate = () => {
      fetchApplications();
    };

    socket.on('newApplication', handleNewApplication);
    socket.on('applicationUpdate', handleApplicationUpdate);

    return () => {
      socket.off('newApplication', handleNewApplication);
      socket.off('applicationUpdate', handleApplicationUpdate);
    };
  }, [socket, fetchApplications, showToast]);

  const updateStatus = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      const res = await fetch(`http://localhost:3000/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Application ${newStatus.toLowerCase()} successfully`, "success");
        fetchApplications();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = applications.filter(app => {
    const studentName = `${app.studentId?.firstName || ''} ${app.studentId?.lastName || ''}`.toLowerCase();
    const jobTitle = (app.jobId?.title || "Deleted Job").toLowerCase();
    const companyName = (app.jobId?.company || "").toLowerCase();
    const appDate = new Date(app.appliedDate);
    const appMonth = (appDate.getMonth() + 1).toString();
    const appYear = appDate.getFullYear().toString();
    
    const matchesSearch = 
      studentName.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.currentStage === statusFilter;
    const matchesCompany = companyFilter === "ALL" || app.jobId?.company === companyFilter;
    const matchesMonth = selectedMonth === "ALL" || appMonth === selectedMonth;
    const matchesYear = selectedYear === "ALL" || appYear === selectedYear;
    const matchesDept = selectedDept === "ALL" || app.studentId?.department === selectedDept;
    const matchesCourse = selectedCourse === "ALL" || app.studentId?.degree === selectedCourse;

    return matchesSearch && matchesStatus && matchesCompany && matchesMonth && matchesYear && matchesDept && matchesCourse;
  });

  const companies = [...new Set(applications.map(app => app.jobId?.company).filter(Boolean))].sort();
  const departmentList = Object.keys(DEPARTMENTS);
  const courseList = useMemo(() => {
    if (selectedDept === "ALL") {
      const allCourses = Object.values(DEPARTMENTS).flat();
      return [...new Set(allCourses)].sort();
    }
    return DEPARTMENTS[selectedDept] || [];
  }, [selectedDept]);

  const years = [...new Set(applications.map(app => new Date(app.appliedDate).getFullYear().toString()))].sort();
  const months = [
    { id: '1', label: 'January' }, { id: '2', label: 'February' }, { id: '3', label: 'March' },
    { id: '4', label: 'April' }, { id: '5', label: 'May' }, { id: '6', label: 'June' },
    { id: '7', label: 'July' }, { id: '8', label: 'August' }, { id: '9', label: 'September' },
    { id: '10', label: 'October' }, { id: '11', label: 'November' }, { id: '12', label: 'December' }
  ];

  const exportToExcel = () => {
    const dataToExport = filteredApps.map(app => ({
      'Student Name': `${app.studentId?.firstName || ''} ${app.studentId?.lastName || ''}`,
      'Email': app.studentId?.email || '',
      'Department': app.studentId?.department || '',
      'Course': app.studentId?.degree || '',
      'Job Title': app.jobId?.title || 'Deleted Job',
      'Company': app.jobId?.company || '',
      'Applied Date': new Date(app.appliedDate).toLocaleDateString(),
      'Status': STAGES.find(s => s.id === app.currentStage)?.label || app.currentStage,
      'Rejected At': app.currentStage === 'REJECTED' ? (STAGES.find(s => s.id === app.rejectedAtStage)?.label || app.rejectedAtStage) : 'N/A',
      'Resume Link': app.studentId?.resumeUrl || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    let filename = "All_Applications.xlsx";
    if (companyFilter !== "ALL" && statusFilter !== "ALL") {
      filename = `${companyFilter}_${statusFilter}.xlsx`;
    } else if (companyFilter !== "ALL") {
      filename = `${companyFilter}_Applications.xlsx`;
    } else if (statusFilter !== "ALL") {
      filename = `Applications_${statusFilter}.xlsx`;
    }

    XLSX.writeFile(workbook, filename);
  };

  const getNextStage = (currentStage) => {
    if (currentStage === 'REJECTED' || currentStage === 'SELECTED') return null;
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    return STAGES[currentIndex + 1]?.id || null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Applications Management</h1>
          <p className="text-secondary/40 font-medium">Review and manage student job applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchApplications} />
          <button 
            onClick={exportToExcel}
            className="btn-secondary !py-2.5 !px-5 flex items-center gap-2 text-sm shadow-sm"
          >
            <Download size={18} /> Export Excel
          </button>
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest">
            Total: {applications.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
            <input 
              type="text" 
              placeholder="Search by student, job, or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <select 
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="pl-12 pr-6 py-4 rounded-2xl border border-black/5 bg-white hover:bg-[#F8F9FA] transition-all font-semibold focus:outline-none min-w-[180px] appearance-none"
              >
                <option value="ALL">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-6 py-4 rounded-2xl border border-black/5 bg-white hover:bg-[#F8F9FA] transition-all font-semibold focus:outline-none min-w-[180px] appearance-none"
              >
                <option value="ALL">All Statuses</option>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
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
              setSelectedCourse("ALL");
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

          {(searchTerm || statusFilter !== "ALL" || companyFilter !== "ALL" || selectedMonth !== "ALL" || selectedYear !== "ALL" || selectedDept !== "ALL" || selectedCourse !== "ALL") && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setCompanyFilter("ALL");
                setSelectedMonth("ALL");
                setSelectedYear("ALL");
                setSelectedDept("ALL");
                setSelectedCourse("ALL");
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col">
        {/* overflow-x-auto is the outermost so horizontal scroll spans the full card width.
            overflow-y-auto is on this same element so sticky thead works correctly —
            the scroll container and the sticky context are the same element. */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-400px)] custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-10">
              {/* Background is on each <th> individually so it is always fully opaque
                  regardless of what is scrolling behind it. */}
              <tr>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Student</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Department & Course</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Opportunity</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Applied Date</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Last Stage</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10">Resume</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40 bg-[#f5f5f5] border-b-2 border-black/10 text-right">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-black/5">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-secondary/40 font-medium">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <tr key={app._id} className="hover:bg-black/[0.01] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {app.studentId?.firstName?.[0] || '?'}{app.studentId?.lastName?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-secondary">{app.studentId?.firstName} {app.studentId?.lastName}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-secondary/40">{app.studentId?.email}</p>
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                                app.studentId?.placementStatus === 'PLACED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {app.studentId?.placementStatus?.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-bold text-secondary">{app.studentId?.department || 'N/A'}</p>
                          <p className="text-xs text-secondary/40">{app.studentId?.degree || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {app.jobId ? (
                          <div>
                            <p className="font-bold text-secondary">{app.jobId.title}</p>
                            <p className="text-xs text-primary font-medium">{app.jobId.company}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-red-500">Job Deleted</p>
                            <p className="text-xs text-secondary/40 italic">No longer available</p>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-secondary/60 font-medium">
                          {new Date(app.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          app.currentStage === 'SELECTED' ? 'bg-emerald-50 text-emerald-600' :
                          app.currentStage === 'REJECTED' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {STAGES.find(s => s.id === app.currentStage)?.label}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {app.currentStage === 'REJECTED' ? (
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                            {STAGES.find(s => s.id === app.rejectedAtStage)?.label || 'N/A'}
                          </span>
                        ) : (
                          <span className="text-xs text-secondary/20">—</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {app.studentId?.resumeUrl ? (
                          <a 
                            href={app.studentId.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-secondary/20">N/A</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {getNextStage(app.currentStage) && (
                            <button 
                              disabled={updatingId === app._id}
                              onClick={() => updateStatus(app._id, getNextStage(app.currentStage))}
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                            >
                              <ArrowRight size={14} /> Promote
                            </button>
                          )}
                          {app.currentStage !== 'REJECTED' && app.currentStage !== 'SELECTED' && (
                            <button 
                              disabled={updatingId === app._id}
                              onClick={() => updateStatus(app._id, 'REJECTED')}
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-8 py-20 text-center">
                      <p className="text-secondary/40 font-medium italic">No applications found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
    </motion.div>
  );
}