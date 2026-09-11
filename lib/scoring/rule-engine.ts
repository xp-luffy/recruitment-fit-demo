import type { Criterion, ScoringResult } from "@/lib/types/recruitment";

function countKeywordHits(rawText: string, keywords: string[]) {
  const text = rawText.toLowerCase();

  return keywords.reduce((hits, keyword) => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return hits;
    }

    return text.includes(normalized) ? hits + 1 : hits;
  }, 0);
}

function valueForHits(hits: number, keywordCount: number) {
  if (keywordCount === 0) {
    return 2.5;
  }

  const ratio = hits / keywordCount;
  if (ratio >= 0.75) return 5;
  if (ratio >= 0.5) return 4;
  if (ratio >= 0.25) return 3;
  if (hits > 0) return 2;
  return 1;
}

export function scoreEvaluation(rawText: string, criteria: Criterion[]): ScoringResult {
  const totalWeight = criteria.reduce((sum, criterion) => sum + Number(criterion.weight || 0), 0);

  if (totalWeight <= 0 || criteria.length === 0) {
    return { totalScore: 0, scores: [] };
  }

  const scores = criteria.map((criterion) => {
    const keywords = criterion.keywords ?? [];
    const hits = countKeywordHits(rawText, keywords);
    const value = valueForHits(hits, keywords.length);
    const weightedContribution = value * Number(criterion.weight || 0);
    const matched = hits === 1 ? "1 signal" : `${hits} signals`;

    return {
      criterionId: criterion.id,
      value,
      weightedContribution,
      justification:
        keywords.length > 0
          ? `${matched} matched from ${keywords.length} rubric keywords.`
          : "No keywords configured; neutral manual-review score used.",
    };
  });

  const weightedAverage =
    scores.reduce((sum, score) => sum + score.weightedContribution, 0) / totalWeight;

  return {
    totalScore: Math.round(weightedAverage * 20),
    scores,
  };
}
