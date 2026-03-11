import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Mail, Shield, AlertCircle, Search } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";

export default function StudentManagement() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "all"
  const socket = useSocket();

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [pendingRes, allRes] = await Promise.all([
        fetch('http://localhost:3000/api/admin/students/pending', {
          headers: { 'x-auth-token': token }
        }),
        fetch('http://localhost:3000/api/admin/students', {
          headers: { 'x-auth-token': token }
        })
      ]);

      if (pendingRes.ok && allRes.ok) {
        const pendingData = await pendingRes.json();
        const allData = await allRes.json();
        setPendingStudents(pendingData);
        setAllStudents(allData);
      }
    } catch {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (socket) {
      socket.on('verificationProcessed', () => {
        fetchStudents();
      });
      
      return () => {
        socket.off('verificationProcessed');
      };
    }
  }, [socket, fetchStudents]);

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/admin/students/verify/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchStudents();
      } else {
        const data = await res.json();
        setError(data.message || "Action failed");
      }
    } catch {
      setError("Server error");
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Student Management</h1>
          <p className="text-secondary/60 font-medium">Manage student verifications and profiles</p>
        </div>
        <div className="flex gap-2 p-1 bg-black/5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "pending" ? "bg-white text-secondary shadow-sm" : "text-secondary/40 hover:text-secondary/60"}`}
          >
            Pending ({pendingStudents.length})
          </button>
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "bg-white text-secondary shadow-sm" : "text-secondary/40 hover:text-secondary/60"}`}
          >
            All Students
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === "pending" ? (
          <motion.div
            key="pending-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-black/5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                  <Shield className="text-primary" size={20} /> Pending Verifications
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/[0.02]">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Student</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Academic Info</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Student ID</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {pendingStudents.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-12 text-center text-secondary/40 italic">
                          No pending verifications at the moment.
                        </td>
                      </tr>
                    ) : (
                      pendingStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-black/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary font-bold">
                                {student.firstName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-secondary">{student.firstName} {student.lastName}</p>
                                <p className="text-xs text-secondary/40 flex items-center gap-1">
                                  <Mail size={12} /> {student.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-secondary">{student.degree} in {student.department}</p>
                              <p className="text-xs text-secondary/40">Batch of {student.batch}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-black/5 rounded-lg text-xs font-mono font-bold text-secondary/60">
                              {student.studentId}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleVerify(student._id, 'REJECTED')}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Reject"
                              >
                                <X size={20} />
                              </button>
                              <button 
                                onClick={() => handleVerify(student._id, 'VERIFIED')}
                                className="p-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                                title="Approve"
                              >
                                <Check size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="all-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                  <Users className="text-primary" size={20} /> All Registered Students
                </h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="pl-12 pr-4 py-2.5 bg-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/[0.02]">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Student</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Academic Info</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Status</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40 text-right">Placement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {allStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-black/[0.01] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary font-bold">
                              {student.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-secondary">{student.firstName} {student.lastName}</p>
                              <p className="text-xs text-secondary/40">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-secondary">{student.degree}</p>
                            <p className="text-xs text-secondary/40">{student.department}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            student.profileStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' :
                            student.profileStatus === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {student.profileStatus}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-xs font-bold text-secondary/60">
                            {student.placementStatus.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Add missing icon
const Users = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);