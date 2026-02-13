
export enum AlgorithmCategory {
  SORTING = 'Sorting',
  SEARCHING = 'Searching',
  GRAPHS = 'Graphs',
  TREES = 'Trees',
  ARRAYS = 'Arrays',
  LINKED_LISTS = 'Linked Lists',
  STACKS = 'Stacks',
  QUEUES = 'Queues',
  HASH_TABLES = 'Hash Tables'
}

export enum Language {
  JAVASCRIPT = 'JavaScript',
  PYTHON = 'Python',
  JAVA = 'Java',
  CPP = 'C++'
}

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface VisualizerState {
  data: any[];
  highlightIndices: number[];
  comparingIndices: number[];
  sortedIndices: number[];
  swappingIndices: number[];
  isProcessing: boolean;
  speed: number;
  currentStepDescription: string;
}
