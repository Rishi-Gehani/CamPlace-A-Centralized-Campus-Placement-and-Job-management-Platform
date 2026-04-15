import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, BookOpen, Video, Code, Briefcase, Star, ExternalLink, Loader2, Filter, X } from "lucide-react";
import { io } from "socket.io-client";

const CATEGORY_ICONS = {
  'Technical Guides': Code,
  'Aptitude Tests': BookOpen,
  'HR Preparation': Briefcase,
  'Video Tutorials': Video,
  'Resume Templates': ExternalLink,
  'Question Banks': ExternalLink
};

const CATEGORY_COLORS = {
  'Technical Guides': 'bg-blue-50 text-blue-500',
  'Aptitude Tests': 'bg-purple-50 text-purple-500',
  'HR Preparation': 'bg-emerald-50 text-emerald-500',
  'Video Tutorials': 'bg-red-50 text-red-500',
  'Resume Templates': 'bg-amber-50 text-amber-500',
  'Question Banks': 'bg-indigo-50 text-indigo-500'
};

export default function InterviewResources() {
  const [resources, setResources] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const fetchResources = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setIsRefreshing(true);

      const query = new URLSearchParams();
      if (debouncedSearch) query.append("search", debouncedSearch);
      if (filter !== "All") query.append("category", filter);
      
      const res = await fetch(`http://localhost:3000/api/resources?${query.toString()}`);
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, filter]);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/resources?featured=true");
      const data = await res.json();
      setFeaturedResources(data);
    } catch (err) {
      console.error("Failed to fetch featured resources", err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/resources/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchResources(true), fetchFeatured(), fetchCategories()]);
      setLoading(false);
    };
    loadData();

    // Connect to socket with explicit options for better reliability
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      console.log("Connected to real-time updates server");
    });

    socket.on("resourceUpdated", () => {
      console.log("Real-time update received from server");
      fetchResources(true);
      fetchFeatured();
      fetchCategories();
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => socket.disconnect();
  }, [fetchResources, fetchFeatured, fetchCategories]);

  const handleAction = (resource) => {
    window.open(resource.externalLink, '_blank');
  };

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
            New resources detected. Refreshing...
          </motion.div>
        )}
      </AnimatePresence>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
        {categories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.name] || ExternalLink;
          const color = CATEGORY_COLORS[cat.name] || 'bg-gray-50 text-gray-500';
          return (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => setFilter(cat.name)}
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${filter === cat.name ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-black/5 shadow-sm hover:shadow-md'}`}
            >
              <div className={`w-12 h-12 ${filter === cat.name ? 'bg-white/20 text-secondary' : color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <h3 className={`text-sm font-bold mb-1 ${filter === cat.name ? 'text-secondary' : 'text-secondary'}`}>{cat.name}</h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${filter === cat.name ? 'text-secondary/60' : 'text-secondary/40'}`}>{cat.count} Resources</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Resource List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-secondary flex items-center gap-3">
              {filter === "All" ? "All Resources" : filter}
              {filter !== "All" && (
                <button 
                  onClick={() => setFilter("All")}
                  className="p-1 hover:bg-black/5 rounded-full text-secondary/40 transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-secondary/40 uppercase tracking-widest">
              <Filter size={14} /> {resources.length} found
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-black/5">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-secondary/40 font-medium">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-black/5 text-center px-6">
              <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center text-secondary/20 mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-secondary">No resources found</h3>
              <p className="text-secondary/40 mt-2 max-w-xs">We couldn&apos;t find any resources matching your search or filter criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="divide-y divide-black/5">
                {resources.map((resource) => (
                  <div key={resource._id} className="p-8 hover:bg-black/[0.01] transition-all flex items-start justify-between group gap-6">
                    <div className="flex items-start gap-6 flex-1 min-w-0">
                      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-500`}>
                        <ExternalLink size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{resource.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">
                            LINK
                          </span>
                          <span className="w-1 h-1 rounded-full bg-secondary/20" />
                          <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {resource.description && (
                          <p className="text-sm text-secondary/60 mt-2 whitespace-pre-wrap">{resource.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {resource.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-bold bg-black/5 text-secondary/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAction(resource)}
                      className="w-12 h-12 shrink-0 rounded-xl bg-secondary text-white flex items-center justify-center hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/10"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Sidebar */}
        <div className="space-y-8">
          <h2 className="text-2xl font-display font-bold text-secondary flex items-center gap-3">
            <Star size={24} className="text-amber-500" fill="currentColor" />
            Featured
          </h2>
          
          <div className="space-y-4">
            {featuredResources.length === 0 ? (
              <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 text-center">
                <p className="text-secondary/40 text-sm italic">No featured resources yet.</p>
              </div>
            ) : (
              featuredResources.map(resource => (
                <motion.div 
                  key={resource._id}
                  whileHover={{ x: 5 }}
                  onClick={() => handleAction(resource)}
                  className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500`}>
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h4>
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mt-1">{resource.category}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="bg-primary rounded-[2.5rem] p-8 space-y-4">
            <h3 className="text-lg font-bold text-secondary">Preparation Tips</h3>
            <ul className="space-y-3">
              {[
                "Research the company thoroughly",
                "Review your past projects and experiences",
                "Work on your communication skills",
                "Keep your resume updated and tailored",
                "Prepare questions to ask the interviewer"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-secondary/70 font-medium">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-secondary">{i + 1}</span>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
