/**
 * linked-list.test.js
 *
 * @module linked-list.test.js
 */

const { newList } = require('./linked-list');

describe('linked-list', () => {
  let instance;
  beforeEach(() => {
    instance = newList();
  });
  describe('newList', () => {
    it('should start with size 0', () => expect(instance.size).toBe(0));
  });
  describe('push', () => {
    it('shuld increase size after push', () => {
      instance.push(0);
      expect(instance.size).toBe(1);
      expect(instance.first.value).toBe(0);
    });
    it('shuld increase twice after push twice', () => {
      instance = newList();
      instance.push(0);
      instance.push(1);
      expect(instance.size).toBe(2);
      expect(instance.first.value).toBe(0);
      expect(instance.getLast().value).toBe(1);
    });
    it('should return inserted object', () => {
      instance = newList();
      instance.push(5);
      const result = instance.first;
      expect(result.value).toBe(5);
    });
  });
  describe('removeLast', () => {
    it('will decrease size after remove', () => {
      instance = newList();
      instance.push(5);
      instance.push(4);
      instance.removeLast();
      expect(instance.size).toBe(1);
    });
    it('a list with one item should have first and last as same value', () => {
      instance = newList();
      instance.push(5);
      instance.push(4);
      instance.removeLast();
      expect(instance.size).toBe(1);
      const { first } = instance;
      const last = instance.getLast();
      expect(first).toBe(last);
    });
  });
  describe('find', () => {
    it('will return fined value', () => {
      instance = newList();
      instance.push(5);
      instance.push(4);
      instance.push(3);

      const result = instance.find(4);
      expect(result.value).toBe(4);
    });
    it('will return null when not find', () => {
      instance = newList();
      instance.push(5);
      instance.push(4);
      instance.push(3);

      const result = instance.find(9);
      expect(result).toBeFalsy();
    });
  });
  describe('toString', () => {
    it('empty should return []', () => {
      instance = newList();
      expect(instance.toString()).toBe('[]');
    });
  });
  describe('remove', () => {
    it('should decrease size', () => {
      instance = newList();
      instance.push(1);
      instance.push(2);
      expect(instance.size).toBe(2);
      instance.remove(instance.first);
      expect(instance.size).toBe(1);
    });
  });
  describe('moveToFirstPlace', () => {
    it('first element should be the moved element', () => {
      instance = newList();
      instance.push(5);
      instance.push(4);
      instance.push(3);

      expect(instance.first.value).toBe(5);
      expect(instance.first.next.value).toBe(4);
      expect(instance.first.next.next.value).toBe(3);
      expect(instance.toString()).toBe('[5,4,3,]');

      const result = instance.find(4);
      instance.moveToFirstPlace(result);
      expect(instance.first.value).toBe(4);
      expect(instance.first.next.value).toBe(5);
      expect(instance.first.next.next.value).toBe(3);
      expect(instance.size).toBe(3);
      expect(instance.toString()).toBe('[4,5,3,]');

      expect(instance.first).toBe(result);
      expect(instance.first.value).toBe(4);
      expect(instance.getLast().value).toBe(3);
      expect(instance.first.next.value).toBe(5);
    });
  });
});
