"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function initializePlatform(formData: FormData) {
  const existingUsers = await prisma.appUser.count();

  if (existingUsers > 0) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.appUser.create({
    data: {
      name,
      email,
      passwordHash,
      title: "System Administrator",
      department: "Administration",
      status: "Active",
      isExecutive: true,
    },
  });

  redirect("/login?initialized=1");
}