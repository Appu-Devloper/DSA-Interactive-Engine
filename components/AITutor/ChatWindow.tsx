
import React, { useState, useRef, useEffect } from 'react';
import { getAlgorithmExplanationStream } from '../../services/geminiService';
import { ChatMessage, Algorithm } from '../../types';

interface ChatWindowProps {
  currentAlgorithm: Algorithm;
}

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/);

  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const content = part.replace(/```[a-z]*\n?|```/g, '');
          const lang = part.match(/```([a-z]+)/)?.[1] || 'code';
          return (
            <div key={i} className="my-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
              <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang}</span>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
                {content.trim()}
              </pre>
            </div>
          );
        }

        return (
          <div key={i} className="prose-slate prose-invert max-w-none">
            {part.split('\n').map((line, j) => {
              if (line.startsWith('### ')) {
                return <h3 key={j} className="text-sm font-black text-indigo-400 uppercase tracking-widest mt-6 mb-2 border-l-2 border-indigo-500 pl-3">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('* ') || line.startsWith('- ')) {
                return <li key={j} className="ml-4 text-slate-300 list-disc marker:text-indigo-500 mb-1">{parseInline(line.substring(2))}</li>;
              }
              if (line.trim() === '') return <div key={j} className="h-2" />;
              if (line.includes('💡') || line.includes('⚠️')) {
                return (
                  <div key={j} className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl my-3 text-indigo-200 text-xs italic">
                    {parseInline(line)}
                  </div>
                );
              }
              return <p key={j} className="leading-relaxed text-slate-300">{parseInline(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="text-indigo-200 italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-950 px-1.5 py-0.5 rounded text-rose-400 font-mono text-[11px] border border-slate-800">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const ChatWindow: React.FC<ChatWindowProps> = ({ currentAlgorithm }) => {
  // Persistence Key
  const STORAGE_KEY = 'algo_visual_gemini_key';

  // Initialize from localStorage
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  
  // Show setup initially if no key exists
  const [showKeySetup, setShowKeySetup] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY);
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
      setShowKeySetup(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setShowKeySetup(true);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !apiKey) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    const fullText = await getAlgorithmExplanationStream(
      currentAlgorithm.name, 
      input, 
      { complexity: currentAlgorithm.complexity.time, category: currentAlgorithm.category },
      apiKey,
      (text) => setStreamingText(text)
    );

    if (fullText) {
      setMessages(prev => [...prev, { role: 'model', text: fullText }]);
    }
    setStreamingText('');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
      
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">AI Tutor</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{apiKey ? 'Persistence Active' : 'Activation Required'}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowKeySetup(!showKeySetup)}
            className={`p-2 rounded-xl border transition-all ${showKeySetup ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
          </button>
        </div>

        {showKeySetup && (
          <div className="mt-4 p-5 bg-slate-950 rounded-2xl border border-indigo-500/20 shadow-2xl animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Persistent Gemini API Key</label>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-800 px-2 py-1 rounded-lg text-slate-400 font-bold hover:text-indigo-400 transition-colors border border-slate-700">Get Key →</a>
            </div>
            <div className="flex gap-2">
              <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Key starts with AIza..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-700"
              />
              <button 
                onClick={handleSaveKey}
                className="px-4 py-2.5 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                Save
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[9px] text-slate-600 leading-relaxed font-medium">
                Saved to browser LocalStorage.
              </p>
              {apiKey && (
                <button onClick={handleClearKey} className="text-[9px] font-bold text-rose-500 hover:underline">Clear Storage</button>
              )}
            </div>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 text-sm custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {!apiKey ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10 opacity-60">
            <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center border border-slate-700/50 relative">
              <div className="absolute inset-0 bg-indigo-500/5 blur-xl rounded-full"></div>
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Tutor Locked</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-[220px] mx-auto font-medium">
                Provide a Gemini API key to persist and unlock the AI professor across your browser sessions.
              </p>
            </div>
          </div>
        ) : messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/10">
              <svg className="w-8 h-8 text-indigo-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <p className="text-xs font-black text-slate-200 uppercase tracking-widest">I'm ready! Ask me about {currentAlgorithm.name}.</p>
          </div>
        )}
        
        {apiKey && messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[95%] ${m.role === 'user' ? 'bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none border border-white/10' : 'w-full'}`}>
              {m.role === 'user' ? <p className="font-bold">{m.text}</p> : <div className="bg-slate-900/80 p-5 rounded-2xl rounded-tl-none border border-slate-800/50 shadow-xl"><MarkdownRenderer text={m.text} /></div>}
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="flex justify-start animate-in fade-in">
            <div className="w-full bg-slate-900/80 p-5 rounded-2xl rounded-tl-none border border-slate-800 relative">
              <MarkdownRenderer text={streamingText} />
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 p-4 bg-slate-900/50 rounded-2xl">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800/50 ${!apiKey ? 'opacity-20 pointer-events-none' : ''}`}>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={apiKey ? "Ask a question..." : "Set API Key above to chat"}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !apiKey}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
