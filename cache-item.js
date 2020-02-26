/**
 * cache-item.js
 * Copyright (C) 2020 Editora Sanar
 *
 * Distributed under terms of the MIT license.
 * @author Edgard Leal <edgard.leal@sanar.com>
 * @module cache-item.js
 */

class CacheItem {
  constructor(key, value) {
    this.created = Date.now();
    this.lastAccessed = Date.now();
    this.key = key;
    this.value = value;
    this.hits = 1;
  }
}

module.exports = {
  CacheItem,
};
