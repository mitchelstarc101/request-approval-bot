import { describe, it, expect } from 'vitest';
import { calculateDuration } from './utils';

describe('calculateDuration', () => {
  it('should return 1 for a single day leave', () => {
    const startDate = new Date('2023-01-01T10:00:00');
    const endDate = new Date('2023-01-01T14:00:00');
    expect(calculateDuration(startDate, endDate)).toBe(1);
  });

  it('should correctly calculate duration for multi-day leave', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-03');
    expect(calculateDuration(startDate, endDate)).toBe(3);
  });

  it('should handle time differences correctly, ignoring time of day', () => {
    // Buggy version would fail this test.
    // e.g. 25 hours diff would be ceil(1.04) + 1 = 3 days, but it's 2.
    const startDate = new Date('2023-01-01T10:00:00');
    const endDate = new Date('2023-01-02T11:00:00');
    expect(calculateDuration(startDate, endDate)).toBe(2);
  });

  it('should handle another time difference case correctly', () => {
    const startDate = new Date('2023-01-01T22:00:00');
    const endDate = new Date('2023-01-02T01:00:00'); // 3 hours difference, but across two days
    expect(calculateDuration(startDate, endDate)).toBe(2);
  });

  it('should return 2 for a two-day leave crossing a month boundary', () => {
    const startDate = new Date('2023-01-31T10:00:00');
    const endDate = new Date('2023-02-01T10:00:00');
    expect(calculateDuration(startDate, endDate)).toBe(2);
  });
});
