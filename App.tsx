
import React, { useState } from 'react';
import { ALGORITHMS, CODE_SNIPPETS } from './constants';
import { Algorithm, AlgorithmCategory, Language } from './types';
import SortingVisualizer from './components/Visualizers/SortingVisualizer';
import SearchingVisualizer from './components/Visualizers/SearchingVisualizer';
import StackQueueVisualizer from './components/Visualizers/StackQueueVisualizer';
import HashTableVisualizer from './components/Visualizers/HashTableVisualizer';
import LinkedListVisualizer from './components/Visualizers/LinkedListVisualizer';
import TreeVisualizer from './components/Visualizers/TreeVisualizer';
import GraphVisualizer from './components/Visualizers/GraphVisualizer';
import ChatWindow from './components/AITutor/ChatWindow';

const App: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(ALGORITHMS[0]);
  const [speed, setSpeed] = useState(30);
  const [activeTab, setActiveTab] = useState<'visualize' | 'code'>('visualize');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.JAVASCRIPT);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = Object.values(AlgorithmCategory);

  const renderVisualizer = () => {
    switch (selectedAlgo.category) {
      case AlgorithmCategory.SORTING:
        return <SortingVisualizer algorithmId={selectedAlgo.id} speed={speed} onFinish={() => {}} />;
      case AlgorithmCategory.SEARCHING:
        return <SearchingVisualizer algorithmId={selectedAlgo.id} speed={speed} onFinish={() => {}} />;
      case AlgorithmCategory.STACKS:
      case AlgorithmCategory.QUEUES:
        return <StackQueueVisualizer algorithmId={selectedAlgo.id} speed={speed} />;
      case AlgorithmCategory.HASH_TABLES:
        return <HashTableVisualizer speed={speed} />;
      case AlgorithmCategory.LINKED_LISTS:
        return <LinkedListVisualizer speed={speed} />;
      case AlgorithmCategory.TREES:
        return <TreeVisualizer speed={speed} />;
      case AlgorithmCategory.GRAPHS:
        return <GraphVisualizer algorithmId={selectedAlgo.id} speed={speed} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800 text-slate-500">
            <p className="text-sm font-bold uppercase tracking-widest italic">Simulation Engine Optimizing</p>
          </div>
        );
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-8">
        {categories.map(cat => {
          const algosInCat = ALGORITHMS.filter(a => a.category === cat);
          if (algosInCat.length === 0) return null;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{cat}</h3>
                <span className="text-[9px] font-bold text-slate-700">{algosInCat.length} Units</span>
              </div>
              <div className="space-y-1.5">
                {algosInCat.map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => { 
                      setSelectedAlgo(algo); 
                      setActiveTab('visualize');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs transition-all relative group flex items-center justify-between ${
                      selectedAlgo.id === algo.id 
                        ? 'bg-indigo-600/10 text-indigo-300 font-black border border-indigo-500/20 shadow-inner' 
                        : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                  >
                    <span className="relative z-10">{algo.name}</span>
                    {selectedAlgo.id === algo.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#6366f1]"></div>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Contact Info */}
      <div className="mt-12 pt-8 border-t border-slate-800/50 space-y-4">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Contact Developer</h3>
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/50 space-y-3">
          <a href="mailto:appua0126@gmail.com" className="flex items-center gap-3 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors group">
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            Email Me
          </a>
          <a href="https://www.linkedin.com/in/appu-flutter/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors group">
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </div>
            LinkedIn
          </a>
          <a href="https://github.com/Appu-Devloper" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors group">
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] selection:bg-indigo-500/30">
      <header className="h-20 border-b border-slate-800/50 flex items-center px-6 md:px-10 justify-between bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl italic text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-white/10 shrink-0">A</div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500 tracking-tight">AlgoVisual Studio</h1>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Mastering Computer Science</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest">Browse Units</button>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appu M Edition</span>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] xl:hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-slate-950 border-r border-slate-800 p-8 overflow-y-auto">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-slate-800/50 bg-slate-950/50 overflow-y-auto hidden xl:block p-6 custom-scrollbar"><SidebarContent /></aside>
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 relative">
          <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-10 pb-12">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-slate-800/50 pb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-[0.2em]">Module: {selectedAlgo.category}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">{selectedAlgo.name}</h2>
                <p className="text-slate-400 text-sm md:text-base max-w-3xl font-medium leading-relaxed">{selectedAlgo.description}</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-[2rem] min-w-[120px] shadow-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Time</p>
                  <p className="text-indigo-400 font-mono text-lg font-black">{selectedAlgo.complexity.time}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-[2rem] min-w-[120px] shadow-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Space</p>
                  <p className="text-cyan-400 font-mono text-lg font-black">{selectedAlgo.complexity.space}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-8 space-y-8">
                <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
                  <div className="flex border-b border-slate-800 px-6 py-2 justify-between items-center bg-slate-900/60 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4">
                      {['visualize', 'code'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-4 text-[11px] font-black uppercase tracking-[0.2em] relative ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500'}`}>
                          {tab === 'visualize' ? 'Simulation' : 'Source Code'}
                          {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full shadow-lg"></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 md:p-10">
                    {activeTab === 'visualize' ? (
                      <div className="space-y-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800/50 shadow-inner">
                          <div className="flex-1 w-full space-y-3">
                            <div className="flex justify-between px-2 text-[10px] text-slate-500 uppercase font-black"><label>Speed</label><span className="text-indigo-400">{speed}%</span></div>
                            <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-indigo-500" />
                          </div>
                        </div>
                        {renderVisualizer()}
                      </div>
                    ) : (
                      <div className="bg-slate-950 p-6 md:p-8 rounded-[2rem] border border-slate-800 font-mono text-xs md:text-sm text-emerald-400 overflow-hidden">
                        <pre className="whitespace-pre-wrap leading-relaxed">{CODE_SNIPPETS[selectedAlgo.id]?.[selectedLanguage] || '// No snippet'}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="xl:col-span-4 h-[600px] xl:h-[850px] xl:sticky xl:top-24"><ChatWindow currentAlgorithm={selectedAlgo} /></div>
            </div>

            {/* Footer Attribution Section */}
            <footer className="pt-24 border-t border-slate-800/50 mt-20 pb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-black text-lg text-white border border-white/10 shadow-2xl rotate-3">AM</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-1">Developed by</p>
                    <p className="text-xl font-black text-white tracking-tighter">Appu M</p>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-6">
                  <div className="flex items-center gap-8">
                    <a href="mailto:appua0126@gmail.com" title="Email Appu" className="text-slate-400 hover:text-indigo-400 transition-all transform hover:scale-125 duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/appu-flutter/" target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="text-slate-400 hover:text-indigo-400 transition-all transform hover:scale-125 duration-300">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="https://github.com/Appu-Devloper" target="_blank" rel="noopener noreferrer" title="GitHub Repository" className="text-slate-400 hover:text-indigo-400 transition-all transform hover:scale-125 duration-300">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">&copy; 2024 AlgoVisual Studio</p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;