
import React, { useState, useRef, useEffect } from 'react';

interface StackQueueVisualizerProps {
  algorithmId: string;
  speed: number;
}

const StackQueueVisualizer: React.FC<StackQueueVisualizerProps> = ({ algorithmId, speed }) => {
  const [items, setItems] = useState<number[]>([]);
  const [actionLabel, setActionLabel] = useState<string>('Select an operation to visualize.');
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const isStack = algorithmId === 'stack-ops';

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const getDelay = () => 1500 - (speed * 12);

  const handlePush = async () => {
    if (items.length >= 8) {
      setActionLabel('Structure is full for this demo.');
      return;
    }
    const val = Math.floor(Math.random() * 99) + 1;
    const newItems = [...items, val];
    setAnimatingIndex(newItems.length - 1);
    setActionLabel(`${isStack ? 'Pushing' : 'Enqueuing'} value: ${val}`);
    await sleep(getDelay());
    setItems(newItems);
    setAnimatingIndex(null);
  };

  const handlePop = async () => {
    if (items.length === 0) {
      setActionLabel('Structure is empty (Underflow).');
      return;
    }
    
    if (isStack) {
      const index = items.length - 1;
      setAnimatingIndex(index);
      setActionLabel(`Popping top value: ${items[index]}`);
      await sleep(getDelay());
      setItems(items.slice(0, -1));
    } else {
      setAnimatingIndex(0);
      setActionLabel(`Dequeuing front value: ${items[0]}`);
      await sleep(getDelay());
      setItems(items.slice(1));
    }
    setAnimatingIndex(null);
  };

  useEffect(() => {
    setItems([]);
    setActionLabel(`Ready for ${isStack ? 'Stack' : 'Queue'} operations.`);
  }, [algorithmId]);

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-4">
        <button 
          onClick={handlePush}
          className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
        >
          {isStack ? 'Push Item' : 'Enqueue Item'}
        </button>
        <button 
          onClick={handlePop}
          className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
        >
          {isStack ? 'Pop Item' : 'Dequeue Item'}
        </button>
      </div>

      <div className="w-full p-4 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-2xl min-h-[60px] flex items-center">
        <p className="text-xs font-semibold text-indigo-100 italic">{actionLabel}</p>
      </div>

      <div className="h-64 bg-slate-900/50 rounded-[2rem] border border-slate-800 flex items-center justify-center p-8 overflow-hidden relative">
        <div className={`flex ${isStack ? 'flex-col-reverse' : 'flex-row'} gap-3 w-full max-w-md justify-center`}>
          {items.length === 0 && !animatingIndex && (
            <div className="text-slate-700 font-black uppercase tracking-widest text-xs opacity-20">Empty Structure</div>
          )}
          {items.map((val, idx) => (
            <div 
              key={`${idx}-${val}`}
              className={`
                h-12 w-full max-w-[80px] bg-indigo-600/20 border-2 border-indigo-500/40 rounded-xl 
                flex items-center justify-center text-indigo-300 font-black text-sm transition-all duration-500
                ${animatingIndex === idx ? 'scale-110 border-indigo-400 bg-indigo-600/40 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : ''}
                ${!isStack && idx === 0 ? 'border-emerald-500/50 bg-emerald-500/10' : ''}
              `}
            >
              {val}
              {isStack && idx === items.length - 1 && (
                <div className="absolute -right-12 text-[8px] text-indigo-400 font-bold uppercase tracking-tighter">Top</div>
              )}
              {!isStack && idx === 0 && (
                <div className="absolute -top-6 text-[8px] text-emerald-400 font-bold uppercase tracking-tighter">Front</div>
              )}
              {!isStack && idx === items.length - 1 && (
                <div className="absolute -bottom-6 text-[8px] text-indigo-400 font-bold uppercase tracking-tighter">Rear</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackQueueVisualizer;
