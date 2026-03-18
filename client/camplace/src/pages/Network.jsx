import { motion } from "motion/react";
import { Building2, Users, Award, CheckCircle2 } from "lucide-react";
import RefreshButton from "../components/RefreshButton";

export default function Partners() {
  const partners = [
    {
      id: "google",
      name: "Google",
      logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
      description: "A global leader in technology, specializing in Internet-related services and products.",
      process: "Aptitude Test -> 3-4 Technical Interviews -> HR Round",
      highestPackage: "₹64 LPA",
      criteria: "Strong DSA, Problem Solving, and System Design skills. Minimum 7.5 CGPA.",
      tags: ["Tech Giant", "MNC", "Software"]
    },
    {
      id: "microsoft",
      name: "Microsoft",
      logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
      description: "Empowering every person and every organization on the planet to achieve more.",
      process: "Aptitude Test -> 2-3 Technical Interviews -> Managerial Round",
      highestPackage: "₹51 LPA",
      criteria: "Proficiency in C++/Java, OS, Networking, and Database management. No active backlogs.",
      tags: ["Software", "Cloud", "Hardware"]
    },
    {
      id: "amazon",
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      description: "Earth's most customer-centric company, where people can find and discover anything they might want to buy online.",
      process: "Aptitude Test -> Technical Assessment -> 2-3 Technical Interviews -> Bar Raiser Round",
      highestPackage: "₹45 LPA",
      criteria: "Strong analytical skills, customer obsession, and proficiency in scalable systems.",
      tags: ["E-commerce", "Cloud", "MNC"]
    },
    {
      id: "tcs",
      name: "TCS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
      description: "A global leader in IT services, consulting & business solutions with a large network of innovation & delivery centers.",
      process: "Aptitude Test (NQT) -> Technical Interview -> HR Round",
      highestPackage: "₹12 LPA",
      criteria: "Good academic record (60%+), basic programming knowledge, and logical reasoning.",
      tags: ["IT Services", "Consulting", "Global"]
    },
    {
      id: "infosys",
      name: "Infosys",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
      description: "A global leader in next-generation digital services and consulting.",
      process: "Aptitude Test -> Technical Interview -> HR Round",
      highestPackage: "₹10 LPA",
      criteria: "Strong fundamentals in computer science, good communication, and 60% throughout.",
      tags: ["IT Services", "Digital", "Consulting"]
    },
    {
      id: "deloitte",
      name: "Deloitte",
      logo: "https://www2.deloitte.com/content/dam/Deloitte/in/Images/promo_images/deloitte-logo-black.png",
      description: "Providing industry-leading audit, consulting, tax, and advisory services.",
      process: "Aptitude Test -> Group Discussion -> Technical Interview -> Partner Round",
      highestPackage: "₹18 LPA",
      criteria: "Good communication skills, analytical thinking, and basic coding knowledge. 60% throughout.",
      tags: ["Consulting", "Big 4", "Finance"]
    },
    {
      id: "meta",
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      description: "Building technologies that help people connect, find communities, and grow businesses.",
      process: "Technical Screening -> 3-4 Product/System Interviews -> Behavioral Round",
      highestPackage: "₹60 LPA",
      criteria: "Strong product sense, system design, and coding skills. Focus on scalability.",
      tags: ["Social Media", "Tech Giant", "MNC"]
    },
    {
      id: "apple",
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      description: "Designing and developing consumer electronics, computer software, and online services.",
      process: "Technical Screening -> 4-5 In-depth Technical Interviews -> Team Match",
      highestPackage: "₹55 LPA",
      criteria: "Excellence in hardware/software integration, attention to detail, and OS fundamentals.",
      tags: ["Hardware", "Software", "Design"]
    },
    {
      id: "netflix",
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      description: "The world's leading streaming entertainment service with millions of paid memberships.",
      process: "Technical Screening -> 4-5 Senior Engineer Interviews -> Culture Fit",
      highestPackage: "₹65 LPA",
      criteria: "Senior-level experience, strong culture alignment, and expertise in distributed systems.",
      tags: ["Streaming", "Entertainment", "Tech"]
    },
    {
      id: "ibm",
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      description: "A global technology and innovation company, the largest technology and consulting employer in the world.",
      process: "Cognitive Ability Test -> Technical Interview -> HR Round",
      highestPackage: "₹22 LPA",
      criteria: "Knowledge of AI, Cloud, and Enterprise systems. Good problem-solving skills.",
      tags: ["Consulting", "AI", "Cloud"]
    },
    {
      id: "oracle",
      name: "Oracle",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
      description: "Providing a comprehensive and fully integrated stack of cloud applications and platform services.",
      process: "Online Test -> 2-3 Technical Interviews -> HR Round",
      highestPackage: "₹38 LPA",
      criteria: "Strong database knowledge, Java proficiency, and analytical skills.",
      tags: ["Database", "Cloud", "Enterprise"]
    },
    {
      id: "cisco",
      name: "Cisco",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
      description: "The worldwide leader in networking that transforms how people connect, communicate and collaborate.",
      process: "Online Test -> Technical Interview -> Managerial Round -> HR Round",
      highestPackage: "₹32 LPA",
      criteria: "Strong networking fundamentals, C/C++ knowledge, and logical reasoning.",
      tags: ["Networking", "Hardware", "Security"]
    },
    {
      id: "intel",
      name: "Intel",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
      description: "Designing and building the essential technologies that serve as the foundation for the world's computing devices.",
      process: "Technical Test -> 2 Technical Interviews -> HR Round",
      highestPackage: "₹35 LPA",
      criteria: "Expertise in VLSI, Embedded Systems, and Computer Architecture.",
      tags: ["Hardware", "Semiconductors", "Tech"]
    },
    {
      id: "nvidia",
      name: "NVIDIA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
      description: "The pioneer of GPU-accelerated computing, specializing in graphics and AI technology.",
      process: "Technical Screening -> 3-4 Technical Interviews -> HR Round",
      highestPackage: "₹48 LPA",
      criteria: "Strong C++ skills, knowledge of Graphics, AI, and Parallel Computing.",
      tags: ["AI", "Graphics", "Hardware"]
    }
  ];

  return (
    <div className="pb-24">
      <RefreshButton onRefresh={() => window.location.reload()} className="fixed top-24 right-8 z-50 !bg-white/80 backdrop-blur-sm" />
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
            Our Hiring <span className="text-primary">Network</span>
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
              id={partner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[3rem] border border-black/5 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all overflow-hidden scroll-mt-24"
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
