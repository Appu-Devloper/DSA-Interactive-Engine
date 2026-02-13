
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VisualizerState } from '../../types';

interface SearchingVisualizerProps {
  algorithmId: string;
  speed: number;
  onFinish: () => void;
}

const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ algorithmId, speed, onFinish }) => {
  const [data, setData] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [comparingIdx, setComparingIdx] = useState<number | null>(null);
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [desc, setDesc] = useState('Select an algorithm and press start.');

  const speedRef = useRef(speed);
  const isPausedRef = useRef(false);
  const stopRef = useRef(false);
  const isSteppingRef = useRef(false);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const generateData = useCallback(() => {
    const newData = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100));
    if (algorithmId === 'binary-search') newData.sort((a, b) => a - b);
    setData(newData);
    const randomTarget = newData[Math.floor(Math.random() * newData.length)];
    setTarget(randomTarget);
    setLow(null); setHigh(null); setComparingIdx(null); setFound(null);
    setIsProcessing(false); setIsPaused(false);
    isSteppingRef.current = false;
    setDesc(`Target is ${randomTarget}. Click Start to search.`);
  }, [algorithmId]);

  useEffect(() => {
    generateData();
    return () => { stopRef.current = true; };
  }, [generateData]);

  const getStepDelay = () => 4000 - (speedRef.current * 38);

  const waitIfPaused = async () => {
    while (isPausedRef.current && !stopRef.current && !isSteppingRef.current) {
      await new Promise(r => setTimeout(r, 50));
    }
    isSteppingRef.current = false;
  };

  const sleep = async (ms: number) => {
    await waitIfPaused();
    if (stopRef.current) return;
    return new Promise(r => setTimeout(r, ms));
  };

  const linearSearch = async () => {
    setIsProcessing(true);
    for (let i = 0; i < data.length; i++) {
      if (stopRef.current) return;
      setComparingIdx(i);
      setDesc(`Comparing index ${i} (${data[i]}) with target ${target}...`);
      await sleep(getStepDelay());
      if (data[i] === target) {
        setFound(i);
        setDesc(`Found! Element ${target} is at index ${i}.`);
        setIsProcessing(false);
        onFinish();
        return;
      }
    }
    setDesc('Element not found.');
    setIsProcessing(false);
  };

  const binarySearch = async () => {
    setIsProcessing(true);
    let l = 0, r = data.length - 1;
    while (l <= r) {
      if (stopRef.current) return;
      setLow(l); setHigh(r);
      let m = Math.floor((l + r) / 2);
      setComparingIdx(m);
      setDesc(`Calculating midpoint: ${m}. Comparing ${data[m]} with ${target}.`);
      await sleep(getStepDelay());
      if (data[m] === target) {
        setFound(m);
        setDesc(`Found! Element ${target} at index ${m}.`);
        setIsProcessing(false);
        onFinish();
        return;
      }
      if (data[m] < target) { setDesc(`${data[m]} < ${target}. Search right.`); l = m + 1; }
      else { setDesc(`${data[m]} > ${target}. Search left.`); r = m - 1; }
      await sleep(getStepDelay());
    }
    setDesc('Not found.');
    setIsProcessing(false);
  };

  const startSearch = () => {
    setIsPaused(false);
    if (algorithmId === 'linear-search') linearSearch();
    else binarySearch();
  };

  const togglePlayback = () => {
    if (!isProcessing) startSearch();
    else setIsPaused(!isPaused);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex gap-4 w-full mb-6">
        <button onClick={generateData} disabled={isProcessing && !isPaused} className="flex-1 px-4 py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700">Shuffle</button>
        <button onClick={togglePlayback} className="flex-[1.5] px-4 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
           {isProcessing ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
        </button>
        <button onClick={() => { setIsPaused(true); isSteppingRef.current = true; if(!isProcessing) startSearch(); }} className="flex-1 px-4 py-3 bg-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Step</button>
      </div>
      <div className="w-full mb-6 p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-2xl min-h-[64px] flex items-center">
        <p className="text-xs font-semibold text-emerald-100 italic">{desc} {isPaused && <span className="text-amber-400 uppercase text-[10px] ml-2">[PAUSED]</span>}</p>
      </div>
      <div className="w-full flex justify-between gap-1 h-32 items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800 overflow-x-auto">
        {data.map((val, idx) => {
          let state = 'bg-slate-800 text-slate-500 opacity-40';
          if (algorithmId === 'binary-search') {
            if (low !== null && high !== null && idx >= low && idx <= high) state = 'bg-slate-700 text-slate-300 opacity-100';
          } else state = 'bg-slate-700 text-slate-300 opacity-100';
          if (comparingIdx === idx) state = 'bg-amber-500 text-white scale-110 shadow-lg z-10';
          if (found === idx) state = 'bg-emerald-500 text-white scale-125 shadow-2xl z-20';
          return (
            <div key={idx} className={`min-w-[40px] flex-1 flex flex-col items-center justify-center rounded-xl h-16 transition-all duration-500 ${state}`}>
              <span className="text-xs font-black">{val}</span>
              <span className="text-[8px] mt-1 opacity-50">{idx}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchingVisualizer;
