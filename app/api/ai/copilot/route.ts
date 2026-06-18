import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildCompanyContext, generateDeterministicAnswer, summarizeContextForPrompt } from '@/lib/ai-data-context';

async function callOpenAI(question: string, context: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are SDI One, an enterprise operations copilot for Shaft Drillers International. Answer using only the supplied business context. Be concise, operational, and action-oriented. Highlight risks and recommended next actions.'
        },
        { role: 'user', content: `Business context:\n${context}\n\nQuestion: ${question}` }
      ]
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const question = String(body.question || '').trim();
  const entityType = body.entityType ? String(body.entityType) : null;
  const entityKey = body.entityKey ? String(body.entityKey) : null;

  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  const ctx = await buildCompanyContext();
  const promptContext = summarizeContextForPrompt(ctx);
  const liveAnswer = await callOpenAI(question, promptContext);
  const answer = liveAnswer ?? generateDeterministicAnswer(question, ctx);

  const conversation = await prisma.aiConversation.create({
    data: {
      title: question.slice(0, 120),
      userEmail: 'admin@sdi.local',
      entityType,
      entityKey,
      messages: {
        create: [
          { role: 'user', content: question, context: { entityType, entityKey } },
          { role: 'assistant', content: answer, context: { live: Boolean(liveAnswer), context: promptContext } }
        ]
      }
    },
    include: { messages: true }
  });

  await prisma.naturalLanguageQueryLog.create({
    data: {
      query: question,
      interpretedIntent: entityType ?? 'enterprise_context',
      entities: { entityType, entityKey },
      resultCount: 1,
      userEmail: 'admin@sdi.local'
    }
  }).catch(() => null);

  return NextResponse.json({
    answer,
    live: Boolean(liveAnswer),
    conversationId: conversation.id,
    context: {
      customers: ctx.executive.customers,
      jobs: ctx.executive.jobs,
      vendors: ctx.executive.vendors,
      equipment: ctx.executive.equipment,
      invoiceTotal: ctx.invoiceSummary.totalAmount,
      inventoryTotal: ctx.executive.inventoryTotal,
    }
  });
}
