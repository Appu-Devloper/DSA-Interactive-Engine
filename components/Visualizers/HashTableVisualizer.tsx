
import React, { useState, useEffect } from 'react';

interface HashTableVisualizerProps {
  speed: number;
}

const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({ speed }) => {
  const TABLE_SIZE = 10;
  const [table, setTable] = useState<(number | null)[]>(new Array(TABLE_SIZE).fill(null));
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [desc, setDesc] = useState('Hash Table with Linear Probing for collisions. Size = 10.');
  const [isProcessing, setIsProcessing] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const getDelay = () => 1500 - (speed * 12);

  const hash = (key: number) => key % TABLE_SIZE;

  const handleInsert = async () => {
    if (table.every(item => item !== null)) {
      setDesc('Table is completely full.');
      return;
    }

    setIsProcessing(true);
    const val = Math.floor(Math.random() * 999) + 1;
    let index = hash(val);
    
    setDesc(`Inserting ${val}. Initial hash: ${val} % ${TABLE_SIZE} = ${index}`);
    setHighlightedIndex(index);
    await sleep(getDelay());

    let probes = 0;
    while (table[index] !== null && probes < TABLE_SIZE) {
      setDesc(`Collision at index ${index}! Looking for next slot...`);
      index = (index + 1) % TABLE_SIZE;
      setHighlightedIndex(index);
      await sleep(getDelay() * 0.7);
      probes++;
    }

    const newTable = [...table];
    newTable[index] = val;
    setTable(newTable);
    setDesc(`Successfully inserted ${val} at index ${index}.`);
    await sleep(getDelay());
    setHighlightedIndex(null);
    setIsProcessing(false);
  };

  const handleClear = () => {
    setTable(new Array(TABLE_SIZE).fill(null));
    setDesc('Table cleared.');
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-4">
        <button 
          onClick={handleInsert}
          disabled={isProcessing}
          className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg disabled:opacity-20"
        >
          Insert Random Key
        </button>
        <button 
          onClick={handleClear}
          disabled={isProcessing}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          Clear
        </button>
      </div>

      <div className="w-full p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-2xl min-h-[60px] flex items-center">
        <p className="text-xs font-semibold text-emerald-100 italic">{desc}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {table.map((val, idx) => (
          <div 
            key={idx}
            className={`
              h-20 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative
              transition-all duration-300
              ${highlightedIndex === idx ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}
            `}
          >
            <span className="absolute top-2 left-3 text-[8px] font-black text-slate-600">INDEX {idx}</span>
            <div className={`text-xl font-black ${val === null ? 'text-slate-800' : 'text-indigo-400 animate-in zoom-in'}`}>
              {val === null ? '-' : val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HashTableVisualizer;
