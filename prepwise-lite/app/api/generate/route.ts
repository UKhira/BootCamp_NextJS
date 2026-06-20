import { NextRequest, NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/plan";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = generateStudyPlan(body);
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate a study plan.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
