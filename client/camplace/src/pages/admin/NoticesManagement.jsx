import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, X, Trash2, Edit2, Star, Check, AlertCircle, Loader2, ExternalLink, Megaphone, Calendar } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../context/ToastContext";
import RefreshButton from "../../components/RefreshButton";

const CATEGORIES = ['General', 'Event', 'Placement', 'Academic', 'Others'];

const CATEGORY_COLORS = {
  'General': 'bg-blue-50 text-blue-500 border-blue-100',
  'Event': 'bg-purple-50 text-purple-500 border-purple-100',
  'Placement': 'bg-emerald-50 text-emerald-500 border-emerald-100',
  'Academic': 'bg-amber-50 text-amber-500 border-amber-100',
  'Others': 'bg-gray-50 text-gray-500 border-gray-100'
};

export default function NoticesManagement() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const socket = useSocket();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: CATEGORIES[0],
    link: "",
    isFeatured: false
  });

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (filter !== "All") query.append("category", filter);
      
      const res = await fetch(`http://localhost:3000/api/notices?${query.toString()}`);
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    if (!socket) return;

    const handleNoticeUpdate = () => {
      fetchNotices();
      showToast("Notice board updated", "info");
    };

    socket.on("noticeUpdated", handleNoticeUpdate);

    return () => {
      socket.off("noticeUpdated", handleNoticeUpdate);
    };
  }, [socket, fetchNotices, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters long");
      return;
    }
    if (!formData.content.trim() || formData.content.trim().length < 10) {
      setError("Content must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = editingNotice ? `http://localhost:3000/api/notices/${editingNotice._id}` : "http://localhost:3000/api/notices";
      const method = editingNotice ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast(editingNotice ? "Notice updated successfully!" : "Notice created successfully!", "success");
        setIsModalOpen(false);
        resetForm();
        fetchNotices();
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to save notice");
      }
    } catch {
      setError("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: CATEGORIES[0],
      link: "",
      isFeatured: false
    });
    setEditingNotice(null);
    setError(null);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      link: notice.link || "",
      isFeatured: notice.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setNoticeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/notices/${noticeToDelete}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      });
      if (res.ok) {
        showToast("Notice deleted successfully!", "success");
        fetchNotices();
      } else {
        showToast("Failed to delete notice", "error");
      }
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Server error", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setNoticeToDelete(null);
    }
  };

  const toggleFeatured = async (notice) => {
    try {
      const res = await fetch(`http://localhost:3000/api/notices/${notice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({ isFeatured: !notice.isFeatured })
      });
      if (res.ok) fetchNotices();
    } catch (err) {
      console.error("Toggle featured failed", err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Notice Management</h1>
          <p className="text-secondary/40 font-medium">Create and manage announcements for the notice board.</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={fetchNotices} />
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Create New Notice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Filter by Category</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilter("All")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${filter === "All" ? "bg-primary text-secondary" : "bg-black/[0.02] border border-black/5 text-secondary/70 hover:bg-black/[0.05]"}`}
              >
                <span className="text-sm font-bold">All Notices</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${filter === "All" ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                  {notices.length}
                </span>
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${filter === cat ? "bg-primary text-secondary" : "bg-black/[0.02] border border-black/5 text-secondary/70 hover:bg-black/[0.05]"}`}
                >
                  <span className="text-sm font-medium">{cat}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${filter === cat ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                    {notices.filter(n => n.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notice List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="text" 
                placeholder="Search notices by title or content..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-black/5 bg-black/[0.01]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Manage Notices</h3>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-secondary/40 font-medium">Loading notices...</p>
              </div>
            ) : notices.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center text-secondary/20">
                  <Megaphone size={40} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-secondary">No notices found</h4>
                  <p className="text-secondary/40 max-w-xs mx-auto mt-2">Try adjusting your search or filters, or create a new notice.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {notices.map(notice => (
                  <div key={notice._id} className={`p-6 hover:bg-black/[0.01] transition-all group relative ${notice.isFeatured ? 'bg-primary/[0.02]' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${CATEGORY_COLORS[notice.category] || CATEGORY_COLORS['Others']}`}>
                          <Megaphone size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-secondary">{notice.title}</h4>
                            {notice.isFeatured && (
                              <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Star size={10} fill="currentColor" /> Important
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-secondary/40 line-clamp-1 mb-2">{notice.content}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${CATEGORY_COLORS[notice.category] || CATEGORY_COLORS['Others']}`}>
                              {notice.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-secondary/30 text-[10px] font-bold uppercase tracking-widest">
                              <Calendar size={12} />
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => toggleFeatured(notice)}
                          className={`p-2 rounded-xl transition-all ${notice.isFeatured ? 'bg-amber-50 text-amber-500' : 'bg-black/5 text-secondary/40 hover:text-amber-500'}`}
                          title={notice.isFeatured ? "Remove Important Badge" : "Mark as Important"}
                        >
                          <Star size={18} fill={notice.isFeatured ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => handleEdit(notice)}
                          className="p-2 bg-black/5 text-secondary/40 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title="Edit Notice"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(notice._id)}
                          className="p-2 bg-black/5 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Notice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between bg-black/[0.01]">
                <div>
                  <h2 className="text-2xl font-display font-bold text-secondary">
                    {editingNotice ? "Edit Notice" : "Create New Notice"}
                  </h2>
                  <p className="text-secondary/40 text-sm font-medium">Post an announcement for the students.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-xl transition-all text-secondary/40"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Notice Title *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., Campus Recruitment Drive 2026"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Category *</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Content / Description *</label>
                  <textarea 
                    required
                    placeholder="Write the detailed notice content here..."
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Attachment Link (Optional)</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
                    <input 
                      type="url"
                      placeholder="https://example.com/document.pdf"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isFeatured ? 'bg-primary' : 'bg-black/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-sm font-bold text-secondary">Mark as Important Notice</span>
                </div>
              </form>

              <div className="p-8 border-t border-black/5 flex items-center justify-end gap-4 bg-black/[0.01]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-secondary/40 hover:text-secondary transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary !px-10 flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {editingNotice ? <Check size={18} /> : <Plus size={18} />}
                      {editingNotice ? "Update Notice" : "Post Notice"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                <Trash2 size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-secondary">Delete Notice?</h2>
                <p className="text-secondary/40 font-medium mt-2">This action cannot be undone. Are you sure you want to remove this notice?</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-black/5 text-secondary font-bold hover:bg-black/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
