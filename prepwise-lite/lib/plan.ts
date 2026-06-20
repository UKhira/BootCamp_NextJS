export type PlanRequestData = {
  subject: string;
  topics: string;
  examDate: string;
};

export type StudySession = {
  date: string;
  title: string;
  topic: string;
  description: string;
};

export type StudyPlan = {
  id: string;
  subject: string;
  topics: string[];
  examDate: string;
  createdAt: string;
  sessions: StudySession[];
};

const parseTopics = (topicsInput: string): string[] => {
  return topicsInput
    .split(/\r?\n|,/) 
    .map((topic) => topic.trim())
    .filter(Boolean);
};

const formatPlanDate = (date: Date) => date.toISOString().slice(0, 10);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getSessionDates = (start: Date, end: Date, sessionCount: number): string[] => {
  if (sessionCount <= 0) {
    return [];
  }

  const rangeDays = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
  const dates: string[] = [];

  for (let index = 0; index < sessionCount; index += 1) {
    const offset = sessionCount === 1 ? 0 : Math.round((rangeDays * index) / (sessionCount - 1));
    const date = new Date(start);
    date.setDate(date.getDate() + offset);
    if (date > end) {
      dates.push(formatPlanDate(end));
    } else {
      dates.push(formatPlanDate(date));
    }
  }

  return dates;
};

const createUniqueId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `plan-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isValidISODate = (value: string) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const dateToUTC = (value: Date) => {
  const utc = new Date(value);
  utc.setHours(0, 0, 0, 0);
  return utc;
};

export function generateStudyPlan(input: unknown): StudyPlan {
  if (typeof input !== "object" || input === null) {
    throw new Error("Invalid request payload.");
  }

  const { subject, topics, examDate } = input as Record<string, unknown>;

  if (typeof subject !== "string" || subject.trim().length === 0) {
    throw new Error("Please provide a valid subject.");
  }

  if (typeof topics !== "string" || topics.trim().length === 0) {
    throw new Error("Please provide at least one study topic.");
  }

  if (typeof examDate !== "string" || !isValidISODate(examDate)) {
    throw new Error("Please provide a valid exam date.");
  }

  const parsedTopics = parseTopics(topics);
  if (parsedTopics.length === 0) {
    throw new Error("Please provide at least one study topic.");
  }

  const today = dateToUTC(new Date());
  const exam = dateToUTC(new Date(examDate));

  if (exam < today) {
    throw new Error("Exam date must be today or in the future.");
  }

  const sessionDates = getSessionDates(today, exam, parsedTopics.length);
  const sessions = parsedTopics.map((topic, index) => {
    const date = sessionDates[index] ?? formatPlanDate(exam);
    return {
      date,
      title: `Study ${topic}`,
      topic,
      description: `Focus on ${topic} for this session. Review the key ideas and create a quick summary to reinforce learning.`,
    };
  });

  const reviewDate = formatPlanDate(exam);
  const lastSessionDate = sessions[sessions.length - 1]?.date;

  if (lastSessionDate !== reviewDate) {
    sessions.push({
      date: reviewDate,
      title: "Final exam review",
      topic: "Review session",
      description: "Use this session to revisit your notes, practice the most important topics, and make sure you feel ready for the exam.",
    });
  }

  return {
    id: createUniqueId(),
    subject: subject.trim(),
    topics: parsedTopics,
    examDate: reviewDate,
    createdAt: new Date().toISOString(),
    sessions,
  };
}
