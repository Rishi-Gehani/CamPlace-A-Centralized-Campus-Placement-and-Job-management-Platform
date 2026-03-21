import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, AlertCircle, CheckCircle2, Target, Zap } from "lucide-react";

export default function AIInsightsModal({ isOpen, onClose, insights, loading, error }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-black/5 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary text-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-secondary">AI Strategic Insights</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Powered by Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-secondary/60 font-medium animate-pulse">Analyzing dashboard data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">Analysis Failed</h3>
                <p className="text-secondary/60 mb-6">{error}</p>
                <button onClick={onClose} className="btn-primary !py-3 !px-8">Close</button>
              </div>
            ) : insights ? (
              <div className="space-y-8">
                {/* Executive Summary */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={18} className="text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40">Executive Summary</h4>
                  </div>
                  <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10">
                    <p className="text-secondary font-medium leading-relaxed italic">
                      &quot;{insights.executive_summary || insights.momentum_diagnosis}&quot;
                    </p>
                  </div>
                </section>

                {/* Market Alignment / Funnel Diagnosis */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={18} className="text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40">
                      {insights.market_alignment_fix ? "Market Alignment Fix" : "Funnel Diagnosis"}
                    </h4>
                  </div>
                  {Array.isArray(insights.market_alignment_fix) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {insights.market_alignment_fix.map((step, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-black/5 shadow-sm flex gap-3">
                          <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                            {i + 1}
                          </div>
                          <p className="text-sm text-secondary/80 font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                      <p className="text-secondary/80 font-medium leading-relaxed">
                        {insights.market_alignment_fix || insights.funnel_diagnosis}
                      </p>
                    </div>
                  )}
                </section>

                {/* Bottleneck Intervention / Critical Bottleneck */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40">
                      {insights.bottleneck_intervention ? "Bottleneck Intervention" : "Critical Bottleneck"}
                    </h4>
                  </div>
                  {Array.isArray(insights.bottleneck_intervention) ? (
                    <div className="space-y-3">
                      {insights.bottleneck_intervention.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
                          <div className="mt-1 text-red-500">
                            <CheckCircle2 size={16} />
                          </div>
                          <p className="text-sm text-secondary/80 font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-sm uppercase tracking-wider">
                      {insights.bottleneck_intervention || insights.critical_bottleneck}
                    </div>
                  )}
                </section>

                {/* Strategic Opportunity / Action Plan */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary/40">
                      {insights.strategic_opportunity ? "Strategic Opportunity" : "Action Plan"}
                    </h4>
                  </div>
                  {insights.strategic_opportunity ? (
                    <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                      <p className="text-secondary font-bold leading-relaxed">
                        {insights.strategic_opportunity}
                      </p>
                    </div>
                  ) : Array.isArray(insights.action_plan) ? (
                    <div className="space-y-3">
                      {insights.action_plan.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                          <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                            {i + 1}
                          </div>
                          <p className="text-sm text-secondary/80 font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                      <p className="text-secondary font-medium leading-relaxed">
                        {insights.action_plan}
                      </p>
                    </div>
                  )}
                </section>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-black/5 bg-gray-50 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
