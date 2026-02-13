
import React, { useState, useEffect } from 'react';

interface ListNode {
  id: number;
  val: number;
}

const LinkedListVisualizer: React.FC<{ speed: number }> = ({ speed }) => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [desc, setDesc] = useState('Build a Linked List to see how pointers work.');
  const [isProcessing, setIsProcessing] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const getDelay = () => 2000 - (speed * 18);

  const handleInsert = async (pos: 'head' | 'tail') => {
    setIsProcessing(true);
    const newVal = Math.floor(Math.random() * 99) + 1;
    const newNode = { id: Date.now(), val: newVal };

    if (pos === 'head') {
      setDesc(`Creating new node ${newVal}. Pointing its 'next' to current head.`);
      setNodes([newNode, ...nodes]);
    } else {
      setDesc(`Traversing to tail to append ${newVal}...`);
      for (let i = 0; i <= nodes.length; i++) {
        setCurrentIndex(i);
        await sleep(getDelay() * 0.3);
      }
      setNodes([...nodes, newNode]);
    }
    
    await sleep(getDelay());
    setCurrentIndex(null);
    setDesc(`Node ${newVal} successfully linked.`);
    setIsProcessing(false);
  };

  const handleDelete = () => {
    if (nodes.length === 0) return;
    setNodes(nodes.slice(1));
    setDesc('Removed head node. Head pointer updated to next node.');
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-4">
        <button onClick={() => handleInsert('head')} disabled={isProcessing} className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Insert Head</button>
        <button onClick={() => handleInsert('tail')} disabled={isProcessing} className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Insert Tail</button>
        <button onClick={handleDelete} disabled={isProcessing} className="px-4 py-3 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Delete Head</button>
      </div>

      <div className="w-full p-4 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-2xl min-h-[60px] flex items-center">
        <p className="text-xs font-semibold text-indigo-100 italic">{desc}</p>
      </div>

      <div className="h-64 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 flex items-center p-12 overflow-x-auto custom-scrollbar">
        <div className="flex items-center">
          {nodes.length === 0 && <div className="text-slate-700 font-black uppercase tracking-widest text-xs opacity-20">Null Head</div>}
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div className={`relative flex flex-col items-center transition-all duration-500 ${currentIndex === idx ? 'scale-110' : ''}`}>
                <div className={`flex h-16 w-24 rounded-xl border-2 overflow-hidden shadow-2xl transition-colors duration-500 ${currentIndex === idx ? 'border-amber-400 bg-amber-400/10' : 'border-indigo-500/30 bg-slate-800'}`}>
                  <div className="flex-1 flex items-center justify-center font-black text-indigo-300 border-r border-indigo-500/20">{node.val}</div>
                  <div className="w-8 flex items-center justify-center bg-indigo-500/10">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
                {idx === 0 && <div className="absolute -top-6 text-[8px] text-indigo-400 font-black uppercase">Head</div>}
                {currentIndex === idx && <div className="absolute -bottom-6 text-[8px] text-amber-400 font-black uppercase animate-bounce">Current</div>}
              </div>
              
              {idx < nodes.length - 1 && (
                <div className="w-12 h-px bg-indigo-500/30 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-indigo-500/50"></div>
                </div>
              )}
            </React.Fragment>
          ))}
          {nodes.length > 0 && (
            <div className="ml-4 px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-600 border border-slate-700">NULL</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
