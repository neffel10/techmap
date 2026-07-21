import React, { useState } from 'react';
import { Sparkles, X, Loader2, Target, GraduationCap, Compass } from 'lucide-react';

const CAREER_OPTIONS = [
  'Fullstack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Cybersecurity Specialist',
  'Data Analyst / AI Engineer',
  'UX/UI Engineer'
];

const LEVEL_OPTIONS = ['Junior / Entry-Level', 'Mid-Level Specialist', 'Senior / Architect'];
const GOAL_OPTIONS = ['Get hired quickly', 'Professional specialization', 'Build a Startup / SaaS'];

export function CareerQuizModal({ isOpen, onClose, techList, onGenerateRoadmap }) {
  const [step, setStep] = useState(1);
  const [selectedCareer, setSelectedCareer] = useState(CAREER_OPTIONS[0]);
  const [selectedLevel, setSelectedLevel] = useState(LEVEL_OPTIONS[0]);
  const [selectedGoal, setSelectedGoal] = useState(GOAL_OPTIONS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      const keywordsMap = {
        'Frontend Developer': ['react', 'next', 'vue', 'tailwind', 'sass', 'svelte', 'astro', 'angular'],
        'Backend Developer': ['docker', 'rest', 'strapi', 'sanity', 'contentful', 'postman', 'node'],
        'Fullstack Developer': ['react', 'next', 'docker', 'tailwind', 'rest', 'strapi', 'supabase'],
        'DevOps Engineer': ['docker', 'rest-api', 'ga'],
        'Mobile Developer': ['react'],
        'Cybersecurity Specialist': ['docker', 'rest-api'],
        'Data Analyst / AI Engineer': ['ga', 'gtm'],
        'UX/UI Engineer': ['tailwind', 'sass', 'wordpress']
      };

      const preferredSlugs = keywordsMap[selectedCareer] || ['react', 'tailwind'];
      
      const matchedIds = techList
        .filter(t => {
          const lowerId = t.id.toLowerCase();
          const lowerTitle = t.title.toLowerCase();
          return preferredSlugs.some(slug => lowerId.includes(slug) || lowerTitle.includes(slug));
        })
        .map(t => t.id);

      onGenerateRoadmap({
        title: `${selectedCareer} (${selectedLevel.split(' ')[0]})`,
        reasoning: `Tailored learning path focused on ${selectedGoal.toLowerCase()} for ${selectedCareer}.`,
        ids: matchedIds.length > 0 ? matchedIds : techList.slice(0, 5).map(t => t.id)
      });

      setIsGenerating(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Career Roadmap Generator</h2>
              <p className="text-xs text-slate-400">Personalize your learning track using AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Step 1: Select Your Target Career
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {CAREER_OPTIONS.map(career => (
                <button
                  key={career}
                  onClick={() => setSelectedCareer(career)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                    selectedCareer === career
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {career}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl mt-4"
            >
              Next: Experience Level ➔
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Step 2: Your Current or Target Level
            </label>
            <div className="space-y-2">
              {LEVEL_OPTIONS.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="py-2.5 px-4 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl">
                Next: Primary Goal ➔
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Step 3: What is Your Primary Goal?
            </label>
            <div className="space-y-2">
              {GOAL_OPTIONS.map(goal => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition ${
                    selectedGoal === goal
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(2)} className="py-2.5 px-4 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                Back
              </button>
              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Roadmap with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}