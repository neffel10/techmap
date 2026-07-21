import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Search, 
  Sparkles, 
  Layers,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  X,
  Sun,
  Moon,
  Zap,
  Lightbulb
} from 'lucide-react';

// Import local modular data
import { categories, comparisons, technologies } from './data';
import { ComparisonModal } from './components/ComparisonModal';

export default function App() {
  // Persistence for Theme Mode (Default: Dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('techmap-theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Mode & Notification Toast State
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [modeNotification, setModeNotification] = useState(null); // { title: '', subtitle: '', icon: '' }

  // Search & Navigation State
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComparison, setActiveComparison] = useState(null);
  const [userTechStatus, setUserTechStatus] = useState({});
  const [isComparisonsOpen, setIsComparisonsOpen] = useState(false);

  // Accordion state: ALL categories CLOSED by default
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = {};
    categories.forEach((cat) => {
      initial[cat.id] = false; 
    });
    return initial;
  });

  // Save theme selection in localStorage
  useEffect(() => {
    localStorage.setItem('techmap-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Mode Switch Handler with Screen Flash HUD Animation
  const handleModeSwitch = (simple) => {
    if (isSimpleMode === simple) return;

    setIsSimpleMode(simple);

    if (simple) {
      setModeNotification({
        title: "Simple Mode: ON",
        subtitle: "Every technology explained with clear, everyday metaphors!",
        icon: "💡"
      });
    } else {
      setModeNotification({
        title: "Technical Mode: ON",
        subtitle: "Production-ready technical specs and engineering architecture.",
        icon: "⚡"
      });
    }

    // Auto dismiss after 1.6 seconds
    setTimeout(() => {
      setModeNotification(null);
    }, 1600);
  };

  // Dynamic status counters
  const counts = {
    iKnow: technologies.filter((t) => (userTechStatus[t.id] || t.status) === 'i-know').length,
    learning: technologies.filter((t) => (userTechStatus[t.id] || t.status) === 'learning').length,
    toExplore: technologies.filter((t) => (userTechStatus[t.id] || t.status) === 'to-explore').length,
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

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

  const handleTechClick = (techId) => {
    if (selectedTechId === techId) {
      setSelectedTechId(null);
      return;
    }

    setSelectedTechId(techId);

    const tech = technologies.find((t) => t.id === techId);
    if (tech && tech.connections) {
      setExpandedCategories((prev) => {
        const next = { ...prev };
        tech.connections.forEach((connId) => {
          const connectedTech = technologies.find((t) => t.id === connId);
          if (connectedTech) {
            next[connectedTech.categoryId] = true;
          }
        });
        return next;
      });
    }
  };

  const handleTeleport = (e, targetTechId) => {
    e.stopPropagation();
    
    const targetTech = technologies.find((t) => t.id === targetTechId);
    if (targetTech) {
      setExpandedCategories((prev) => ({
        ...prev,
        [targetTech.categoryId]: true
      }));
    }

    setSelectedTechId(targetTechId);

    setTimeout(() => {
      const element = document.getElementById(`tech-card-${targetTechId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-emerald-500/50');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-emerald-500/50');
        }, 1500);
      }
    }, 100);
  };

  const handleSidebarCategoryClick = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: true
    }));

    setTimeout(() => {
      const element = document.getElementById(`category-section-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
    <div className={`min-h-screen font-sans pb-12 transition-colors duration-300 relative ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white'
    }`}>
      
      {/* OVERLAY ANIMATED HUD NOTIFIER */}
      {modeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 sm:p-8 text-center max-w-sm shadow-2xl shadow-purple-950/50 transform animate-in zoom-in-95 duration-200">
            <span className="text-4xl mb-3 block animate-bounce">{modeNotification.icon}</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
              {modeNotification.title}
            </h3>
            <p className="text-slate-300 text-xs font-medium leading-relaxed">
              {modeNotification.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* 1. Header (Ultra Clean for Mobile) */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow-md shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className={`text-base sm:text-lg font-bold leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                TechMap
              </h1>
              <p className={`text-[10px] font-medium hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Interactive Web Technology Atlas
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Playbooks Button */}
            {comparisons && comparisons.length > 0 && (
              <button
                onClick={() => setIsComparisonsOpen(!isComparisonsOpen)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5 border border-purple-400/30 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                <span className="text-xs">Playbooks</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isComparisonsOpen ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Simple / Technical Toggle Switch */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => handleModeSwitch(true)}
                title="Simple Explanation Mode"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSimpleMode
                    ? isDarkMode ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Simple</span>
              </button>

              <button
                onClick={() => handleModeSwitch(false)}
                title="Technical Specifications Mode"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  !isSimpleMode
                    ? isDarkMode ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Technical</span>
              </button>
            </div>

          </div>
        </div>

        {/* Expandable Comparisons Panel */}
        {isComparisonsOpen && (
          <div className={`backdrop-blur-xl border-b shadow-2xl p-4 sm:p-5 animate-in slide-in-from-top-2 duration-200 ${
            isDarkMode ? 'bg-slate-900/95 border-indigo-500/20' : 'bg-slate-900 text-white border-indigo-900/50'
          }`}>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Interactive Playbooks & Stacks
                </div>
                <button 
                  onClick={() => setIsComparisonsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-300 text-xs mb-4 max-w-xl">
                Not sure which stack fits your project? Click any comparison below to view detailed metrics, market share, and migration estimates.
              </p>

              <div className="flex flex-wrap gap-2">
                {comparisons.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setActiveComparison(comp);
                      setIsComparisonsOpen(false);
                    }}
                    className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 group text-slate-200 hover:text-white"
                  >
                    <span className="truncate max-w-[240px] sm:max-w-none">{comp.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Metrics & Search Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-6">
          <div>
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Atlas & Connection Engine
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Select a card or category. Connected technologies across all categories will automatically expand and highlight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools, terms, metaphors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 shadow-inner' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 shadow-2xs'
                }`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-2.5 sm:px-3 py-2 sm:py-2.5 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-purple-500 shadow-inner' 
                  : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500 shadow-2xs'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="i-know">🟢 I Know ({counts.iKnow})</option>
              <option value="learning">🟡 Learning ({counts.learning})</option>
              <option value="to-explore">⚪ To Explore ({counts.toExplore})</option>
            </select>
          </div>
        </div>

        {/* Global Statistics Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mb-4">
          <div className={`border rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 ${
            isDarkMode ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50 border-emerald-100'
          }`}>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50"></div>
            <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-emerald-300' : 'text-slate-700'}`}>I Know: {counts.iKnow}</span>
          </div>
          <div className={`border rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 ${
            isDarkMode ? 'bg-amber-950/40 border-amber-800/40' : 'bg-amber-50 border-amber-100'
          }`}>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50"></div>
            <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-amber-300' : 'text-slate-700'}`}>Learning: {counts.learning}</span>
          </div>
          <div className={`border rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-500"></div>
            <span className={`text-[10px] sm:text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>To Explore: {counts.toExplore}</span>
          </div>
        </div>
      </section>

      {/* 3. Main Bento Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-8 items-start relative">
        
        {/* LEFT PANEL: Sticky floating categories list */}
        <aside className={`hidden lg:block w-64 shrink-0 sticky top-24 border rounded-2xl p-4 shadow-xl backdrop-blur-md transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 px-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Categories Index
          </h3>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const totalInCategory = technologies.filter((t) => t.categoryId === cat.id).length;
              const matchesFilterCount = filteredTechnologies.filter((t) => t.categoryId === cat.id).length;
              const isAccordionOpen = expandedCategories[cat.id];

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSidebarCategoryClick(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                    isAccordionOpen 
                      ? isDarkMode ? 'bg-slate-800 text-white border border-slate-700/50' : 'bg-slate-100 text-slate-900'
                      : isDarkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-1.5 h-3 rounded-full ${cat.color} block shrink-0`}></span>
                    <span className="truncate">{cat.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition ${
                    isDarkMode ? 'bg-slate-800 text-slate-400 border border-slate-700/40 group-hover:bg-slate-700' : 'bg-slate-200/60 text-slate-500 group-hover:bg-slate-300/60'
                  }`}>
                    {matchesFilterCount}/{totalInCategory}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT PANEL: The main Bento Feed */}
        <main className="flex-1 flex flex-col gap-4 sm:gap-6">
          {categories.map((category) => {
            const categoryTechs = filteredTechnologies.filter(
              (t) => t.categoryId === category.id
            );

            if (categoryTechs.length === 0) return null;
            const isOpen = expandedCategories[category.id];

            return (
              <section 
                key={category.id} 
                id={`category-section-${category.id}`}
                className={`border rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {/* Accordion Toggle Header */}
                <header 
                  onClick={() => toggleCategory(category.id)}
                  className="relative overflow-hidden h-20 sm:h-24 flex items-center justify-between p-4 sm:p-5 cursor-pointer group select-none"
                >
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className={`absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105 ${
                      isDarkMode ? 'opacity-60' : 'opacity-90'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDarkMode ? 'from-slate-950 via-slate-950/70 to-transparent' : 'from-black/80 via-black/40 to-transparent'
                  }`} />

                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`${category.color || 'bg-blue-600'} p-2 rounded-xl text-white shadow-md flex items-center justify-center shrink-0`}>
                      <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md">
                        {category.title}
                      </h2>
                      <p className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                        {categoryTechs.length} technologies listed
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-900/60 border border-slate-700/50 backdrop-blur-md px-2 py-1 rounded-lg">
                      {isOpen ? 'Collapse' : 'Expand'}
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900/60 border border-slate-700/50 hover:bg-slate-800 backdrop-blur-md flex items-center justify-center text-white transition shrink-0">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </header>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className={`p-3.5 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 border-t ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/30 border-slate-100'
                  }`}>
                    {categoryTechs.map((tech) => {
                      const isSelected = selectedTechId === tech.id;
                      const isConnected = selectedTechId && tech.connections?.includes(selectedTechId);

                      return (
                        <article
                          key={tech.id}
                          id={`tech-card-${tech.id}`}
                          onClick={() => handleTechClick(tech.id)}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between ${
                            isSelected
                              ? isDarkMode 
                                ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/30 shadow-xl shadow-purple-950/40 scale-[1.01] z-10' 
                                : 'bg-white border-blue-500 ring-4 ring-blue-500/10 shadow-md scale-[1.01] z-10'
                              : isConnected
                              ? isDarkMode 
                                ? 'bg-emerald-950/30 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/30 z-10' 
                                : 'bg-emerald-50/50 border-emerald-500 shadow-xs ring-4 ring-emerald-500/5 z-10'
                              : isDarkMode 
                                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                          }`}
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">
                                  {tech.id === 'react' ? '⚛️' : tech.id === 'next' ? '▲' : tech.id === 'vue' ? '💚' : tech.id === 'angular' ? '🅰️' : '⚡'}
                                </span>
                                <h3 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {tech.title}
                                </h3>
                                {isConnected && (
                                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border animate-pulse ${
                                    isDarkMode 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                      : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                                  }`}>
                                    Connected
                                  </span>
                                )}
                              </div>

                              {/* Interactive Circle Selector */}
                              <button
                                onClick={(e) => handleToggleStatus(e, tech.id)}
                                title="Click to cycle status"
                                className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center hover:scale-110 transition-transform ${
                                  isDarkMode ? 'border-slate-700 bg-slate-800 shadow-inner' : 'border-slate-300 bg-white shadow-2xs'
                                }`}
                              >
                                {tech.status === 'i-know' && (
                                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-xs shadow-emerald-400/50" />
                                )}
                                {tech.status === 'learning' && (
                                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-xs shadow-amber-400/50" />
                                )}
                                {tech.status === 'to-explore' && (
                                  <div className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} />
                                )}
                              </button>
                            </div>

                            {/* Card Body */}
                            <p className={`text-[11px] leading-relaxed mb-4 font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              {isSimpleMode ? tech.simpleMetaphor : tech.technicalExplanation}
                            </p>
                          </div>

                          {/* Connection Portal Panel */}
                          {isSelected && tech.connections && tech.connections.length > 0 && (
                            <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                              <span className={`text-[9px] font-bold uppercase tracking-wider block mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Teleport Portal (Click to Jump):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {tech.connections.map((connId) => {
                                  const target = technologies.find((t) => t.id === connId);
                                  if (!target) return null;
                                  return (
                                    <button
                                      key={connId}
                                      onClick={(e) => handleTeleport(e, connId)}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition active:scale-95 ${
                                        isDarkMode 
                                          ? 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border-purple-500/30' 
                                          : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                                      }`}
                                    >
                                      <span>{target.emoji || '⚡'}</span>
                                      <span>{target.title}</span>
                                      <ArrowRight className={`w-3 h-3 ${isDarkMode ? 'text-purple-400' : 'text-blue-400'}`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Default Static Associated Techs */}
                          {!isSelected && tech.worksWellWith && tech.worksWellWith.length > 0 && (
                            <div className={`pt-2.5 border-t flex items-center gap-1.5 overflow-hidden ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                              <span className={`text-[9px] font-bold uppercase tracking-wider shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Integrates:
                              </span>
                              <div className="flex gap-1 overflow-x-auto scrollbar-none">
                                {tech.worksWellWith.slice(0, 3).map((item, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-0.5 rounded-md text-[9px] font-semibold border shrink-0 ${
                                      isDarkMode 
                                        ? 'bg-slate-800/60 text-slate-400 border-slate-700/40' 
                                        : 'bg-slate-50 text-slate-500 border-slate-200/60'
                                    }`}
                                  >
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
                )}
              </section>
            );
          })}
        </main>
      </div>

      {/* FOOTER AREA (Theme preference switch placement) */}
      <footer className={`mt-16 border-t py-8 px-4 transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800/80 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold tracking-tight">TechMap &copy; 2026</span>
          </div>

          {/* Clean Theme Switcher in Footer */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Switch to Dark Theme</span>
              </>
            )}
          </button>
        </div>
      </footer>

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