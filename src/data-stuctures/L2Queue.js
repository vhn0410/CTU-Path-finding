// class Node {
//   constructor(value) {
//     this.value = value;
//     this.next = null;
//   }
// }

// export class L2Queue {
//   constructor() {
//     this.front = null;
//     this.rear = null;
//     this.size = 0;
//   }

//   // Add to the end
//   enqueue(value) {
//     const node = new Node(value);
//     if (!this.rear) {
//       this.front = node;
//       this.rear = node;
//     } else {
//       this.rear.next = node;
//       this.rear = node;
//     }
//     this.size++;
//   }

//   // Remove from the front
//   dequeue() {
//     if (!this.front) return null;
//     const value = this.front.value;
//     this.front = this.front.next;
//     if (!this.front) this.rear = null;
//     this.size--;
//     return value;
//   }

//   peek() {
//     return this.front ? this.front.value : null;
//   }

//   isEmpty() {
//     return this.size === 0;
//   }
//   // Check if a value exists
//   contains(value) {
//     let current = this.front;
//     while (current) {
//       if (current.value === value) return true;
//       current = current.next;
//     }
//     return false;
//   }
// }

// // Usage
// const q = new Queue();
// q.enqueue(10);
// q.enqueue(20);
// q.enqueue(30);

// console.log(q.dequeue()); // 10
// console.log(q.peek());    // 20
// console.log(q.isEmpty()); // false
