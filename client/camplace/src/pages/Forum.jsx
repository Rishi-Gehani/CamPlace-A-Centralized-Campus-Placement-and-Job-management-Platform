import { motion } from "motion/react";
import { MessageSquare, TrendingUp, Search, Plus, User } from "lucide-react";

export default function Forum() {
  const topics = [
    { id: 1, title: "How to prepare for Google SDE Intern interview?", author: "Aryan", replies: 24, category: "Interview Prep" },
    { id: 2, title: "My experience with Microsoft recruitment drive 2024", author: "Sneha", replies: 15, category: "Experience" },
    { id: 3, title: "Best resources for learning System Design", author: "Vikram", replies: 42, category: "Resources" },
    { id: 4, title: "What are the core subjects for placement?", author: "Nisha", replies: 8, category: "General" },
  ];

  return (
    <div className="pb-24">
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
                Community <span className="text-primary">Forum</span>
              </motion.h1>
              <p className="text-white/60 text-lg max-w-xl">
                Connect with peers, share experiences, and get advice from the community.
              </p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              <span>New Discussion</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 page-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className="w-full !pl-14 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {topics.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white border border-black/5 shadow-sm hover:border-primary/20 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <span className="badge-primary">{topic.category}</span>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{topic.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-secondary/40">
                      <span className="font-medium text-secondary/60">By {topic.author}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span>{topic.replies} replies</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-secondary/40">
                    <TrendingUp size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card-white space-y-6">
              <h4 className="text-xl font-bold">Forum Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-secondary/60">Total Topics</span>
                  <span className="font-bold">1,240</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary/60">Total Replies</span>
                  <span className="font-bold">8,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary/60">Active Members</span>
                  <span className="font-bold">2,100</span>
                </div>
              </div>
            </div>

            <div className="card-white space-y-6">
              <h4 className="text-xl font-bold">Top Contributors</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">User_{i}23</p>
                      <p className="text-xs text-secondary/40">450 points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
