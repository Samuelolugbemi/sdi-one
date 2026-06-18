import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.$queryRaw`SELECT 1`.then(()=>console.log('Database connection OK')).catch(e=>{console.error('Database connection failed:', e.message); process.exit(1);}).finally(()=>prisma.$disconnect());
