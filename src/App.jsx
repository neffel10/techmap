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
  Lightbulb,
  Plus,
  Eye,
  EyeOff,
  Crown,
  Trash2,
  FolderMinus,
  FolderCheck,
  Globe,
  RotateCcw,
  AlertTriangle,
  Scale,
  User
} from 'lucide-react';

// Import local modular data & components
import { categories as initialCategories, comparisons, technologies as initialTechnologies } from './data';
import { ComparisonModal } from './components/ComparisonModal';
import { CareerQuizModal } from './components/CareerQuizModal';
import AIKnowledgeWorkspace from './components/AIWorkspace/AIKnowledgeWorkspace';

// Robust Helper component for monochromatic white SVG logos
const TechLogo = ({ tech, className = "w-5 h-5" }) => {
  const [hasError, setHasError] = useState(false);

  const techId = typeof tech === 'string' ? tech : tech?.id;
  const customIconSlug = typeof tech === 'object' ? tech?.customIconSlug : null;

  useEffect(() => {
    setHasError(false);
  }, [techId, customIconSlug]);

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
    restful: 'postman',
    svelte: 'svelte',
    remix: 'remix',
    astro: 'astro'
  };

  const slug = customIconSlug || iconSlugs[techId] || techId;

  if (hasError || !slug) {
    return <Code2 className={`${className} text-slate-400`} />;
  }

  return (
    <img 
      src={`https://cdn.simpleicons.org/${slug}/white`} 
      alt={techId}
      onError={() => setHasError(true)}
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

  // Mode & Navigation State
  const [viewMode, setViewMode] = useState('atlas'); // 'atlas' | 'admin'
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [modeNotification, setModeNotification] = useState(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // AI Knowledge Workspace State
  const [activeTechForInfo, setActiveTechForInfo] = useState(null);

  // AI Roadmap Filter & Mandatory Onboarding
  const [aiRoadmapFilter, setAiRoadmapFilter] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(() => {
    const completed = localStorage.getItem('techmap-ai-completed');
    return !completed; // Force open if user hasn't completed onboarding
  });

  // Comparisons Banner Toggle State
  const [showComparisonBanner, setShowComparisonBanner] = useState(false);

  // Dynamic Technologies State
  const [techList, setTechList] = useState(() => {
    const saved = localStorage.getItem('techmap-custom-techs');
    return saved ? JSON.parse(saved) : initialTechnologies.map(t => ({ ...t, isHidden: false }));
  });

  // Hidden Categories State
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState(() => {
    const saved = localStorage.getItem('techmap-hidden-categories');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin New Card Form State
  const [newCard, setNewCard] = useState({
    title: '',
    categoryId: initialCategories[0]?.id || '',
    simpleMetaphor: '',
    technicalExplanation: '',
    iconSlug: '',
    connections: []
  });

  // Connection Portal Search State in Admin
  const [portalSearch, setPortalSearch] = useState('');

  // Search & Navigation State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComparison, setActiveComparison] = useState(null);
  const [userTechStatus, setUserTechStatus] = useState({});

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('techmap-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('techmap-custom-techs', JSON.stringify(techList));
  }, [techList]);

  useEffect(() => {
    localStorage.setItem('techmap-hidden-categories', JSON.stringify(hiddenCategoryIds));
  }, [hiddenCategoryIds]);

  // Open AI Workspace Handler
  const handleOpenAiWorkspace = (e, tech) => {
    e.stopPropagation();
    setActiveTechForInfo({
      ...tech,
      name: tech.title || tech.name,
      aiData: tech.aiData || {
        description: tech.technicalExplanation || tech.simpleMetaphor,
        useCases: ["Production Scalability", "Modern Web Architecture", "High-Performance Workflows"],
        successStories: ["Vercel", "Meta", "Netflix", "Shopify"],
        directCompetitors: ["Alternative Tool A", "Alternative Tool B"],
        simpleMetaphor: tech.simpleMetaphor || "An essential tool for modern software engineering."
      }
    });
  };

  // Toast Notification
  const handleModeSwitch = (simple) => {
    if (isSimpleMode === simple) return;
    setIsSimpleMode(simple);
    setModeNotification({
      title: simple ? "Simple Mode: ON" : "Technical Mode: ON",
      subtitle: simple ? "Every technology explained with clear metaphors!" : "Production-ready technical specs.",
      icon: simple ? "💡" : "⚡"
    });
    setTimeout(() => setModeNotification(null), 1600);
  };

  // Reset local storage with explicit confirmation
  const confirmResetToDefaults = () => {
    localStorage.removeItem('techmap-custom-techs');
    localStorage.removeItem('techmap-hidden-categories');
    setTechList(initialTechnologies.map(t => ({ ...t, isHidden: false })));
    setHiddenCategoryIds([]);
    setShowRestoreConfirm(false);
    
    setModeNotification({
      title: "System Restored",
      subtitle: "Restored initial system technologies and reset visibility.",
      icon: "🔄"
    });
    setTimeout(() => setModeNotification(null), 1600);
  };

  // Toggle Card Visibility
  const toggleCardVisibility = (techId) => {
    setTechList(prev => prev.map(tech => 
      tech.id === techId ? { ...tech, isHidden: !tech.isHidden } : tech
    ));
  };

  // Delete Custom Card Handler
  const handleDeleteCustomCard = (techId) => {
    setTechList(prevList => {
      const filteredList = prevList.filter(tech => tech.id !== techId);
      return filteredList.map(tech => ({
        ...tech,
        connections: (tech.connections || []).filter(connId => connId !== techId)
      }));
    });

    setModeNotification({
      title: "Card Deleted",
      subtitle: "Removed safely without affecting base technologies.",
      icon: "🗑️"
    });
    setTimeout(() => setModeNotification(null), 1600);
  };

  // Toggle Category Visibility
  const toggleCategoryVisibility = (catId) => {
    setHiddenCategoryIds(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // Add Portal Connection to New Card Form
  const handleAddConnection = (targetId) => {
    if (!newCard.connections.includes(targetId)) {
      setNewCard(prev => ({
        ...prev,
        connections: [...prev.connections, targetId]
      }));
    }
    setPortalSearch('');
  };

  // Remove Portal Connection from New Card Form
  const handleRemoveConnection = (targetId) => {
    setNewCard(prev => ({
      ...prev,
      connections: prev.connections.filter(id => id !== targetId)
    }));
  };

  // Add New Custom Card Handler
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.title.trim() || !newCard.simpleMetaphor.trim()) return;

    const generatedUniqueId = `custom-card-${crypto.randomUUID()}`;

    const createdTech = {
      id: generatedUniqueId,
      title: newCard.title.trim(),
      categoryId: newCard.categoryId,
      simpleMetaphor: newCard.simpleMetaphor.trim(),
      technicalExplanation: newCard.technicalExplanation.trim() || newCard.simpleMetaphor.trim(),
      status: 'to-explore',
      connections: newCard.connections,
      worksWellWith: [],
      isHidden: false,
      isCustom: true,
      customIconSlug: newCard.iconSlug.trim() || null
    };

    setTechList(prevList => {
      const updatedList = [createdTech, ...prevList];

      return updatedList.map(tech => {
        if (newCard.connections.includes(tech.id)) {
          const existingConnections = tech.connections || [];
          if (!existingConnections.includes(generatedUniqueId)) {
            return {
              ...tech,
              connections: [...existingConnections, generatedUniqueId]
            };
          }
        }
        return tech;
      });
    });

    setNewCard({
      title: '',
      categoryId: initialCategories[0]?.id || '',
      simpleMetaphor: '',
      technicalExplanation: '',
      iconSlug: '',
      connections: []
    });

    setModeNotification({
      title: "Card Created!",
      subtitle: "Unique UUID assigned. Reciprocal links active.",
      icon: "🎯"
    });
    setTimeout(() => setModeNotification(null), 1600);
  };

  // Filter Categories for Public Atlas
  const visibleCategories = initialCategories.filter(cat => !hiddenCategoryIds.includes(cat.id));

  // Active status counters
  const visibleTechs = techList.filter(t => !t.isHidden && !hiddenCategoryIds.includes(t.categoryId));
  const counts = {
    iKnow: visibleTechs.filter((t) => (userTechStatus[t.id] || t.status) === 'i-know').length,
    learning: visibleTechs.filter((t) => (userTechStatus[t.id] || t.status) === 'learning').length,
    toExplore: visibleTechs.filter((t) => (userTechStatus[t.id] || t.status) === 'to-explore').length,
  };

  const handlePillFilterClick = (filterType) => {
    setStatusFilter(statusFilter === filterType ? 'all' : filterType);
  };

  const handleToggleStatus = (e, techId) => {
    e.stopPropagation();
    setUserTechStatus((prev) => {
      const current = prev[techId] || techList.find((t) => t.id === techId)?.status || 'to-explore';
      let nextStatus = 'learning';
      if (current === 'learning') nextStatus = 'i-know';
      else if (current === 'i-know') nextStatus = 'to-explore';

      return { ...prev, [techId]: nextStatus };
    });
  };

  const handleTechClick = (techId) => {
    setSelectedTechId(selectedTechId === techId ? null : techId);
  };

  const handleTeleport = (e, targetTechId) => {
    e.stopPropagation();
    const targetTech = techList.find((t) => t.id === targetTechId);
    if (targetTech) {
      setSelectedCategoryId(targetTech.categoryId);
    }
    setSelectedTechId(targetTechId);
  };

  // Filtered Techs for rendering in Atlas View
  const filteredTechnologies = techList
    .filter(t => !t.isHidden && !hiddenCategoryIds.includes(t.categoryId))
    .filter(t => {
      if (aiRoadmapFilter && aiRoadmapFilter.ids) {
        return aiRoadmapFilter.ids.includes(t.id);
      }
      return true;
    })
    .map((tech) => ({
      ...tech,
      status: userTechStatus[tech.id] || tech.status
    })).filter((tech) => {
      const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.simpleMetaphor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.technicalExplanation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  const activeCategory = initialCategories.find((c) => c.id === selectedCategoryId);
  const isGlobalFilterActive = statusFilter !== 'all' || searchQuery.trim() !== '' || Boolean(aiRoadmapFilter);

  // Portal candidate list for search dropdown
  const portalCandidates = techList.filter(t => 
    !newCard.connections.includes(t.id) &&
    t.title.toLowerCase().includes(portalSearch.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 relative ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white'
    }`}>
      
      {/* HUD NOTIFIER */}
      {modeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 text-center max-w-sm shadow-2xl shadow-purple-950/50">
            <span className="text-4xl mb-3 block animate-bounce">{modeNotification.icon}</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">{modeNotification.title}</h3>
            <p className="text-slate-300 text-xs font-medium leading-relaxed">{modeNotification.subtitle}</p>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR RESTORE DEFAULTS */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reset to Default Settings?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This will restore all default technologies and category visibility, but <strong className="text-slate-200">will permanently delete all your custom created cards</strong>.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetToDefaults}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-950/50"
              >
                Yes, Restore All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI CAREER ROADMAP MODAL */}
      <CareerQuizModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          localStorage.setItem('techmap-ai-completed', 'true');
        }}
        techList={techList}
        onGenerateRoadmap={(filter) => {
          setAiRoadmapFilter(filter);
          setSelectedCategoryId(null);
          localStorage.setItem('techmap-ai-completed', 'true');
        }}
      />

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
                onClick={() => { setViewMode('atlas'); setSelectedCategoryId(null); setSearchQuery(''); setStatusFilter('all'); setAiRoadmapFilter(null); setActiveTechForInfo(null); }}
                className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow-md cursor-pointer shrink-0"
              >
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 
                  onClick={() => { setViewMode('atlas'); setSelectedCategoryId(null); setSearchQuery(''); setStatusFilter('all'); setAiRoadmapFilter(null); setActiveTechForInfo(null); }}
                  className={`text-base sm:text-lg font-bold leading-none tracking-tight cursor-pointer ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  TechMap
                </h1>
                <p className={`text-[10px] font-medium hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Interactive Web Technology Atlas
                </p>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Compare Tools Button */}
              {comparisons && comparisons.length > 0 && (
                <button
                  onClick={() => setShowComparisonBanner(!showComparisonBanner)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                    showComparisonBanner
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white border border-pink-400/40'
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-950/40 border border-transparent'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-indigo-200" />
                  <span className="hidden sm:inline">Compare Tools</span>
                </button>
              )}

              {/* Admin User Icon */}
              <button
                onClick={() => setViewMode(viewMode === 'atlas' ? 'admin' : 'atlas')}
                className={`h-9 w-9 rounded-xl transition-all border active:scale-95 flex items-center justify-center shrink-0 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-slate-100 border-slate-200'
                }`}
                title={viewMode === 'admin' ? "Exit Admin Portal" : "Enter Admin Portal"}
              >
                <User className="w-4 h-4 text-amber-400" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 shrink-0 ${
                  isDarkMode ? 'bg-slate-800 text-amber-400 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Simple / Technical Toggle */}
              <div className={`h-9 flex items-center gap-0.5 p-1 rounded-xl border ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => handleModeSwitch(true)}
                  className={`h-full px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isSimpleMode
                      ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Simple</span>
                </button>

                <button
                  onClick={() => handleModeSwitch(false)}
                  className={`h-full px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    !isSimpleMode
                      ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Technical</span>
                </button>
              </div>

            </div>
          </div>
        </header>

        {/* 2. TOP BANNER DE COMPARACIONES */}
        {showComparisonBanner && comparisons && comparisons.length > 0 && (
          <div className="bg-slate-900/95 border-b border-indigo-500/30 p-3.5 animate-in slide-in-from-top duration-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap items-center gap-2.5 py-1">
                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> Comparisons:
                </span>
                {comparisons.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setActiveComparison(comp);
                      setShowComparisonBanner(false);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
                  >
                    {comp.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. ADMIN PANEL VIEW */}
        {viewMode === 'admin' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full animate-in fade-in duration-200">
            
            {/* Create Custom Card Form */}
            <div className={`border rounded-2xl p-5 sm:p-6 mb-8 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-800">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Create Premium Custom Card</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRestoreConfirm(true)}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-red-300 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-800/50 rounded-lg transition flex items-center gap-1"
                    title="Restore default technologies"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Defaults</span>
                  </button>
                  
                  <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                    Premium Tier
                  </span>
                </div>
              </div>

              <form onSubmit={handleAddCard} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Technology Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Supabase, Astro, Prisma"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Category Domain *</label>
                  <select
                    value={newCard.categoryId}
                    onChange={(e) => setNewCard({ ...newCard, categoryId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {initialCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    SimpleIcons Slug / Icon ID <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. react, svelte, postgresql"
                    value={newCard.iconSlug}
                    onChange={(e) => setNewCard({ ...newCard, iconSlug: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Simple Metaphor / Explanation *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Explain it with a simple everyday metaphor..."
                    value={newCard.simpleMetaphor}
                    onChange={(e) => setNewCard({ ...newCard, simpleMetaphor: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Technical Architecture Specs <span className="text-slate-500 font-normal">(Optional)</span></label>
                  <textarea
                    rows="2"
                    placeholder="Technical overview for engineers..."
                    value={newCard.technicalExplanation}
                    onChange={(e) => setNewCard({ ...newCard, technicalExplanation: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* MULTI-PORTAL RELATIONSHIPS SEARCH & CHIPS */}
                <div className="md:col-span-3 border-t border-slate-800/80 pt-3">
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Portal Connections (Link to Existing Tools):
                  </label>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {newCard.connections.map((connId) => {
                      const connectedTech = techList.find(t => t.id === connId);
                      return (
                        <span
                          key={connId}
                          className="px-2.5 py-1 bg-purple-950/60 border border-purple-500/40 text-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          <TechLogo tech={connectedTech || connId} className="w-3 h-3" />
                          <span>{connectedTech?.title || connId}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveConnection(connId)}
                            className="hover:text-red-400 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  <div className="relative max-w-md">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tech to link as a portal..."
                      value={portalSearch}
                      onChange={(e) => setPortalSearch(e.target.value)}
                      className={`w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs font-medium focus:outline-none ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />

                    {portalSearch.trim() !== '' && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-slate-900 border border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto p-1">
                        {portalCandidates.length > 0 ? (
                          portalCandidates.map((tech) => (
                            <button
                              key={tech.id}
                              type="button"
                              onClick={() => handleAddConnection(tech.id)}
                              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-purple-600 hover:text-white rounded-lg flex items-center justify-between transition"
                            >
                              <div className="flex items-center gap-2">
                                <TechLogo tech={tech} className="w-3.5 h-3.5" />
                                <span>{tech.title}</span>
                              </div>
                              <Plus className="w-3.5 h-3.5 text-purple-400" />
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-slate-500">No matching tech found.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom Card</span>
                  </button>
                </div>
              </form>
            </div>

            {/* CATEGORY-BASED VISIBILITY & MANAGEMENT */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Category Visibility & Card Management ({techList.length} Total Cards)
              </h3>

              {initialCategories.map((category) => {
                const categoryCards = techList.filter(t => t.categoryId === category.id);
                const isCategoryHidden = hiddenCategoryIds.includes(category.id);

                return (
                  <div
                    key={category.id}
                    className={`border rounded-2xl overflow-hidden transition ${
                      isCategoryHidden 
                        ? 'border-red-900/40 bg-slate-950/40 opacity-70' 
                        : isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${isCategoryHidden ? 'bg-red-500' : 'bg-emerald-400'}`} />
                        <h4 className="text-sm font-extrabold text-white">{category.title}</h4>
                        <span className="text-xs font-mono font-bold text-slate-500">({categoryCards.length} cards)</span>
                      </div>

                      <button
                        onClick={() => toggleCategoryVisibility(category.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                          isCategoryHidden
                            ? 'bg-red-950/40 text-red-300 border-red-800/50 hover:bg-red-900/60'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/60'
                        }`}
                      >
                        {isCategoryHidden ? (
                          <>
                            <FolderMinus className="w-3.5 h-3.5" />
                            <span>Category Hidden</span>
                          </>
                        ) : (
                          <>
                            <FolderCheck className="w-3.5 h-3.5" />
                            <span>Category Visible</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryCards.map((tech) => (
                        <div
                          key={tech.id}
                          className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            tech.isHidden || isCategoryHidden
                              ? 'bg-slate-950/60 border-slate-900 opacity-60'
                              : isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="p-1.5 bg-slate-800 rounded-lg shrink-0">
                              <TechLogo tech={tech} className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs font-bold text-white truncate">{tech.title}</h5>
                                {tech.isCustom && (
                                  <span className="px-1.5 py-0.2 text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                                    Custom
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">{tech.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleCardVisibility(tech.id)}
                              className={`p-1.5 rounded-lg border transition ${
                                tech.isHidden
                                  ? 'bg-amber-950/30 text-amber-400 border-amber-900/50 hover:bg-amber-900/50'
                                  : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900/50'
                              }`}
                              title={tech.isHidden ? "Click to Show in Atlas" : "Click to Hide in Atlas"}
                            >
                              {tech.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>

                            {tech.isCustom && (
                              <button
                                onClick={() => handleDeleteCustomCard(tech.id)}
                                className="p-1.5 rounded-lg border bg-red-950/40 text-red-400 border-red-900/50 hover:bg-red-900/80 transition"
                                title="Delete Custom Card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. PUBLIC ATLAS VIEW */}
        {viewMode === 'atlas' && (
          <>
            {/* Hub Controls */}
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

                <div className="relative min-w-[220px] sm:min-w-[280px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tools, terms, metaphors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-purple-500' 
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <button
                  onClick={() => handlePillFilterClick('i-know')}
                  className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all cursor-pointer ${
                    statusFilter === 'i-know'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400'
                      : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${statusFilter === 'i-know' ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-bold">I Know: {counts.iKnow}</span>
                </button>

                <button
                  onClick={() => handlePillFilterClick('learning')}
                  className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all cursor-pointer ${
                    statusFilter === 'learning'
                      ? 'bg-amber-400 text-slate-950 font-extrabold border-amber-300'
                      : 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${statusFilter === 'learning' ? 'bg-slate-950' : 'bg-amber-400'}`} />
                  <span className="text-xs font-bold">Learning: {counts.learning}</span>
                </button>

                <button
                  onClick={() => handlePillFilterClick('to-explore')}
                  className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all cursor-pointer ${
                    statusFilter === 'to-explore'
                      ? 'bg-slate-200 text-slate-950 font-extrabold border-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${statusFilter === 'to-explore' ? 'bg-slate-950' : 'bg-slate-400'}`} />
                  <span className="text-xs font-bold">To Explore: {counts.toExplore}</span>
                </button>

                {isGlobalFilterActive && (
                  <button
                    onClick={() => { setStatusFilter('all'); setSearchQuery(''); setAiRoadmapFilter(null); }}
                    className="px-2.5 py-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 bg-purple-950/40 border border-purple-500/30 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span>Reset filter</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* AI ROADMAP ACTIVE HUD BANNER */}
              {aiRoadmapFilter && (
                <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/40 rounded-2xl p-4 mb-4 flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-600 rounded-xl text-white shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        AI Track: {aiRoadmapFilter.title}
                      </h3>
                      <p className="text-xs text-purple-200">
                        {aiRoadmapFilter.reasoning}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setAiRoadmapFilter(null)}
                    className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-xs font-bold text-slate-300 rounded-xl border border-slate-700 flex items-center gap-1.5 active:scale-95 transition shrink-0 cursor-pointer"
                  >
                    <span>Clear AI Filter</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </section>

            {/* Atlas Cards Container with Split View Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2 flex flex-col lg:flex-row gap-6 items-start">
              
              <main className={`flex-1 w-full flex flex-col justify-stretch transition-all duration-300 ${
                activeTechForInfo ? 'lg:w-[25%] shrink-0 overflow-y-auto max-h-[calc(100vh-140px)] pr-1' : 'max-w-7xl mx-auto'
              }`}>
                
                {/* Home Category Grid */}
                {!selectedCategoryId && !isGlobalFilterActive && (
                  <div className={`grid gap-3 sm:gap-3.5 animate-in fade-in duration-200 ${
                    activeTechForInfo 
                      ? 'grid-cols-1 sm:grid-cols-2' 
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 min-h-[calc(100vh-250px)] h-full'
                  }`}>
                    {visibleCategories.map((category) => {
                      const categoryTechsCount = techList.filter((t) => t.categoryId === category.id && !t.isHidden).length;

                      return (
                        <div
                          key={category.id}
                          onClick={() => setSelectedCategoryId(category.id)}
                          className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center p-4 text-center h-full ${
                            isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-purple-500/50' : 'bg-white border-slate-200'
                          }`}
                        >
                          <img 
                            src={category.image} 
                            alt={category.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${
                            isDarkMode ? 'from-slate-950 via-slate-950/80 to-slate-950/40' : 'from-slate-900/90 via-slate-900/60 to-transparent'
                          }`} />

                          {/* Categories Counter <span className="absolute top-3 left-3 z-10 text-[10px] font-mono font-bold text-slate-200 bg-slate-950/80 border border-slate-700/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
                            {categoryTechsCount} tools
                          </span> */}

                          <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-lg bg-white/10 group-hover:bg-purple-600 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all">
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>

                          <div className="relative z-10 px-2 my-auto flex items-center justify-center">
                            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-snug drop-shadow-md text-center">
                              {category.title}
                            </h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Multi-Category Unrolled View */}
                {(selectedCategoryId || isGlobalFilterActive) && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200 pb-4">
                    {visibleCategories
                      .filter((cat) => isGlobalFilterActive ? true : cat.id === selectedCategoryId)
                      .map((category) => {
                        const categoryTechs = filteredTechnologies.filter((t) => t.categoryId === category.id);
                        if (categoryTechs.length === 0) return null;

                        return (
                          <section 
                            key={category.id} 
                            className={`border rounded-2xl overflow-hidden shadow-xl ${
                              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="relative overflow-hidden h-16 sm:h-20 flex items-center justify-between p-4 select-none">
                              <img src={category.image} alt={category.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

                              <div className="relative z-10 flex items-center gap-3">
                                <button
                                  onClick={() => { setSelectedCategoryId(null); setSearchQuery(''); setStatusFilter('all'); setAiRoadmapFilter(null); }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white hover:bg-purple-600 flex items-center gap-1.5 font-bold text-xs shrink-0 cursor-pointer"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5 text-purple-300" />
                                  <span>Back to Categories</span>
                                </button>

                                <div>
                                  <h2 className="text-sm sm:text-base font-extrabold text-white">{category.title}</h2>
                                  <p className="text-[11px] font-bold text-slate-400">{categoryTechs.length} technologies listed</p>
                                </div>
                              </div>
                            </div>

                            <div className={`p-3.5 sm:p-5 grid gap-3.5 border-t border-slate-800 bg-slate-950/60 ${
                              activeTechForInfo ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }`}>
                              {categoryTechs.map((tech) => {
                                const isSelected = selectedTechId === tech.id;
                                const isConnected = selectedTechId && tech.connections?.includes(selectedTechId);

                                return (
                                  <article
                                    key={tech.id}
                                    id={`tech-card-${tech.id}`}
                                    onClick={() => handleTechClick(tech.id)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                                      isSelected
                                        ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/30'
                                        : isConnected
                                        ? 'bg-emerald-950/30 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/30'
                                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-2.5">
                                          <div className="p-1.5 rounded-lg border bg-slate-800 border-slate-700 flex items-center justify-center">
                                            <TechLogo tech={tech} className="w-4 h-4" />
                                          </div>

                                          <h3 className="text-sm font-extrabold text-white">{tech.title}</h3>
                                          
                                          {tech.isCustom && (
                                            <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                              Custom
                                            </span>
                                          )}

                                          {isConnected && (
                                            <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                                              Connected
                                            </span>
                                          )}
                                        </div>

                                        <button
                                          onClick={(e) => handleToggleStatus(e, tech.id)}
                                          className="w-5 h-5 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center"
                                        >
                                          {tech.status === 'i-know' && <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />}
                                          {tech.status === 'learning' && <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />}
                                          {tech.status === 'to-explore' && <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />}
                                        </button>
                                      </div>

                                      <p className="text-xs leading-relaxed mb-3 text-slate-300 font-normal">
                                        {isSimpleMode ? tech.simpleMetaphor : tech.technicalExplanation}
                                      </p>

                                      {/* +INFO AI Workspace Button */}
                                      <button
                                        onClick={(e) => handleOpenAiWorkspace(e, tech)}
                                        className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-[11px] tracking-wide shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border border-cyan-400/30 group"
                                      >
                                        <Sparkles className="w-3.5 h-3.5 text-cyan-200 transition-transform group-hover:rotate-12" />
                                        <span>+Info</span>
                                      </button>
                                    </div>

                                    {/* Connection Teleport Portal inside card */}
                                    {isSelected && tech.connections && tech.connections.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-slate-800">
                                        <span className="text-[9px] font-bold uppercase tracking-wider block mb-1.5 text-slate-500">
                                          Teleport Portal:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {tech.connections.map((connId) => {
                                            const target = techList.find((t) => t.id === connId);
                                            if (!target) return null;
                                            return (
                                              <button
                                                key={connId}
                                                onClick={(e) => handleTeleport(e, connId)}
                                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 transition active:scale-95 cursor-pointer"
                                              >
                                                <TechLogo tech={target} className="w-3 h-3" />
                                                <span>{target.title}</span>
                                                <ArrowRight className="w-3 h-3 text-purple-400" />
                                              </button>
                                            );
                                          })}
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

              {/* Right Side: AI Knowledge Workspace Panel */}
              {activeTechForInfo && (
                <div className="lg:w-[65%] w-full h-[calc(100vh-140px)] sticky top-20 shrink-0 animate-in slide-in-from-right duration-300">
                  <AIKnowledgeWorkspace
                    tech={activeTechForInfo}
                    onClose={() => setActiveTechForInfo(null)}
                    onCompareTrigger={(id, target) => {
                      const matchedComp = comparisons?.find(c => c.id === target || c.title.toLowerCase().includes(target.toLowerCase()));
                      if (matchedComp) {
                        setActiveComparison(matchedComp);
                      }
                    }}
                    onNavigateToRelated={(relatedId) => {
                      handleTechClick(relatedId);
                    }}
                  />
                </div>
              )}

            </div>
          </>
        )}
      </div>

      {/* BOTÓN FLOTANTE REDONDO AI TRACK */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold shadow-2xl shadow-purple-950/80 border border-purple-400/40 flex flex-col items-center justify-center gap-0.5 active:scale-90 transition-all group cursor-pointer"
        title="Open AI Career Roadmap Quiz"
      >
        <Sparkles className="w-5 h-5 text-purple-200 animate-pulse group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black tracking-wider leading-none">AI</span>
      </button>

      {/* FOOTER */}
      <footer className={`border-t py-4 transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800/80 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left Side: Brand & Author */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <Layers className="w-4 h-4 text-purple-500 shrink-0" />
            <span>TechMap &copy; 2026</span>
            <span className="text-slate-600 dark:text-slate-700">|</span>
            <span className="text-slate-300 font-semibold">Created by Alessandro Torres</span>
          </div>

          {/* Right Side: Portfolio External Link */}
          <a
            href="https://alessandrotorres.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 transition flex items-center gap-1.5 group px-2.5 py-1 rounded-lg hover:bg-purple-950/40 border border-transparent hover:border-purple-500/30"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span>Web Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

        </div>
      </footer>

      {/* Modal de Comparaciones */}
      {activeComparison && (
        <ComparisonModal
          comparison={activeComparison}
          technologies={techList}
          onClose={() => setActiveComparison(null)}
        />
      )}
    </div>
  );
}