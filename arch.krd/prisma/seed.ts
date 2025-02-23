// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing users
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('AdminKurdishArchive2024!', 10)

  await prisma.user.create({
    data: {
      email: 'admin@kurdisharchive.com',
      name: 'Kurdish Archive Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('Admin user created successfully')

  // Your existing building seed code remains the same
  await prisma.building.deleteMany()

  await prisma.building.createMany({
    data: [
      {
        titleEn: "Erbil Citadel",
        titleKu: "قەڵای هەولێر",
        alternateNamesEn: ["Qelat", "Hawler Castle"],
        alternateNamesKu: ["قەڵات", "قەڵای هەولێر"],
        locationEn: "Erbil, Kurdistan Region",
        locationKu: "هەولێر، هەرێمی کوردستان",
        overviewEn: "The oldest continuously inhabited settlement in the world...",
        overviewKu: "کۆنترین شوێنی نیشتەجێبوونی بەردەوام لە جیهاندا...",
        architecturalDetailsEn: ["Ancient fortification", "Mud-brick construction"],
        architecturalDetailsKu: ["قەڵای کۆن", "بیناسازی خشتی"],
        latitude: 36.19,
        longitude: 44.01,
        period: "6000 BCE - Present",
        status: "UNESCO World Heritage Site",
        images: ["/api/placeholder/400/300"],
        historicalPeriodsEn: JSON.stringify(["Mesopotamian", "Islamic", "Modern"]),
        historicalPeriodsKu: JSON.stringify(["مێژووی مێزۆپۆتامیا", "ئیسلامی", "هاوچەرخ"])
      },
      // Add more buildings...
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })