"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type LoginResult = {
  ok: boolean;
  error?: string;
  redirectTo?: string;
};

export async function login(
  _previousState: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const user = await prisma.appUser.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash || user.status !== "Active") {
    return { ok: false, error: "Invalid email or password." };
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return { ok: false, error: "Invalid email or password." };
  }

  await prisma.appUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  cookies().set("sdi_session", String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return {
    ok: true,
    redirectTo: "/dashboard/command-center",
  };
}

export async function logout() {
  cookies().delete("sdi_session");
}