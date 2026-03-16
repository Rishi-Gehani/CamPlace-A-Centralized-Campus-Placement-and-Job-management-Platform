import { motion } from "motion/react";
import { Calendar, ArrowRight, Megaphone } from "lucide-react";

export default function StudentNotices() {
  const notices = [
    {
      id: 1,
      title: "TCS Ninja Drive Registration Open",
      content: "All eligible students from CS/IT branches are requested to register for the upcoming TCS Ninja drive. The deadline for registration is March 25th, 2026.",
      date: "March 16, 2026",
      category: "Placement",
      priority: "High"
    },
    {
      id: 2,
      title: "Holiday Announcement - Holi",
      content: "The college will remain closed on March 20th and 21st on account of Holi. All placement activities scheduled for these days will be moved to next week.",
      date: "March 15, 2026",
      category: "General",
      priority: "Normal"
    },
    {
      id: 3,
      title: "Resume Workshop Tomorrow",
      content: "Join us for an intensive resume building workshop tomorrow at 10:00 AM in the Seminar Hall. Bring your current resumes for review.",
      date: "March 14, 2026",
      category: "Event",
      priority: "Normal"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center">
          <Megaphone size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold text-secondary">Notices & Updates</h1>
          <p className="text-secondary/40 font-medium text-lg">Stay updated with the latest announcements from the placement cell.</p>
        </div>
      </div>

      <div className="space-y-6">
        {notices.map((notice) => (
          <motion.div 
            key={notice.id}
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  notice.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'
                }`}>
                  {notice.category}
                </span>
                <div className="flex items-center gap-1.5 text-secondary/30">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{notice.date}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
              {notice.title}
            </h3>
            <p className="text-secondary/60 leading-relaxed mb-6">
              {notice.content}
            </p>
            
            <button className="flex items-center gap-2 text-sm font-bold text-primary group/btn">
              Read Full Notice <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
