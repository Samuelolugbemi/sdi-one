import { prisma } from '../lib/prisma';
async function main(){ const c=await prisma.integrationConnector.findUnique({where:{key:'ford-pro'},include:{mappings:true}}); console.log(c ? `Ford Pro ready: ${c.mappings.length} mappings` : 'Ford Pro connector not seeded'); }
main().finally(()=>prisma.$disconnect());
