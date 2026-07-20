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
    react: { emoji: "⚛️", marketShare: "40% del mercado", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] },
    next: { emoji: "▲", marketShare: "Estándar React Fullstack", learningCurve: "medium", popularity: 9, projectSize: ["medium", "large"] },
    vue: { emoji: "💚", marketShare: "10% del mercado", learningCurve: "easy", popularity: 7, projectSize: ["small", "medium"] },
    angular: { emoji: "🅰️", marketShare: "20% del mercado", learningCurve: "hard", popularity: 6, projectSize: ["large"] },
    tailwind: { emoji: "🎨", marketShare: "Framework CSS #1", learningCurve: "easy", popularity: 9, projectSize: ["small", "medium", "large"] },
    sass: { emoji: "💅", marketShare: "Estándar tradicional", learningCurve: "easy", popularity: 7, projectSize: ["medium", "large"] },
    wordpress: { emoji: "📝", marketShare: "43% de la web", learningCurve: "easy", popularity: 10, projectSize: ["small", "medium"] },
    contentful: { emoji: "☁️", marketShare: "Líder enterprise", learningCurve: "medium", popularity: 7, projectSize: ["medium", "large"] },
    strapi: { emoji: "🚀", marketShare: "Open-source #1", learningCurve: "medium", popularity: 8, projectSize: ["small", "medium", "large"] },
    sanity: { emoji: "✨", marketShare: "Figma, Cloudflare", learningCurve: "medium", popularity: 7, projectSize: ["medium", "large"] },
    salesforce: { emoji: "☁️", marketShare: "#1 CRM Mundial", learningCurve: "hard", popularity: 10, projectSize: ["large"] },
    hubspot: { emoji: "🧲", marketShare: "Líder Inbound", learningCurve: "easy", popularity: 9, projectSize: ["small", "medium", "large"] },
    zoho: { emoji: "⚙️", marketShare: "Mejor calidad-precio", learningCurve: "medium", popularity: 7, projectSize: ["small", "medium"] },
    ga: { emoji: "📊", marketShare: "85% cuota de mercado", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] },
    gtm: { emoji: "🏷️", marketShare: "60% sitios con tags", learningCurve: "medium", popularity: 8, projectSize: ["medium", "large"] },
    docker: { emoji: "🐳", marketShare: "82% empresas tech", learningCurve: "medium", popularity: 10, projectSize: ["medium", "large"] },
    "rest-api": { emoji: "🔌", marketShare: "Estándar de facto", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] },
    restful: { emoji: "🌐", marketShare: "Arquitectura REST", learningCurve: "medium", popularity: 10, projectSize: ["small", "medium", "large"] }
  };

  const getTechData = (id) => {
    const globalTech = technologies.find((t) => t.id === id) || {};
    const dbMetrics = techMetricsDatabase[id] || {};

    return {
      id,
      title: globalTech.title || globalTech.name || id,
      emoji: globalTech.emoji || dbMetrics.emoji || "⚡",
      marketShare: globalTech.marketShare || dbMetrics.marketShare || "Ampliamente utilizado",
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
      case 'small': return 'Proyectos Pequeños';
      case 'medium': return 'Proyectos Medianos';
      case 'large': return 'Proyectos Grandes';
      default: return 'Todos los tamaños';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">Fácil</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Medio</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-300">Difícil</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-y-auto my-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{comparison.title}</h2>
            <p className="text-slate-500 text-sm mt-1">{comparison.explanation}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
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
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isWinner ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200/80 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tech.emoji}</span>
                      <span className="font-bold text-slate-900 text-base">{tech.title}</span>
                    </div>
                    {isWinner && (
                      <span className="px-3 py-1 text-[11px] font-bold bg-amber-400 text-amber-950 rounded-full shadow-sm">
                        Más Popular
                      </span>
                    )}
                  </div>

                  {tech.marketShare && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-600 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{tech.marketShare}</span>
                    </div>
                  )}

                  {tech.learningCurve && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-slate-700 font-medium">
                      <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Curva de aprendizaje:</span>
                      {getDifficultyBadge(tech.learningCurve)}
                    </div>
                  )}

                  {tech.popularity && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < tech.popularity ? 'bg-blue-600' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500">{tech.popularity}/10</span>
                    </div>
                  )}
                </div>

                {tech.projectSize && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {tech.projectSize.map((size) => (
                      <span key={size} className="px-2.5 py-1 bg-slate-100/90 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border border-slate-200">
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
          <h3 className="text-base font-bold text-slate-900 mb-3">¿Cuándo usar cada una?</h3>
          <div className="space-y-3">
            {comparison.whenToUse.map((item) => {
              const tech = getTechData(item.techId);

              return (
                <div 
                  key={item.techId} 
                  className="p-4 bg-[#F5F7FF] border border-blue-100 rounded-2xl flex items-start gap-3 shadow-2xs"
                >
                  <span className="text-2xl mt-0.5">{tech.emoji}</span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block mb-0.5">
                      {tech.title}
                    </span>
                    <p className="text-slate-600 text-xs leading-relaxed">
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
            <h3 className="text-base font-bold text-slate-900 mb-3">Facilidad de transición entre tecnologías</h3>
            <div className="space-y-2.5">
              {comparison.transitionDifficulty.map((transition, index) => {
                const fromTech = getTechData(transition.from);
                const toTech = getTechData(transition.to);

                return (
                  <div 
                    key={index} 
                    className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{fromTech.emoji}</span>
                      <span className="font-bold text-slate-900 text-xs">{fromTech.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 mx-1" />
                      <span className="text-lg">{toTech.emoji}</span>
                      <span className="font-bold text-slate-900 text-xs">{toTech.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {getDifficultyBadge(transition.difficulty)}
                      <span className="text-xs font-medium text-slate-500">{transition.timeEstimate}</span>
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