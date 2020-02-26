/**
 * index.js
 *
 * Distributed under terms of the MIT license.
 * @author Edgard Leal <edgard.leal@sanar.com>
 * @module index.js
 */

const { LRU } = require('./lru');
const { DiskCache } = require('./disk-cache');

function createCache(options = {}) {
  return new LRU(options);
}

module.exports = {
  LRU,
  createCache,
  DiskCache,
};
