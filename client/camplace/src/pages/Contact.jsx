import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-secondary text-white py-24 lg:py-32">
        <div className="page-container text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Get in <span className="text-primary">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Have questions? We&apos;re here to help you navigate your placement journey.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="section-title">Contact Information</h2>
              <p className="body-text">Reach out to us through any of these channels.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Email Us</h4>
                  <p className="text-secondary/60">General Inquiries: hello@camplace.edu</p>
                  <p className="text-secondary/60">Support: support@camplace.edu</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Call Us</h4>
                  <p className="text-secondary/60">Main Office: +91 98765 43210</p>
                  <p className="text-secondary/60">Placement Cell: +91 12345 67890</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Visit Us</h4>
                  <p className="text-secondary/60">Tech University Campus, Block A</p>
                  <p className="text-secondary/60">New Delhi, India - 110001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 lg:p-12 rounded-[3rem] bg-white border border-black/5 shadow-xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">First Name</label>
                  <input type="text" className="input-field" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Last Name</label>
                  <input type="text" className="input-field" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Email Address</label>
                <input type="email" className="input-field" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Subject</label>
                <select className="input-field appearance-none">
                  <option>General Inquiry</option>
                  <option>Placement Support</option>
                  <option>Technical Issue</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Message</label>
                <textarea rows={4} className="input-field" placeholder="How can we help you?"></textarea>
              </div>
              <button className="btn-secondary w-full flex items-center justify-center gap-2 !py-4">
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
