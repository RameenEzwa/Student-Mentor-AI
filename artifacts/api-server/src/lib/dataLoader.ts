import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, resolve } from "path";

export interface StudentRow {
  Hours_Studied: number;
  Attendance: number;
  Parental_Involvement: string;
  Access_to_Resources: string;
  Extracurricular_Activities: string;
  Sleep_Hours: number;
  Previous_Scores: number;
  Motivation_Level: string;
  Internet_Access: string;
  Tutoring_Sessions: number;
  Family_Income: string;
  Teacher_Quality: string;
  School_Type: string;
  Peer_Influence: string;
  Physical_Activity: number;
  Learning_Disabilities: string;
  Parental_Education_Level: string;
  Distance_from_Home: string;
  Gender: string;
  Exam_Score: number;
}

let cachedData: StudentRow[] | null = null;

function findCsvPath(): string {
  const candidates = [
    join(resolve("."), "data", "StudentPerformanceFactors.csv"),
    join(resolve("."), "artifacts", "api-server", "data", "StudentPerformanceFactors.csv"),
    join(import.meta.dirname, "..", "data", "StudentPerformanceFactors.csv"),
    join(import.meta.dirname, "..", "..", "data", "StudentPerformanceFactors.csv"),
  ];
  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      // try next
    }
  }
  throw new Error(`CSV file not found. Tried: ${candidates.join(", ")}`);
}

export function loadData(): StudentRow[] {
  if (cachedData) return cachedData;

  const csvPath = findCsvPath();
  const raw = readFileSync(csvPath, "utf-8");

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: (value, context) => {
      const numericCols = [
        "Hours_Studied",
        "Attendance",
        "Sleep_Hours",
        "Previous_Scores",
        "Tutoring_Sessions",
        "Physical_Activity",
        "Exam_Score",
      ];
      if (typeof context.column === "string" && numericCols.includes(context.column)) {
        const n = Number(value);
        return isNaN(n) ? null : n;
      }
      return value === "" ? null : value;
    },
  }) as StudentRow[];

  cachedData = records.filter((r) => r.Exam_Score !== null);
  return cachedData;
}

export function getNumericColumn(data: StudentRow[], col: keyof StudentRow): number[] {
  return data.map((r) => r[col] as number).filter((v) => v !== null && v !== undefined && !isNaN(v));
}

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}
