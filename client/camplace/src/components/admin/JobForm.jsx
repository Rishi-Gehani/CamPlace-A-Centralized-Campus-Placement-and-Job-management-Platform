import { useState, useEffect } from 'react';
import { X, Save, Building2, MapPin, DollarSign, Calendar, Briefcase, Info } from 'lucide-react';

const TAG_OPTIONS = [
  'Frontend', 'Backend', 'Full Stack', 'Technical Support', 
  'Data Science', 'DBMS', 'Cybersecurity', 'DevOps', 'Mobile Development'
];

export default function JobForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    location: '',
    salary: '',
    type: 'Job',
    internshipDuration: '',
    description: '',
    eligibility: '',
    deadline: '',
    tags: [],
    interviewRounds: ['Aptitude', 'Technical', 'HR'],
    interviewDate: '',
    interviewTime: ''
  });

  useEffect(() => {
    const initializeForm = () => {
      if (initialData) {
        setFormData({
          ...initialData,
          deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
          interviewDate: initialData.interviewDate ? new Date(initialData.interviewDate).toISOString().split('T')[0] : '',
          interviewTime: initialData.interviewTime || ''
        });
      }
    };
    initializeForm();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
              <input
                required
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Company Logo URL</label>
            <div className="relative">
              <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
              <input
                required
                type="url"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Location & Salary */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote / Mumbai"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Salary / Stipend</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
              <input
                required
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="12 LPA / 25k per month"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            {formData.type === 'Internship' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Duration</label>
                <input
                  required
                  type="text"
                  name="internshipDuration"
                  value={formData.internshipDuration}
                  onChange={handleChange}
                  placeholder="6 Months"
                  className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Eligibility */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Job Description</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the role and responsibilities..."
            className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Eligibility Criteria</label>
          <textarea
            required
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            rows={3}
            placeholder="B.Tech, 7.5+ CGPA, No active backlogs..."
            className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadline */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Application Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
            <input
              required
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Interview Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Interview Time</label>
            <input
              type="time"
              name="interviewTime"
              value={formData.interviewTime}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/40 ml-1">Tags</label>
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl border border-black/5 bg-black/[0.02]">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  formData.tags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-white text-secondary/60 hover:bg-white/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 border border-black/10 text-secondary font-bold rounded-2xl hover:bg-black/5 transition-all flex items-center gap-2"
        >
          <X size={18} /> Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary !py-4 !px-8 flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? 'Processing...' : <><Save size={18} /> {initialData ? 'Update Job' : 'Post Job'}</>}
        </button>
      </div>
    </form>
  );
}
