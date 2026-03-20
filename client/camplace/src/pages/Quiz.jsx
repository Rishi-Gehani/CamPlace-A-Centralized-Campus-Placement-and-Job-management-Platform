import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  AlertCircle,
  CheckCircle2,
  BarChart3,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadialBarChart,
  RadialBar
} from 'recharts';
import { QUIZ_QUESTIONS } from '../constants/quizQuestions';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = [
  "Computer Science & IT",
  "Business & Management",
  "Accounting & Finance",
  "Science",
  "Engineering"
];

export default function Quiz() {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();
  
  const [selectedDept, setSelectedDept] = useState(null);
  const [quizState, setQuizState] = useState('selection'); // selection, loading, taking, results
  const [currentStep, setCurrentStep] = useState(0); // 0 to 12 (6 core + 7 track)
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState([]);

  // Fetch all results for the user on mount
  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/quiz/results', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (response.ok) {
        const data = await response.json();
        setAllResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const checkQuizStatus = async (dept) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/quiz/check/${encodeURIComponent(dept)}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      const data = await response.json();
      
      if (data.completed) {
        setResults(data.result);
        setQuizState('results');
      } else {
        setSelectedDept(dept);
        setQuizState('taking');
        setCurrentStep(0);
        setAnswers({});
      }
    } catch (error) {
      console.error('Error checking quiz status:', error);
      showToast('Error checking quiz status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const questions = useMemo(() => {
    if (!selectedDept) return [];
    return [...QUIZ_QUESTIONS.coreQuestions, ...QUIZ_QUESTIONS.tracks[selectedDept]];
  }, [selectedDept]);

  const handleAnswer = (questionId, points) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    const percentage = (totalScore / QUIZ_QUESTIONS.maxScore) * 100;

    // Prepare QnA History for Gemini
    const qnaHistory = questions.map(q => {
      const selectedOption = q.options.find(opt => opt.points === answers[q.id]);
      return {
        question: q.question,
        answer: selectedOption?.text || 'No answer',
        points: answers[q.id] || 0
      };
    });

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          department: selectedDept,
          score: totalScore,
          maxScore: QUIZ_QUESTIONS.maxScore,
          percentage: Math.round(percentage),
          qnaHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setQuizState('results');
        fetchResults();
        showToast('Quiz submitted successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to submit quiz', 'error');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      showToast('Error submitting quiz', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getReadinessLevel = (pct) => {
    if (pct >= 85) return { label: 'Highly Ready', color: '#10b981', desc: 'You are in excellent shape for placements!' };
    if (pct >= 70) return { label: 'Ready', color: '#3b82f6', desc: 'You have a strong foundation, just a few more refinements needed.' };
    if (pct >= 50) return { label: 'Average', color: '#f59e0b', desc: 'You are on the right track but need significant improvement in some areas.' };
    return { label: 'Needs Work', color: '#ef4444', desc: 'Focus on building your portfolio and core skills immediately.' };
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="text-primary" size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Placement Readiness Quiz</h1>
          <p className="text-secondary/60 mb-8">
            Assess your skills and get a detailed report of your placement readiness. Please login to take the quiz.
          </p>
          <button onClick={() => openAuthModal('login')} className="btn-primary w-full">
            Login to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="page-container max-w-4xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold mb-4"
          >
            Placement Readiness Assessment
          </motion.h1>
          <p className="text-secondary/60 max-w-2xl mx-auto">
            Evaluate your professional standing and technical expertise across various domains.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Department Selection */}
          {quizState === 'selection' && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {DEPARTMENTS.map((dept) => {
                const completed = allResults.find(r => r.department === dept);
                return (
                  <button
                    key={dept}
                    onClick={() => checkQuizStatus(dept)}
                    disabled={loading}
                    className={`p-8 rounded-3xl text-left transition-all group relative overflow-hidden ${
                      completed 
                        ? 'bg-white border-2 border-emerald-100 shadow-sm' 
                        : 'bg-white border-2 border-transparent shadow-sm hover:border-primary/30 hover:shadow-xl'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                      completed ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                      {completed ? <CheckCircle2 size={24} /> : <BarChart3 size={24} />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{dept}</h3>
                    <p className="text-sm text-secondary/50 mb-4">
                      {completed ? `Score: ${completed.percentage}%` : '13 Questions • 15 Mins'}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-2 transition-transform">
                      <span>{completed ? 'View Result' : 'Start Quiz'}</span>
                      <ChevronRight size={16} />
                    </div>
                    {completed && (
                      <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Completed
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Taking Quiz */}
          {quizState === 'taking' && selectedDept && (
            <motion.div 
              key="taking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 w-full">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="p-10 md:p-16">
                <div className="flex justify-between items-center mb-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary/40">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {currentStep < 6 ? 'Core Foundation' : `${selectedDept} Track`}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={questions[currentStep].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-[300px]"
                  >
                    <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 leading-tight">
                      {questions[currentStep].question}
                    </h2>

                    <div className="space-y-4">
                      {questions[currentStep].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(questions[currentStep].id, option.points)}
                          className={`w-full p-6 rounded-2xl text-left border-2 transition-all flex items-center justify-between group ${
                            answers[questions[currentStep].id] === option.points
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                          }`}
                        >
                          <span className={`font-medium ${
                            answers[questions[currentStep].id] === option.points ? 'text-primary' : 'text-secondary'
                          }`}>
                            {option.text}
                          </span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            answers[questions[currentStep].id] === option.points
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-200 group-hover:border-primary/50'
                          }`}>
                            {answers[questions[currentStep].id] === option.points && <CheckCircle2 size={14} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-16 flex justify-between items-center">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 font-bold transition-colors ${
                      currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-secondary/40 hover:text-secondary'
                    }`}
                  >
                    <ChevronLeft size={20} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={answers[questions[currentStep].id] === undefined || loading}
                    className="btn-primary flex items-center gap-2 group"
                  >
                    <span>{currentStep === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
                    {loading ? (
                      <RefreshCcw size={18} className="animate-spin" />
                    ) : (
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {quizState === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Left Side: Graph */}
                <div className="w-full md:w-1/2 h-[300px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="70%" 
                      outerRadius="100%" 
                      data={[{ name: 'Readiness', value: results.percentage, fill: getReadinessLevel(results.percentage).color }]} 
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar minAngle={15} background dataKey="value" cornerRadius={30} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
                    <span className="text-5xl font-display font-bold" style={{ color: getReadinessLevel(results.percentage).color }}>
                      {results.percentage}%
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary/40">Readiness Score</span>
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold">
                    <Trophy size={16} />
                    <span>Assessment Completed</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold">
                    {getReadinessLevel(results.percentage).label}
                  </h2>
                  <p className="text-secondary/60 leading-relaxed">
                    {getReadinessLevel(results.percentage).desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Score</p>
                      <p className="text-xl font-bold">{results.score} / {results.maxScore}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Track</p>
                      <p className="text-xl font-bold truncate">{results.department}</p>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setQuizState('selection')}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <ArrowRight size={18} className="rotate-180" />
                      <span>Other Tracks</span>
                    </button>
                    <button 
                      onClick={() => window.location.href = '/jobs'}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <span>View Opportunities</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Insights Section */}
              <div className="mt-20 pt-12 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <AlertCircle size={20} className="text-primary" />
                  <span>Brutal AI Insights & Action Plan</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.insights && results.insights.length > 0 ? (
                    results.insights.map((insight, idx) => (
                      <div key={idx} className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col h-full">
                        <h4 className="font-bold mb-3 text-primary uppercase tracking-tight">{insight.title}</h4>
                        <div className="space-y-4 flex-grow">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-1">The Harsh Truth</p>
                            <p className="text-sm text-secondary/70 italic">&quot;{insight.harsh_truth}&quot;</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Immediate Action</p>
                            <p className="text-sm font-medium text-secondary">{insight.action_step}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 bg-gray-50 rounded-3xl text-center">
                      <p className="text-secondary/50 italic">No AI insights available for this result.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
