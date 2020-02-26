/**
 * lru.js
 * Copyright (C) 2020 Editora Sanar
 *
 * Distributed under terms of the MIT license.
 * @author Edgard Leal <edgard.leal@sanar.com>
 * @module lru.js
 */

const { CacheItem } = require('./cache-item');
const { newList } = require('./linked-list');

const CONFIG_ERROR_MESSAGE = 'retrieveFunction is not defined';
const DEFAULT_OPTIONS = {
  timeToLive: 3000,
  size: 50,
};

class LRU {
  constructor(options = {}) {
    const config = {
      maxSize: 50,
      retrieveFunction: () => {},
      timeToLive: 10000,
      ...DEFAULT_OPTIONS,
      ...options,
    };
    if (!options.retrieveFunction) {
      throw new Error(CONFIG_ERROR_MESSAGE);
    }
    this.linkedList = newList();
    this.timeToLive = config.timeToLive;
    this.maxSize = config.maxSize;
    this.size = 0;
    this.map = new Map();
    this.retrieveFunction = config.retrieveFunction;
  }

  getSize() {
    return this.size;
  }

  /**
   * @param {string} key
   */
  retrieveOriginal(key) {
    return this.retrieveFunction(key)
      .then((result) => {
        this.set(key, result);
        return result;
      });
  }

  removeLast() {
    const item = this.linkedList.removeLast();
    const { key } = item;
    this.map.delete(key);
    this.size -= 1;
    return item;
  }

  /**
   * @param {string} key
   */
  async get(key) {
    if (!key) {
      throw new Error('Invalid key');
    }
    const stringKey = typeof key === 'string' ? key : JSON.stringify(key);
    const cached = this.map.get(stringKey);
    if (cached) {
      const age = Date.now() - cached.lastAccessed;
      if (age > this.timeToLive) {
        return this.retrieveOriginal(key);
      }
      cached.hits += 1;
      return Promise.resolve(cached.value);
    }
    return this.retrieveOriginal(key);
  }

  /**
   * @param {string} key
   */
  set(key, value) {
    this.size += 1;
    const cacheItem = new CacheItem(key, value);
    const stringKey = typeof key === 'string' ? key : JSON.stringify(key);
    this.map.set(stringKey, cacheItem);
    this.linkedList.prepend(cacheItem);
    if (this.size > this.maxSize) {
      this.removeLast();
    }
  }

  dump() {
    const result = [];
    this.map.forEach((value) => {
      result.push(value);
    });
    return result;
  }
}

module.exports = {
  LRU,
};
