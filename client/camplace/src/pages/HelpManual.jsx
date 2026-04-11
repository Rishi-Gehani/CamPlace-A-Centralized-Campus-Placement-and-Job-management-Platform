import { motion } from "motion/react";
import { HelpCircle, Book, Shield, User, MessageSquare, Briefcase, CheckCircle, Info } from "lucide-react";

export default function HelpManual() {
  const sections = [
    {
      title: "Getting Started",
      icon: <Book className="text-primary" />,
      content: [
        "Register using your official @somaiya.edu email address.",
        "Complete your profile with accurate academic details (CGPA, Batch, etc.).",
        "Wait for admin verification. You can only apply to jobs once verified.",
      ]
    },
    {
      title: "Managing Your Profile",
      icon: <User className="text-primary" />,
      content: [
        "Access your profile from the sidebar dashboard.",
        "Keep your skills and projects updated to attract recruiters.",
        "Ensure your Resume URL is accessible and up-to-date.",
      ]
    },
    {
      title: "Job Applications",
      icon: <Briefcase className="text-primary" />,
      content: [
        "Browse opportunities in the 'Opportunities' tab.",
        "Check eligibility criteria before applying.",
        "Track your application status (Pending, Shortlisted, Selected, Rejected) in real-time.",
      ]
    },
    {
      title: "Security & Passwords",
      icon: <Shield className="text-primary" />,
      content: [
        "Password Security: Use a strong password with uppercase, lowercase, numbers, and symbols.",
        "Changing Password: You can change your password from the 'Change Password' section in your profile.",
        "Forgot Password: The placement process is highly confidential. To reset a forgotten password, please visit the Placement Cell in person with your Identity Card (ID Card) and request a manual reset. This ensures your account remains secure.",
        "Account Deletion: Account deletion requests must be made in person at the Placement Cell. Students are required to submit a written declaration stating valid reasons for the request along with their Identity Card (ID Card). Please note that submitting a request does not guarantee account deletion. The request will be reviewed by the Placement Cell, and deletion will only be approved if the provided reasons are deemed valid and appropriate.",
      ]
    },
    {
      title: "Communication",
      icon: <MessageSquare className="text-primary" />,
      content: [
        "Use the 'Contact' page to raise queries to the placement cell.",
        "Check the 'Notices' section regularly for important updates.",
        "Participate in the community discussions for placement tips.",
      ]
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F8F9FA]">
      <div className="page-container max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-secondary">User Help Manual</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto">
            Welcome to the CamPlace Help Center. Find everything you need to know about using the platform effectively.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-secondary">{section.title}</h2>
              </div>
              <ul className="space-y-4">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-secondary/70 leading-relaxed">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 rounded-[2.5rem] bg-secondary text-white text-center space-y-4"
        >
          <Info className="mx-auto text-primary" size={32} />
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-white/60">
            If you encounter any issues not covered in this manual, please reach out to the placement cell via the Contact form.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
