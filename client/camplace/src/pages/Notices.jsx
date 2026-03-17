import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Bell, Megaphone, Calendar, ExternalLink, Loader2, Star } from "lucide-react";
import { io } from "socket.io-client";

const CATEGORY_COLORS = {
  'General': 'bg-blue-50 text-blue-500 border-blue-100',
  'Event': 'bg-purple-50 text-purple-500 border-purple-100',
  'Placement': 'bg-emerald-50 text-emerald-500 border-emerald-100',
  'Academic': 'bg-amber-50 text-amber-500 border-amber-100',
  'Others': 'bg-gray-50 text-gray-500 border-gray-100'
};

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchNotices = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setIsRefreshing(true);

      const query = new URLSearchParams();
      if (debouncedSearch) query.append("search", debouncedSearch);
      if (filter !== "All") query.append("category", filter);
      
      const res = await fetch(`http://localhost:3000/api/notices?${query.toString()}`);
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchNotices();

    // Connect to socket for real-time updates
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      console.log("Connected to real-time notices server");
    });

    socket.on("noticeUpdated", () => {
      console.log("Real-time notice update received");
      fetchNotices(true);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => socket.disconnect();
  }, [fetchNotices]);

  const categories = ["All", "General", "Event", "Placement", "Academic", "Others"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-12 px-6 relative"
    >
      <AnimatePresence>
        {isRefreshing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-secondary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            New notices detected. Refreshing...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-secondary flex items-center gap-3">
            <Bell className="text-primary" size={36} />
            Notice Board
          </h1>
          <p className="text-secondary/40 font-medium text-lg mt-2">Stay updated with the latest announcements and events.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={20} />
          <input 
            type="text" 
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
              filter === cat 
                ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" 
                : "bg-white text-secondary/60 border-black/5 hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-black/5">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-secondary/40 font-medium">Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-black/5 text-center px-6">
          <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center text-secondary/20 mb-6">
            <Megaphone size={40} />
          </div>
          <h3 className="text-xl font-bold text-secondary">No Notices Available</h3>
          <p className="text-secondary/40 mt-2 max-w-xs mx-auto">Check back later for new announcements or try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notices.map((notice) => (
            <motion.div
              layout
              key={notice._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white p-8 rounded-[3rem] border transition-all group relative overflow-hidden ${
                notice.isFeatured ? "border-primary/30 shadow-lg shadow-primary/5 bg-primary/[0.01]" : "border-black/5 shadow-sm hover:shadow-md"
              }`}
            >
              {notice.isFeatured && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-secondary text-[10px] font-bold px-6 py-1 rotate-45 translate-x-4 translate-y-2 uppercase tracking-widest shadow-sm">
                    Featured
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${CATEGORY_COLORS[notice.category] || CATEGORY_COLORS['Others']}`}>
                      {notice.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-secondary/30 text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={12} />
                      {new Date(notice.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-bold text-secondary group-hover:text-primary transition-colors flex items-center gap-2">
                      {notice.title}
                      {notice.isFeatured && <Star size={18} className="text-primary fill-current" />}
                    </h3>
                    <p className="text-secondary/60 mt-3 leading-relaxed whitespace-pre-wrap">
                      {notice.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {notice.link && (
                      <a 
                        href={notice.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/10"
                      >
                        Open Attachment <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
