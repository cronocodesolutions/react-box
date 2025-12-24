import { describe, expect, it } from 'vitest';
import { fuzzyMatch, fuzzySearch, fuzzySearchObject, fuzzySearchObjectScore } from './fuzzySearch';

describe('fuzzySearch', () => {
  describe('fuzzyMatch', () => {
    it('should match exact strings', () => {
      const result = fuzzyMatch('hello', 'hello');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThan(0);
    });

    it('should match substring patterns', () => {
      const result = fuzzyMatch('hlo', 'hello');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThan(0);
    });

    it('should return null for non-matching patterns', () => {
      const result = fuzzyMatch('xyz', 'hello');
      expect(result).toBeNull();
    });

    it('should return match with empty pattern', () => {
      const result = fuzzyMatch('', 'hello');
      expect(result).not.toBeNull();
      expect(result!.score).toBe(1);
    });

    it('should return null for empty target', () => {
      const result = fuzzyMatch('test', '');
      expect(result).toBeNull();
    });

    it('should be case-insensitive', () => {
      const result = fuzzyMatch('HeLLo', 'hello');
      expect(result).not.toBeNull();
    });

    it('should match characters across word boundaries', () => {
      const result = fuzzyMatch('fn', 'first_name');
      expect(result).not.toBeNull();
    });

    it('should give higher score to consecutive matches', () => {
      const consecutive = fuzzyMatch('abc', 'abc123');
      const nonConsecutive = fuzzyMatch('abc', 'a1b2c3');
      expect(consecutive).not.toBeNull();
      expect(nonConsecutive).not.toBeNull();
      expect(consecutive!.score).toBeGreaterThan(nonConsecutive!.score);
    });
  });

  describe('fuzzySearch', () => {
    it('should return true for matching strings', () => {
      expect(fuzzySearch('joh', 'John')).toBe(true);
    });

    it('should return false for non-matching strings', () => {
      expect(fuzzySearch('xyz', 'John')).toBe(false);
    });

    it('should return true for empty pattern', () => {
      expect(fuzzySearch('', 'anything')).toBe(true);
    });
  });

  describe('fuzzySearchObject', () => {
    const testObj = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      age: 30,
    };

    it('should match across any field by default', () => {
      expect(fuzzySearchObject('joh', testObj)).toBe(true);
      expect(fuzzySearchObject('doe', testObj)).toBe(true);
      expect(fuzzySearchObject('@example', testObj)).toBe(true);
    });

    it('should return true for empty pattern', () => {
      expect(fuzzySearchObject('', testObj)).toBe(true);
    });

    it('should search only specified fields', () => {
      expect(fuzzySearchObject('doe', testObj, ['firstName'])).toBe(false);
      expect(fuzzySearchObject('doe', testObj, ['lastName'])).toBe(true);
    });

    it('should handle numeric fields', () => {
      expect(fuzzySearchObject('30', testObj)).toBe(true);
    });

    it('should handle null/undefined values', () => {
      const objWithNull = { name: null, value: undefined };
      expect(fuzzySearchObject('test', objWithNull)).toBe(false);
    });

    it('should return false when no fields match', () => {
      expect(fuzzySearchObject('xyz', testObj)).toBe(false);
    });
  });

  describe('fuzzySearchObjectScore', () => {
    const testObj = {
      firstName: 'John',
      lastName: 'Smith',
    };

    it('should return highest score from matching fields', () => {
      const score = fuzzySearchObjectScore('john', testObj);
      expect(score).toBeGreaterThan(0);
    });

    it('should return 1 for empty pattern', () => {
      const score = fuzzySearchObjectScore('', testObj);
      expect(score).toBe(1);
    });

    it('should return 0 for non-matching pattern', () => {
      const score = fuzzySearchObjectScore('xyz', testObj);
      expect(score).toBe(0);
    });
  });
});
