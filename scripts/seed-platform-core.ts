import { prisma } from '../lib/prisma';
import { workflowTemplates } from '../lib/workflow-engine';
import { platformRoles, permissionMatrix } from '../lib/security-engine';

async function main() {
  for (const role of platformRoles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description, isSystem: true },
    });
  }

  for (const [key, capability] of permissionMatrix) {
    const [module, action] = key.split('.');
    await prisma.permission.upsert({
      where: { key },
      update: { description: capability },
      create: { key, module, action, description: capability },
    });
  }

  for (const w of workflowTemplates) {
    await prisma.workflowDefinition.upsert({
      where: { key: w.key },
      update: { name: w.name, triggerType: w.trigger, config: { stages: w.stages } },
      create: { key: w.key, name: w.name, triggerType: w.trigger, description: `System workflow for ${w.name}`, config: { stages: w.stages } },
    });
  }

  console.log('Seeded platform core roles, permissions, and workflows.');
}

main().finally(async () => prisma.$disconnect());
