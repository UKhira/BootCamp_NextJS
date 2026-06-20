"use client";

import { useState } from "react";
import type { PlanRequestData } from "@/lib/plan";

type StudyFormProps = {
  onSubmit: (data: PlanRequestData) => void;
  isLoading: boolean;
};

export default function StudyForm({ onSubmit, isLoading }: StudyFormProps) {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ subject: subject.trim(), topics: topics.trim(), examDate });
  };

  return (
    <form className="rounded-[2rem] bg-white p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/80 sm:p-10" onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">New study plan</p>
          <h2 className="text-3xl font-semibold text-slate-950">Create your schedule</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Share your subject, topics, and exam date so Prepwise Lite can build the right plan for your next exam.
          </p>
        </div>

        <div className="grid gap-5">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Subject
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Biology, History, Math"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Topics
            <textarea
              className="min-h-[170px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={topics}
              onChange={(event) => setTopics(event.target.value)}
              placeholder="Enter one topic per line or separate topics with commas"
              required
            />
            <p className="text-xs text-slate-500">Separate each topic with a comma or line break.</p>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Exam date
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              type="date"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? "Generating plan..." : "Generate study plan"}
        </button>
      </div>
    </form>
  );
}
