"use server"

import { revalidatePath } from "next/cache"
import prisma from "../../lib/prisma"

export async function calculateBreadPrice(breadId: string, quantity: number) {
  const bread = await prisma.bread.findUnique({ where: { id: breadId } })
  if (!bread) return 0

  if (bread.promotionPrice && quantity >= 2) {
    const pairs = Math.floor(quantity / 2)
    const remainder = quantity % 2
    return (pairs * bread.promotionPrice) + (remainder * bread.price)
  }

  return bread.price * quantity
}

export async function createOrder(data: {
  titular: string
  breadId: string
  quantity: number
  isDelivery: boolean
  deliveryCost?: number
  isPaid: boolean
  agentName: string
  phone?: string
}) {
  await prisma.order.create({
    data: {
      titular: data.titular,
      breadId: data.breadId,
      quantity: data.quantity,
      isDelivery: data.isDelivery,
      deliveryCost: data.deliveryCost,
      isPaid: data.isPaid,
      agentName: data.agentName,
      phone: data.phone,
    }
  })
  revalidatePath('/dashboard')
}

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({
    where: { id },
    data: { status }
  })
  revalidatePath('/dashboard')
}

export async function updateOrderPaymentStatus(id: string, isPaid: boolean) {
  await prisma.order.update({
    where: { id },
    data: { isPaid }
  })
  revalidatePath('/dashboard')
}

export async function updateDeliveryCost(id: string, cost: number) {
  await prisma.order.update({
    where: { id },
    data: { deliveryCost: cost }
  })
  revalidatePath('/dashboard')
}

export async function getOrders() {
  return await prisma.order.findMany({
    include: { bread: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getBreads() {
  return await prisma.bread.findMany()
}

export async function seedBreads() {
  const count = await prisma.bread.count()
  if (count === 0) {
    await prisma.bread.create({
      data: {
        name: "Pan Casero",
        description: "Pan de campo",
        price: 2500,
        promotionPrice: 4000
      }
    })
  }
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({
    where: { id }
  })
  revalidatePath('/dashboard')
}

export async function updateOrder(id: string, data: {
  titular: string
  breadId: string
  quantity: number
  isDelivery: boolean
  deliveryCost?: number
  isPaid: boolean
  phone?: string
}) {
  await prisma.order.update({
    where: { id },
    data: {
      titular: data.titular,
      breadId: data.breadId,
      quantity: data.quantity,
      isDelivery: data.isDelivery,
      deliveryCost: data.deliveryCost,
      isPaid: data.isPaid,
      phone: data.phone,
    }
  })
  revalidatePath('/dashboard')
}