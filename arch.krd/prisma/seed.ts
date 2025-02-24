// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing buildings
  // Seed historical buildings
  await prisma.building.createMany({
    data: [
      // ... (Previous entries from the last response) ...
        {titleEn: "Grd Jozi", titleKu: "گرد جوزی", locationEn: "Sulaymaniyah", locationKu: "سلێمانی", overviewEn: "Ancient archaeological mound...", overviewKu: "گردێکی شوێنەواری کۆن...", architecturalDetailsEn: ["Archaeological mound"], architecturalDetailsKu: ["گردی شوێنەواری"], latitude: 35.56, longitude: 45.43, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Sherwana Castle", titleKu: "قەڵای شێروانە", locationEn: "Kalar", locationKu: "کەلار", overviewEn: "A historical castle with ruins...", overviewKu: "قەڵایەکی مێژوویی بە پاشماوە...", architecturalDetailsEn: ["Castle ruins"], architecturalDetailsKu: ["پاشماوەی قەڵا"], latitude: 34.62, longitude: 45.31, period: "Various", status: "Historical Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Various"]), historicalPeriodsKu: JSON.stringify(["جۆراوجۆر"])} ,
      {titleEn: "Tel Zargah", titleKu: "تەل زەرگە", locationEn: "Chamchamal", locationKu: "چەمچەماڵ", overviewEn: "An ancient tell with archaeological significance...", overviewKu: "تەلێکی کۆن بە گرنگی شوێنەواری...", architecturalDetailsEn: ["Archaeological tell"], architecturalDetailsKu: ["تەلی شوێنەواری"], latitude: 35.51, longitude: 44.78, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Bastama Castle", titleKu: "قەڵای بەستامە", locationEn: "Rania", locationKu: "ڕانیە", overviewEn: "Ruins of an ancient castle...", overviewKu: "پاشماوەی قەڵایەکی کۆن...", architecturalDetailsEn: ["Castle ruins"], architecturalDetailsKu: ["پاشماوەی قەڵا"], latitude: 36.23, longitude: 44.88, period: "Ancient", status: "Historical Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Darband-i-Belula", titleKu: "دەربەندی بێلولە", locationEn: "Darbandikhan", locationKu: "دەربەندیخان", overviewEn: "Ancient rock reliefs...", overviewKu: "نەخشە بەردی کۆن...", architecturalDetailsEn: ["Rock reliefs"], architecturalDetailsKu: ["نەخشە بەرد"], latitude: 35.15, longitude: 45.72, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Yasin Tepe", titleKu: "یاسین تەپە", locationEn: "Sharazoor Plain", locationKu: "دەشتی شارەزوور", overviewEn: "Archaeological mound with evidence of early settlement...", overviewKu: "گردی شوێنەواری بە بەڵگەی نیشتەجێبوونی سەرەتایی...", architecturalDetailsEn: ["Archaeological mound"], architecturalDetailsKu: ["گردی شوێنەواری"], latitude: 35.35, longitude: 45.60, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Gird-i Shamshara", titleKu: "گردی شەمشەڕە", locationEn: "Dokkan", locationKu: "دوکان", overviewEn: "Archaeological site with ancient pottery and artifacts...", overviewKu: "شوێنی شوێنەواری بە گۆزە و شوێنەواری کۆن...", architecturalDetailsEn: ["Archaeological site"], architecturalDetailsKu: ["شوێنی شوێنەواری"], latitude: 36.08, longitude: 44.97, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Tell Begum", titleKu: "تەل بێگوم", locationEn: "Erbil Plain", locationKu: "دەشتی هەولێر", overviewEn: "Archaeological tell with layers of historical occupation...", overviewKu: "تەلی شوێنەواری بە چینەکانی نیشتەجێبوونی مێژوویی...", architecturalDetailsEn: ["Archaeological tell"], architecturalDetailsKu: ["تەلی شوێنەواری"], latitude: 36.30, longitude: 43.80, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Tell ed-Daim", titleKu: "تەل ئەلدەیم", locationEn: "Makhmur", locationKu: "مەخموور", overviewEn: "Ancient archaeological tell...", overviewKu: "تەلی شوێنەواری کۆن...", architecturalDetailsEn: ["Archaeological tell"], architecturalDetailsKu: ["تەلی شوێنەواری"], latitude: 35.90, longitude: 43.40, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])} ,
      {titleEn: "Tell Hassan", titleKu: "تەل حەسەن", locationEn: "Dibaga", locationKu: "دیبەگە", overviewEn: "Archaeological site with historical significance...", overviewKu: "شوێنی شوێنەواری بە گرنگی مێژوویی...", architecturalDetailsEn: ["Archaeological site"], architecturalDetailsKu: ["شوێنی شوێنەواری"], latitude: 35.70, longitude: 43.60, period: "Ancient", status: "Archaeological Site", images: ["/api/placeholder/400/300"], historicalPeriodsEn: JSON.stringify(["Ancient"]), historicalPeriodsKu: JSON.stringify(["کۆن"])}
    ]
  })

  console.log('Historical buildings seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })