import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.aiProviderConfig.upsert({
    where: { key: 'openai-primary' },
    update: { status: process.env.OPENAI_API_KEY ? 'Configured' : 'Ready for API key', modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini' },
    create: { key: 'openai-primary', name: 'OpenAI Primary Provider', provider: 'OpenAI', modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini', status: process.env.OPENAI_API_KEY ? 'Configured' : 'Ready for API key', purpose: 'Operational AI Copilot, executive briefings, workspace summaries, recommendations' }
  });

  const templates = [
    ['job-over-budget-live', 'Explain Job Cost Risk', 'entity', 'job', 'Analyze why a job may be over budget using invoices, inventory, equipment, timeline, and vendor context.'],
    ['vendor-spend-live', 'Vendor Spend Explanation', 'entity', 'vendor', 'Explain vendor spend concentration, job impact, invoice history, and recommended review steps.'],
    ['equipment-profit-live', 'Equipment Profitability Explanation', 'entity', 'equipment', 'Explain equipment profitability using utilization, repair cost, rental revenue, fuel, and assignment data.'],
    ['executive-daily-live', 'Executive Daily Briefing', 'executive', null, 'Summarize business health, risks, and recommended actions for executives.'],
  ];
  for (const [key, name, scope, entityType, prompt] of templates) {
    await prisma.aiPromptTemplate.upsert({
      where: { key },
      update: { prompt, enabled: true },
      create: { key, name, scope, entityType, prompt, enabled: true, description: prompt }
    });
  }

  await prisma.aiRecommendation.createMany({
    data: [
      { category: 'AI Readiness', title: 'Connect live AI provider', recommendation: 'Add OPENAI_API_KEY to enable live executive briefings and natural-language analysis.', impact: 'Enables operational copilot', confidence: 0.95, source: 'v1.0 seed' },
      { category: 'Data Context', title: 'Prioritize job cost intelligence', recommendation: 'Use invoice lines and inventory transactions as the first AI grounding layer for job profitability analysis.', impact: 'Improves job workspace decisions', confidence: 0.9, source: 'v1.0 seed' },
      { category: 'Integration', title: 'Connect POR after Intacct', recommendation: 'POR should be prioritized for equipment profitability because it adds utilization and rental revenue context.', impact: 'Improves asset decisions', confidence: 0.88, source: 'v1.0 seed' }
    ],
    skipDuplicates: true
  }).catch(() => null);
}

main().finally(async () => prisma.$disconnect());
