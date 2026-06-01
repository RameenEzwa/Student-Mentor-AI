import { Router, type IRouter } from "express";
import { PredictScoreBody, GetRecommendationsQueryParams } from "@workspace/api-zod";
import { predictScore } from "../lib/mlModel";

const router: IRouter = Router();

// POST /predict/score
router.post("/predict/score", (req, res) => {
  const parsed = PredictScoreBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid prediction input", details: parsed.error.issues });
    return;
  }

  const result = predictScore(parsed.data);
  res.json(result);
});

// GET /predict/recommendations
router.get("/predict/recommendations", (req, res) => {
  const parsed = GetRecommendationsQueryParams.safeParse(req.query);
  const score = parsed.success && parsed.data.score ? Number(parsed.data.score) : 65;
  const hoursStudied = parsed.success && parsed.data.hours_studied ? Number(parsed.data.hours_studied) : 15;
  const attendance = parsed.success && parsed.data.attendance ? Number(parsed.data.attendance) : 75;
  const motivation = parsed.success && parsed.data.motivation ? String(parsed.data.motivation) : "Medium";

  const recommendations = [];

  if (attendance < 75) {
    recommendations.push({
      category: "Attendance",
      title: "Prioritise Consistent Attendance",
      description: "Your attendance rate is below the performance threshold. Students who attend at least 85% of classes score on average 7 points higher. Set calendar reminders and reach out to your tutor about any recurring barriers.",
      priority: "high",
      color: "#dc2626",
    });
  }

  if (hoursStudied < 15) {
    recommendations.push({
      category: "Study Time",
      title: "Increase Daily Study Hours",
      description: "Data shows that students studying 20+ hours per week perform significantly better. Consider blocking 3 focused study sessions per day using the Pomodoro technique to build sustainable habits.",
      priority: "high",
      color: "#dc2626",
    });
  }

  if (motivation === "Low") {
    recommendations.push({
      category: "Motivation",
      title: "Re-engage Your Learning Goals",
      description: "Low motivation is a key predictor of underperformance. Connect each study topic to a real-world goal. Study groups and accountability partners have been shown to improve motivation by 40% in cohort analysis.",
      priority: "high",
      color: "#dc2626",
    });
  }

  if (score < 70) {
    recommendations.push({
      category: "Academic Support",
      title: "Book Additional Tutoring Sessions",
      description: "Tutoring sessions directly correlate with score improvement. Students with 2+ sessions per week improve by an average of 8 points. Contact the academic support centre to schedule weekly sessions.",
      priority: "medium",
      color: "#d97706",
    });
  }

  if (attendance >= 75 && attendance < 90) {
    recommendations.push({
      category: "Attendance",
      title: "Push Attendance Above 90%",
      description: "You're making progress on attendance. Reaching the 90% mark places you in the high-performance cohort. Review upcoming timetables and plan proactively for any known absences.",
      priority: "medium",
      color: "#d97706",
    });
  }

  recommendations.push({
    category: "Sleep Hygiene",
    title: "Optimise Your Sleep Schedule",
    description: "Students sleeping 7-9 hours per night score up to 5 points higher than those getting fewer hours. Establish a consistent bedtime, reduce screen exposure 1 hour before sleep, and avoid late-night study marathons.",
    priority: score < 65 ? "medium" : "low",
    color: score < 65 ? "#d97706" : "#16a34a",
  });

  recommendations.push({
    category: "Physical Wellbeing",
    title: "Incorporate Regular Physical Activity",
    description: "Regular exercise (3+ times per week) improves cognitive performance and concentration. Even 30-minute walks between study sessions improve recall and reduce exam anxiety.",
    priority: "low",
    color: "#16a34a",
  });

  recommendations.push({
    category: "Resource Access",
    title: "Leverage Digital Learning Resources",
    description: "Students with access to high-quality digital resources perform 6% better on average. Explore Khan Academy, MIT OpenCourseWare, and your institution's e-library for supplementary material.",
    priority: "low",
    color: "#16a34a",
  });

  res.json({ recommendations });
});

export default router;
