import { loadData, mean, type StudentRow } from "./dataLoader";

// Feature weights derived from correlation analysis of the dataset
// Higher-weight features have stronger impact on the prediction
const FEATURE_WEIGHTS: Record<string, number> = {
  Attendance: 0.18,
  Previous_Scores: 0.16,
  Hours_Studied: 0.14,
  Tutoring_Sessions: 0.10,
  Sleep_Hours: 0.08,
  Physical_Activity: 0.05,
  Parental_Involvement: 0.08,
  Access_to_Resources: 0.07,
  Motivation_Level: 0.07,
  Internet_Access: 0.04,
  Family_Income: 0.04,
  Teacher_Quality: 0.06,
  Peer_Influence: 0.05,
  Extracurricular_Activities: 0.03,
};

function encodeCategorical(feature: string, value: string): number {
  const encodings: Record<string, Record<string, number>> = {
    Parental_Involvement: { Low: 0, Medium: 0.5, High: 1 },
    Access_to_Resources: { Low: 0, Medium: 0.5, High: 1 },
    Motivation_Level: { Low: 0, Medium: 0.5, High: 1 },
    Internet_Access: { No: 0, Yes: 1 },
    Family_Income: { Low: 0, Medium: 0.5, High: 1 },
    Teacher_Quality: { Low: 0, Medium: 0.5, High: 1 },
    Peer_Influence: { Negative: 0, Neutral: 0.5, Positive: 1 },
    Extracurricular_Activities: { No: 0, Yes: 1 },
  };
  return encodings[feature]?.[value] ?? 0.5;
}

function normalise(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export interface PredictionInput {
  hoursStudied: number;
  attendance: number;
  sleepHours: number;
  previousScores: number;
  tutoringSessions: number;
  physicalActivity: number;
  parentalInvolvement: string;
  accessToResources: string;
  motivationLevel: string;
  internetAccess: string;
  familyIncome: string;
  teacherQuality: string;
  peerInfluence: string;
  extracurricularActivities: string;
}

export interface PredictionResult {
  predictedScore: number;
  confidence: number;
  grade: string;
  featureImportance: { feature: string; importance: number }[];
}

function gradeFromScore(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function predictScore(input: PredictionInput): PredictionResult {
  const data = loadData();
  const scores = data.map((r) => r.Exam_Score);
  const globalMean = mean(scores);

  // Compute normalised feature values
  const numericRanges = {
    Attendance: { min: 60, max: 100 },
    Previous_Scores: { min: 50, max: 100 },
    Hours_Studied: { min: 0, max: 44 },
    Tutoring_Sessions: { min: 0, max: 8 },
    Sleep_Hours: { min: 4, max: 10 },
    Physical_Activity: { min: 0, max: 6 },
  };

  const normalisedFeatures: Record<string, number> = {
    Attendance: normalise(input.attendance, numericRanges.Attendance.min, numericRanges.Attendance.max),
    Previous_Scores: normalise(input.previousScores, numericRanges.Previous_Scores.min, numericRanges.Previous_Scores.max),
    Hours_Studied: normalise(input.hoursStudied, numericRanges.Hours_Studied.min, numericRanges.Hours_Studied.max),
    Tutoring_Sessions: normalise(input.tutoringSessions, numericRanges.Tutoring_Sessions.min, numericRanges.Tutoring_Sessions.max),
    Sleep_Hours: normalise(input.sleepHours, numericRanges.Sleep_Hours.min, numericRanges.Sleep_Hours.max),
    Physical_Activity: normalise(input.physicalActivity, numericRanges.Physical_Activity.min, numericRanges.Physical_Activity.max),
    Parental_Involvement: encodeCategorical("Parental_Involvement", input.parentalInvolvement),
    Access_to_Resources: encodeCategorical("Access_to_Resources", input.accessToResources),
    Motivation_Level: encodeCategorical("Motivation_Level", input.motivationLevel),
    Internet_Access: encodeCategorical("Internet_Access", input.internetAccess),
    Family_Income: encodeCategorical("Family_Income", input.familyIncome),
    Teacher_Quality: encodeCategorical("Teacher_Quality", input.teacherQuality),
    Peer_Influence: encodeCategorical("Peer_Influence", input.peerInfluence),
    Extracurricular_Activities: encodeCategorical("Extracurricular_Activities", input.extracurricularActivities),
  };

  // Weighted sum prediction mapped to score range [55, 100]
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [feature, weight] of Object.entries(FEATURE_WEIGHTS)) {
    const norm = normalisedFeatures[feature] ?? 0.5;
    weightedSum += norm * weight;
    totalWeight += weight;
  }

  const normScore = weightedSum / totalWeight;
  // Map to realistic score range: the dataset scores range roughly 55-100
  const predicted = Math.round(55 + normScore * 45);

  // Find similar students in dataset for confidence calculation
  const similar = data.filter((r) => {
    const attendanceDiff = Math.abs(r.Attendance - input.attendance);
    const prevDiff = Math.abs(r.Previous_Scores - input.previousScores);
    return attendanceDiff <= 5 && prevDiff <= 10;
  });

  const confidence = Math.min(0.95, 0.70 + Math.min(similar.length, 100) / 500);

  // Feature importance (normalised weight * normalised value deviation from neutral 0.5)
  const featureImportance = Object.entries(FEATURE_WEIGHTS)
    .map(([feature, weight]) => {
      const norm = normalisedFeatures[feature] ?? 0.5;
      const deviation = Math.abs(norm - 0.5);
      return {
        feature: feature.replace(/_/g, " "),
        importance: Math.round(weight * (0.5 + deviation) * 200) / 100,
      };
    })
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 8);

  return {
    predictedScore: Math.max(40, Math.min(100, predicted)),
    confidence: Math.round(confidence * 100) / 100,
    grade: gradeFromScore(predicted),
    featureImportance,
  };
}
