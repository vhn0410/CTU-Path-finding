export class PriorityQueue {
  constructor() {
    this.items = [];
  }
  makeNull() {
    this.items = []
  }
  // Enqueue element with priority
  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;

    // Insert element in the right position
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) { // lower number = higher priority
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  // Dequeue element with highest priority
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift().element;
  }

  // Peek at element with highest priority
  front() {
    if (this.isEmpty()) return null;
    return this.items[0].element;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  print() {
    console.log(this.items);
  }
  exists(value) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].element.nodeId === value.nodeId) {
        return this.items[i]; // Trả về item, không phải element
      }
    }
    return null;
  }
  // Update existing element A -> B
  update(oldValue, newValue) {
    const index = this.items.findIndex(
      item => item.element.nodeId === oldValue.nodeId
    );

    if (index === -1) return false; // not found

    // Remove old item
    this.items.splice(index, 1);

    // Insert new one properly (keeping priority order)
    this.enqueue(newValue.element, newValue.priority);

    return true;
  }
  remove(value) {
    const index = this.items.findIndex(
      item => item.element.nodeId === value.nodeId
    );
    if (index === -1) return false; // not found

    // Remove old item
    this.items.splice(index, 1);

    return true
  }


}

// Example usage
// const pq = new PriorityQueue();
// pq.enqueue("task1", 2);
// pq.enqueue("task2", 1); // higher priority
// pq.enqueue("task3", 3);

// console.log(pq.dequeue()); // task2
// console.log(pq.front());   // task1
// pq.print();
