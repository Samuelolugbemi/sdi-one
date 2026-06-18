
import { prisma } from '../lib/prisma';

async function main() {
  const providers = [
    { key: 'openai-primary', name: 'OpenAI Primary Provider', provider: 'OpenAI', modelName: 'gpt-5.5-thinking', status: 'Awaiting credentials', purpose: 'Operational AI, summaries, recommendations, and natural language analysis.' },
    { key: 'local-rule-engine', name: 'Rule-Based Insight Engine', provider: 'Internal', modelName: 'deterministic', status: 'Active', purpose: 'Non-LLM insight generation and explainable rules.' },
  ];
  for (const p of providers) await prisma.aiProviderConfig.upsert({ where: { key: p.key }, update: p, create: p });

  const prompts = [
    { key: 'executive-daily-briefing', name: 'Executive Daily Briefing', scope: 'executive', prompt: 'Summarize the most important financial, job, equipment, fleet, and integration changes for SDI executives.', variables: ['kpis','alerts','imports','approvals'] },
    { key: 'job-risk-analysis', name: 'Job Risk Analysis', scope: 'workspace', entityType: 'job', prompt: 'Analyze why this job may be over budget or at risk. Use invoices, inventory, equipment, timeline, and related vendors.', variables: ['job','invoiceLines','inventory','equipment','timeline'] },
    { key: 'equipment-profitability-summary', name: 'Equipment Profitability Summary', scope: 'workspace', entityType: 'equipment', prompt: 'Explain whether this equipment is making money, what it costs, where it is used, and what should be reviewed next.', variables: ['equipment','jobs','costs','fuel','maintenance'] },
    { key: 'invoice-explanation', name: 'Invoice Explanation', scope: 'workspace', entityType: 'invoice', prompt: 'Explain why this money was spent, which job it belongs to, vendor context, and any approval concerns.', variables: ['invoice','lines','vendor','job'] },
  ];
  for (const p of prompts) await prisma.aiPromptTemplate.upsert({ where: { key: p.key }, update: p as any, create: p as any });

  await prisma.aiBriefing.create({ data: {
    audience: 'Executive', title: 'Executive Briefing Framework Ready', summary: 'SDI One can now produce AI-ready executive briefings once OpenAI credentials and live KPI feeds are connected.',
    highlights: [{ title: 'Imported data foundation is active' }, { title: 'Entity and workspace engines are available' }],
    risks: [{ title: 'External integrations still need credentials' }],
    actions: [{ title: 'Configure Sage/Salesforce/POR connector credentials' }]
  }}).catch(()=>{});

  await prisma.aiRecommendation.createMany({ data: [
    { category: 'Finance', title: 'Review high-spend vendors', recommendation: 'Use invoice and invoice line data to identify vendors with increasing monthly spend.', impact: 'Cost control', confidence: 0.82, source: 'Rule Engine' },
    { category: 'Operations', title: 'Prioritize job cost variance monitoring', recommendation: 'Jobs should be scored daily using invoice lines, inventory consumption, and equipment costs.', impact: 'Margin protection', confidence: 0.88, source: 'Rule Engine' },
    { category: 'Assets', title: 'Connect POR and fuel data next', recommendation: 'Equipment profitability requires POR rental revenue, repair costs, fuel, and assignment history.', impact: 'Asset profitability', confidence: 0.91, source: 'Architecture' },
  ], skipDuplicates: true }).catch(()=>{});
  console.log('Seeded AI platform.');
}
main().finally(()=>prisma.$disconnect());
