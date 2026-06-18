import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main(){
  await prisma.dataSourceConnection.upsert({ where:{system:'Intacct CSV'}, update:{status:'Configured', connectionType:'CSV Import', notes:'Uses SDI export CSV files in data/imports.'}, create:{system:'Intacct CSV', status:'Configured', connectionType:'CSV Import', notes:'Uses SDI export CSV files in data/imports.'} });
  for (const system of ['Salesforce','Ford Pro','Fuel System','Monday.com','POR']) await prisma.dataSourceConnection.upsert({ where:{system}, update:{}, create:{system, status:'Awaiting credentials/source data', connectionType:'TBD'} });
}
main().finally(()=>prisma.$disconnect());
