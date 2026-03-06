import { motion } from "motion/react";
import { Search, MapPin, Building2, Calendar, Filter, ChevronRight } from "lucide-react";

export default function Jobs() {
  const jobs = [
    {
      id: 1,
      role: "Software Engineer Intern",
      company: "Google",
      location: "Bangalore, India",
      type: "Internship",
      salary: "₹1,00,000/mo",
      deadline: "Oct 25, 2024",
      logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
    },
    {
      id: 2,
      role: "Full Stack Developer",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "Full Time",
      salary: "₹18-22 LPA",
      deadline: "Nov 05, 2024",
      logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
    },
    {
      id: 3,
      role: "Associate Consultant",
      company: "Deloitte",
      location: "Mumbai, India",
      type: "Full Time",
      salary: "₹12-15 LPA",
      deadline: "Oct 30, 2024",
      logo: "https://www2.deloitte.com/content/dam/Deloitte/in/Images/promo_images/deloitte-logo-black.png",
    },
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
                Explore <span className="text-primary">Opportunities</span>
              </motion.h1>
              <p className="text-white/60 text-lg max-w-xl">
                Find your dream job or internship from our curated list of verified openings.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-white/40">Total Opportunities:</span>
              <span className="bg-primary text-secondary px-3 py-1 rounded-full">{jobs.length} Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-12 border-b border-black/5 sticky top-20 bg-white/80 backdrop-blur-md z-40">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
              <input 
                type="text" 
                placeholder="Search by role, company, or skills..." 
                className="input-field pl-12"
              />
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-black/5 bg-white hover:bg-[#F8F9FA] transition-all font-semibold">
                <Filter size={18} />
                <span>Filters</span>
              </button>
              <button className="btn-secondary !py-4 whitespace-nowrap">Search Jobs</button>
            </div>
          </div>
        </div>
      </section>

      {/* Job List */}
      <section className="py-12 page-container">
        <div className="space-y-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-6 lg:p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0">
                <img src={job.logo} alt={job.company} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-grow space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="badge-primary">{job.type}</span>
                  <span className="badge-success">{job.salary}</span>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{job.role}</h3>
                <div className="flex flex-wrap gap-6 text-secondary/60 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Deadline: {job.deadline}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="px-8 py-3 rounded-full border border-black/10 font-bold hover:bg-black/5 transition-all text-center">View Details</button>
                <button className="btn-secondary !py-3 !px-8 flex items-center justify-center gap-2 group/btn">
                  Apply Now
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
