import { motion } from "motion/react";
import { Bell, Plus, Search, Filter, Trash2, Eye, FileText, Upload } from "lucide-react";

export default function NoticesManagement() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Notices Management</h1>
          <p className="text-secondary/40 font-medium">Broadcast important updates and announcements to students.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} /> Create New Notice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Notice Form Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <h3 className="text-xl font-bold text-secondary">Quick Post</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Notice Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Placement Drive Postponed"
                  className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Category</label>
                <select className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none">
                  <option>General Announcement</option>
                  <option>Placement Update</option>
                  <option>Urgent Notice</option>
                  <option>Event Invitation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Attachment (Optional)</label>
                <div className="border-2 border-dashed border-black/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:border-primary/20 transition-all cursor-pointer">
                  <Upload size={20} className="text-secondary/20" />
                  <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Upload PDF/Image</span>
                </div>
              </div>

              <button className="w-full py-4 bg-secondary text-white rounded-2xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10">
                Publish Notice
              </button>
            </div>
          </div>
        </div>

        {/* Notice List Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="text" 
                placeholder="Search notices..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <button className="p-3 bg-[#F8F9FA] border border-black/5 rounded-xl text-secondary/40">
              <Filter size={18} />
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden min-h-[450px] flex flex-col">
            <div className="p-6 border-b border-black/5 bg-black/[0.01] flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Active Notices</h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">3 Total</span>
            </div>
            
            <div className="divide-y divide-black/5">
              {[
                { title: 'TCS Ninja Drive Registration Open', date: '2 hours ago', type: 'Placement' },
                { title: 'Holiday Announcement - Holi', date: '1 day ago', type: 'General' },
                { title: 'Resume Workshop Tomorrow', date: '2 days ago', type: 'Event' }
              ].map((notice, i) => (
                <div key={i} className="p-6 hover:bg-black/[0.01] transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary group-hover:text-primary transition-colors">{notice.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">{notice.date}</span>
                        <span className="w-1 h-1 rounded-full bg-secondary/20" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{notice.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section Placeholder */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Eye size={20} />
          </div>
          <h3 className="text-xl font-bold text-secondary">Notice Preview</h3>
        </div>
        <div className="aspect-[16/5] bg-black/[0.02] border border-black/5 rounded-[2rem] flex items-center justify-center">
          <p className="text-secondary/30 font-medium italic">Select a notice to see how it will appear to students</p>
        </div>
      </div>
    </motion.div>
  );
}
