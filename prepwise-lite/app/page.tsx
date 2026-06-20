"use client";

import { useEffect, useState } from "react";
import StudyForm from "@/components/StudyForm";
import PlanCard from "@/components/PlanCard";
import type { StudyPlan, PlanRequestData } from "@/lib/plan";

const STORAGE_KEY = "prepwiseLiteSavedPlans";

export default function Home() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StudyPlan[];
        setPlans(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const savePlans = (updatedPlans: StudyPlan[]) => {
    setPlans(updatedPlans);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  };

  const handleSubmit = async (data: PlanRequestData) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to generate your study plan.");
      }

      savePlans([payload as StudyPlan, ...plans]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (planId: string) => {
    const filtered = plans.filter((plan) => plan.id !== planId);
    savePlans(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-950/5 text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-white/95 p-8 shadow-[0_40px_100px_-40px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 sm:p-12">
          <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-20 h-40 w-40 rounded-full bg-fuchsia-300/15 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-600">Prepwise Lite</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Smart study plans for every exam.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Enter your subject, topics, and exam date to generate a personalized study schedule that stays saved in your browser for later review.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Planner</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">Personalized</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Storage</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">Local & ready</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.6)] sm:px-10">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Ready to study?</p>
              <p className="mt-4 text-4xl font-semibold leading-tight">Plan, review, succeed.</p>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Generate a clear daily schedule across topics and keep it available for your next study session.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <StudyForm onSubmit={handleSubmit} isLoading={isLoading} />
            {errorMessage ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
                {errorMessage}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.6)] ring-1 ring-white/10 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Saved plans</p>
                  <h2 className="mt-3 text-2xl font-semibold">Your latest schedules</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-100">
                  {plans.length} saved
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Your generated study plans are preserved locally so you can return to them whenever you need a quick refresher.
              </p>
            </div>

            {plans.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                <p className="text-base font-medium">No plans yet.</p>
                <p className="mt-2 text-sm">Submit a subject and exam date to create your first schedule.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onDelete={() => handleDelete(plan.id)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
