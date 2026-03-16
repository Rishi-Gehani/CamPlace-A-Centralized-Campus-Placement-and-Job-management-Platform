import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, CheckCircle2, XCircle, AlertCircle, Download, Filter, Building2, User } from "lucide-react";
import * as XLSX from 'xlsx';

export default function PlacementRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/applications/admin', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (res.ok) {
        const data = await res.json();
        // Only show SELECTED or REJECTED
        const finalRecords = data.filter(app => ['SELECTED', 'REJECTED'].includes(app.currentStage));
        setRecords(finalRecords);
      } else {
        setError("Failed to fetch placement records");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const studentName = `${record.studentId?.firstName || ''} ${record.studentId?.lastName || ''}`.toLowerCase();
    const jobTitle = (record.jobId?.title || "Deleted Job").toLowerCase();
    const companyName = (record.jobId?.company || "").toLowerCase();
    
    const matchesSearch = 
      studentName.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || record.currentStage === statusFilter;
    const matchesCompany = companyFilter === "ALL" || record.jobId?.company === companyFilter;
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const companies = [...new Set(records.map(r => r.jobId?.company).filter(Boolean))].sort();

  const exportToExcel = () => {
    const dataToExport = filteredRecords.map(record => ({
      'Student Name': `${record.studentId?.firstName || ''} ${record.studentId?.lastName || ''}`,
      'Email': record.studentId?.email || '',
      'Job Title': record.jobId?.title || 'Deleted Job',
      'Company': record.jobId?.company || '',
      'Final Status': record.currentStage === 'SELECTED' ? 'Selected' : 'Rejected',
      'Date': new Date(record.appliedDate).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement Records");

    let filename = "Placement_Records.xlsx";
    if (companyFilter !== "ALL" && statusFilter !== "ALL") {
      filename = `${companyFilter}_Placement_${statusFilter}.xlsx`;
    } else if (companyFilter !== "ALL") {
      filename = `${companyFilter}_Placement_Results.xlsx`;
    } else if (statusFilter !== "ALL") {
      filename = `Placement_${statusFilter === 'SELECTED' ? 'Selected' : 'Rejected'}.xlsx`;
    }

    XLSX.writeFile(workbook, filename);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Placement Records</h1>
          <p className="text-secondary/40 font-medium">History and archive of final placement outcomes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="btn-secondary !py-2.5 !px-5 flex items-center gap-2 text-sm shadow-sm"
          >
            <Download size={18} /> Export Excel
          </button>
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest">
            Total: {records.length}
          </div>
        </div>
      </div>

      {/* Filters */}
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
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
            <select 
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="pl-12 pr-6 py-4 rounded-2xl border border-black/5 bg-white hover:bg-[#F8F9FA] transition-all font-semibold focus:outline-none min-w-[200px] appearance-none"
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
              className="pl-12 pr-6 py-4 rounded-2xl border border-black/5 bg-white hover:bg-[#F8F9FA] transition-all font-semibold focus:outline-none min-w-[200px] appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Student</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Company & Role</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Final Outcome</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-secondary/40 font-medium">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-secondary">{record.studentId?.firstName} {record.studentId?.lastName}</p>
                          <p className="text-xs text-secondary/40">{record.studentId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/5 text-secondary flex items-center justify-center">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-secondary">{record.jobId?.company || 'Deleted Company'}</p>
                          <p className="text-xs text-secondary/40">{record.jobId?.title || 'Deleted Role'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-fit ${
                        record.currentStage === 'SELECTED' 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      }`}>
                        {record.currentStage === 'SELECTED' ? (
                          <><CheckCircle2 size={14} /> Selected</>
                        ) : (
                          <><XCircle size={14} /> Rejected</>
                        )}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-secondary/60 font-medium">
                        {new Date(record.appliedDate).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <p className="text-secondary/40 font-medium italic">No placement records found.</p>
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
