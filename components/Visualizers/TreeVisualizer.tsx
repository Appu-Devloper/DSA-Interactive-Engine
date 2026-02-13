
import React, { useState } from 'react';

interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
  x: number;
  y: number;
}

const TreeVisualizer: React.FC<{ speed: number }> = ({ speed }) => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [path, setPath] = useState<number[]>([]);
  const [desc, setDesc] = useState('Insert values to see the Binary Search Tree grow.');
  const [isProcessing, setIsProcessing] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const getDelay = () => 1500 - (speed * 12);

  const insertNode = async (val: number) => {
    setIsProcessing(true);
    setPath([]);
    
    if (!root) {
      setRoot({ val, x: 50, y: 15 });
      setDesc(`Tree was empty. ${val} becomes the root.`);
    } else {
      const newPath: number[] = [];
      const traverse = async (node: TreeNode, x: number, y: number, level: number): Promise<TreeNode> => {
        newPath.push(node.val);
        setPath([...newPath]);
        await sleep(getDelay());

        if (val < node.val) {
          setDesc(`${val} < ${node.val}, traversing left branch.`);
          if (!node.left) {
            node.left = { val, x: x - 15 / level, y: y + 20 };
            return node;
          }
          return traverse(node.left, node.left.x, node.left.y, level + 1);
        } else {
          setDesc(`${val} >= ${node.val}, traversing right branch.`);
          if (!node.right) {
            node.right = { val, x: x + 15 / level, y: y + 20 };
            return node;
          }
          return traverse(node.right, node.right.x, node.right.y, level + 1);
        }
      };

      await traverse(root, root.x, root.y, 1);
      setRoot({ ...root });
    }
    
    await sleep(getDelay());
    setPath([]);
    setIsProcessing(false);
  };

  const renderNodes = (node: TreeNode): React.ReactNode => {
    return (
      <React.Fragment key={node.val}>
        {node.left && (
          <line x1={`${node.x}%`} y1={`${node.y}%`} x2={`${node.left.x}%`} y2={`${node.left.y}%`} stroke="#334155" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={`${node.x}%`} y1={`${node.y}%`} x2={`${node.right.x}%`} y2={`${node.right.y}%`} stroke="#334155" strokeWidth="2" />
        )}
        <circle cx={`${node.x}%`} cy={`${node.y}%`} r="18" fill={path.includes(node.val) ? '#f59e0b' : '#4f46e5'} className="transition-all duration-500 shadow-xl" />
        <text x={`${node.x}%`} y={`${node.y}%`} dy=".3em" textAnchor="middle" fill="white" className="text-[10px] font-black pointer-events-none">{node.val}</text>
        {node.left && renderNodes(node.left)}
        {node.right && renderNodes(node.right)}
      </React.Fragment>
    );
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-4">
        <button onClick={() => insertNode(Math.floor(Math.random() * 99) + 1)} disabled={isProcessing} className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Insert Random Value</button>
        <button onClick={() => setRoot(null)} className="px-4 py-3 bg-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Reset Tree</button>
      </div>

      <div className="w-full p-4 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-2xl min-h-[60px] flex items-center">
        <p className="text-xs font-semibold text-amber-100 italic">{desc}</p>
      </div>

      <div className="h-96 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
        <svg className="w-full h-full">
          {root && renderNodes(root)}
        </svg>
        {!root && <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-black uppercase tracking-[0.2em] text-xs">Binary Tree Empty</div>}
      </div>
    </div>
  );
};

export default TreeVisualizer;
