import { motion } from "motion/react";
import { Upload, FileText, Eye, Search, Filter, Plus } from "lucide-react";

export default function InterviewResources() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">Interview Resources</h1>
          <p className="text-secondary/40 font-medium">Upload and manage preparation materials for students.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} /> Add New Resource
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Upload size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary">Upload Area</h3>
              <p className="text-sm text-secondary/40">Drag and drop files here or click to browse</p>
            </div>
            <button className="px-6 py-2 bg-secondary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary/90 transition-all">
              Select Files
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Resource Categories</h3>
            <div className="space-y-2">
              {['Interview PDFs', 'Preparation Guides', 'Question Banks', 'Resume Templates'].map(cat => (
                <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-black/5">
                  <span className="text-sm font-medium text-secondary/70">{cat}</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">0</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource List Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/5 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-[#F8F9FA] border border-black/5 rounded-xl text-secondary/40 hover:text-primary transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-6 border-b border-black/5 bg-black/[0.01]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Recent Uploads</h3>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center text-secondary/20">
                <FileText size={40} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-secondary">No resources uploaded yet</h4>
                <p className="text-secondary/40 max-w-xs mx-auto mt-2">Start by uploading interview guides, PDFs, or question banks for students.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Section Placeholder */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <Eye size={20} />
          </div>
          <h3 className="text-xl font-bold text-secondary">File Preview Section</h3>
        </div>
        <div className="aspect-video bg-black/[0.02] border border-black/5 rounded-[2rem] flex items-center justify-center">
          <p className="text-secondary/30 font-medium italic">Select a file to preview its content here</p>
        </div>
      </div>
    </motion.div>
  );
}
