import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, GraduationCap, BookOpen, Award, Code, Briefcase, Shield, CheckCircle2, AlertCircle, Save, Edit2, X, Building2, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { DEPARTMENTS, COLLEGES } from '../constants/education';
import ApplicationTracker from '../components/ApplicationTracker';
import { io } from 'socket.io-client';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-black/5">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
      <Icon size={20} />
    </div>
    <h3 className="text-xl font-bold text-secondary">{title}</h3>
  </div>
);

const InputField = ({ label, name, value, type = "text", placeholder, icon: Icon, disabled = false, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />}
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={!isEditing || disabled}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-black/[0.02] disabled:text-secondary/60`}
      />
    </div>
  </div>
);

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'applications'
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchApplications();

      const socket = io();
      socket.emit('join', user.id);

      socket.on('applicationUpdate', (data) => {
        setMyApplications(prev => prev.map(app => 
          app._id === data.applicationId ? { ...app, currentStage: data.status, rejectedAtStage: data.rejectedAtStage } : app
        ));
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/auth/user', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          ...data,
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
          projects: Array.isArray(data.projects) ? data.projects.join(', ') : data.projects
        });
      }
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/applications/my', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (res.ok) {
        const data = await res.json();
        setMyApplications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const submissionData = {
        ...profileData,
        skills: typeof profileData.skills === 'string' ? profileData.skills.split(',').map(s => s.trim()).filter(s => s) : profileData.skills,
        projects: typeof profileData.projects === 'string' ? profileData.projects.split(',').map(p => p.trim()).filter(p => p) : profileData.projects
      };

      const res = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Refresh data
        const updatedData = await res.json();
        setProfileData({
          ...updatedData,
          skills: Array.isArray(updatedData.skills) ? updatedData.skills.join(', ') : updatedData.skills,
          projects: Array.isArray(updatedData.projects) ? updatedData.projects.join(', ') : updatedData.projects
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Update failed');
      }
    } catch {
      setError('Server error');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-32">
      <div className="page-container max-w-6xl">
        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-black/5 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center text-primary text-5xl font-display font-bold shadow-xl shadow-secondary/20">
              {profileData?.firstName?.charAt(0) || user.firstName?.charAt(0)}
            </div>
            <div className="flex-grow text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-display font-bold text-secondary">{profileData?.firstName} {profileData?.lastName}</h1>
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${profileData?.profileStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {profileData?.profileStatus || 'PENDING'}
                </span>
              </div>
              <p className="text-secondary/60 font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {profileData?.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="px-4 py-2 bg-black/5 rounded-xl text-sm font-bold text-secondary/60 flex items-center gap-2">
                  <Shield size={14} /> {profileData?.studentId}
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  profileData?.placementStatus === 'PLACED' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  <Briefcase size={14} /> {profileData?.placementStatus?.replace('_', ' ') || 'NOT PLACED'}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing && activeTab === 'profile' && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary !py-4 !px-8 flex items-center gap-2 shadow-lg shadow-secondary/20"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              )}
              {isEditing && (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 border border-black/10 text-secondary font-bold rounded-2xl hover:bg-black/5 transition-all flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary !py-4 !px-8 flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 flex items-center gap-8 border-b border-black/5">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'profile' ? 'text-primary' : 'text-secondary/40 hover:text-secondary'}`}
            >
              Profile Details
              {activeTab === 'profile' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'applications' ? 'text-primary' : 'text-secondary/40 hover:text-secondary'}`}
            >
              My Applications
              {activeTab === 'applications' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-2xl flex items-center gap-3">
            <CheckCircle2 size={20} /> {success}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Personal & Academic */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5">
                  <SectionHeader icon={User} title="Personal Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="First Name" name="firstName" value={profileData?.firstName} icon={User} onChange={handleChange} isEditing={isEditing} />
                    <InputField label="Last Name" name="lastName" value={profileData?.lastName} icon={User} onChange={handleChange} isEditing={isEditing} />
                    <InputField label="Phone Number" name="phone" value={profileData?.phone} icon={Phone} onChange={handleChange} isEditing={isEditing} />
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Gender</label>
                      <select 
                        name="gender" 
                        value={profileData?.gender || ''} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-black/[0.02]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5">
                  <SectionHeader icon={GraduationCap} title="Education & Academic" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Department</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <select 
                          name="department" 
                          value={profileData?.department || ''} 
                          onChange={(e) => {
                            setProfileData({ ...profileData, department: e.target.value, degree: '' });
                          }}
                          disabled={true}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-black/[0.02] text-secondary/60 shadow-sm focus:outline-none transition-all"
                        >
                          <option value="">Select Department</option>
                          {Object.keys(DEPARTMENTS).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Degree</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <select 
                          name="degree" 
                          value={profileData?.degree || ''} 
                          onChange={handleChange}
                          disabled={true}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-black/[0.02] text-secondary/60 shadow-sm focus:outline-none transition-all"
                        >
                          <option value="">Select Degree</option>
                          {profileData?.department && DEPARTMENTS[profileData.department]?.map(degree => (
                            <option key={degree} value={degree}>{degree}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <InputField label="Batch Year" name="batch" value={profileData?.batch} type="number" icon={Shield} onChange={handleChange} isEditing={false} />
                    <InputField label="Student ID" name="studentId" value={profileData?.studentId} icon={User} onChange={handleChange} isEditing={false} />
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">College Name</label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                        <select 
                          name="collegeName" 
                          value={profileData?.collegeName || ''} 
                          onChange={handleChange}
                          disabled={true}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-black/[0.02] text-secondary/60 shadow-sm focus:outline-none transition-all"
                        >
                          <option value="">Select College</option>
                          {COLLEGES.map(college => (
                            <option key={college} value={college}>{college}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <InputField label="University" name="university" value={profileData?.university} icon={Shield} onChange={handleChange} isEditing={false} />
                    <InputField label="Current CGPA" name="cgpa" value={profileData?.cgpa} type="number" icon={Award} onChange={handleChange} isEditing={isEditing} />
                    <InputField label="Active Backlogs" name="backlogs" value={profileData?.backlogs} type="number" icon={BookOpen} onChange={handleChange} isEditing={isEditing} />
                    <InputField label="10th Percentage" name="tenthPercentage" value={profileData?.tenthPercentage} type="number" icon={Award} onChange={handleChange} isEditing={false} />
                    <InputField label="12th Percentage" name="twelfthPercentage" value={profileData?.twelfthPercentage} type="number" icon={Award} onChange={handleChange} isEditing={false} />
                  </div>
                </div>
              </div>

              {/* Skills & Projects */}
              <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5">
                  <SectionHeader icon={Code} title="Skills & Projects" />
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Skills (Comma separated)</label>
                      <textarea
                        name="skills"
                        value={profileData?.skills || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="React, Node, MongoDB"
                        className="w-full px-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] disabled:bg-black/[0.02]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Projects (Comma separated)</label>
                      <textarea
                        name="projects"
                        value={profileData?.projects || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="E-commerce, Portfolio"
                        className="w-full px-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] disabled:bg-black/[0.02]"
                      />
                    </div>
                    <InputField label="Resume URL" name="resumeUrl" value={profileData?.resumeUrl} icon={Mail} onChange={handleChange} isEditing={isEditing} />
                  </div>
                </div>

                <div className="bg-secondary rounded-[2.5rem] p-10 text-white space-y-6">
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="text-primary" size={20} /> Account Security
                  </h4>
                  <p className="text-white/60 text-sm">
                    Your profile is currently {profileData?.profileStatus === 'VERIFIED' ? 'verified' : 'under review'}. Verified profiles get priority in job applications.
                  </p>
                  <div className="pt-4">
                    <Link 
                      to="/change-password"
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all text-sm flex items-center justify-center"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="applications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {myApplications.length > 0 ? (
                myApplications.map((app) => (
                  <div key={app._id} className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center p-2">
                          {app.jobId ? (
                            <img src={app.jobId.companyLogo} alt={app.jobId.company} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <Briefcase className="text-secondary/20" size={32} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-secondary">{app.jobId?.title || 'Job Deleted'}</h3>
                          <p className="text-primary font-bold flex items-center gap-2">
                            <Building2 size={16} /> {app.jobId?.company || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-black/5 rounded-xl text-xs font-bold text-secondary/60 flex items-center gap-2">
                          <MapPin size={14} /> {app.jobId?.location || 'N/A'}
                        </div>
                        <div className="px-4 py-2 bg-black/5 rounded-xl text-xs font-bold text-secondary/60 flex items-center gap-2">
                          <Calendar size={14} /> Applied on {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-black/5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-6">Application Progress</h4>
                      <ApplicationTracker currentStage={app.currentStage} rejectedAtStage={app.rejectedAtStage} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border border-black/5 shadow-sm">
                  <div className="w-20 h-20 rounded-3xl bg-black/5 flex items-center justify-center text-secondary/20 mx-auto mb-6">
                    <Briefcase size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">No applications yet</h3>
                  <p className="text-secondary/40 max-w-md mx-auto mb-8">
                    You haven&apos;t applied to any opportunities yet. Start exploring jobs to kickstart your career.
                  </p>
                  <Link to="/jobs" className="btn-primary !py-4 !px-10">
                    Explore Jobs
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
