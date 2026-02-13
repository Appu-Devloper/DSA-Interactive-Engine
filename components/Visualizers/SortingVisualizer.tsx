
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VisualizerState } from '../../types';

interface SortingVisualizerProps {
  algorithmId: string;
  speed: number;
  onFinish: () => void;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithmId, speed, onFinish }) => {
  const [state, setState] = useState<VisualizerState>({
    data: [],
    highlightIndices: [],
    comparingIndices: [],
    sortedIndices: [],
    swappingIndices: [],
    isProcessing: false,
    speed: speed,
    currentStepDescription: 'Ready to begin. Adjust speed and press Start or Step.'
  });

  const [isPaused, setIsPaused] = useState(false);
  const speedRef = useRef(speed);
  const stopRef = useRef(false);
  const isPausedRef = useRef(false);
  const isSteppingRef = useRef(false);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const generateData = useCallback(() => {
    const newData = Array.from({ length: 15 }, () => Math.floor(Math.random() * 85) + 10);
    setState(prev => ({
      ...prev,
      data: newData,
      highlightIndices: [],
      comparingIndices: [],
      sortedIndices: [],
      swappingIndices: [],
      isProcessing: false,
      currentStepDescription: 'Environment reset. Data randomized.'
    }));
    stopRef.current = false;
    setIsPaused(false);
    isSteppingRef.current = false;
  }, []);

  useEffect(() => {
    generateData();
    return () => { stopRef.current = true; };
  }, [generateData, algorithmId]);

  const getStepDelay = () => {
    const maxDelay = 3000;
    const minDelay = 10;
    const delay = maxDelay - ((speedRef.current - 1) * (maxDelay - minDelay) / 99);
    return Math.max(minDelay, delay);
  };

  const waitIfPaused = async () => {
    while (isPausedRef.current && !stopRef.current && !isSteppingRef.current) {
      await new Promise(r => setTimeout(r, 50));
    }
    isSteppingRef.current = false;
  };

  const sleep = async (ms: number) => {
    await waitIfPaused();
    if (stopRef.current) return;
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const bubbleSort = async () => {
    let arr = [...state.data];
    let n = arr.length;
    setState(prev => ({ ...prev, isProcessing: true, sortedIndices: [] }));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;
        setState(prev => ({ ...prev, comparingIndices: [j, j + 1], currentStepDescription: `Scanning: Checking if ${arr[j]} > ${arr[j+1]}...` }));
        await sleep(getStepDelay());

        if (arr[j] > arr[j + 1]) {
          setState(prev => ({ ...prev, swappingIndices: [j, j + 1], currentStepDescription: `Swap required: ${arr[j]} is larger.` }));
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setState(prev => ({ ...prev, data: [...arr] }));
          await sleep(getStepDelay());
          setState(prev => ({ ...prev, swappingIndices: [] }));
        }
      }
      setState(prev => ({ ...prev, sortedIndices: [...prev.sortedIndices, n - i - 1] }));
    }
    finish();
  };

  const selectionSort = async () => {
    let arr = [...state.data];
    let n = arr.length;
    setState(prev => ({ ...prev, isProcessing: true, sortedIndices: [] }));

    for (let i = 0; i < n - 1; i++) {
      let min_idx = i;
      setState(prev => ({ ...prev, highlightIndices: [min_idx], currentStepDescription: `New search: assuming index ${i} is minimum.` }));
      await sleep(getStepDelay());

      for (let j = i + 1; j < n; j++) {
        if (stopRef.current) return;
        setState(prev => ({ ...prev, comparingIndices: [j, min_idx] }));
        await sleep(getStepDelay());

        if (arr[j] < arr[min_idx]) {
          min_idx = j;
          setState(prev => ({ ...prev, highlightIndices: [min_idx], currentStepDescription: `Found smaller element ${arr[j]} at index ${j}.` }));
          await sleep(getStepDelay());
        }
      }
      if (min_idx !== i) {
        setState(prev => ({ ...prev, swappingIndices: [i, min_idx], currentStepDescription: `Swapping ${arr[i]} with min ${arr[min_idx]}.` }));
        [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
        setState(prev => ({ ...prev, data: [...arr] }));
        await sleep(getStepDelay());
      }
      setState(prev => ({ ...prev, sortedIndices: [...prev.sortedIndices, i], highlightIndices: [], swappingIndices: [] }));
    }
    setState(prev => ({ ...prev, sortedIndices: Array.from({length: n}, (_, k) => k) }));
    finish();
  };

  const insertionSort = async () => {
    let arr = [...state.data];
    let n = arr.length;
    setState(prev => ({ ...prev, isProcessing: true, sortedIndices: [0] }));

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setState(prev => ({ ...prev, highlightIndices: [i], currentStepDescription: `Picking ${key} to insert into sorted part.` }));
      await sleep(getStepDelay());

      while (j >= 0 && arr[j] > key) {
        if (stopRef.current) return;
        setState(prev => ({ ...prev, comparingIndices: [j, j+1], currentStepDescription: `${arr[j]} > ${key}, shifting ${arr[j]} right.` }));
        await sleep(getStepDelay());
        
        arr[j + 1] = arr[j];
        setState(prev => ({ ...prev, data: [...arr], swappingIndices: [j, j+1] }));
        await sleep(getStepDelay() * 0.5);
        j = j - 1;
      }
      arr[j + 1] = key;
      setState(prev => ({ 
        ...prev, 
        data: [...arr], 
        highlightIndices: [], 
        swappingIndices: [],
        sortedIndices: Array.from({length: i + 1}, (_, k) => k),
        currentStepDescription: `Inserted ${key} at index ${j + 1}.`
      }));
      await sleep(getStepDelay());
    }
    finish();
  };

  const quickSort = async () => {
    let arr = [...state.data];
    setState(prev => ({ ...prev, isProcessing: true, sortedIndices: [] }));

    const partition = async (low: number, high: number) => {
      let pivot = arr[high];
      setState(prev => ({ ...prev, highlightIndices: [high], currentStepDescription: `Pivot set to ${pivot}.` }));
      await sleep(getStepDelay());
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (stopRef.current) return -1;
        setState(prev => ({ ...prev, comparingIndices: [j, high] }));
        await sleep(getStepDelay());
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setState(prev => ({ ...prev, data: [...arr], swappingIndices: [i, j], currentStepDescription: `${arr[i]} < ${pivot}, partitioning left.` }));
          await sleep(getStepDelay());
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setState(prev => ({ ...prev, data: [...arr], swappingIndices: [i + 1, high] }));
      await sleep(getStepDelay());
      return i + 1;
    };

    const sort = async (l: number, h: number) => {
      if (l < h) {
        let pi = await partition(l, h);
        if (pi === -1) return;
        setState(prev => ({ ...prev, sortedIndices: [...prev.sortedIndices, pi] }));
        await sort(l, pi - 1);
        await sort(pi + 1, h);
      } else if (l === h) {
        setState(prev => ({ ...prev, sortedIndices: [...prev.sortedIndices, l] }));
      }
    };

    await sort(0, arr.length - 1);
    finish();
  };

  const finish = () => {
    setState(prev => ({ ...prev, isProcessing: false, currentStepDescription: 'Process Complete.', highlightIndices: [], comparingIndices: [], swappingIndices: [] }));
    onFinish();
  };

  const startAlgo = () => {
    setIsPaused(false);
    if (algorithmId === 'bubble-sort') bubbleSort();
    else if (algorithmId === 'selection-sort') selectionSort();
    else if (algorithmId === 'insertion-sort') insertionSort();
    else if (algorithmId === 'quick-sort') quickSort();
  };

  const togglePlayback = () => {
    if (!state.isProcessing) startAlgo();
    else setIsPaused(!isPaused);
  };

  const handleStep = () => {
    if (!state.isProcessing) {
      setIsPaused(true);
      isSteppingRef.current = true;
      startAlgo();
    } else {
      setIsPaused(true);
      isSteppingRef.current = true;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between w-full mb-6 gap-4">
        <button onClick={generateData} disabled={state.isProcessing && !isPaused} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-20 border border-slate-700">Reset</button>
        <button onClick={togglePlayback} className={`flex-[1.5] px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 ${state.isProcessing ? isPaused ? 'bg-indigo-600' : 'bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-500'} text-white`}>
          {state.isProcessing ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
        </button>
        <button onClick={handleStep} className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-2">Step</button>
      </div>
      <div className="w-full mb-6 p-4 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-2xl min-h-[64px] flex items-center transition-all shadow-inner">
        <p className="text-xs font-semibold text-indigo-100 italic leading-relaxed">{state.currentStepDescription} {isPaused && <span className="text-amber-400 ml-2 font-black uppercase text-[10px] tracking-widest">[PAUSED]</span>}</p>
      </div>
      <div className="relative w-full h-72 bg-slate-900 rounded-3xl flex items-end justify-center px-6 pb-4 border border-slate-800">
        {state.data.map((val, idx) => {
          let bgColor = 'bg-slate-700/80';
          let glow = '';
          if (state.comparingIndices.includes(idx)) { bgColor = 'bg-amber-400'; glow = 'shadow-[0_0_15px_rgba(251,191,36,0.6)] z-10'; }
          if (state.swappingIndices.includes(idx)) { bgColor = 'bg-rose-500'; glow = 'shadow-[0_0_20px_rgba(244,63,94,0.7)] z-20'; }
          if (state.sortedIndices.includes(idx)) { bgColor = 'bg-emerald-500'; glow = 'shadow-[0_0_10px_rgba(16,185,129,0.3)]'; }
          if (state.highlightIndices.includes(idx)) { bgColor = 'bg-indigo-400'; glow = 'shadow-[0_0_15px_rgba(129,140,248,0.5)]'; }
          return <div key={idx} className={`mx-0.5 w-full transition-all duration-300 rounded-t-lg relative ${bgColor} ${glow}`} style={{ height: `${val}%` }} />
        })}
      </div>
    </div>
  );
};

export default SortingVisualizer;
