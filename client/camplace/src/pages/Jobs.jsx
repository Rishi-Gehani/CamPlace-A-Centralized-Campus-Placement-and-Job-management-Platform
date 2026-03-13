import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Clock, XCircle, X, Info, ListChecks, Tags, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import { io } from 'socket.io-client';

export default function Jobs() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modal
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.profileStatus === 'VERIFIED')) {
      fetchData();

      const socket = io();
      socket.emit('join', user.id);

      socket.on('applicationUpdate', (data) => {
        setMyApplications(prev => prev.map(app => 
          app._id === data.applicationId ? { ...app, currentStage: data.status } : app
        ));
        if (data.status === 'SELECTED') {
          window.location.reload();
        }
      });

      socket.on('newJob', (job) => {
        setJobs(prev => [job, ...prev]);
      });

      socket.on('jobUpdated', (updatedJob) => {
        setJobs(prev => prev.map(job => job._id === updatedJob._id ? updatedJob : job));
        setSelectedJob(prev => prev?._id === jobId ? null : prev);
      });

      socket.on('jobDeleted', (jobId) => {
        setJobs(prev => prev.filter(job => job._id !== jobId));
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        fetch('http://localhost:3000/api/jobs'),
        fetch('http://localhost:3000/api/applications/my', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        })
      ]);

      if (jobsRes.ok && appsRes.ok) {
        const jobsData = await jobsRes.json();
        const appsData = await appsRes.json();
        
        // Show all jobs as requested (even expired ones, but they will be marked as closed)
        setJobs(jobsData);
        setMyApplications(appsData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/applications/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (res.ok) {
        setSuccess("Application submitted successfully!");
        fetchData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to apply");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Server error while applying");
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/" />;

  const isVerified = user.role === 'admin' || user.profileStatus === 'VERIFIED';
  const isPending = user.profileStatus === 'PENDING';
  const isPlaced = user.placementStatus === 'PLACED';

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-32">
        <div className="page-container max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-black/5 text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500 mx-auto">
              {isPending ? <Clock size={48} /> : <XCircle size={48} />}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-display font-bold text-secondary">
                {isPending ? 'Verification in Progress' : 'Profile Not Verified'}
              </h1>
              <p className="text-secondary/60 text-lg max-w-xl mx-auto">
                {isPending 
                  ? "Your profile is currently under review by the administration. You'll gain access to all opportunities once your profile is verified."
                  : "Your profile verification was not successful. Please update your details or contact the administration for more information."}
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/profile" className="btn-primary !py-4 !px-10">
                Update Profile
              </Link>
              <Link to="/contact" className="px-10 py-4 border border-black/10 text-secondary font-bold rounded-2xl hover:bg-black/5 transition-all">
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const allTags = [...new Set(jobs.flatMap(job => job.tags))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => job.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="pb-24 bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <section className="bg-secondary text-white py-20">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-display font-bold"
              >
                Explore <span className="text-primary">Opportunities</span>
              </motion.h1>
              <p className="text-white/60 text-lg max-w-xl">
                Find your dream job or internship from our curated list of verified openings.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-white/40">Active Openings:</span>
              <span className="bg-primary text-secondary px-3 py-1 rounded-full font-bold">{jobs.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Placed Banner */}
      {isPlaced && (
        <div className="bg-emerald-500 text-white py-4">
          <div className="page-container flex items-center justify-center gap-3 font-bold">
            <CheckCircle2 size={20} />
            You are already placed. Application buttons are disabled.
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <section className="py-8 border-b border-black/5 sticky top-20 bg-white/80 backdrop-blur-md z-40">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
              <input 
                type="text" 
                placeholder="Search by role or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full !pl-14 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all font-semibold ${
                  selectedTags.length > 0 ? 'bg-primary border-primary text-secondary' : 'border-black/5 bg-white hover:bg-[#F8F9FA]'
                }`}
              >
                <Filter size={18} />
                <span>Filters {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedTags.includes(tag) 
                          ? 'bg-secondary text-white' 
                          : 'bg-black/5 text-secondary/60 hover:bg-black/10'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  {selectedTags.length > 0 && (
                    <button 
                      onClick={() => setSelectedTags([])}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Alerts */}
      <div className="page-container mt-8">
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 mb-6">
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 mb-6">
              <CheckCircle2 size={20} /> {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Job List */}
      <section className="py-8 page-container">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-secondary/40 font-medium">Loading opportunities...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job._id}
                job={job}
                onApply={handleApply}
                onViewDetails={setSelectedJob}
                isApplied={myApplications.some(app => app.jobId?._id === job._id)}
                isPlaced={isPlaced}
                isExpired={new Date() > new Date(job.deadline)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-black/5 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-black/5 flex items-center justify-center text-secondary/20 mx-auto mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-2">No opportunities found</h3>
            <p className="text-secondary/40 max-w-md mx-auto">
              We couldn&apos;t find any jobs matching your current search or filter criteria.
            </p>
          </div>
        )}
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)} className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 p-2 flex items-center justify-center shadow-sm">
                    <img src={selectedJob.companyLogo} alt={selectedJob.company} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary">{selectedJob.title}</h2>
                    <p className="font-medium text-primary">{selectedJob.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-2 rounded-xl hover:bg-black/5 text-secondary/40 transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Type</p>
                    <p className="font-bold text-secondary">{selectedJob.type}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Location</p>
                    <p className="font-bold text-secondary">{selectedJob.location}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Salary</p>
                    <p className="font-bold text-secondary">{selectedJob.salary}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Deadline</p>
                    <p className="font-bold text-secondary">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                    <Info size={16} /> Job Description
                  </h4>
                  <p className="text-secondary/70 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                    <ListChecks size={16} /> Eligibility Criteria
                  </h4>
                  <p className="text-secondary/70 leading-relaxed whitespace-pre-wrap">{selectedJob.eligibility}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                    <Tags size={16} /> Skills & Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-black/5 bg-black/[0.01] flex justify-end">
                {!myApplications.some(app => app.jobId?._id === selectedJob._id) && !isPlaced && (
                  <button 
                    onClick={() => {
                      handleApply(selectedJob._id);
                      setSelectedJob(null);
                    }}
                    className="btn-primary !py-4 !px-12"
                  >
                    Apply for this Position
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
