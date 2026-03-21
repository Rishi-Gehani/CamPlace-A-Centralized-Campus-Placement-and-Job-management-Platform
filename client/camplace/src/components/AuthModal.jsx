import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, Circle, Phone, GraduationCap, BookOpen, Award, Code, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS, COLLEGES, FIXED_UNIVERSITY } from '../constants/education';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    department: '',
    degree: '',
    batch: '',
    cgpa: '',
    backlogs: '0',
    tenthPercentage: '',
    twelfthPercentage: '',
    collegeName: '',
    university: FIXED_UNIVERSITY,
    studentId: '',
    skills: '',
    projects: '',
    resumeUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { label: '8-12 characters long', regex: /^.{8,12}$/ },
    { label: 'One uppercase letter', regex: /[A-Z]/ },
    { label: 'One lowercase letter', regex: /[a-z]/ },
    { label: 'One number', regex: /[0-9]/ },
    { label: 'One special symbol', regex: /[^A-Za-z0-9]/ }
  ];

  const validatePassword = (pass) => {
    return passwordRequirements.every(req => req.regex.test(pass));
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone || !formData.gender) {
        setError('Please fill all personal details');
        return;
      }
      if (!formData.email.endsWith('@somaiya.edu')) {
        setError('Please use your somaiya.edu email address');
        return;
      }
      if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      // Check for invalid phone patterns like all same digits
      if (/^(\d)\1{9}$/.test(formData.phone)) {
        setError('Please enter a valid phone number (avoid repeating digits)');
        return;
      }
      if (!validatePassword(formData.password)) {
        setError('Password does not meet requirements');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (step === 2) {
      if (!formData.department || !formData.degree || !formData.batch || !formData.collegeName || !formData.university || !formData.studentId) {
        setError('Please fill all education details');
        return;
      }
      if (formData.batch < 2000 || formData.batch > 2030) {
        setError('Please enter a valid batch year');
        return;
      }
    } else if (step === 3) {
      if (!formData.cgpa || !formData.tenthPercentage || !formData.twelfthPercentage) {
        setError('Please fill all academic details');
        return;
      }
      if (formData.cgpa < 0 || formData.cgpa > 10) {
        setError('CGPA must be between 0 and 10');
        return;
      }
      if (formData.backlogs < 0 || formData.backlogs > 6) {
        setError('Backlogs must be between 0 and 6');
        return;
      }
      if (formData.tenthPercentage < 0 || formData.tenthPercentage > 100 || 
          formData.twelfthPercentage < 0 || formData.twelfthPercentage > 100) {
        setError('Percentage must be between 0 and 100');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      if (!formData.skills || !formData.projects || !formData.resumeUrl) {
        setError('Please add your skills, projects, and resume URL');
        setLoading(false);
        return;
      }

      // Basic URL validation
      try {
        new URL(formData.resumeUrl);
      } catch {
        setError('Please enter a valid Resume URL');
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        projects: formData.projects.split(',').map(p => p.trim()).filter(p => p),
        profileStatus: 'PENDING',
        placementStatus: 'NOT_PLACED'
      };

      const loggedInUser = await register(submissionData);
      if (loggedInUser) {
        onClose();
        if (loggedInUser.role === 'admin') {
          navigate('/admin');
        }
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const loggedInUser = await login(formData.email, formData.password);
      if (loggedInUser) {
        onClose();
        if (loggedInUser.role === 'admin') {
          navigate('/admin');
        }
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Rishi" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Gehani" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="rishi.gehani@somaiya.edu" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="auth-input !pl-4">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="auth-input pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary/60 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="auth-input" />
              </div>
            </div>
            <div className="sm:col-span-2 p-3 bg-black/5 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1.5">Password Requirements</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {passwordRequirements.map((req, idx) => {
                  const isValid = req.regex.test(formData.password);
                  return (
                    <div key={idx} className="flex items-center gap-1.5 text-[9px]">
                      {isValid ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Circle size={10} className="text-secondary/20" />}
                      <span className={isValid ? 'text-secondary font-medium' : 'text-secondary/40'}>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Department</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value, degree: '' });
                  }} 
                  className="auth-input !pl-12"
                >
                  <option value="">Select Department</option>
                  {Object.keys(DEPARTMENTS).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Degree</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <select 
                  name="degree" 
                  value={formData.degree} 
                  onChange={handleChange} 
                  disabled={!formData.department}
                  className="auth-input !pl-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Degree</option>
                  {formData.department && DEPARTMENTS[formData.department]?.map(degree => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Batch (Year)</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="number" name="batch" value={formData.batch} onChange={handleChange} placeholder="2025" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Student ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="CE2025_112" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">College Name</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <select 
                  name="collegeName" 
                  value={formData.collegeName} 
                  onChange={handleChange} 
                  className="auth-input !pl-12"
                >
                  <option value="">Select College</option>
                  {COLLEGES.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">University</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input 
                  type="text" 
                  name="university" 
                  value={formData.university} 
                  readOnly 
                  className="auth-input bg-black/5 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Current CGPA</label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="8.4" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Active Backlogs</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} placeholder="0" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">10th Percentage</label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="number" step="0.01" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange} placeholder="85" className="auth-input" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">12th Percentage</label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="number" step="0.01" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleChange} placeholder="88" className="auth-input" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 gap-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Skills (Comma separated)</label>
              <div className="relative">
                <Code className="absolute left-4 top-4 text-secondary/30" size={18} />
                <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node, MongoDB" className="auth-input !pl-12 min-h-[80px] py-3" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Projects (Comma separated)</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-4 text-secondary/30" size={18} />
                <textarea name="projects" value={formData.projects} onChange={handleChange} placeholder="Placement System, E-commerce Website" className="auth-input !pl-12 min-h-[80px] py-3" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Resume URL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input type="text" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://cloudinary/resume.pdf" className="auth-input" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row min-h-[500px]"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-[60]">
            <X size={20} />
          </button>

          {/* Left Side: Branding */}
          <div className="hidden md:flex md:w-[35%] bg-primary p-12 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-primary" size={24} />
                </div>
                <span className="text-2xl font-display font-bold text-secondary tracking-tight">CamPlace</span>
              </div>
              <h3 className="text-4xl font-display font-bold text-secondary leading-tight mb-4">
                {mode === 'login' ? 'Welcome back to your future.' : 'Start your journey with us.'}
              </h3>
              <p className="text-secondary/70 text-lg">
                {mode === 'login' 
                  ? 'Access the best placement opportunities curated just for you.' 
                  : `Step ${step} of 4: ${step === 1 ? 'Personal' : step === 2 ? 'Education' : step === 3 ? 'Academic' : 'Skills'}`}
              </p>
            </div>
            
            <div className="relative z-10">
              <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-secondary/20 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">+2k</div>
              </div>
              <p className="text-secondary/50 text-sm font-medium">Joined by 2,000+ Somaiya students</p>
            </div>

            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-[65%] p-8 md:p-10 overflow-y-auto max-h-[90vh] md:max-h-none">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-display font-bold tracking-tight mb-2">
                  {mode === 'login' ? 'Login' : 'Create Account'}
                </h2>
                <p className="text-secondary/60">
                  {mode === 'login' ? 'Enter your credentials to access your portal' : 'Fill in your details to get started'}
                </p>
              </div>

              {(error || authError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error || authError}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="yourname@somaiya.edu" className="auth-input" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="auth-input pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary/60 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-secondary font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-4">
                    {loading ? 'Processing...' : 'Login'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-primary text-secondary' : 'bg-black/5 text-secondary/30'}`}>
                          {s}
                        </div>
                        {s < 4 && <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-black/5'}`} />}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {renderStep()}
                    
                    <div className="flex gap-4 pt-4">
                      {step > 1 && (
                        <button type="button" onClick={prevStep} className="flex-1 py-4 border border-black/10 text-secondary font-bold rounded-2xl hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                          <ChevronLeft size={18} /> Back
                        </button>
                      )}
                      {step < 4 ? (
                        <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-primary text-secondary font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                          Next Step <ChevronRight size={18} />
                        </button>
                      ) : (
                        <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-secondary font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                          {loading ? 'Processing...' : 'Complete Registration'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-black/5 text-center">
                <p className="text-sm text-secondary/60">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="ml-2 font-bold text-primary hover:underline">
                    {mode === 'login' ? 'Register Now' : 'Login Instead'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
