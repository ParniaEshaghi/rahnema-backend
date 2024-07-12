class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.len = 0;
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current !== null) {
      arr.push(current);
      current = current.next;
    }
    return arr;
  }

  static fromArray(arr) {
    return arr.reverse().reduce((prev, curr) => new Node(curr.value, prev), null);
  }

  insert(value) {
    this.head = new Node(value, this.head);
    this.len++;
  }

  insertLast(value) {
    const newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode
    }
    this.len++;
  }

  size() {
    return this.len;
  }

  at(n) {
    const arr = this.toArray();
    return arr[n] ? arr[n] : undefined;
  }

  join(separator) {
    const arr = this.toArray();
    return arr.map(node => node.value).join(separator);
  }

  map(fn) {
    const arr = this.toArray();
    const newArr = arr.map(node => fn(node.value));
    return LinkedList.fromArray(newArr);
  }

  filter(fn) {
    const arr = this.toArray();
    const newArr = arr.filter(node => fn(node.value));
    return LinkedList.fromArray(newArr);
  }

  find(fn) {
    const arr = this.toArray();
    const node = arr.find(node => fn(node.value));
    return node ? node : undefined;
  }
}

