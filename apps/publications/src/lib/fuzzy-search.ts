/**
 * Fuzzy search utility with typo tolerance, partial matching, and keyword similarity.
 * Uses Levenshtein distance for character-level matching and token-based similarity.
 */

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  const maxLen = Math.max(a.length, b.length);
  const dist = levenshteinDistance(a, b);
  return 1 - dist / maxLen;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function partialMatchScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (t.includes(q)) return 1;

  let bestScore = 0;
  for (let i = 0; i <= t.length - q.length; i++) {
    const window = t.substring(i, i + q.length);
    const score = similarity(q, window);
    if (score > bestScore) bestScore = score;
  }

  if (bestScore === 0) {
    for (let len = q.length - 1; len >= Math.max(1, q.length - 2); len--) {
      for (let i = 0; i <= t.length - len; i++) {
        const window = t.substring(i, i + len);
        const score = similarity(q, window) * 0.8;
        if (score > bestScore) bestScore = score;
      }
    }
  }

  return bestScore;
}

function tokenMatchScore(queryTokens: string[], targetTokens: string[]): number {
  if (queryTokens.length === 0) return 0;

  let totalScore = 0;
  for (const qt of queryTokens) {
    let bestTokenScore = 0;
    for (const tt of targetTokens) {
      if (tt === qt) {
        bestTokenScore = 1;
        break;
      }
      if (tt.includes(qt) || qt.includes(tt)) {
        bestTokenScore = Math.max(bestTokenScore, 0.9);
        continue;
      }
      const sim = similarity(qt, tt);
      if (sim > 0.6) {
        bestTokenScore = Math.max(bestTokenScore, sim);
      }
    }
    totalScore += bestTokenScore;
  }

  return totalScore / queryTokens.length;
}

export interface FuzzyResult<T> {
  item: T;
  score: number;
  matchType: "exact" | "contains" | "fuzzy" | "partial" | "token";
}

export function fuzzySearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[],
  threshold = 0.3
): FuzzyResult<T>[] {
  if (!query.trim()) return items.map((item) => ({ item, score: 1, matchType: "exact" as const }));

  const queryLower = query.toLowerCase().trim();
  const queryTokens = tokenize(query);

  const results: FuzzyResult<T>[] = [];

  for (const item of items) {
    const searchableTexts = getSearchableText(item);
    const allText = searchableTexts.join(" ").toLowerCase();
    const targetTokens = tokenize(allText);

    let bestScore = 0;
    let bestMatchType: FuzzyResult<T>["matchType"] = "fuzzy";

    for (const text of searchableTexts) {
      const textLower = text.toLowerCase();

      if (textLower === queryLower) {
        bestScore = 1;
        bestMatchType = "exact";
        break;
      }

      if (textLower.includes(queryLower)) {
        const score = 0.95;
        if (score > bestScore) {
          bestScore = score;
          bestMatchType = "contains";
        }
      }

      const tokenScore = tokenMatchScore(queryTokens, tokenize(text));
      if (tokenScore > bestScore) {
        bestScore = tokenScore;
        bestMatchType = "token";
      }

      const partialScore = partialMatchScore(queryLower, textLower);
      if (partialScore > bestScore) {
        bestScore = partialScore;
        bestMatchType = "partial";
      }

      for (const qt of queryTokens) {
        const score = partialMatchScore(qt, textLower);
        if (score > bestScore) {
          bestScore = score;
          bestMatchType = "partial";
        }
      }
    }

    const overallTokenScore = tokenMatchScore(queryTokens, targetTokens);
    if (overallTokenScore > bestScore) {
      bestScore = overallTokenScore;
      bestMatchType = "token";
    }

    if (bestScore >= threshold) {
      results.push({ item, score: bestScore, matchType: bestMatchType });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

export function getSuggestion(query: string, candidates: string[]): string | null {
  const q = query.toLowerCase().trim();
  let bestCandidate: string | null = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const c = candidate.toLowerCase();
    if (c === q) return null;

    const score = similarity(q, c);
    if (score > bestScore && score > 0.6) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}
