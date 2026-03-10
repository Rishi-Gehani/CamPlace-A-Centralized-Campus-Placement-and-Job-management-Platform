import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, Circle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      if (!formData.email.endsWith('@somaiya.edu')) {
        setError('Please use your somaiya.edu email address');
        setLoading(false);
        return;
      }
      if (!validatePassword(formData.password)) {
        setError('Password does not meet requirements');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const success = await register(formData.firstName, formData.lastName, formData.email, formData.password);
      if (success) onClose();
    } else {
      if (!formData.email || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const success = await login(formData.email, formData.password);
      if (success) onClose();
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row min-h-[500px]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-[60]"
          >
            <X size={20} />
          </button>

          {/* Left Side: Branding/Image */}
          <div className="hidden md:flex md:w-[35%] bg-primary p-12 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Shield className="text-primary" size={24} />
                </div>
                <span className="text-2xl font-display font-bold text-secondary tracking-tight">CamPlace</span>
              </div>
              <h3 className="text-4xl font-display font-bold text-secondary leading-tight mb-4">
                {mode === 'login' ? 'Welcome back to your future.' : 'Start your journey with us.'}
              </h3>
              <p className="text-secondary/70 text-lg">
                {mode === 'login' 
                  ? 'Access the best placement opportunities curated just for you.' 
                  : 'Create an account to unlock exclusive campus placement resources.'}
              </p>
            </div>
            
            <div className="relative z-10">
              <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-secondary/20 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                  +2k
                </div>
              </div>
              <p className="text-secondary/50 text-sm font-medium">Joined by 2,000+ Somaiya students</p>
            </div>

            {/* Decorative elements */}
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
                  {mode === 'login' 
                    ? 'Enter your credentials to access your portal' 
                    : 'Fill in your details to get started'}
                </p>
              </div>

              {(error || authError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error || authError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="w-full pl-12 pr-4 py-2.5 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="w-full pl-12 pr-4 py-2.5 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="yourname@somaiya.edu"
                          className="w-full pl-12 pr-4 py-2.5 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-2.5 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary/60 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-2.5 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-black/5 rounded-2xl flex flex-col justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1.5">Password Requirements</p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {passwordRequirements.map((req, idx) => {
                          const isValid = req.regex.test(formData.password);
                          return (
                            <div key={idx} className="flex items-center gap-1.5 text-[9px]">
                              {isValid ? (
                                <CheckCircle2 size={10} className="text-emerald-500" />
                              ) : (
                                <Circle size={10} className="text-secondary/20" />
                              )}
                              <span className={isValid ? 'text-secondary font-medium' : 'text-secondary/40'}>
                                {req.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="sm:col-span-2 w-full py-3.5 bg-primary text-secondary font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-2"
                    >
                      {loading ? 'Processing...' : 'Create Account'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="yourname@somaiya.edu"
                          className="w-full pl-12 pr-4 py-3 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-secondary/50 ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 bg-black/5 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary/60 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-primary text-secondary font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-4"
                    >
                      {loading ? 'Processing...' : 'Login'}
                    </button>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-4 border-t border-black/5 text-center">
                <p className="text-sm text-secondary/60">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="ml-2 font-bold text-primary hover:underline"
                  >
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
