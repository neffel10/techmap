import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Search, 
  Sparkles, 
  Layers,
  ArrowLeft,
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

// Helper component for monochromatic white SVG logos
const TechLogo = ({ id, className = "w-5 h-5" }) => {
  const iconSlugs = {
    react: 'react',
    next: 'nextdotjs',
    vue: 'vuedotjs',
    angular: 'angular',
    tailwind: 'tailwindcss',
    sass: 'sass',
    wordpress: 'wordpress',
    contentful: 'contentful',
    strapi: 'strapi',
    sanity: 'sanity',
    docker: 'docker',
    salesforce: 'salesforce',
    hubspot: 'hubspot',
    zoho: 'zoho',
    ga: 'googleanalytics',
    gtm: 'googletagmanager',
    'rest-api': 'postman',
    restful: 'postman'
  };

  const slug = iconSlugs[id];
  if (!slug) return <Code2 className={`${className} text-slate-400`} />;

  return (
    <img 
      src={`https://cdn.simpleicons.org/${slug}/white`} 
      alt={id}
      className={`${className} object-contain opacity-90 group-hover:opacity-100 transition-opacity`}
      loading="lazy"
    />
  );
};

export default function App() {
  // Persistence for Theme Mode (Default: Dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('techmap-theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Mode & Notification Toast State
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [modeNotification, setModeNotification] = useState(null);

  // Search & Navigation State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // NULL = Grid View
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'i-know' | 'learning' | 'to-explore'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComparison, setActiveComparison] = useState(null);
  const [userTechStatus, setUserTechStatus] = useState({});
  const [isComparisonsOpen, setIsComparisonsOpen] = useState(false);

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

  // Toggle or select status filter via pills
  const handlePillFilterClick = (filterType) => {
    if (statusFilter === filterType) {
      setStatusFilter('all'); // Toggle off if clicking the currently active filter
    } else {
      setStatusFilter(filterType);
    }
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
  };

  const handleTeleport = (e, targetTechId) => {
    e.stopPropagation();
    
    const targetTech = technologies.find((t) => t.id === targetTechId);
    if (targetTech) {
      setSelectedCategoryId(targetTech.categoryId);
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

  // Filter logic
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

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const isGlobalFilterActive = statusFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 relative ${
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

      {/* TOP CONTAINER */}
      <div className="flex-1 flex flex-col">
        
        {/* 1. Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div 
                onClick={() => { setSelectedCategoryId(null); setSearchQuery(''); setStatusFilter('all'); }}
                className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow-md cursor-pointer shrink-0"
              >
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 
                  onClick={() => { setSelectedCategoryId(null); setSearchQuery(''); setStatusFilter('all'); }}
                  className={`text-base sm:text-lg font-bold leading-none tracking-tight cursor-pointer ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  TechMap
                </h1>
                <p className={`text-[10px] font-medium hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Interactive Web Technology Atlas
                </p>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Dark / Light Theme Toggle Button (DESKTOP ONLY) */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`hidden sm:flex p-1.5 rounded-xl border transition-all active:scale-95 shrink-0 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Playbooks Button */}
              {comparisons && comparisons.length > 0 && (
                <button
                  onClick={() => setIsComparisonsOpen(!isComparisonsOpen)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5 border border-purple-400/30 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                  <span>Playbooks</span>
                </button>
              )}

              {/* Simple / Technical Toggle Switch */}
              <div className={`flex items-center gap-0.5 p-1 rounded-xl border ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => handleModeSwitch(true)}
                  title="Simple Explanation Mode"
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
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
            <div className={`backdrop-blur-xl border-b shadow-2xl p-4 animate-in slide-in-from-top-2 duration-200 ${
              isDarkMode ? 'bg-slate-900/95 border-indigo-500/20' : 'bg-slate-900 text-white border-indigo-900/50'
            }`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive Playbooks & Stacks
                  </div>
                  <button 
                    onClick={() => setIsComparisonsOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

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
        <section className="shrink-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5">
            <div>
              <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isGlobalFilterActive 
                  ? `Filtered View (${filteredTechnologies.length} results)`
                  : selectedCategoryId && activeCategory 
                    ? activeCategory.title 
                    : 'Atlas & Categories'}
              </h2>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isGlobalFilterActive
                  ? 'Showing all matching technologies across all categories.'
                  : selectedCategoryId 
                    ? 'Showing technologies for this domain. Select a card to teleport to connected tools.'
                    : 'Select a category to explore its technologies, metaphors, and cross-domain connections.'}
              </p>
            </div>

            {/* Clean Search Input */}
            <div className="relative min-w-[220px] sm:min-w-[280px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools, terms, metaphors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 shadow-inner' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 shadow-2xs'
                }`}
              />
            </div>
          </div>

          {/* CLICKABLE INTERACTIVE PILL FILTERS */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pill 1: I Know */}
            <button
              onClick={() => handlePillFilterClick('i-know')}
              className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all active:scale-95 cursor-pointer select-none ${
                statusFilter === 'i-know'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50'
                  : isDarkMode 
                    ? 'bg-emerald-950/40 border-emerald-800/40 hover:border-emerald-500/60 text-emerald-300' 
                    : 'bg-emerald-50 border-emerald-200 hover:border-emerald-300 text-slate-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                statusFilter === 'i-know' ? 'bg-slate-950' : 'bg-emerald-400 shadow-xs shadow-emerald-400/50'
              }`} />
              <span className="text-xs font-bold">I Know: {counts.iKnow}</span>
            </button>

            {/* Pill 2: Learning */}
            <button
              onClick={() => handlePillFilterClick('learning')}
              className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all active:scale-95 cursor-pointer select-none ${
                statusFilter === 'learning'
                  ? 'bg-amber-400 text-slate-950 font-extrabold border-amber-300 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/50'
                  : isDarkMode 
                    ? 'bg-amber-950/40 border-amber-800/40 hover:border-amber-500/60 text-amber-300' 
                    : 'bg-amber-50 border-amber-200 hover:border-amber-300 text-slate-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                statusFilter === 'learning' ? 'bg-slate-950' : 'bg-amber-400 shadow-xs shadow-amber-400/50'
              }`} />
              <span className="text-xs font-bold">Learning: {counts.learning}</span>
            </button>

            {/* Pill 3: To Explore */}
            <button
              onClick={() => handlePillFilterClick('to-explore')}
              className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all active:scale-95 cursor-pointer select-none ${
                statusFilter === 'to-explore'
                  ? 'bg-slate-200 text-slate-950 font-extrabold border-white ring-2 ring-white/40 shadow-lg'
                  : isDarkMode 
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300' 
                    : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                statusFilter === 'to-explore' ? 'bg-slate-950' : 'bg-slate-400'
              }`} />
              <span className="text-xs font-bold">To Explore: {counts.toExplore}</span>
            </button>

            {/* Clear Filter Badge (shows when a status filter or search is active) */}
            {isGlobalFilterActive && (
              <button
                onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                className="px-2.5 py-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 bg-purple-950/40 border border-purple-500/30 rounded-xl transition flex items-center gap-1"
              >
                <span>Reset filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </section>

        {/* 3. MAIN DYNAMIC CONTENT AREA */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2 flex flex-col justify-stretch">
          
          {/* VIEW 1: CATEGORIES GRID (Active when no category is selected AND no global filter/search is active) */}
          {!selectedCategoryId && !isGlobalFilterActive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 animate-in fade-in duration-200 min-h-[calc(100vh-250px)] h-full">
              {categories.map((category) => {
                const categoryTechsCount = technologies.filter((t) => t.categoryId === category.id).length;

                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl flex flex-col items-center justify-center p-4 text-center h-full ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-800 hover:border-purple-500/50 shadow-lg' 
                        : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                    }`}
                  >
                    {/* Background Image Restored with Smooth Overlay */}
                    <img 
                      src={category.image} 
                      alt={category.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDarkMode ? 'from-slate-950 via-slate-950/80 to-slate-950/40' : 'from-slate-900/90 via-slate-900/60 to-transparent'
                    }`} />

                    {/* Absolute Positioned Badges so Title sits DEAD CENTER */}
                    <span className="absolute top-3 left-3 z-10 text-[10px] font-mono font-bold text-slate-200 bg-slate-950/80 border border-slate-700/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
                      {categoryTechsCount} tools
                    </span>

                    <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-lg bg-white/10 group-hover:bg-purple-600 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* DEAD-CENTERED TITLE */}
                    <div className="relative z-10 px-2 my-auto flex items-center justify-center">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-snug drop-shadow-md group-hover:text-purple-300 transition-colors text-center">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: MULTI-CATEGORY UNROLLED VIEW (Active when a Category is picked OR a Filter/Search is active) */}
          {(selectedCategoryId || isGlobalFilterActive) && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200 pb-4">
              {categories
                .filter((cat) => isGlobalFilterActive ? true : cat.id === selectedCategoryId)
                .map((category) => {
                  const categoryTechs = filteredTechnologies.filter(
                    (t) => t.categoryId === category.id
                  );

                  if (categoryTechs.length === 0) return null;

                  return (
                    <section 
                      key={category.id} 
                      className={`border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Category Title Header with Integrated "Back to Categories" Button */}
                      <div className="relative overflow-hidden h-16 sm:h-20 flex items-center justify-between p-4 select-none">
                        <img 
                          src={category.image} 
                          alt={category.title} 
                          className={`absolute inset-0 w-full h-full object-cover ${
                            isDarkMode ? 'opacity-40' : 'opacity-80'
                          }`}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          isDarkMode ? 'from-slate-950 via-slate-950/80 to-transparent' : 'from-black/80 via-black/40 to-transparent'
                        }`} />

                        <div className="relative z-10 flex items-center gap-3">
                          {/* BACK TO CATEGORIES BUTTON */}
                          <button
                            onClick={() => { setSelectedCategoryId(null); setSearchQuery(''); setStatusFilter('all'); }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white hover:bg-purple-600 hover:border-purple-500 backdrop-blur-md shadow-lg transition-all active:scale-95 flex items-center gap-1.5 font-bold text-xs shrink-0"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 text-purple-300" />
                            <span>Back to Categories</span>
                          </button>

                          <div>
                            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-md">
                              {category.title}
                            </h2>
                            <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                              {categoryTechs.length} technologies listed
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 3 COLUMNS GRID INSIDE CATEGORY DETAIL */}
                      <div className={`p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 border-t ${
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
                              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between group ${
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
                                {/* Card Header (White SVG Logo + Neutral Container) */}
                                <div className="flex items-center justify-between mb-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                      isDarkMode 
                                        ? 'bg-slate-800/80 border-slate-700/60 shadow-inner group-hover:border-slate-600' 
                                        : 'bg-slate-900 border-slate-800'
                                    }`}>
                                      <TechLogo id={tech.id} className="w-4 h-4" />
                                    </div>

                                    <h3 className={`text-sm font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                      {tech.title}
                                    </h3>
                                    {isConnected && (
                                      <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded-full border animate-pulse ${
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
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center hover:scale-110 transition-transform ${
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
                                <p className={`text-xs leading-relaxed mb-3 font-normal ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  {isSimpleMode ? tech.simpleMetaphor : tech.technicalExplanation}
                                </p>
                              </div>

                              {/* Connection Portal Panel */}
                              {isSelected && tech.connections && tech.connections.length > 0 && (
                                <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                  <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border transition active:scale-95 ${
                                            isDarkMode 
                                              ? 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border-purple-500/30' 
                                              : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                                          }`}
                                        >
                                          <TechLogo id={target.id} className="w-3 h-3" />
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
                                <div className={`pt-2 border-t flex items-center gap-1.5 overflow-hidden ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
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
                    </section>
                  );
              })}
            </div>
          )}

        </main>
      </div>

      {/* FOOTER AREA */}
      <footer className={`border-t py-4 transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800/80 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold tracking-tight">TechMap &copy; 2026</span>
          </div>

          {/* Theme Switcher (MOBILE ONLY) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex sm:hidden px-3 py-1.5 rounded-xl border text-xs font-bold transition-all items-center gap-2 shadow-xs active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>Switch Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Switch Theme</span>
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