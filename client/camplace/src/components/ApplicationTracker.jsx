import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, AlertCircle, XCircle } from 'lucide-react';

const STAGES = [
  { id: 'APPLIED', label: 'Applied' },
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'INTERVIEW_ROUND_1', label: 'Aptitude' },
  { id: 'INTERVIEW_ROUND_2', label: 'Technical' },
  { id: 'INTERVIEW_ROUND_3', label: 'HR' },
  { id: 'SELECTED', label: 'Selected' }
];

export default function ApplicationTracker({ currentStage, rejectedAtStage }) {
  const isRejected = currentStage === 'REJECTED';
  const isSelected = currentStage === 'SELECTED';
  
  // If rejected but no stage recorded (legacy data), default to 'APPLIED'
  const effectiveStage = isRejected ? (rejectedAtStage || 'APPLIED') : currentStage;
  const currentIndex = STAGES.findIndex(s => s.id === effectiveStage);
  
  // Ensure currentIndex is at least 0 to avoid layout issues
  const safeIndex = Math.max(0, currentIndex);

  return (
    <div className={`w-full py-8 px-6 rounded-[2rem] transition-all duration-500 ${
      isSelected ? 'bg-emerald-50/50 border border-emerald-100' : 
      isRejected ? 'bg-red-50/50 border border-red-100' : 
      'bg-transparent'
    }`}>
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-black/5 rounded-full" />
        
        {/* Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(safeIndex / (STAGES.length - 1)) * 100}%` }}
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full ${
            isSelected ? 'bg-emerald-500' : 
            isRejected ? 'bg-red-500' : 
            'bg-primary'
          }`}
        />

        {/* Steps */}
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < safeIndex;
          const isCurrent = idx === safeIndex;

          return (
            <div key={stage.id} className="relative flex flex-col items-center gap-3 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isCompleted ? (
                  isSelected ? 'bg-emerald-200 text-emerald-600' :
                  isRejected ? 'bg-red-200 text-red-600' : 
                  'bg-primary text-white'
                ) : 
                isCurrent ? (
                  isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                  isRejected ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 
                  'bg-white border-4 border-primary text-primary shadow-lg shadow-primary/20'
                ) :
                'bg-white border-2 border-black/5 text-secondary/20'
              }`}>
                {isCompleted ? <CheckCircle2 size={20} /> : 
                 isCurrent ? (
                   isSelected ? <CheckCircle2 size={20} /> :
                   isRejected ? <XCircle size={20} /> : 
                   <Clock size={20} className="animate-pulse" />
                 ) :
                 <Circle size={20} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                isCurrent ? (
                  isSelected ? 'text-emerald-600' :
                  isRejected ? 'text-red-500' : 
                  'text-primary'
                ) : 
                'text-secondary/40'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {isRejected && (
        <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">Your application was rejected at the <strong>{STAGES.find(s => s.id === rejectedAtStage)?.label || 'initial'}</strong> stage.</p>
        </div>
      )}

      {isSelected && (
        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">Congratulations! You have been <strong>Selected</strong> for this position.</p>
        </div>
      )}
    </div>
  );
}
