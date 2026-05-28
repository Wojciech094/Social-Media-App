import { describe, it, expect, beforeEach } from 'vitest';
import { setLocalItem, getLocalItem } from './storage';

describe('storage utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it('should store and retrieve a string value', () => {
    setLocalItem('testKey', 'testValue');
    const result = getLocalItem('testKey');
    expect(result).toBe('testValue');
  });

  it('should store and retrieve an object', () => {
    const obj = { foo: 'bar', num: 42 };
    setLocalItem('objKey', obj as any);
    const result = getLocalItem('objKey');
    expect(result).toEqual(obj);
  });

  it('should return null for non-existent key', () => {
    const result = getLocalItem('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should retrieve a value stored under a default key', () => {
    setLocalItem('defaultKey', 'defaultKeyValue');
    const result = getLocalItem('defaultKey');
    expect(result).toBe('defaultKeyValue');
  });

  it('should handle storing and retrieving null', () => {
    setLocalItem('nullKey', null as any);
    const result = getLocalItem('nullKey');
    expect(result).toBeNull();
  });

  it('should handle storing and retrieving numbers', () => {
    setLocalItem('numKey', 123 as any);
    const result = getLocalItem('numKey');
    expect(result).toBe(123);
  });

  it('should handle storing and retrieving booleans', () => {
    setLocalItem('boolKey', true as any);
    const result = getLocalItem('boolKey');
    expect(result).toBe(true);
  });
});
