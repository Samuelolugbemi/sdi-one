import { prisma } from '../lib/prisma';
async function main(){ const c=await prisma.integrationConnector.findUnique({where:{key:'geotab'},include:{mappings:true}}); console.log(c ? `Geotab ready: ${c.mappings.length} mappings` : 'Geotab connector not seeded'); }
main().finally(()=>prisma.$disconnect());
