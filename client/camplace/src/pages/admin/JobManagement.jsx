import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Filter, Briefcase, Building2, MapPin, 
  DollarSign, Calendar, Trash2, Edit2, X, AlertCircle,
  CheckCircle2, Clock, Info, ChevronRight, Tags, ListChecks
} from 'lucide-react';
import JobForm from '../../components/admin/JobForm';

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      const url = selectedJob ? `http://localhost:3000/api/jobs/${selectedJob._id}` : 'http://localhost:3000/api/jobs';
      const method = selectedJob ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(`Job ${selectedJob ? 'updated' : 'posted'} successfully!`);
        setIsFormOpen(false);
        setSelectedJob(null);
        fetchJobs();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${jobToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (res.ok) {
        setSuccess('Job deleted successfully');
        setIsDeleteConfirmOpen(false);
        setJobToDelete(null);
        fetchJobs();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete job');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-32">
      <div className="page-container max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-secondary">Job Management</h1>
            <p className="text-secondary/60">Post and manage job opportunities for students</p>
          </div>
          <button 
            onClick={() => {
              setSelectedJob(null);
              setIsFormOpen(true);
            }}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Post New Opportunity
          </button>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={20} />
            <input 
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={20} />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
            >
              <option value="All">All Types</option>
              <option value="Job">Jobs Only</option>
              <option value="Internship">Internships Only</option>
            </select>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest">Total Jobs</p>
                <p className="text-xl font-bold text-secondary">{jobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3"
            >
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-2xl flex items-center gap-3"
            >
              <CheckCircle2 size={20} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-secondary/40 font-medium">Loading opportunities...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <motion.div 
                key={job._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-black/5 bg-white p-2 flex items-center justify-center shadow-sm">
                    <img 
                      src={job.companyLogo} 
                      alt={job.company} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/seed/company/100/100';
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setIsFormOpen(true);
                      }}
                      className="p-2 rounded-xl bg-black/5 text-secondary/40 hover:bg-primary/10 hover:text-primary transition-all"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setJobToDelete(job);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="p-2 rounded-xl bg-black/5 text-secondary/40 hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                  <p className="text-secondary/60 font-medium flex items-center gap-1.5">
                    <Building2 size={14} /> {job.company}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="px-3 py-1 rounded-lg bg-black/5 text-[10px] font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-1.5">
                    <MapPin size={12} /> {job.location}
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-black/5 text-[10px] font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-1.5">
                    <DollarSign size={12} /> {job.salary}
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                    job.type === 'Job' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <Clock size={12} /> {job.type}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary/40">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">Ends: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedJob(job);
                      setIsViewOpen(true);
                    }}
                    className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Details <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-black/5 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-black/5 flex items-center justify-center text-secondary/20 mx-auto mb-6">
              <Briefcase size={40} />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-2">No opportunities found</h3>
            <p className="text-secondary/40 max-w-md mx-auto">
              {searchTerm || filterType !== 'All' 
                ? "We couldn't find any jobs matching your current search or filter criteria."
                : "You haven't posted any job or internship opportunities yet. Click the button above to get started."}
            </p>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {/* Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)}
                className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="p-8 border-b border-black/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary">{selectedJob ? 'Edit Opportunity' : 'Post New Opportunity'}</h2>
                    <p className="text-sm text-secondary/40">Fill in the details for the job or internship</p>
                  </div>
                  <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-xl hover:bg-black/5 text-secondary/40 transition-all">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 overflow-y-auto">
                  <JobForm 
                    initialData={selectedJob}
                    onSubmit={handleCreateOrUpdate}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </div>
              </motion.div>
            </div>
          )}

          {/* View Details Modal */}
          {isViewOpen && selectedJob && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsViewOpen(false)}
                className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="p-8 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 p-2 flex items-center justify-center shadow-sm">
                      <img src={selectedJob.companyLogo} alt={selectedJob.company} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-secondary">{selectedJob.title}</h2>
                      <p className="font-medium text-primary">{selectedJob.company}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsViewOpen(false)} className="p-2 rounded-xl hover:bg-black/5 text-secondary/40 transition-all">
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

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                      <Clock size={16} /> Interview Rounds
                    </h4>
                    <div className="flex items-center gap-3">
                      {selectedJob.interviewRounds.map((round, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold">
                            {round}
                          </div>
                          {idx < selectedJob.interviewRounds.length - 1 && <ChevronRight size={16} className="text-secondary/20" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Delete Opportunity?</h3>
                <p className="text-secondary/60 mb-8">
                  Are you sure you want to delete <span className="font-bold text-secondary">&quot;{jobToDelete?.title}&quot;</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="flex-1 py-4 border border-black/10 text-secondary font-bold rounded-2xl hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
