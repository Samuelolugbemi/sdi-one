import { prisma } from '../lib/prisma';
async function main(){ const c=await prisma.integrationConnector.findUnique({where:{key:'fuel-system'},include:{mappings:true}}); console.log(c ? `Fuel System ready: ${c.mappings.length} mappings` : 'Fuel System connector not seeded'); }
main().finally(()=>prisma.$disconnect());
