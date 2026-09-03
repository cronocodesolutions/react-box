/**
 * Fuzzy search implementation for text matching.
 * Matches characters in order but not necessarily consecutively.
 */
export interface FuzzyMatch {
    score: number;
    matches: [number, number][];
}
/**
 * Performs fuzzy matching of a pattern against a target string.
 * Returns a match object with score and matched ranges, or null if no match.
 */
export declare function fuzzyMatch(pattern: string, target: string): FuzzyMatch | null;
/**
 * Simple fuzzy search that returns true if the pattern matches the target.
 */
export declare function fuzzySearch(pattern: string, target: string): boolean;
/**
 * Fuzzy search across multiple fields of an object.
 * Returns true if the pattern matches any of the specified fields.
 */
export declare function fuzzySearchObject<T extends object>(pattern: string, obj: T, fields?: (keyof T)[]): boolean;
/**
 * Get the best fuzzy match score across multiple fields.
 * Returns the highest score found, or 0 if no match.
 */
export declare function fuzzySearchObjectScore<T extends object>(pattern: string, obj: T, fields?: (keyof T)[]): number;
