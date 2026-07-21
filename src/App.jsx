import React, { useState } from 'react';
import { 
  Code2, 
  Search, 
  Sparkles, 
  Layers
} from 'lucide-react';

import { categories, comparisons, technologies } from './data';
import { ComparisonModal } from './components/ComparisonModal';

export default function App() {
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComparison, setActiveComparison] = useState(null);
  const [userTechStatus, setUserTechStatus] = useState({});

  const handleToggleStatus = (e, techId) => {
    e.stopPropagation();
    setUserTechStatus((prev) => {
      const current = prev[techId] || technologies.find((t) => t.id === techId)?.status || 'to-explore';
      let nextStatus = 'learning';
      if (current === 'learning') nextStatus = 'i-know';
      else if (current === 'i-know') nextStatus = 'to-explore';

      return { ...prev, [techId]: nextStatus };
    });
  };

  const filteredTechnologies = technologies.map((tech) => ({
    ...tech,
    status: userTechStatus[tech.id] || tech.status
  })).filter((tech) => {
    const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.simpleMetaphor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.technicalExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">
      
      {/* 1. Navbar / Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-slate-900">TechMap</h1>
              <p className="text-[11px] text-slate-500 font-medium">Web Technology Atlas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsSimpleMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSimpleMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              💡 Simple Explanation
            </button>
            <button
              onClick={() => setIsSimpleMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isSimpleMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ⚡ Technical
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero & Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Explore & Connect Technologies
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Click on any card to reveal its direct integrations and connections.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search technology, concept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="i-know">🟢 I Know</option>
              <option value="learning">🟡 Learning</option>
              <option value="to-explore">⚪ To Explore</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-500 pb-2 border-b border-slate-200/60">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> I Know
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Learning
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> To Explore
          </span>
        </div>
      </section>

      {/* 3. Quick Comparisons Section */}
      {comparisons && comparisons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> Technology Comparisons
              </div>
              <h3 className="text-xl font-bold mb-1">Not sure which stack to pick?</h3>
              <p className="text-blue-100 text-xs mb-4 max-w-2xl">
                Analyze trade-offs, transition difficulty, and real-world use cases.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {comparisons.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComparison(comp)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <span>{comp.title}</span>
                    <span className="text-blue-300">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Bento Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((category) => {
          const categoryTechs = filteredTechnologies.filter(
            (t) => t.categoryId === category.id
          );

          if (categoryTechs.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-2xl h-32 shadow-md border border-slate-200 flex items-end p-5">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 flex items-center gap-3">
                  <div className={`${category.color || 'bg-blue-600'} p-2 rounded-xl text-white shadow-md flex items-center justify-center`}>
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-white drop-shadow-md">
                    {category.title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {categoryTechs.map((tech) => {
                  const isSelected = selectedTechId === tech.id;
                  const isConnected = selectedTechId && tech.connections?.includes(selectedTechId);

                  return (
                    <article
                      key={tech.id}
                      onClick={() => setSelectedTechId(isSelected ? null : tech.id)}
                      className={`p-5 rounded-2xl border bg-white transition-all duration-200 cursor-pointer relative shadow-xs ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : isConnected
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{tech.title}</h3>
                          {isConnected && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                              Connected
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleToggleStatus(e, tech.id)}
                          title="Click to toggle status"
                          className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center hover:scale-110 transition-transform bg-white"
                        >
                          {tech.status === 'i-know' && (
                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                          )}
                          {tech.status === 'learning' && (
                            <div className="w-3 h-3 bg-amber-500 rounded-full" />
                          )}
                          {tech.status === 'to-explore' && (
                            <div className="w-3 h-3 bg-slate-300 rounded-full" />
                          )}
                        </button>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed font-normal mb-4">
                        {isSimpleMode ? tech.simpleMetaphor : tech.technicalExplanation}
                      </p>

                      {tech.worksWellWith && tech.worksWellWith.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            Works well with:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {tech.worksWellWith.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border border-slate-200/80"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* Comparison Modal */}
      {activeComparison && (
        <ComparisonModal
          comparison={activeComparison}
          technologies={technologies}
          onClose={() => setActiveComparison(null)}
        />
      )}
    </div>
  );
}