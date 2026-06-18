import { NextResponse } from 'next/server';
import { getProjectPlanningDashboard } from '@/lib/project-planning';

export async function GET() {
  const data = await getProjectPlanningDashboard();
  return NextResponse.json(data);
}
