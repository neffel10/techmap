import React from 'react';
import { 
  X, 
  TrendingUp, 
  Zap, 
  Building2, 
  Home, 
  ArrowRight, 
  Star 
} from 'lucide-react';

export function ComparisonModal({ comparison, technologies, onClose }) {
  if (!comparison) return null;

  const techMetricsDatabase = {
    react: { emoji: "⚛️", marketShare: "40% market share", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] },
    next: { emoji: "▲", marketShare: "Standard React Fullstack", learningCurve: "medium", popularity: 9, projectSize: ["medium", "large"] },
    vue: { emoji: "💚", marketShare: "10% market share", learningCurve: "easy", popularity: 7, projectSize: ["small", "medium"] },
    angular: { emoji: "🅰️", marketShare: "20% market share", learningCurve: "hard", popularity: 6, projectSize: ["large"] },
    tailwind: { emoji: "🎨", marketShare: "#1 CSS Framework", learningCurve: "easy", popularity: 9, projectSize: ["small", "medium", "large"] },
    sass: { emoji: "💅", marketShare: "Traditional standard", learningCurve: "easy", popularity: 7, projectSize: ["medium", "large"] },
    wordpress: { emoji: "📝", marketShare: "43% of all websites", learningCurve: "easy", popularity: 10, projectSize: ["small", "medium"] },
    contentful: { emoji: "☁️", marketShare: "Enterprise Headless Leader", learningCurve: "medium", popularity: 7, projectSize: ["medium", "large"] },
    strapi: { emoji: "🚀", marketShare: "#1 Open-Source Headless", learningCurve: "medium", popularity: 8, projectSize: ["small", "medium", "large"] },
    sanity: { emoji: "✨", marketShare: "Used by Figma & Cloudflare", learningCurve: "medium", popularity: 7, projectSize: ["medium", "large"] },
    salesforce: { emoji: "☁️", marketShare: "#1 Global CRM", learningCurve: "hard", popularity: 10, projectSize: ["large"] },
    hubspot: { emoji: "🧲", marketShare: "Inbound Marketing Leader", learningCurve: "easy", popularity: 9, projectSize: ["small", "medium", "large"] },
    zoho: { emoji: "⚙️", marketShare: "Best value CRM", learningCurve: "medium", popularity: 7, projectSize: ["small", "medium"] },
    ga: { emoji: "📊", marketShare: "85% web analytics share", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] },
    gtm: { emoji: "🏷️", marketShare: "60% tag-managed sites", learningCurve: "medium", popularity: 8, projectSize: ["medium", "large"] },
    docker: { emoji: "🐳", marketShare: "82% tech adoption", learningCurve: "medium", popularity: 10, projectSize: ["medium", "large"] },
    "rest-api": { emoji: "🔌", marketShare: "De facto API standard", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] },
    restful: { emoji: "🌐", marketShare: "REST Architecture", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] }
  };

  const getTechData = (id) => {
    const globalTech = technologies.find((t) => t.id === id) || {};
    const dbMetrics = techMetricsDatabase[id] || {};

    return {
      id,
      title: globalTech.title || globalTech.name || id,
      emoji: globalTech.emoji || dbMetrics.emoji || "⚡",
      marketShare: globalTech.marketShare || dbMetrics.marketShare || "Widely adopted",
      learningCurve: globalTech.learningCurve || dbMetrics.learningCurve || "medium",
      popularity: globalTech.popularity || dbMetrics.popularity || 8,
      projectSize: globalTech.projectSize || dbMetrics.projectSize || ["medium", "large"]
    };
  };

  const getProjectSizeIcon = (size) => {
    switch (size) {
      case 'small': return <Home className="w-3.5 h-3.5" />;
      case 'medium': return <Building2 className="w-3.5 h-3.5" />;
      case 'large': return <Building2 className="w-4 h-4" />;
      default: return <Star className="w-3.5 h-3.5" />;
    }
  };

  const getProjectSizeLabel = (size) => {
    switch (size) {
      case 'small': return 'Small Projects';
      case 'medium': return 'Medium Projects';
      case 'large': return 'Large Enterprise';
      default: return 'All Scale';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Easy</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Medium</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl max-h-[90vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-y-auto my-auto p-6 md:p-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{comparison.title}</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">{comparison.explanation}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {comparison.technologies.map((techId) => {
            const tech = getTechData(techId);
            const isWinner = comparison.winner === techId;

            return (
              <div 
                key={techId}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isWinner 
                    ? 'border-amber-500/50 bg-amber-950/10 shadow-lg shadow-amber-950/20' 
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tech.emoji}</span>
                      <span className="font-bold text-white text-base">{tech.title}</span>
                    </div>
                    {isWinner && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-400 text-amber-950 rounded-full shadow-xs">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {tech.marketShare && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{tech.marketShare}</span>
                    </div>
                  )}

                  {tech.learningCurve && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-slate-300 font-medium">
                      <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Learning curve:</span>
                      {getDifficultyBadge(tech.learningCurve)}
                    </div>
                  )}

                  {tech.popularity && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < tech.popularity ? 'bg-purple-500 shadow-xs shadow-purple-500/50' : 'bg-slate-800'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500">{tech.popularity}/10</span>
                    </div>
                  )}
                </div>

                {tech.projectSize && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {tech.projectSize.map((size) => (
                      <span key={size} className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg text-[10px] font-medium flex items-center gap-1.5 border border-slate-800">
                        {getProjectSizeIcon(size)}
                        {getProjectSizeLabel(size)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 2. When to Use Section */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">When to use each?</h3>
          <div className="space-y-3">
            {comparison.whenToUse.map((item) => {
              const tech = getTechData(item.techId);

              return (
                <div 
                  key={item.techId} 
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-3 shadow-inner"
                >
                  <span className="text-2xl mt-0.5">{tech.emoji}</span>
                  <div>
                    <span className="font-bold text-white text-sm block mb-0.5">
                      {tech.title}
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.scenario}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Transition Difficulty Section */}
        {comparison.transitionDifficulty && comparison.transitionDifficulty.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Transition difficulty between technologies</h3>
            <div className="space-y-2.5">
              {comparison.transitionDifficulty.map((transition, index) => {
                const fromTech = getTechData(transition.from);
                const toTech = getTechData(transition.to);

                return (
                  <div 
                    key={index} 
                    className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-inner"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{fromTech.emoji}</span>
                      <span className="font-bold text-white text-xs">{fromTech.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 mx-1 shrink-0" />
                      <span className="text-base">{toTech.emoji}</span>
                      <span className="font-bold text-white text-xs">{toTech.title}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getDifficultyBadge(transition.difficulty)}
                      <span className="text-xs font-medium text-slate-400">{transition.timeEstimate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}