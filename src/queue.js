class Queue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(task) {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processNext();
    }
  }

  async processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    try {
      await task();
    } catch (error) {
      console.error("Error processing task:", error);
    } finally {
      this.processNext();
    }
  }
}

const globalQueue = new Queue();

export default globalQueue;
