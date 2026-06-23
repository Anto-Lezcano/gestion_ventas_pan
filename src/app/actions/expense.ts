"use server"

import { revalidatePath } from "next/cache"
import prisma from "../../lib/prisma"

export async function createExpense(data: {
  description: string
  amount: number
  agentName: string
}) {
  await prisma.expense.create({
    data
  })
  revalidatePath('/dashboard')
}

export async function updateExpense(id: string, data: {
  description: string
  amount: number
}) {
  await prisma.expense.update({
    where: { id },
    data
  })
  revalidatePath('/dashboard')
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({
    where: { id }
  })
  revalidatePath('/dashboard')
}

export async function getExpenses() {
  return await prisma.expense.findMany({
    orderBy: { createdAt: 'desc' }
  })
}
