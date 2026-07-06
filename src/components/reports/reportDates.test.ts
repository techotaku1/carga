import { describe, expect, it } from 'vitest';
import { formatIsoDate, shiftIsoDate } from './reportDates';

describe('reportDates', () => {
  describe('shiftIsoDate', () => {
    it('moves one day forward', () => {
      expect(shiftIsoDate('2026-07-06', 1)).toBe('2026-07-07');
    });

    it('moves one day backward', () => {
      expect(shiftIsoDate('2026-07-06', -1)).toBe('2026-07-05');
    });

    it('crosses month boundaries', () => {
      expect(shiftIsoDate('2026-07-31', 1)).toBe('2026-08-01');
      expect(shiftIsoDate('2026-08-01', -1)).toBe('2026-07-31');
    });

    it('crosses year boundaries', () => {
      expect(shiftIsoDate('2026-12-31', 1)).toBe('2027-01-01');
      expect(shiftIsoDate('2027-01-01', -1)).toBe('2026-12-31');
    });

    it('handles leap years', () => {
      expect(shiftIsoDate('2028-02-28', 1)).toBe('2028-02-29');
      expect(shiftIsoDate('2028-03-01', -1)).toBe('2028-02-29');
    });
  });

  describe('formatIsoDate', () => {
    it('formats a date using local time parts', () => {
      expect(formatIsoDate(new Date(2026, 6, 6))).toBe('2026-07-06');
    });

    it('pads single-digit months and days', () => {
      expect(formatIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    });
  });
});
