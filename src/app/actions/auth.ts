"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";

export async function seedUsers() {
  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.createMany({
      data: [
        { name: "anto" },
        { name: "cami" }
      ]
    });
  }
}

export async function login(name: string) {
  // Asegurarnos de que los usuarios existan
  await seedUsers();

  const lowerName = name.trim().toLowerCase();
  
  // Verify user exists in database
  const user = await prisma.user.findUnique({
    where: { name: lowerName }
  });

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set("agentName", user.name, { path: "/" });
    return { success: true };
  } else {
    throw new Error("Usuario no autorizado");
  }
}
