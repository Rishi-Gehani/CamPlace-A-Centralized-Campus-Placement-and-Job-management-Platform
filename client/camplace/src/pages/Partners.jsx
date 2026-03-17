import { motion } from "motion/react";
import { Building2, Users, Award, CheckCircle2, ArrowRight } from "lucide-react";

export default function Partners() {
  const partners = [
    {
      name: "Google",
      logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
      description: "A global leader in technology, specializing in Internet-related services and products.",
      process: "Online Assessment -> 3-4 Technical Interviews -> HR Round",
      highestPackage: "₹64 LPA",
      criteria: "Strong DSA, Problem Solving, and System Design skills. Minimum 7.5 CGPA.",
      tags: ["Tech Giant", "MNC", "Software"]
    },
    {
      name: "Microsoft",
      logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
      description: "Empowering every person and every organization on the planet to achieve more.",
      process: "Coding Round -> 2-3 Technical Interviews -> Managerial Round",
      highestPackage: "₹51 LPA",
      criteria: "Proficiency in C++/Java, OS, Networking, and Database management. No active backlogs.",
      tags: ["Software", "Cloud", "Hardware"]
    },
    {
      name: "Deloitte",
      logo: "https://www2.deloitte.com/content/dam/Deloitte/in/Images/promo_images/deloitte-logo-black.png",
      description: "Providing industry-leading audit, consulting, tax, and advisory services.",
      process: "Aptitude Test -> Group Discussion -> Technical Interview -> Partner Round",
      highestPackage: "₹18 LPA",
      criteria: "Good communication skills, analytical thinking, and basic coding knowledge. 60% throughout.",
      tags: ["Consulting", "Big 4", "Finance"]
    }
  ];

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24 lg:py-32">
        <div className="page-container text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold uppercase tracking-widest mb-4"
          >
            Our Network
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Our Hiring <span className="text-primary">Partners</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            We collaborate with industry giants to bring the best career opportunities directly to our campus.
          </motion.p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-24 page-container">
        <div className="grid grid-cols-1 gap-16">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[3rem] border border-black/5 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Logo & Basic Info */}
                <div className="lg:col-span-4 p-10 lg:p-12 bg-[#F8F9FA] flex flex-col items-center text-center justify-center space-y-6 border-r border-black/5">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg bg-white p-4">
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold">{partner.name}</h2>
                    <div className="flex flex-wrap justify-center gap-2">
                      {partner.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-secondary/5 text-secondary/60 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Detailed Info */}
                <div className="lg:col-span-8 p-10 lg:p-12 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Building2 className="text-primary" size={20} />
                      About the Company
                    </h3>
                    <p className="body-text italic">
                      &quot;{partner.description}&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                        <Users className="text-primary" size={16} />
                        Recruitment Process
                      </h4>
                      <p className="text-secondary/80 font-medium leading-relaxed">
                        {partner.process}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                        <Award className="text-primary" size={16} />
                        Highest Package
                      </h4>
                      <p className="text-3xl font-display font-bold text-secondary">
                        {partner.highestPackage}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-black/5 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                      <CheckCircle2 className="text-primary" size={16} />
                      What they look for
                    </h4>
                    <p className="text-secondary/70 leading-relaxed">
                      {partner.criteria}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="flex items-center gap-2 text-secondary font-bold group-hover:text-primary transition-colors">
                      View Open Positions <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
