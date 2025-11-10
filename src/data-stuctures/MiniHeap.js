export class PriorityQueue {
  constructor() {
    this.heap = [];
    this.nodeMap = new Map(); // Map to track node positions for quick lookup
  }

  makeNull() {
    this.heap = [];
    this.nodeMap.clear();
  }

  // Helper methods for heap navigation
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  // Swap two elements in heap
  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;

    // Update nodeMap
    this.nodeMap.set(this.heap[index1].element.nodeId, index1);
    this.nodeMap.set(this.heap[index2].element.nodeId, index2);
  }

  // Heapify up (after insertion)
  heapifyUp(index = this.heap.length - 1) {
    while (this.hasParent(index) && this.parent(index).priority > this.heap[index].priority) {
      const parentIndex = this.getParentIndex(index);
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  // Heapify down (after deletion)
  heapifyDown(index = 0) {
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);

      if (this.hasRightChild(index) && 
          this.rightChild(index).priority < this.leftChild(index).priority) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].priority < this.heap[smallerChildIndex].priority) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  // Enqueue element with priority - O(log n)
  enqueue(element, priority) {
    const queueElement = { element, priority };
    this.heap.push(queueElement);
    const index = this.heap.length - 1;
    this.nodeMap.set(element.nodeId, index);
    this.heapifyUp(index);
  }

  // Dequeue element with highest priority - O(log n)
  dequeue() {
    if (this.isEmpty()) return null;

    const root = this.heap[0];
    this.nodeMap.delete(root.element.nodeId);

    if (this.heap.length === 1) {
      this.heap.pop();
      return root.element;
    }

    this.heap[0] = this.heap.pop();
    this.nodeMap.set(this.heap[0].element.nodeId, 0);
    this.heapifyDown(0);

    return root.element;
  }

  // Peek at element with highest priority - O(1)
  front() {
    if (this.isEmpty()) return null;
    return this.heap[0].element;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  print() {
    console.log(this.heap);
  }

  // Check if node exists - O(1) with Map
  exists(value) {
    const index = this.nodeMap.get(value.nodeId);
    if (index === undefined || index >= this.heap.length) return null;
    return this.heap[index];
  }

  // Update existing element A -> B - O(log n)
  update(oldValue, newValue) {
    const index = this.nodeMap.get(oldValue.nodeId);
    if (index === undefined || index >= this.heap.length) return false;

    const oldPriority = this.heap[index].priority;
    this.heap[index] = { element: newValue.element, priority: newValue.priority };
    
    // Update nodeMap if nodeId changed
    if (oldValue.nodeId !== newValue.element.nodeId) {
      this.nodeMap.delete(oldValue.nodeId);
      this.nodeMap.set(newValue.element.nodeId, index);
    }

    // Restore heap property
    if (newValue.priority < oldPriority) {
      this.heapifyUp(index);
    } else if (newValue.priority > oldPriority) {
      this.heapifyDown(index);
    }

    return true;
  }

  // Remove element - O(log n)
  remove(value) {
    const index = this.nodeMap.get(value.nodeId);
    if (index === undefined || index >= this.heap.length) return false;

    this.nodeMap.delete(value.nodeId);

    if (index === this.heap.length - 1) {
      this.heap.pop();
      return true;
    }

    const removedPriority = this.heap[index].priority;
    this.heap[index] = this.heap.pop();
    this.nodeMap.set(this.heap[index].element.nodeId, index);

    // Restore heap property
    if (this.heap[index].priority < removedPriority) {
      this.heapifyUp(index);
    } else {
      this.heapifyDown(index);
    }

    return true;
  }

  // Getter for compatibility with existing code that uses .items
  get items() {
    return this.heap;
  }
}

// Example usage
// const pq = new PriorityQueue();
// pq.enqueue({nodeId: 1}, 2);
// pq.enqueue({nodeId: 2}, 1); // higher priority
// pq.enqueue({nodeId: 3}, 3);

// console.log(pq.dequeue()); // {nodeId: 2}
// console.log(pq.front());   // {nodeId: 1}
// pq.print();