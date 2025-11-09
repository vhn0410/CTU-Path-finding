export class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert({ element, priority }) {
    this.heap.push({ element, priority });
    this._bubbleUp();
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown();
    }
    return min.element;
  }

  _bubbleUp() {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.heap[parentIdx];
      if (element.priority >= parent.priority) break;
      this.heap[parentIdx] = element;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
  }

  _sinkDown() {
    let idx = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let swap = null;

      if (leftIdx < length && this.heap[leftIdx].priority < element.priority) {
        swap = leftIdx;
      }
      if (rightIdx < length && this.heap[rightIdx].priority < (swap === null ? element.priority : this.heap[leftIdx].priority)) {
        swap = rightIdx;
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

// Example usage
const pq = new MinHeap();
pq.insert({ element: "task1", priority: 2 });
pq.insert({ element: "task2", priority: 1 });
pq.insert({ element: "task3", priority: 3 });

console.log(pq.extractMin()); // task2
console.log(pq.extractMin()); // task1
