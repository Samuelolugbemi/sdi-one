import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const session = cookies().get("sdi_session")?.value;

  if (!session) {
    return null;
  }

  const userId = Number(session);

  if (!Number.isFinite(userId)) {
    return null;
  }

  return prisma.appUser.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
      companyAccess: true,
      jobAccess: true,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function hasPermission(permissionKey: string) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return user.roles.some((userRole) =>
    userRole.role.permissions.some(
      (rolePermission) => rolePermission.permission.key === permissionKey
    )
  );
}

export async function requirePermission(permissionKey: string) {
  const allowed = await hasPermission(permissionKey);

  if (!allowed) {
    redirect("/dashboard/unauthorized");
  }
}

export function userIsSystemAdmin(
  user: Awaited<ReturnType<typeof getCurrentUser>>
) {
  return Boolean(
    user?.roles.some((userRole) => userRole.role.name === "System Administrator")
  );
}


export const SESSION_COOKIE = 'sdi_one_session';
const SESSION_DAYS = 7;

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: number) {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.userSession.create({
    data: { userId, tokenHash, expiresAt },
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.userSession.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  cookies().delete(SESSION_COOKIE);
}

export async function userHasPermission(permissionKey: string) {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.roles.some((ur) => ur.role.name === 'System Admin')) return true;
  return user.roles.some((ur) => ur.role.permissions.some((rp) => rp.permission.key === permissionKey));
}

export function getUserRoleNames(user: Awaited<ReturnType<typeof getCurrentUser>>) {
  return user?.roles.map((ur) => ur.role.name) ?? [];
}
