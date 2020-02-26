/**
 * disk-cache.js
 * Copyright (C) 2020 Editora Sanar
 *
 * Distributed under terms of the MIT license.
 * @author Edgard Leal <edgard.leal@sanar.com>
 * @module disk-cache.js
 */

const fs = require('fs');
const path = require('path');
const logger = require('debug')('cache-disk');
const { LRU } = require('./lru');

const CACHE_DIR = '.cache';

class DiskCache extends LRU {
  constructor(options) {
    super(options);
    if (!options.name || typeof options.name !== 'string') {
      throw new Error('Invalid cache name');
    }
    this.name = options.name;
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(`${CACHE_DIR}/`);
    }
    if (!fs.existsSync(`${CACHE_DIR}/${this.name}`)) {
      fs.mkdirSync(`${CACHE_DIR}/${this.name}`);
    }
    this.loadFromFiles();
  }

  loadFromFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.getCacheDirName(), (err, files) => {
        if (err) {
          reject(err);
        } else {
          files.forEach((file) => {
            logger('loading cache from file: %s', file);
            const rawdata = fs.readFileSync(path.normalize(`${CACHE_DIR}/${this.name}/${file}`));
            const cacheItem = JSON.parse(rawdata);
            this.set(cacheItem.key, cacheItem.value);
          });
          resolve();
        }
      });
    });
  }

  getCacheDirName() {
    return `${CACHE_DIR}/${this.name}/`;
  }

  save() {
    const data = this.dump();
    data.forEach((cacheItem) => {
      fs.writeFileSync(
        `${CACHE_DIR}/${this.name}/${JSON.stringify(cacheItem.key)}.json`,
        JSON.stringify(cacheItem, null, 2),
        'utf-8',
      );
    });
  }
}

module.exports = {
  DiskCache,
};
