import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import RefreshButton from "../components/RefreshButton";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Shield,
      title: "Information Collection",
      content: "We collect personal information that you provide to us, such as your name, email address, phone number, academic records, and professional details when you register on our portal. This information is essential for the recruitment and placement process."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and is only accessible by authorized personnel (Placement Cell administrators) and verified recruiters for the purpose of placement."
    },
    {
      icon: Eye,
      title: "Information Disclosure",
      content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties (recruiters) who assist us in conducting our placement activities, so long as those parties agree to keep this information confidential."
    },
    {
      icon: FileText,
      title: "Usage of Information",
      content: "The information we collect from you may be used to personalize your experience, improve our website, process applications, and send periodic emails regarding placement opportunities and notices."
    },
    {
      icon: CheckCircle2,
      title: "Student Consent",
      content: "By using our portal, you consent to our privacy policy. You have the right to update your information at any time through your profile settings. For any data deletion requests, please contact the Placement Cell directly."
    }
  ];

  return (
    <div className="pb-24 bg-[#F8F9FA]">
      <RefreshButton />
      
      {/* Hero */}
      <section className="bg-secondary text-white py-24 lg:py-32">
        <div className="page-container text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Privacy <span className="text-primary">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            How we protect and manage your data at CamPlace.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 page-container">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-black/5 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-secondary">Our Commitment to Privacy</h2>
              <p className="text-secondary/60 leading-relaxed">
                At CamPlace, we take your privacy seriously. This policy outlines how we handle your personal and academic data to ensure a secure and transparent placement experience for all Somaiya students.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {sections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <section.icon size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-secondary">{section.title}</h3>
                    <p className="text-secondary/60 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-12 border-t border-black/5">
              <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest text-center">
                Last Updated: March 18, 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
