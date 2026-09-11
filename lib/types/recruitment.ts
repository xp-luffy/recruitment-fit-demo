export type CandidateStatus = "active" | "shortlisted" | "rejected" | "hired";
export type EvaluationType = "cv" | "interview";
export type ScoringMode = "rule" | "ai";
export type ScoreSource = "rule" | "ai" | "manual";
export type ReviewStatus = "unreviewed" | "accepted" | "needs_review";

export type Candidate = {
  id: string;
  name: string;
  role_applied: string;
  source: string | null;
  status: CandidateStatus | string;
  overall_score: number | null;
  user_id: string | null;
  created_at: string;
};

export type Criterion = {
  id: string;
  rubric_id: string;
  name: string;
  description: string | null;
  weight: number;
  keywords: string[] | null;
  created_at: string;
};

export type Rubric = {
  id: string;
  name: string;
  role: string | null;
  user_id: string | null;
  created_at: string;
};

export type RubricWithCriteria = Rubric & {
  criteria: Criterion[];
};

export type Score = {
  id: string;
  evaluation_id: string;
  criterion_id: string;
  value: number;
  justification: string | null;
  source: ScoreSource | string;
  confidence: number | null;
  review_status: ReviewStatus | string;
  created_at: string;
};

export type ScoreWithCriterion = Score & {
  criterion: Criterion | null;
};

export type Evaluation = {
  id: string;
  candidate_id: string;
  rubric_id: string;
  eval_type: EvaluationType;
  raw_text: string;
  total_score: number | null;
  scoring_mode: ScoringMode | string;
  user_id: string | null;
  created_at: string;
};

export type EvaluationWithScores = Evaluation & {
  rubric: Rubric | null;
  scores: ScoreWithCriterion[];
};

export type CandidateDetail = Candidate & {
  evaluations: EvaluationWithScores[];
};

export type CriterionInput = {
  id?: string;
  name: string;
  description?: string;
  weight: number;
  keywords: string[];
};

export type ScoredCriterion = {
  criterionId: string;
  value: number;
  weightedContribution: number;
  justification: string;
};

export type ScoringResult = {
  totalScore: number;
  scores: ScoredCriterion[];
};
