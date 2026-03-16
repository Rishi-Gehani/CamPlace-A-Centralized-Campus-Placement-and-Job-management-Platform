import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function QueryResolution() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchQueries = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/queries', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      if (res.ok) {
        const data = await res.json();
        setQueries(data);
      }
    } catch (err) {
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
    // Auto-refresh polling every 6 seconds
    const interval = setInterval(fetchQueries, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleReply = async (queryId) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`http://localhost:3000/api/queries/${queryId}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ reply: replyText })
      });

      if (res.ok) {
        setReplyText("");
        setReplyingTo(null);
        fetchQueries();
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading && queries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Query Resolution</h1>
          <p className="text-secondary/60">Manage and respond to student inquiries.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">
          <Clock size={16} />
          <span>Auto-refreshing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {queries.length === 0 ? (
          <div className="card-white text-center py-20 space-y-4">
            <MessageSquare size={48} className="mx-auto text-secondary/20" />
            <p className="text-secondary/60 font-medium">No queries found.</p>
          </div>
        ) : (
          queries.map((query) => (
            <motion.div 
              key={query._id}
              layout
              className={`card-white overflow-hidden border-l-4 ${query.status === 'replied' ? 'border-emerald-500' : 'border-amber-500'}`}
            >
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${query.status === 'replied' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {query.status === 'replied' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{query.firstName} {query.lastName}</h3>
                      <p className="text-sm text-secondary/60">{query.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-secondary/40 uppercase tracking-wider">{query.subject}</p>
                    <p className="text-xs text-secondary/40">{new Date(query.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                  <p className="text-secondary/80 leading-relaxed">{query.message}</p>
                </div>

                {query.status === 'replied' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 size={16} />
                      <span>Replied</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                      <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Admin Response:</p>
                      <p className="text-emerald-900 whitespace-pre-wrap">{query.adminReply}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replyingTo === query._id ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your response here..."
                          className="input-field min-h-[120px]"
                          rows={4}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReply(query._id)}
                            disabled={submittingReply || !replyText.trim()}
                            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                          >
                            {submittingReply ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Send size={16} />
                            )}
                            <span>Send Reply</span>
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="px-6 py-2 rounded-full border border-black/10 font-bold hover:bg-black/5 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(query._id)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Send size={16} />
                        <span>Reply to Query</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
