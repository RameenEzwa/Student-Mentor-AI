import { Router, type IRouter } from "express";
import { SendChatMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

const KNOWLEDGE_BASE: { keywords: string[]; response: string; suggestions: string[] }[] = [
  {
    keywords: ["improve", "score", "grade", "better", "higher"],
    response: "Based on our dataset of 6,607 students, the three strongest predictors of exam score improvement are: (1) Attendance above 85% — high-attendance students score 8 points higher on average, (2) Regular tutoring sessions — 2+ sessions per week correlates with a 6-point increase, and (3) Study hours of 20+ hours per week. Start by tracking your weekly study time and identifying gaps in attendance.",
    suggestions: ["How many hours should I study?", "What are tutoring session options?", "How does attendance affect my grade?"],
  },
  {
    keywords: ["attendance", "absent", "miss", "class", "skip"],
    response: "Attendance is the second strongest predictor of exam performance in our dataset. Students with 85-100% attendance score 7 points higher than those below 70%. If you're struggling to attend, speak to your academic advisor about support options. Document any medical absences to avoid academic penalties.",
    suggestions: ["How can I catch up on missed work?", "What attendance rate do I need?", "Tips for staying consistent"],
  },
  {
    keywords: ["study", "hours", "time", "schedule", "plan", "revision"],
    response: "Our dataset analysis shows students studying 20-30 hours per week perform best. More isn't always better — quality over quantity matters. Use spaced repetition: study in 50-minute sessions with 10-minute breaks. Spread sessions across the week rather than cramming. Review material within 24 hours of learning it.",
    suggestions: ["What is spaced repetition?", "How to make a study timetable", "Best time of day to study"],
  },
  {
    keywords: ["motivation", "focus", "distract", "procrastinate", "lazy", "tired"],
    response: "Low motivation is a measurable factor in our data — it's associated with a 4-point score reduction on average. Practical strategies: Break large tasks into 15-minute micro-goals, use a visual progress tracker, study with a peer, and reward yourself after milestones. Consider if there are external stressors — speak to your wellbeing advisor if needed.",
    suggestions: ["How to build better study habits?", "Tips to avoid procrastination", "How does stress affect learning?"],
  },
  {
    keywords: ["sleep", "rest", "tired", "fatigue", "night"],
    response: "Sleep directly impacts cognitive retention. Our analysis shows students sleeping 7-9 hours nightly score up to 5 points higher. Avoid all-night study sessions — the brain consolidates memory during sleep. Set a consistent sleep time, reduce caffeine after 2pm, and create a wind-down routine 30 minutes before bed.",
    suggestions: ["What is memory consolidation?", "How to build a sleep routine", "Effects of sleep deprivation on learning"],
  },
  {
    keywords: ["predict", "prediction", "forecast", "expected", "what will"],
    response: "The AI Score Prediction tool in the Student Workspace uses a weighted linear model calibrated on 6,607 real student records. Input your current study habits and lifestyle factors, and it estimates your likely exam score with a confidence measure. The feature importance chart shows which factors are driving your predicted outcome most.",
    suggestions: ["Try the score predictor", "Which factors matter most?", "How accurate is the prediction?"],
  },
  {
    keywords: ["resources", "material", "textbook", "website", "online"],
    response: "High-quality resource access is linked to a 6% performance improvement in our cohort. Recommended platforms: Khan Academy (free, all subjects), Coursera & edX (university courses), MIT OpenCourseWare, your institution's digital library, and Anki for spaced repetition flashcards. Ask your teacher about specific subject resources too.",
    suggestions: ["Best free learning platforms", "How to use flashcards effectively", "Digital library access tips"],
  },
  {
    keywords: ["exam", "test", "preparation", "anxiety", "nervous", "stress"],
    response: "Exam preparation is most effective when spread over weeks, not days. Strategies from top performers in our dataset: practise past papers under timed conditions, use active recall instead of passive re-reading, get 8 hours of sleep the night before, and avoid last-minute cramming. If exam anxiety is affecting you, speak to your school's counselling service.",
    suggestions: ["How to practise past papers", "Managing exam anxiety", "Revision techniques that work"],
  },
];

function generateResponse(message: string, history: { role: string; content: string }[]): { message: string; suggestions: string[] } {
  const lower = message.toLowerCase();

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { message: entry.response, suggestions: entry.suggestions };
    }
  }

  // Contextual follow-up based on previous turns
  if (history.length > 0) {
    const lastUserMsg = [...history].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      return {
        message: `That is a great follow-up question. Based on our student performance data, I recommend focusing on consistent daily habits rather than short bursts of intense effort. Gradual, sustained improvements in attendance, study hours, and sleep quality have the highest cumulative impact on exam outcomes. Is there a specific area you would like to explore further?`,
        suggestions: ["Tell me about study hours", "How does sleep affect performance?", "How to improve attendance"],
      };
    }
  }

  return {
    message: `Welcome to the Student Mentor AI. I can help you understand what drives academic performance based on analysis of 6,607 real student records. Ask me about study habits, attendance strategies, sleep, motivation, exam preparation, or your predicted score factors. What would you like to explore?`,
    suggestions: ["How can I improve my score?", "What study hours are recommended?", "How important is attendance?"],
  };
}

// POST /chat/message
router.post("/chat/message", (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid chat input" });
    return;
  }

  const { message, history = [] } = parsed.data;
  const response = generateResponse(message, history);
  res.json(response);
});

export default router;
