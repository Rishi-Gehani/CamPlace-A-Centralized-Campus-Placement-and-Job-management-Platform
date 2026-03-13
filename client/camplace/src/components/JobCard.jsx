import { motion } from 'motion/react';
import { Building2, MapPin, DollarSign, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JobCard({ job, onApply, onViewDetails, isApplied, isPlaced, isExpired }) {
  return (
    <motion.div 
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
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${job.company}/100/100`;
            }}
          />
        </div>
        <div className="flex gap-2">
          {isExpired && (
            <div className="px-3 py-1 rounded-lg bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest">
              Expired
            </div>
          )}
          <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
            job.type === 'Job' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <Clock size={12} /> {job.type}
          </div>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
        <p className="text-secondary/60 font-medium flex items-center gap-1.5">
          <Building2 size={14} /> {job.company}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="px-3 py-1 rounded-lg bg-black/5 text-[10px] font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-1.5">
          <MapPin size={12} /> {job.location}
        </div>
        <div className="px-3 py-1 rounded-lg bg-black/5 text-[10px] font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-1.5">
          <DollarSign size={12} /> {job.salary}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 rounded-md bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
            {tag}
          </span>
        ))}
        {job.tags.length > 3 && (
          <span className="px-2 py-1 rounded-md bg-black/5 text-secondary/40 text-[10px] font-bold uppercase tracking-wider">
            +{job.tags.length - 3}
          </span>
        )}
      </div>

      <div className="pt-6 border-t border-black/5 flex items-center justify-between gap-4">
        <button 
          onClick={() => onViewDetails(job)}
          className="text-secondary/40 font-bold text-xs flex items-center gap-1 hover:text-secondary transition-all"
        >
          Details <ChevronRight size={14} />
        </button>

        {isPlaced ? (
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Placed
          </div>
        ) : isApplied ? (
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Applied
          </div>
        ) : isExpired ? (
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-black/5 text-secondary/20 text-xs font-bold text-center flex items-center justify-center gap-2">
            <AlertCircle size={14} /> Closed
          </div>
        ) : (
          <button 
            onClick={() => onApply(job._id)}
            className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Apply Now
          </button>
        )}
      </div>
    </motion.div>
  );
}
