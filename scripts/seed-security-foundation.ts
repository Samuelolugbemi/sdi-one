import { prisma } from "../lib/prisma";

const roles = [
  ["System Administrator", "Full platform control"],
  ["Executive", "Company-wide visibility"],
  ["Company Admin", "Company-level administration"],
  ["Operations Manager", "Jobs, equipment, fleet, inventory"],
  ["Accounting", "Finance, invoices, vendors, Sage"],
  ["Project Manager", "Assigned jobs and related data"],
  ["Purchasing", "Vendors and inventory"],
  ["Equipment Manager", "Fleet and equipment"],
  ["Read Only", "View-only access"],
];

const permissions = [
  ["dashboard.view", "dashboard", "view"],
  ["dashboard.executive", "dashboard", "executive"],
  ["customer.read", "customer", "read"],
  ["customer.write", "customer", "write"],
  ["job.read", "job", "read"],
  ["job.write", "job", "write"],
  ["vendor.read", "vendor", "read"],
  ["vendor.write", "vendor", "write"],
  ["invoice.read", "invoice", "read"],
  ["equipment.read", "equipment", "read"],
  ["equipment.write", "equipment", "write"],
  ["inventory.read", "inventory", "read"],
  ["document.read", "document", "read"],
  ["document.upload", "document", "upload"],
  ["workflow.manage", "workflow", "manage"],
  ["integration.manage", "integration", "manage"],
  ["integration.run", "integration", "run"],
  ["user.manage", "user", "manage"],
  ["role.manage", "role", "manage"],
  ["permission.manage", "permission", "manage"],
  ["analytics.view", "analytics", "view"],
  ["report.export", "report", "export"],
  ["ai.use", "ai", "use"],
  ["timeline.view", "timeline", "view"],
];

async function main() {
  const adminEmail = process.argv[2]?.toLowerCase();

  for (const [name, description] of roles) {
    await prisma.role.upsert({
      where: { name },
      update: { description, isSystem: true },
      create: { name, description, isSystem: true },
    });
  }

  for (const [key, module, action] of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: { module, action },
      create: {
        key,
        module,
        action,
        description: `${action} ${module}`,
      },
    });
  }

  const systemAdmin = await prisma.role.findUnique({
    where: { name: "System Administrator" },
  });

  const allPermissions = await prisma.permission.findMany();

  if (systemAdmin) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: systemAdmin.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: systemAdmin.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const user = adminEmail
    ? await prisma.appUser.findUnique({ where: { email: adminEmail } })
    : await prisma.appUser.findFirst({ orderBy: { id: "asc" } });

  if (!user || !systemAdmin) {
    throw new Error("No AppUser found. Create the first admin through /setup first.");
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: systemAdmin.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: systemAdmin.id,
    },
  });

  console.log(`Security foundation seeded.`);
  console.log(`Assigned System Administrator to ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });