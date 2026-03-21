import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="text-secondary" size={24} />
              </div>
              <span className="text-2xl font-display font-bold tracking-tighter">CamPlace</span>
            </Link>
            <p className="text-white/60 leading-relaxed">
              Empowering students to reach their career goals through a centralized, efficient placement management system.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://x.com/GehaniRishi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/rishi-gehani-10291126a/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://github.com/Rishi-Gehani" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Opportunities</Link></li>
              <li><Link to="/network" className="hover:text-primary transition-colors">Our Network</Link></li>
              <li><Link to="/forum" className="hover:text-primary transition-colors">Forum</Link></li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-lg font-bold mb-6">Pages</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Manual</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>rishi.gehani@somaiya.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={45} className="text-primary" />
                <span>4th floor, Aurobindo Building, Somaiya Vidyavihar University, Vidyavihar (East), India - 400077</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} CamPlace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
