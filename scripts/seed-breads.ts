import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.bread.createMany({
    data: [
      { name: "Jamón y Queso", description: "Pan relleno de jamón y queso", price: 2500, promotionPrice: 4000 },
      { name: "Salame y Queso", description: "Pan relleno de salame y queso", price: 2500, promotionPrice: 4000 }
    ],
    skipDuplicates: true
  })
  console.log('Panes añadidos correctamente')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
