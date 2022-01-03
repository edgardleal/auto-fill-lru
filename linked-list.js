/**
 * linked-list.js
 * Copyright (C) 2020 Editora Sanar
 *
 * Distributed under terms of the MIT license.
 * @author Edgard Leal <edgard.leal@sanar.com>
 * @module linked-list.js
 */

/**
 * @typedef Node
 * @property {Node} previus
 * @property {Node} next
 * @property {Object} value
 */

/**
 * @param {Node} previus
 * @param {Node} next
 * @param {Object} value
 * @return {Node}
 */
function newNode(previus, next, value) {
  return {
    previus,
    next,
    value,
  };
}

function newList({ maxSize } = {}) {
  return {
    size: 0,
    maxSize: maxSize || Number.isInteger,
    first: null,
    append(node) {
      if (!this.first) {
        this.initiate(node);
      } else {
        this.size += 1;
        const last = this.getLast();
        last.next = node;
        this.first.previus = node;

        /* eslint no-param-reassign: 1 */
        node.previus = last;
        node.next = this.first;
        if (this.size > this.maxSize) {
          this.removeLast();
        }
      }
    },
    initiate(node) {
      if (node) {
        this.size = 1;
        this.first = node;
        this.first.next = node;
        this.first.previus = node;
      }
    },
    find(value) {
      let currNode = this.first;
      let result;
      while (currNode !== null && currNode !== this.first.previus) {
        if (currNode.value === value) {
          result = currNode;
          break;
        }
        currNode = currNode.next;
      }
      return result;
    },
    toString() {
      if (!this.first) {
        return '[]';
      }
      let currNode = this.getLast();
      let result = '';
      do {
        currNode = currNode.next;
        result += `${currNode.value},`;
      } while (currNode !== null && currNode !== this.first.previus);
      return `[${result}]`;
    },
    isNode(node) {
      return node && typeof node === 'object' && !!node.next;
    },
    /**
     * Add new item on the queue start
     */
    prepend(value) {
      const node = this.isNode(value) ? value : newNode(null, null, value);
      if (!this.first) {
        this.initiate(node);
      } else {
        this.size += 1;
        const tmpFirst = this.first;
        tmpFirst.previus.next = node;
        this.first = node;
        this.first.next = tmpFirst;
        this.first.previus = tmpFirst.previus;
        tmpFirst.previus = this.first;
      }
    },
    push(value) {
      const node = newNode(null, null, value);
      if (this.first) {
        this.append(node);
      } else {
        this.initiate(node);
      }
    },
    moveToFirstPlace(node) {
      this.remove(node);
      this.prepend(node);
    },
    remove(node) {
      this.size -= 1;
      node.next.previus = node.previus;
      node.previus.next = node.next;
      return node;
    },
    getFirst() {
      return this.first;
    },
    getLast() {
      if (this.first) {
        return this.first.previus;
      }
      return null;
    },
    /**
     * @return {Node}
     */
    removeLast() {
      let result = null;
      if (this.size) {
        result = this.first.previus;
        this.first.previus = result.previus;
        result.next = this.first;
        this.size -= 1;
      }
      return (result || {}).value;
    },
  };
}

module.exports = {
  newList,
};
