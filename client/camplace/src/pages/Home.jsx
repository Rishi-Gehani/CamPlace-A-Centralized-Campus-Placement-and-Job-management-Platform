import { motion } from "motion/react";
import { Search, ArrowRight, TrendingUp, Users, Building2, CheckCircle2, MessageSquare, ShieldCheck, Briefcase, GraduationCap, ClipboardCheck, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.openAuth) {
      openAuthModal(location.state.openAuth);
      // Clear state properly using navigate to prevent modal from reopening
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, openAuthModal, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    
    // Redirect to jobs page with search query
    // The Jobs page will handle verification check
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleProtectedAction = (e, mode = 'login') => {
    if (!user) {
      e.preventDefault();
      openAuthModal(mode);
    }
  };
  const stats = [
    { label: "Students Registered", value: "500+", icon: <Users className="text-primary" /> },
    { label: "Job Opportunities", value: "300+", icon: <Briefcase className="text-primary" /> },
    { label: "Hiring Partners", value: "75+", icon: <Building2 className="text-primary" /> },
    { label: "Placement Rate", value: "85%", icon: <TrendingUp className="text-primary" /> },
  ];

  const highlights = [
    { label: "Highest Package", value: "₹24 LPA", sub: "2024 Batch" },
    { label: "Average Package", value: "₹7.5 LPA", sub: "Overall" },
    { label: "Students Placed", value: "420+", sub: "Last Season" },
    { label: "New Recruiters", value: "25+", sub: "This Year" },
  ];

  const features = [
    {
      title: "Centralized Job Board",
      desc: "Access all campus placement drives and internship opportunities in one place.",
      icon: <LayoutDashboard size={24} />,
    },
    {
      title: "Real-time Notifications",
      desc: "Get instant alerts for new job postings, application status changes, and notices.",
      icon: <MessageSquare size={24} />,
    },
    {
      title: "Placement Readiness Quiz",
      desc: "Check your readiness with our upcoming module. Analyze your skills, internships, and projects to get personalized career insights.",
      icon: <ClipboardCheck size={24} />,
      isNew: true
    },
    {
      title: "Verified Student Profiles",
      desc: "Build a professional profile that is verified by the placement cell for authenticity.",
      icon: <GraduationCap size={24} />,
    },
    {
      title: "Application Tracking",
      desc: "Monitor your journey from initial application to final selection with a detailed timeline.",
      icon: <TrendingUp size={24} />,
    },
    {
      title: "Secure Data Management",
      desc: "Your academic and personal data is handled with the highest security standards.",
      icon: <ShieldCheck size={24} />,
    },
  ];

  const steps = [
    { id: "01", title: "Create Profile", desc: "Students set up their professional profile with academic details." },
    { id: "02", title: "Browse Jobs", desc: "Explore available opportunities tailored to your skills." },
    { id: "03", title: "Apply Easily", desc: "One-click applications to multiple companies." },
    { id: "04", title: "Track Status", desc: "Monitor your journey from application to offer letter." },
  ];

  const partners = [
    "TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "Cognizant"
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-secondary font-semibold text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Placements 2025 Now Open
              </div>
              <h1 className="hero-title">
                Your Gateway to <span className="text-primary">Campus Placements</span> and Internships
              </h1>
              <p className="body-text max-w-lg">
                A centralized platform where students can explore job opportunities, apply to internships, and connect with top hiring companies.
              </p>
              
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs, internships..."
                    className="w-full !pl-14 pr-4 py-4 rounded-full border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button type="submit" className="btn-secondary whitespace-nowrap">
                  {user ? "Search Jobs" : "Get Started"}
                </button>
              </form>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-primary border-2 border-white flex items-center justify-center text-xs font-bold">
                    +500
                  </div>
                </div>
                <p className="text-sm font-medium text-secondary/60">
                  Joined by <span className="text-secondary font-bold">500+ students</span> this week
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Students collaborating"
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-black/5 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary/40 font-bold uppercase tracking-wider">Status</p>
                    <p className="font-bold">Offer Received</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">{item.label}</p>
                <h3 className="text-3xl lg:text-4xl font-display font-bold text-primary">{item.value}</h3>
                <p className="text-white/40 text-xs">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="card-white hover-card flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold">{stat.value}</h3>
                  <p className="text-secondary/60 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="section-title">Powerful Features for Your Success</h2>
            <p className="body-text">Everything you need to manage your placement journey, from application to tracking.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-3xl bg-white border border-black/5 shadow-sm hover-card space-y-6"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center relative">
                  {feature.icon}
                  {feature.isNew && (
                    <span className="absolute -top-2 -right-2 bg-primary text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      NEW
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="body-text !text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="section-title leading-tight">How CamPlace Works</h2>
                <p className="body-text">Your placement journey simplified into four easy steps.</p>
              </div>
              
              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold font-display">
                      {step.id}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold">{step.title}</h4>
                      <p className="text-secondary/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/help" className="btn-secondary inline-flex items-center gap-2 group">
                Learn More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                  alt="Working on laptop"
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -left-10 w-full h-full border-2 border-primary/20 rounded-3xl -z-10 -rotate-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Partners */}
      <section id="partners" className="py-24 bg-white border-y border-black/5">
        <div className="page-container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-display font-bold text-secondary/40 uppercase tracking-widest">Top Hiring Companies</h2>
            <Link to="/partners" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              View Recruitment Processes <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner) => (
              <Link 
                key={partner} 
                to="/partners"
                className="text-2xl font-display font-black tracking-tighter hover:text-primary transition-colors"
              >
                {partner}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card-white space-y-8 !p-12">
              <div className="flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map(i => <TrendingUp key={i} size={20} />)}
              </div>
              <p className="text-2xl font-medium italic leading-relaxed">
                “This portal helped me easily apply to multiple companies and track my placement journey. The interface is so clean and intuitive!”
              </p>
              <div className="flex items-center gap-4">
                <img src="https://picsum.photos/seed/student/100/100" alt="Student" className="w-14 h-14 rounded-full" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold">Rahul Sharma</p>
                  <p className="text-sm text-secondary/60">B.Tech CSE, 2024 Batch</p>
                </div>
              </div>
            </div>
            
            <div className="p-12 rounded-[2.5rem] bg-secondary text-white space-y-8">
              <div className="flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map(i => <TrendingUp key={i} size={20} />)}
              </div>
              <p className="text-2xl font-medium italic leading-relaxed">
                “The system streamlined our recruitment process and made student shortlisting significantly easier. Highly recommended for any institution.”
              </p>
              <div className="flex items-center gap-4">
                <img src="https://picsum.photos/seed/recruiter/100/100" alt="Recruiter" className="w-14 h-14 rounded-full" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold">Priya Verma</p>
                  <p className="text-sm text-white/60">HR Manager, Tech Corp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="page-container">
          <div className="relative rounded-[3rem] bg-primary p-12 lg:p-24 overflow-hidden text-center space-y-8">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-secondary max-w-3xl mx-auto leading-tight">
              Start Your Placement Journey Today
            </h2>
            <p className="text-secondary/70 text-xl max-w-2xl mx-auto">
              Join hundreds of students who have already secured their dream jobs through CamPlace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                to="/jobs" 
                onClick={(e) => handleProtectedAction(e)}
                className="btn-secondary !py-4 !px-10"
              >
                Explore Opportunities
              </Link>
              {!user && (
                <button 
                  onClick={() => openAuthModal('register')}
                  className="bg-white text-secondary px-10 py-4 rounded-full font-semibold hover:bg-white/90 transition-all"
                >
                  Create Student Account
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* No local AuthModal here, using global one in Navbar */}
    </div>
  );
}
