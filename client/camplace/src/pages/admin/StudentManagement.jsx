import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Mail, Shield, Search, Filter, Eye, Trash2, ExternalLink, Users, GraduationCap, BookOpen, Code } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../context/ToastContext";
import RefreshButton from "../../components/RefreshButton";

export default function StudentManagement() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "all"
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  
  // Modal States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      } else {
        showToast("Failed to load students", "error");
      }
    } catch {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (socket) {
      socket.on('verificationProcessed', () => {
        fetchStudents();
      });

      socket.on('newStudentRegistration', () => {
        fetchStudents();
        showToast("New student registration pending verification", "info");
      });
      
      return () => {
        socket.off('verificationProcessed');
        socket.off('newStudentRegistration');
      };
    }
  }, [socket, fetchStudents, showToast]);

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
        showToast(`Student ${status.toLowerCase()} successfully`, "success");
        fetchStudents();
      } else {
        const data = await res.json();
        showToast(data.message || "Action failed", "error");
      }
    } catch {
      showToast("Server error", "error");
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/admin/students/${studentToDelete._id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      if (res.ok) {
        showToast("Student deleted successfully", "success");
        fetchStudents();
        setStudentToDelete(null);
      } else {
        const data = await res.json();
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Server error", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchesSearch = 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === "" || student.department === selectedDept;
      const matchesBatch = selectedBatch === "" || String(student.batch) === selectedBatch;
      
      return matchesSearch && matchesDept && matchesBatch;
    });
  }, [allStudents, searchTerm, selectedDept, selectedBatch]);

  const departments = useMemo(() => {
    return [...new Set(allStudents.map(s => s.department))].filter(Boolean).sort();
  }, [allStudents]);

  const batches = useMemo(() => {
    return [...new Set(allStudents.map(s => String(s.batch)))].filter(Boolean).sort();
  }, [allStudents]);

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
        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchStudents} />
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
      </div>

      {/* Alerts removed - using Toast */}

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
              <div className="p-8 border-b border-black/5 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                    <Users className="text-primary" size={20} /> All Registered Students
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search name or email..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-2.5 bg-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-secondary/40" />
                    <span className="text-xs font-bold text-secondary/40 uppercase tracking-wider">Filters:</span>
                  </div>
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="px-4 py-2 bg-black/5 rounded-xl text-xs font-bold text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <select 
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-4 py-2 bg-black/5 rounded-xl text-xs font-bold text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Batches</option>
                    {batches.map(batch => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                  {(searchTerm || selectedDept || selectedBatch) && (
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedDept("");
                        setSelectedBatch("");
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/[0.02]">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Student</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Academic Info</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">Status</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-12 text-center text-secondary/40 italic">
                          No students found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
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
                              <p className="text-xs text-secondary/40">{student.department} • {student.batch}</p>
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
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setSelectedStudent(student)}
                                className="p-2 text-secondary/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                title="View Profile"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => setStudentToDelete(student)}
                                className="p-2 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Student"
                              >
                                <Trash2 size={18} />
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
        )}
      </AnimatePresence>

      {/* Student Profile Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between bg-[#F8F9FA]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary text-2xl font-display font-bold">
                    {selectedStudent.firstName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-secondary">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h2>
                    <p className="text-secondary/40 font-medium">{selectedStudent.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-black/5 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-3 flex items-center gap-2">
                      <GraduationCap size={14} /> Academic Details
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-secondary">{selectedStudent.degree}</p>
                      <p className="text-sm text-secondary/60">{selectedStudent.department}</p>
                      <p className="text-sm text-secondary/60">Batch of {selectedStudent.batch}</p>
                      <p className="text-sm text-secondary/60">CGPA: {selectedStudent.cgpa}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-3 flex items-center gap-2">
                      <Code size={14} /> Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.skills?.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-black/5 rounded-lg text-xs font-bold text-secondary/60">
                          {skill}
                        </span>
                      )) || <span className="text-sm text-secondary/40 italic">No skills listed</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-3 flex items-center gap-2">
                      <Shield size={14} /> Verification Status
                    </h4>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedStudent.profileStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' :
                      selectedStudent.profileStatus === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {selectedStudent.profileStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-3 flex items-center gap-2">
                      <BookOpen size={14} /> Resume & Documents
                    </h4>
                    {selectedStudent.resumeUrl ? (
                      <a 
                        href={selectedStudent.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary font-bold hover:underline"
                      >
                        View Resume <ExternalLink size={16} />
                      </a>
                    ) : (
                      <p className="text-sm text-secondary/40 italic">No resume uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#F8F9FA] border-t border-black/5 flex justify-end">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="btn-secondary !py-3 !px-8"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-secondary">Delete Student?</h3>
                <p className="text-secondary/60">
                  Are you sure you want to delete <strong>{studentToDelete.firstName} {studentToDelete.lastName}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStudentToDelete(null)}
                  disabled={deleting}
                  className="flex-1 px-6 py-4 border border-black/10 text-secondary font-bold rounded-2xl hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

