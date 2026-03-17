import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { firstName, lastName, email, subject, message } = formData;

    // Basic required check
    if (!firstName || !lastName || !email || !subject || !message) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // Name validation (alphabetic only, 2-50 chars)
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(firstName)) {
      setError("First name should be 2-50 characters long and contain only letters.");
      setLoading(false);
      return;
    }
    if (!nameRegex.test(lastName)) {
      setError("Last name should be 2-50 characters long and contain only letters.");
      setLoading(false);
      return;
    }

    // Email validation
    if (!email.endsWith("@somaiya.edu")) {
      setError("Please use your official @somaiya.edu email address.");
      setLoading(false);
      return;
    }

    // Message validation (10-1000 chars)
    if (message.length < 10) {
      setError("Message should be at least 10 characters long.");
      setLoading(false);
      return;
    }
    if (message.length > 1000) {
      setError("Message is too long (max 1000 characters).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "General Inquiry",
          message: ""
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to submit query");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
                  <p className="text-secondary/60">Support: rishi.gehani@somaiya.edu</p>
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
                  <p className="text-secondary/60">4th floor, Aurobindo Building, Somaiya Vidyavihar University</p>
                  <p className="text-secondary/60">Vidyavihar (East), India - 400077</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 z-10 flex items-center justify-center p-10 lg:p-12 rounded-[3rem] bg-emerald-500 text-white text-center"
                >
                  <div className="space-y-4">
                    <CheckCircle2 size={64} className="mx-auto" />
                    <h3 className="text-2xl font-bold">Query Submitted!</h3>
                    <p className="text-white/80 font-medium">Your query has been submitted successfully. Our team will contact you soon.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-10 lg:p-12 rounded-[3rem] bg-white border border-black/5 shadow-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field" 
                      placeholder="First Name" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field" 
                      placeholder="Last Name" 
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="yourname@somaiya.edu" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Placement Support</option>
                    <option>Technical Issue</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-secondary/40">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    className="input-field" 
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-secondary w-full flex items-center justify-center gap-2 !py-4 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
