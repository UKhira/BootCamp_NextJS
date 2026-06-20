"use client";

import type { StudyPlan } from "@/lib/plan";

type PlanCardProps = {
  plan: StudyPlan;
  onDelete: () => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export default function PlanCard({ plan, onDelete }: PlanCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.15)]">
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 px-6 py-5 text-white sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-100/80">Study plan</p>
            <h2 className="mt-2 text-2xl font-semibold">{plan.subject}</h2>
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Exam date</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(plan.examDate)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Created</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(plan.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Topics</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {plan.topics.map((topic) => (
                <li key={topic} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Sessions</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{plan.sessions.length}</p>
            <p className="mt-1 text-sm text-slate-500">Daily working sessions</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">Schedule</h3>
          <div className="space-y-3">
            {plan.sessions.map((session) => (
              <div key={`${plan.id}-${session.date}-${session.topic}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{session.title}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{formatDate(session.date)}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {session.topic}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{session.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
