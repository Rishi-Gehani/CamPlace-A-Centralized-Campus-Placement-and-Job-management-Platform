import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

const STAGES = [
  { id: 'APPLIED', label: 'Applied' },
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'INTERVIEW_ROUND_1', label: 'Aptitude' },
  { id: 'INTERVIEW_ROUND_2', label: 'Technical' },
  { id: 'INTERVIEW_ROUND_3', label: 'HR' },
  { id: 'SELECTED', label: 'Selected' }
];

export default function ApplicationTracker({ currentStage }) {
  const isRejected = currentStage === 'REJECTED';
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full py-8">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-black/5 rounded-full" />
        
        {/* Progress Line */}
        {!isRejected && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full"
          />
        )}

        {/* Steps */}
        {STAGES.map((stage, idx) => {
          const isCompleted = !isRejected && idx < currentIndex;
          const isCurrent = !isRejected && idx === currentIndex;

          return (
            <div key={stage.id} className="relative flex flex-col items-center gap-3 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isCompleted ? 'bg-primary text-white' : 
                isCurrent ? 'bg-white border-4 border-primary text-primary shadow-lg shadow-primary/20' :
                isRejected && idx <= currentIndex ? 'bg-red-500 text-white' :
                'bg-white border-2 border-black/5 text-secondary/20'
              }`}>
                {isCompleted ? <CheckCircle2 size={20} /> : 
                 isCurrent ? <Clock size={20} className="animate-pulse" /> :
                 isRejected && idx === currentIndex ? <AlertCircle size={20} /> :
                 <Circle size={20} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                isCurrent ? 'text-primary' : 
                isRejected && idx === currentIndex ? 'text-red-500' :
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
          <p className="text-sm font-medium">Your application has been rejected at the current stage.</p>
        </div>
      )}
    </div>
  );
}
