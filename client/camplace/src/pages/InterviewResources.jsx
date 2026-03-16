import { motion } from "motion/react";
import { FileText, Download, Search, BookOpen, Video, Code, Briefcase } from "lucide-react";

export default function InterviewResources() {
  const categories = [
    { name: "Technical Guides", icon: Code, count: 12, color: "bg-blue-50 text-blue-500" },
    { name: "Aptitude Tests", icon: BookOpen, count: 8, color: "bg-purple-50 text-purple-500" },
    { name: "HR Preparation", icon: Briefcase, count: 5, color: "bg-emerald-50 text-emerald-500" },
    { name: "Video Tutorials", icon: Video, count: 15, color: "bg-red-50 text-red-500" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-secondary">Interview Resources</h1>
          <p className="text-secondary/40 font-medium text-lg mt-2">Everything you need to ace your next interview.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={20} />
          <input 
            type="text" 
            placeholder="Search resources..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {categories.map((cat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <cat.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-1">{cat.name}</h3>
            <p className="text-secondary/40 text-sm font-medium">{cat.count} Resources</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 bg-black/[0.01]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Featured Materials</h3>
        </div>
        <div className="divide-y divide-black/5">
          {[
            { title: "Top 50 Data Structures Questions", type: "PDF", size: "2.4 MB", date: "Mar 10, 2026" },
            { title: "System Design Interview Handbook", type: "PDF", size: "5.1 MB", date: "Mar 08, 2026" },
            { title: "Common HR Interview Questions & Answers", type: "DOCX", size: "1.2 MB", date: "Mar 05, 2026" },
            { title: "TCS Ninja Previous Year Papers", type: "ZIP", size: "12.8 MB", date: "Mar 01, 2026" }
          ].map((file, i) => (
            <div key={i} className="p-8 hover:bg-black/[0.01] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{file.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">{file.type}</span>
                    <span className="w-1 h-1 rounded-full bg-secondary/20" />
                    <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">{file.size}</span>
                    <span className="w-1 h-1 rounded-full bg-secondary/20" />
                    <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">{file.date}</span>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/10">
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
