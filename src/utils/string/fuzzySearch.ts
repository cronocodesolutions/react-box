/**
 * Fuzzy search implementation for text matching.
 * Matches characters in order but not necessarily consecutively.
 */

export interface FuzzyMatch {
  score: number;
  matches: [number, number][]; // ranges of matching characters
}

/**
 * Performs fuzzy matching of a pattern against a target string.
 * Returns a match object with score and matched ranges, or null if no match.
 */
export function fuzzyMatch(pattern: string, target: string): FuzzyMatch | null {
  if (!pattern) return { score: 1, matches: [] };
  if (!target) return null;

  const patternLower = pattern.toLowerCase();
  const targetLower = target.toLowerCase();

  let patternIdx = 0;
  let targetIdx = 0;
  const matches: [number, number][] = [];
  let currentMatchStart = -1;
  let score = 0;
  let consecutiveBonus = 0;

  while (patternIdx < patternLower.length && targetIdx < targetLower.length) {
    if (patternLower[patternIdx] === targetLower[targetIdx]) {
      if (currentMatchStart === -1) {
        currentMatchStart = targetIdx;
      }
      patternIdx++;
      consecutiveBonus++;
      score += consecutiveBonus;

      // Bonus for matching at word boundaries
      if (targetIdx === 0 || /\s|_|-/.test(target[targetIdx - 1])) {
        score += 5;
      }

      // Bonus for exact case match
      if (pattern[patternIdx - 1] === target[targetIdx]) {
        score += 1;
      }
    } else {
      if (currentMatchStart !== -1) {
        matches.push([currentMatchStart, targetIdx]);
        currentMatchStart = -1;
      }
      consecutiveBonus = 0;
    }
    targetIdx++;
  }

  // Complete the last match range
  if (currentMatchStart !== -1) {
    matches.push([currentMatchStart, targetIdx]);
  }

  // Pattern must be fully matched
  if (patternIdx < patternLower.length) {
    return null;
  }

  // Normalize score based on target length (shorter matches score higher)
  score = score / target.length;

  return { score, matches };
}

/**
 * Simple fuzzy search that returns true if the pattern matches the target.
 */
export function fuzzySearch(pattern: string, target: string): boolean {
  return fuzzyMatch(pattern, target) !== null;
}

/**
 * Fuzzy search across multiple fields of an object.
 * Returns true if the pattern matches any of the specified fields.
 */
export function fuzzySearchObject<T extends object>(pattern: string, obj: T, fields?: (keyof T)[]): boolean {
  if (!pattern) return true;

  const searchFields = fields ?? (Object.keys(obj) as (keyof T)[]);

  return searchFields.some((field) => {
    const value = obj[field];
    if (value == null) return false;
    return fuzzySearch(pattern, String(value));
  });
}

/**
 * Get the best fuzzy match score across multiple fields.
 * Returns the highest score found, or 0 if no match.
 */
export function fuzzySearchObjectScore<T extends object>(pattern: string, obj: T, fields?: (keyof T)[]): number {
  if (!pattern) return 1;

  const searchFields = fields ?? (Object.keys(obj) as (keyof T)[]);
  let bestScore = 0;

  for (const field of searchFields) {
    const value = obj[field];
    if (value == null) continue;

    const match = fuzzyMatch(pattern, String(value));
    if (match && match.score > bestScore) {
      bestScore = match.score;
    }
  }

  return bestScore;
}
