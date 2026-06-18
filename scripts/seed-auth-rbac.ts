import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const roles = [
  ['System Admin', 'Full platform administration including users, settings, imports and security.'],
  ['Executive', 'All-company visibility with executive dashboards and command center access.'],
  ['Company Admin', 'Administer assigned companies and view company-scoped business records.'],
  ['Project Manager', 'View assigned jobs and related customers, invoices, equipment and inventory.'],
  ['Accounting', 'Manage vendors, AP bills, invoices, financials, exports and reporting.'],
  ['Operations', 'Manage jobs, equipment, fleet, inventory and field operations.'],
  ['Read Only', 'Read-only access to assigned records.'],
] as const;

const permissions = [
  ['platform.admin', 'platform', 'admin', 'Full platform administration'],
  ['security.manage', 'security', 'manage', 'Manage users, roles, permissions and access'],
  ['security.read', 'security', 'read', 'Read security configuration'],
  ['dashboard.executive.read', 'dashboard', 'read', 'View executive dashboards'],
  ['customers.read', 'customers', 'read', 'View customers'],
  ['customers.export', 'customers', 'export', 'Export customers'],
  ['jobs.read', 'jobs', 'read', 'View jobs'],
  ['jobs.export', 'jobs', 'export', 'Export jobs'],
  ['vendors.read', 'vendors', 'read', 'View vendors'],
  ['vendors.export', 'vendors', 'export', 'Export vendors'],
  ['invoices.read', 'invoices', 'read', 'View invoices and invoice lines'],
  ['invoices.export', 'invoices', 'export', 'Export invoice data'],
  ['equipment.read', 'equipment', 'read', 'View equipment and fleet assets'],
  ['equipment.export', 'equipment', 'export', 'Export equipment data'],
  ['inventory.read', 'inventory', 'read', 'View inventory transactions'],
  ['inventory.export', 'inventory', 'export', 'Export inventory data'],
  ['documents.manage', 'documents', 'manage', 'Upload and manage documents'],
  ['automation.manage', 'automation', 'manage', 'Manage workflows, rules and scheduled jobs'],
  ['integrations.manage', 'integrations', 'manage', 'Configure and monitor integrations'],
  ['ai.use', 'ai', 'use', 'Use AI copilot and AI workspace features'],
  ['reports.manage', 'reports', 'manage', 'Create, export and schedule reports'],
] as const;

const rolePermissions: Record<string, string[]> = {
  'System Admin': permissions.map((p) => p[0]),
  Executive: ['dashboard.executive.read', 'customers.read', 'jobs.read', 'vendors.read', 'invoices.read', 'equipment.read', 'inventory.read', 'ai.use', 'reports.manage'],
  'Company Admin': ['customers.read', 'jobs.read', 'vendors.read', 'invoices.read', 'equipment.read', 'inventory.read', 'reports.manage'],
  'Project Manager': ['customers.read', 'jobs.read', 'invoices.read', 'equipment.read', 'inventory.read', 'documents.manage', 'ai.use'],
  Accounting: ['customers.read', 'vendors.read', 'invoices.read', 'invoices.export', 'reports.manage'],
  Operations: ['jobs.read', 'equipment.read', 'inventory.read', 'documents.manage', 'reports.manage'],
  'Read Only': ['customers.read', 'jobs.read', 'vendors.read', 'invoices.read', 'equipment.read', 'inventory.read'],
};

async function main() {
  for (const [name, description] of roles) {
    await prisma.role.upsert({
      where: { name },
      update: { description, isSystem: true },
      create: { name, description, isSystem: true },
    });
  }

  for (const [key, module, action, description] of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: { module, action, description },
      create: { key, module, action, description },
    });
  }

  for (const [roleName, permissionKeys] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
    for (const permissionKey of permissionKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const admin = await prisma.appUser.upsert({
    where: { email: 'admin@sdi.local' },
    update: {
      name: 'SDI System Admin',
      title: 'Platform Administrator',
      department: 'IT',
      status: 'Active',
      passwordHash: hashPassword('Admin123!'),
    },
    create: {
      email: 'admin@sdi.local',
      name: 'SDI System Admin',
      title: 'Platform Administrator',
      department: 'IT',
      status: 'Active',
      passwordHash: hashPassword('Admin123!'),
    },
  });

  const systemAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'System Admin' } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: systemAdminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: systemAdminRole.id },
  });

  await prisma.securityPolicy.upsert({
    where: { key: 'session.max_age_days' },
    update: { name: 'Session max age', enabled: true, config: { days: 7 } },
    create: { key: 'session.max_age_days', name: 'Session max age', description: 'Default session expiration policy.', enabled: true, config: { days: 7 } },
  });

  await prisma.securityPolicy.upsert({
    where: { key: 'password.min_strength' },
    update: { name: 'Password strength', enabled: true, config: { minimumLength: 8, requireComplex: true } },
    create: { key: 'password.min_strength', name: 'Password strength', description: 'Temporary local password policy before Azure/Entra SSO.', enabled: true, config: { minimumLength: 8, requireComplex: true } },
  });

  console.log('Seeded SDI One Authentication & RBAC v0.7');
  console.log('Admin: admin@sdi.local / Admin123!');
}

main().finally(async () => prisma.$disconnect());
