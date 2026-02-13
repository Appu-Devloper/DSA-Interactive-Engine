
import { Algorithm, AlgorithmCategory, Language } from './types';

export const ALGORITHMS: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: AlgorithmCategory.SORTING,
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: { time: 'O(n²)', space: 'O(1)' }
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: AlgorithmCategory.SORTING,
    description: 'Finds the minimum element from the unsorted part and puts it at the beginning. It maintains two subarrays: sorted and unsorted.',
    complexity: { time: 'O(n²)', space: 'O(1)' }
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: AlgorithmCategory.SORTING,
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.',
    complexity: { time: 'O(n²)', space: 'O(1)' }
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: AlgorithmCategory.SORTING,
    description: 'An efficient, divide-and-conquer sorting algorithm that works by selecting a "pivot" element and partitioning the other elements into two sub-arrays.',
    complexity: { time: 'O(n log n)', space: 'O(log n)' }
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: AlgorithmCategory.SEARCHING,
    description: 'Checks every element in the list sequentially until a match is found or the whole list has been searched.',
    complexity: { time: 'O(n)', space: 'O(1)' }
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: AlgorithmCategory.SEARCHING,
    description: 'Finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
    complexity: { time: 'O(log n)', space: 'O(1)' }
  },
  {
    id: 'stack-ops',
    name: 'Stack Operations',
    category: AlgorithmCategory.STACKS,
    description: 'A Last-In-First-Out (LIFO) data structure. Common operations include Push (add to top) and Pop (remove from top).',
    complexity: { time: 'O(1)', space: 'O(n)' }
  },
  {
    id: 'queue-ops',
    name: 'Queue Operations',
    category: AlgorithmCategory.QUEUES,
    description: 'A First-In-First-Out (FIFO) data structure. Common operations include Enqueue (add to rear) and Dequeue (remove from front).',
    complexity: { time: 'O(1)', space: 'O(n)' }
  },
  {
    id: 'hash-table-ops',
    name: 'Hash Table',
    category: AlgorithmCategory.HASH_TABLES,
    description: 'A data structure that maps keys to values using a hash function to compute an index into an array of buckets.',
    complexity: { time: 'O(1) Avg', space: 'O(n)' }
  },
  {
    id: 'dfs',
    name: 'Depth First Search',
    category: AlgorithmCategory.GRAPHS,
    description: 'An algorithm for traversing or searching tree or graph data structures by exploring as far as possible along each branch before backtracking.',
    complexity: { time: 'O(V + E)', space: 'O(V)' }
  },
  {
    id: 'bfs',
    name: 'Breadth First Search',
    category: AlgorithmCategory.GRAPHS,
    description: 'Starts at the tree root and explores all nodes at the present depth level before moving on to the nodes at the next depth level.',
    complexity: { time: 'O(V + E)', space: 'O(V)' }
  },
  {
    id: 'linked-list-traversal',
    name: 'Linked List Traversal',
    category: AlgorithmCategory.LINKED_LISTS,
    description: 'The basic operation of visiting each node in a linked list structure exactly once.',
    complexity: { time: 'O(n)', space: 'O(1)' }
  },
  {
    id: 'bst-insertion',
    name: 'BST Insertion',
    category: AlgorithmCategory.TREES,
    description: 'Adding a node to a Binary Search Tree while maintaining the property: Left < Node < Right.',
    complexity: { time: 'O(log n)', space: 'O(h)' }
  }
];

export const CODE_SNIPPETS: Record<string, Record<Language, string>> = {
  'bubble-sort': {
    [Language.JAVASCRIPT]: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    [Language.PYTHON]: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    [Language.JAVA]: `public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    [Language.CPP]: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`
  },
  'selection-sort': {
    [Language.JAVASCRIPT]: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[min_idx]) min_idx = j;
    [arr[min_idx], arr[i]] = [arr[i], arr[min_idx]];
  }
}`,
    [Language.PYTHON]: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    [Language.JAVA]: `void sort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    [Language.CPP]: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`
  },
  'insertion-sort': {
    [Language.JAVASCRIPT]: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`,
    [Language.PYTHON]: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    [Language.JAVA]: `void sort(int arr[]) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    [Language.CPP]: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
  },
  'linear-search': {
    [Language.JAVASCRIPT]: `function search(arr, x) {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === x) return i;
  return -1;
}`,
    [Language.PYTHON]: `def search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x: return i
    return -1`,
    [Language.JAVA]: `int search(int arr[], int x) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == x) return i;
    return -1;
}`,
    [Language.CPP]: `int search(int arr[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (arr[i] == x) return i;
    return -1;
}`
  },
  'quick-sort': {
    [Language.JAVASCRIPT]: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
    [Language.PYTHON]: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
    [Language.JAVA]: `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    [Language.CPP]: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
  },
  'stack-ops': {
    [Language.JAVASCRIPT]: `class Stack {
  constructor() { this.items = []; }
  push(element) { this.items.push(element); }
  pop() { return this.items.length === 0 ? "Underflow" : this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}`,
    [Language.PYTHON]: `class Stack:
    def __init__(self): self.items = []
    def push(self, item): self.items.append(item)
    def pop(self): return self.items.pop() if self.items else "Underflow"
    def peek(self): return self.items[-1] if self.items else None`,
    [Language.JAVA]: `import java.util.Stack;
Stack<Integer> stack = new Stack<>();
stack.push(10);
int top = stack.pop();`,
    [Language.CPP]: `#include <stack>
std::stack<int> s;
s.push(10);
s.pop();`
  },
  'queue-ops': {
    [Language.JAVASCRIPT]: `class Queue {
  constructor() { this.items = []; }
  enqueue(element) { this.items.push(element); }
  dequeue() { return this.items.length === 0 ? "Underflow" : this.items.shift(); }
  front() { return this.items[0]; }
}`,
    [Language.PYTHON]: `from collections import deque
queue = deque()
queue.append(10) # enqueue
queue.popleft() # dequeue`,
    [Language.JAVA]: `import java.util.LinkedList;
import java.util.Queue;
Queue<Integer> q = new LinkedList<>();
q.add(10); // enqueue
int first = q.remove(); // dequeue`,
    [Language.CPP]: `#include <queue>
std::queue<int> q;
q.push(10);
q.pop();`
  },
  'hash-table-ops': {
    [Language.JAVASCRIPT]: `const hashTable = {};
hashTable["key"] = "value"; // Insert
delete hashTable["key"]; // Delete
const val = hashTable["key"]; // Search`,
    [Language.PYTHON]: `hash_table = {}
hash_table["key"] = "value" # Insert
del hash_table["key"] # Delete
val = hash_table.get("key") # Search`,
    [Language.JAVA]: `import java.util.HashMap;
HashMap<String, String> map = new HashMap<>();
map.put("key", "value");
map.remove("key");
String val = map.get("key");`,
    [Language.CPP]: `#include <unordered_map>
std::unordered_map<string, string> map;
map["key"] = "value";
map.erase("key");`
  },
  'binary-search': {
    [Language.JAVASCRIPT]: `function binarySearch(arr, x) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (arr[m] === x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`,
    [Language.PYTHON]: `def binary_search(arr, x):
    l, r = 0, len(arr) - 1
    while l <= r:
        m = (l + r) // 2
        if arr[m] == x: return m
        if arr[m] < x: l = m + 1
        else: r = m - 1
    return -1`,
    [Language.JAVA]: `public int binarySearch(int[] arr, int x) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
    [Language.CPP]: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
  },
  'dfs': {
    [Language.JAVASCRIPT]: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
    [Language.PYTHON]: `def dfs(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    print(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`,
    [Language.JAVA]: `void DFS(int v, boolean visited[]) {
    visited[v] = true;
    System.out.print(v + " ");
    for (int n : adj[v]) {
        if (!visited[n]) DFS(n, visited);
    }
}`,
    [Language.CPP]: `void DFS(int v) {
    visited[v] = true;
    cout << v << " ";
    for (auto i = adj[v].begin(); i != adj[v].end(); ++i)
        if (!visited[*i]) DFS(*i);
}`
  },
  'bfs': {
    [Language.JAVASCRIPT]: `function bfs(graph, start) {
  let q = [start];
  let visited = new Set([start]);
  while (q.length > 0) {
    let u = q.shift();
    for (let v of graph[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        q.push(v);
      }
    }
  }
}`,
    [Language.PYTHON]: `from collections import deque
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
    [Language.JAVA]: `void BFS(int s) {
    boolean visited[] = new boolean[V];
    LinkedList<Integer> queue = new LinkedList<Integer>();
    visited[s]=true; queue.add(s);
    while (queue.size() != 0) {
        s = queue.poll();
        for (int n : adj[s]) {
            if (!visited[n]) {
                visited[n] = true; queue.add(n);
            }
        }
    }
}`,
    [Language.CPP]: `void BFS(int s) {
    vector<bool> visited(V, false);
    list<int> queue;
    visited[s] = true; queue.push_back(s);
    while(!queue.empty()) {
        s = queue.front(); queue.pop_front();
        for(auto i : adj[s]) {
            if(!visited[i]) {
                visited[i] = true; queue.push_back(i);
            }
        }
    }
}`
  },
  'linked-list-traversal': {
    [Language.JAVASCRIPT]: `function traverse(head) {
  let current = head;
  while (current !== null) {
    console.log(current.value);
    current = current.next;
  }
}`,
    [Language.PYTHON]: `def traverse(head):
    current = head
    while current:
        print(current.value)
        current = current.next`,
    [Language.JAVA]: `public void traverse(Node head) {
    Node current = head;
    while (current != null) {
        System.out.println(current.value);
        current = current.next;
    }
}`,
    [Language.CPP]: `void traverse(Node* head) {
    Node* current = head;
    while (current != NULL) {
        cout << current->value << " ";
        current = current->next;
    }
}`
  }
];
