
import React, { useState, useEffect, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  state: 'unvisited' | 'visiting' | 'visited';
}

const GraphVisualizer: React.FC<{ algorithmId: string, speed: number }> = ({ algorithmId, speed }) => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, x: 20, y: 50, state: 'unvisited' },
    { id: 1, x: 40, y: 20, state: 'unvisited' },
    { id: 2, x: 40, y: 80, state: 'unvisited' },
    { id: 3, x: 60, y: 20, state: 'unvisited' },
    { id: 4, x: 60, y: 80, state: 'unvisited' },
    { id: 5, x: 80, y: 50, state: 'unvisited' },
  ]);

  const adj = [[1, 2], [0, 3], [0, 4], [1, 5], [2, 5], [3, 4]];
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [desc, setDesc] = useState('Graph Engine Active.');

  const isPausedRef = useRef(false);
  const isSteppingRef = useRef(false);
  const stopRef = useRef(false);
  const speedRef = useRef(speed);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

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

  const getDelay = () => 1500 - (speedRef.current * 12);

  const dfs = async (u: number, visited: Set<number>, currentNodes: Node[]) => {
    if (stopRef.current) return;
    visited.add(u);
    // Explicit type Node[] on resetNodes in handleStart ensures this assignment is valid
    currentNodes[u].state = 'visiting';
    setNodes([...currentNodes]);
    setDesc(`DFS: Visiting ${u}. Deep-diving...`);
    await sleep(getDelay());
    for (const v of adj[u]) {
      if (!visited.has(v)) await dfs(v, visited, currentNodes);
    }
    currentNodes[u].state = 'visited';
    setNodes([...currentNodes]);
    await sleep(getDelay() * 0.5);
  };

  const bfs = async () => {
    const q: number[] = [0];
    const visited = new Set([0]);
    // Fix: Explicitly type currentNodes as Node[] to prevent inference narrowing from 'as const'
    const currentNodes: Node[] = nodes.map(n => ({...n, state: 'unvisited'}));
    currentNodes[0].state = 'visiting';
    setNodes([...currentNodes]);
    
    while (q.length > 0) {
      if (stopRef.current) return;
      let u = q.shift()!;
      setDesc(`BFS: Dequeued ${u}. Exploring neighbors layer-by-layer.`);
      await sleep(getDelay());
      
      for (let v of adj[u]) {
        if (!visited.has(v)) {
          visited.add(v);
          // Fix: Type-safe assignment of 'visiting' to Node.state
          currentNodes[v].state = 'visiting';
          setNodes([...currentNodes]);
          q.push(v);
          setDesc(`BFS: Found ${v}, adding to Queue.`);
          await sleep(getDelay() * 0.5);
        }
      }
      // Fix: Type-safe assignment of 'visited' to Node.state
      currentNodes[u].state = 'visited';
      setNodes([...currentNodes]);
    }
  };

  const handleStart = async () => {
    setIsProcessing(true); stopRef.current = false;
    // Fix: Explicitly type resetNodes as Node[] to avoid narrow type inference during map
    const resetNodes: Node[] = nodes.map(n => ({ ...n, state: 'unvisited' }));
    setNodes(resetNodes);
    if (algorithmId === 'dfs') await dfs(0, new Set(), resetNodes);
    else await bfs();
    setDesc(`${algorithmId.toUpperCase()} Complete.`);
    setIsProcessing(false);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-4">
        <button onClick={() => { stopRef.current = true; setIsProcessing(false); setNodes(nodes.map(n => ({ ...n, state: 'unvisited' as const }))); }} className="flex-1 px-4 py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-slate-700">Reset</button>
        <button onClick={() => !isProcessing ? handleStart() : setIsPaused(!isPaused)} className="flex-[1.5] px-4 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
           {isProcessing ? (isPaused ? 'Resume' : 'Pause') : 'Start Search'}
        </button>
        <button onClick={() => { setIsPaused(true); isSteppingRef.current = true; if(!isProcessing) handleStart(); }} className="flex-1 px-4 py-3 bg-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Step</button>
      </div>
      <div className="w-full p-4 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-2xl min-h-[60px] flex items-center">
        <p className="text-xs font-semibold text-indigo-100 italic">{desc} {isPaused && <span className="text-amber-400 uppercase text-[10px] ml-2">[PAUSED]</span>}</p>
      </div>
      <div className="h-80 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative">
        <svg className="w-full h-full">
          {adj.map((neighbors, u) => neighbors.map(v => <line key={`${u}-${v}`} x1={`${nodes[u].x}%`} y1={`${nodes[u].y}%`} x2={`${nodes[v].x}%`} y2={`${nodes[v].y}%`} stroke="#1e293b" strokeWidth="2" />))}
          {nodes.map(node => <circle key={node.id} cx={`${node.x}%`} cy={`${node.y}%`} r="15" className={`transition-all duration-700 ${node.state === 'visiting' ? 'fill-amber-500 shadow-[0_0_15px_#f59e0b]' : node.state === 'visited' ? 'fill-emerald-500 opacity-60' : 'fill-slate-800'}`} />)}
          {nodes.map(node => <text key={`t-${node.id}`} x={`${node.x}%`} y={`${node.y}%`} dy=".3em" textAnchor="middle" fill="white" className="text-[10px] font-black">{node.id}</text>)}
        </svg>
      </div>
    </div>
  );
};

export default GraphVisualizer;
