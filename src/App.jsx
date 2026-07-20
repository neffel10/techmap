import React, { useState } from 'react';
import { 
  Layers, 
  Map, 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  Sparkles, 
  Briefcase, 
  ArrowLeftRight, 
  Code2,
  GitCompare
} from 'lucide-react';
import initialTechData from './data/techData.json';
import { ComparisonModal } from './components/ComparisonModal';

const App = () => {
  // State management
  const [technologies, setTechnologies] = useState(initialTechData.technologies);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [selectedTechId, setSelectedTechId] = useState(null);
  
  // Comparisons state
  const [showComparisonsList, setShowComparisonsList] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState(null);

  // Dynamic status counters
  const counts = {
    iKnow: technologies.filter((t) => t.status === 'i-know').length,
    learning: technologies.filter((t) => t.status === 'learning').length,
    toExplore: technologies.filter((t) => t.status === 'to-explore').length,
  };

  const handleToggleStatus = (e, techId) => {
    e.stopPropagation();
    setTechnologies((prev) =>
      prev.map((tech) => {
        if (tech.id === techId) {
          const nextStatus =
            tech.status === 'to-explore'
              ? 'learning'
              : tech.status === 'learning'
              ? 'i-know'
              : 'to-explore';
          return { ...tech, status: nextStatus };
        }
        return tech;
      })
    );
  };

  const filteredTechnologies = technologies.filter((tech) => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-10 font-sans">
      {/* 1. Header Navigation Bar */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Technology Knowledge Map</h1>
          </div>
          <p className="text-slate-600 text-sm mt-1">
            Explore technologies with simple explanations, visual metaphors, and track what you know
          </p>
        </div>

        {/* Top View Switchers */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 font-semibold text-xs transition">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Carrera
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 font-semibold text-xs transition">
            <Compass className="w-3.5 h-3.5 text-slate-500" /> Roadmap
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-950 text-white font-semibold text-xs shadow-sm">
            <Map className="w-3.5 h-3.5 text-teal-400" /> Mapa
          </button>
        </div>
      </header>

      {/* 2. Main Metrics Status Cards */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#E6F4EA] border border-emerald-300 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-emerald-900 font-bold text-xs block">I Know</span>
            <p className="text-slate-900 font-bold text-sm">{counts.iKnow} technologies</p>
          </div>
        </div>

        <div className="bg-[#FEF7E0] border border-amber-300 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-amber-950 font-bold text-xs block">Learning</span>
            <p className="text-slate-900 font-bold text-sm">{counts.learning} technologies</p>
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-300 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-800 font-bold text-xs block">To Explore</span>
            <p className="text-slate-900 font-bold text-sm">{counts.toExplore} technologies</p>
          </div>
        </div>
      </section>

      {/* 3. Filter Buttons and Mode Toggles */}
      <section className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1 rounded-xl border border-slate-300">
          {[
            { id: 'all', label: 'All Technologies' },
            { id: 'i-know', label: 'I Know' },
            { id: 'learning', label: 'Learning' },
            { id: 'to-explore', label: 'To Learn' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                activeFilter === filter.id
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowComparisonsList(!showComparisonsList)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition text-xs font-bold shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4 text-slate-700" /> Ver Comparaciones
          </button>
          <button
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition text-xs font-bold shadow-sm"
          >
            {isSimpleMode ? <Sparkles className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-teal-400" />}
            {isSimpleMode ? 'Simple Mode' : 'Technical Mode'}
          </button>
        </div>
      </section>

      {/* 4. Comparisons Expandable Section */}
      {showComparisonsList && (
        <section className="max-w-7xl mx-auto mb-8 p-6 bg-purple-50/60 border border-purple-200 rounded-2xl">
          <h2 className="text-lg font-bold text-purple-950 flex items-center gap-2 mb-2">
            <GitCompare className="w-5 h-5 text-purple-700" /> Comparaciones de Tecnologías
          </h2>
          <p className="text-xs text-purple-900 font-medium mb-4">
            Selecciona una comparativa para analizar pros, contras, curvas de aprendizaje y facilidad de migración:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialTechData.comparisons?.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setSelectedComparison(comp)}
                className="p-4 bg-white border border-purple-200 rounded-xl hover:border-purple-400 cursor-pointer shadow-sm transition group"
              >
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-purple-700 transition">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">{comp.explanation}</p>
                <span className="inline-block mt-3 text-xs font-bold text-purple-600 group-hover:underline">
                  Ver detalles completos →
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Main Bento Grid Section */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {initialTechData.categories.map((category) => {
          const categoryTechs = filteredTechnologies.filter(
            (t) => t.categoryId === category.id
          );

          if (categoryTechs.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-4">
              {/* Category Cover Header */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800 min-h-[130px] flex items-end">
                {category.coverCode && (
                  <pre className="absolute top-2 left-4 text-[11px] text-slate-400 font-mono opacity-50 select-none">
                    {category.coverCode}
                  </pre>
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-white">{category.title}</h2>
                </div>
              </div>

              {/* Technologies List */}
              <div className="flex flex-col gap-4">
                {categoryTechs.map((tech) => {
                  const isSelected = selectedTechId === tech.id;
                  const isConnected = selectedTechId && tech.connections?.includes(selectedTechId);

                  return (
                    <article
                      key={tech.id}
                      onClick={() => setSelectedTechId(isSelected ? null : tech.id)}
                      className={`p-5 rounded-2xl border bg-white transition-all duration-200 cursor-pointer relative shadow-sm ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : isConnected
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-300 hover:border-slate-400 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{tech.title}</h3>
                          {isConnected && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full border border-emerald-300">
                              Connected
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleToggleStatus(e, tech.id)}
                          title="Click to change status"
                          className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          {tech.status === 'i-know' && (
                            <div className="w-3 h-3 bg-emerald-600 rounded-full" />
                          )}
                          {tech.status === 'learning' && (
                            <div className="w-3 h-3 bg-amber-500 rounded-full" />
                          )}
                          {tech.status === 'to-explore' && (
                            <div className="w-3 h-3 bg-slate-300 rounded-full" />
                          )}
                        </button>
                      </div>

                      <p className="text-slate-800 text-xs leading-relaxed font-medium mb-4">
                        {isSimpleMode ? tech.simpleMetaphor : tech.technicalExplanation}
                      </p>

                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                          Works well with:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {tech.worksWellWith.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-100 text-slate-900 rounded-md text-[11px] font-bold flex items-center gap-1.5 border border-slate-300"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* Comparison Modal Overlay */}
      {selectedComparison && (
        <ComparisonModal
          comparison={selectedComparison}
          technologies={technologies}
          onClose={() => setSelectedComparison(null)}
        />
      )}
    </div>
  );
};

export default App;