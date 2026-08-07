import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, GitCompare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { queryTechAI } from '../../services/aiService';

export default function AIKnowledgeWorkspace({ 
  tech, 
  onClose, 
  onCompareTrigger, 
  onNavigateToRelated 
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const [isTyping, setIsTyping] = useState(false);

  const latestAnswerRef = useRef(null);
  const techName = tech?.name || tech?.title || "Technology";

  // --- Initial Overview Fetch ---
  useEffect(() => {
    setMessages([]);
    setIsInitialLoading(true);

    if (!tech) return;

    const triggerInitialOverview = async () => {
      const internalPrompt = `Provide a structured overview in English for ${techName}. Include EXTENDED CONCEPT, KEY USE CASES, and SUCCESS STORIES with clean Markdown spacing.`;
      
      try {
        const responseText = await queryTechAI(techName, internalPrompt);
        setMessages([{ role: 'assistant', text: responseText, isOverview: true }]);
      } catch (error) {
        console.error("Error fetching AI overview:", error);
        setMessages([{ 
          role: 'assistant', 
          text: `⚠️ Unable to load AI overview for ${techName}. Please feel free to ask a custom question below.`,
          isOverview: true
        }]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    triggerInitialOverview();
  }, [tech?.id, techName]);

  // --- Auto-scroll to the latest AI answer ---
  useEffect(() => {
    if (isInitialLoading) return;

    const timer = window.setTimeout(() => {
      latestAnswerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [messages, isInitialLoading]);

  const suggestedPrompts = [
    "💡 Teach me in a simple way",
    "⚡ When should I NOT use this technology?",
    "🛠️ Show me a 1-minute basic code example",
    "📈 What is the current job market demand for this?"
  ];

  const handleSendPrompt = async (promptText) => {
    if (!promptText || !promptText.trim()) return;

    const userQuery = promptText.trim();

    setMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const responseText = await queryTechAI(techName, userQuery);
      setMessages((prev) => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      console.error("Error in prompt execution:", error);
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', text: `⚠️ Network error. Could not retrieve information for ${techName}.` }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const overviewMessages = messages.filter((m) => m.isOverview);
  const followUpMessages = messages.filter((m) => !m.isOverview);

  return (
    <div className="w-full h-full bg-slate-900/95 border border-slate-800 rounded-2xl p-5 md:p-7 flex flex-col text-slate-100 backdrop-blur-md shadow-2xl overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-2.5">
            {techName}
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono tracking-wider uppercase">
              AI Workspace
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{tech?.category || "Web Architecture"}</p>
        </div>

        <button 
          onClick={onClose} 
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area (Overview + Follow-up Responses) */}
      <div className="flex-1 space-y-6">
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 animate-pulse">
              Consulting TechMap AI for {techName}...
            </p>
          </div>
        ) : (
          <>
            {/* Initial Overview */}
            {overviewMessages.map((msg, idx) => (
              <div
                key={`ov-${idx}`}
                ref={idx === overviewMessages.length - 1 ? latestAnswerRef : null}
                className="text-slate-200 text-sm leading-relaxed space-y-5"
              >
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => (
                      <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mt-6 mb-3 pb-1.5 border-b border-slate-800/80 flex items-center gap-2" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-2" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-slate-300 mb-3 text-xs md:text-sm leading-relaxed" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs md:text-sm mb-4 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="leading-snug" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="text-white font-semibold" {...props} />
                    )
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))}

            {/* Interactive Chat Responses */}
            {followUpMessages.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-800">
                {followUpMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    ref={idx === followUpMessages.length - 1 ? latestAnswerRef : null}
                    className={`p-4 rounded-xl text-xs flex gap-3 ${
                      msg.role === 'user' 
                        ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-100 ml-auto max-w-[85%]' 
                        : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 mr-auto w-full'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 font-sans leading-relaxed text-xs md:text-sm">
                      <p className="font-bold text-[10px] uppercase text-slate-400 mb-2 tracking-wider">
                        {msg.role === 'user' ? 'You' : 'TechMap AI Assistant'}
                      </p>
                      {msg.role === 'user' ? (
                        <p>{msg.text}</p>
                      ) : (
                        <ReactMarkdown
                          components={{
                            h2: ({node, ...props}) => <h2 className="text-xs font-bold uppercase text-cyan-400 mt-4 mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="p-3 rounded-xl text-xs bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center gap-2.5 w-max">
                <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="italic animate-pulse text-xs">TechMap AI is generating analysis...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed Bottom Section */}
      <div className="pt-4 mt-6 border-t border-slate-800 space-y-4 shrink-0">
        
        {/* 🌀 TELEPORT PORTALS: Ubicado siempre abajo, arriba de Suggested Prompts */}
        {tech?.connections && tech.connections.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-slate-800/40 p-3.5 rounded-xl border border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-2 text-[11px] uppercase tracking-wider flex items-center gap-2">
              🌀 Teleport Portals (Connected Tech)
            </h4>
            <div className="flex flex-wrap gap-2">
              {tech.connections.map((connId) => (
                <button
                  key={connId}
                  onClick={() => onNavigateToRelated(connId)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs transition-all cursor-pointer group"
                >
                  <span className="capitalize">{connId.replace('custom-card-', '').replace('-', ' ')}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Suggested Prompts & Actions:
        </p>

        {/* Suggested Chips + Integrated Compare Button */}
        <div className="flex flex-wrap gap-2">
          {tech?.comparisonTarget && (
            <button
              onClick={() => onCompareTrigger(tech.id, tech.comparisonTarget)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-500/10"
            >
              <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Compare with {tech.comparisonTargetName || "Alternative"}</span>
            </button>
          )}

          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSendPrompt(prompt)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                index === 0
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 font-semibold"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputValue);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask a specific question about ${techName}...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
            disabled={isTyping || isInitialLoading}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>

    </div>
  );
}