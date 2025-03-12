import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean existing data
  await cleanDatabase();

  // Create eras
  const eras = await createEras();

  // Create regions
  const regions = await createRegions();

  // Create building types
  const buildingTypes = await createBuildingTypes();

  // Create materials
  const materials = await createMaterials();

  // Create buildings
  await createBuildings(eras, regions, buildingTypes, materials);

}

async function cleanDatabase() {
  console.log('Cleaning database...');
  // Delete in reverse order of dependencies
  await prisma.comment.deleteMany();
  await prisma.source.deleteMany();
  await prisma.image.deleteMany();
  await prisma.buildingsOnMaterials.deleteMany();
  await prisma.building.deleteMany();
  await prisma.material.deleteMany();
  await prisma.buildingType.deleteMany();
  await prisma.region.deleteMany();
  await prisma.era.deleteMany();
  console.log('Database cleaned');
}

async function createEras() {
  console.log('Creating eras...');
  
  const eras = [
    {
      nameEn: "Ancient Mesopotamian",
      nameKu: "مێژووی کۆنی مێزۆپۆتامیا",
      descriptionEn: "The earliest period of Kurdish architectural history, dating back to ancient Mesopotamian civilizations.",
      descriptionKu: "کۆنترین سەردەمی مێژووی تەلارسازی کوردی، کە بۆ شارستانییەتە کۆنەکانی مێزۆپۆتامیا دەگەڕێتەوە.",
      startYear: -6000,
      endYear: -330
    },
    {
      nameEn: "Median Era",
      nameKu: "سەردەمی میدی",
      descriptionEn: "The period of the Median Empire, one of the early Kurdish states.",
      descriptionKu: "سەردەمی ئیمپراتۆریەتی میدی، یەکێک لە دەوڵەتە کوردییە سەرەتاییەکان.",
      startYear: -728,
      endYear: -550
    },
    {
      nameEn: "Islamic Golden Age",
      nameKu: "سەردەمی زێڕینی ئیسلامی",
      descriptionEn: "The period of Islamic influence on Kurdish architecture, featuring mosques and madrasas.",
      descriptionKu: "سەردەمی کاریگەری ئیسلام لەسەر تەلارسازی کوردی، کە مزگەوت و مەدرەسەکانی تێدایە.",
      startYear: 750,
      endYear: 1258
    },
    {
      nameEn: "Ottoman Period",
      nameKu: "سەردەمی عوسمانی",
      descriptionEn: "The period of Ottoman rule, featuring a blend of Turkish and Kurdish architectural styles.",
      descriptionKu: "سەردەمی دەسەڵاتی عوسمانی، کە تێکەڵەیەک لە شێوازی تەلارسازی تورکی و کوردییە.",
      startYear: 1299,
      endYear: 1922
    },
    {
      nameEn: "Modern Kurdish",
      nameKu: "کوردی هاوچەرخ",
      descriptionEn: "Modern Kurdish architecture, including contemporary buildings and restoration projects.",
      descriptionKu: "تەلارسازی کوردی هاوچەرخ، کە بیناکانی ئێستا و پڕۆژەکانی نۆژەنکردنەوە لەخۆ دەگرێت.",
      startYear: 1922,
      endYear: null
    }
  ];

  const createdEras = [];
  for (const era of eras) {
    const createdEra = await prisma.era.create({ data: era });
    createdEras.push(createdEra);
    console.log(`Created era: ${era.nameEn}`);
  }
  
  return createdEras;
}

async function createRegions() {
  console.log('Creating regions...');
  
  const regions = [
    {
      nameEn: "Erbil (Hewlêr)",
      nameKu: "هەولێر",
      descriptionEn: "The capital city of the Kurdistan Region in Iraq, home to the ancient Erbil Citadel.",
      descriptionKu: "پایتەختی هەرێمی کوردستان لە عێراق، شوێنی قەڵای کۆنی هەولێر.",
      latitude: 36.191,
      longitude: 44.009
    },
    {
      nameEn: "Sulaymaniyah (Silêmanî)",
      nameKu: "سلێمانی",
      descriptionEn: "A cultural center in the Kurdistan Region of Iraq, known for its historical sites.",
      descriptionKu: "ناوەندێکی کولتووری لە هەرێمی کوردستانی عێراق، کە بە شوێنە مێژووییەکانی ناسراوە.",
      latitude: 35.558,
      longitude: 45.435
    },
    {
      nameEn: "Duhok",
      nameKu: "دهۆک",
      descriptionEn: "A governorate in the Kurdistan Region of Iraq, with a rich architectural heritage.",
      descriptionKu: "پارێزگایەک لە هەرێمی کوردستانی عێراق، کە میراتێکی دەوڵەمەندی تەلارسازی هەیە.",
      latitude: 36.867,
      longitude: 42.950
    },
    {
      nameEn: "Kermanshah",
      nameKu: "کرماشان",
      descriptionEn: "A Kurdish city in western Iran, home to several historical monuments.",
      descriptionKu: "شارێکی کوردی لە رۆژاوای ئێران، شوێنی چەندین یادگارییە مێژووییەکان.",
      latitude: 34.314,
      longitude: 47.065
    },
    {
      nameEn: "Sanandaj",
      nameKu: "سنە",
      descriptionEn: "The capital of Kurdistan Province in Iran, with distinctive architectural features.",
      descriptionKu: "پایتەختی پارێزگای کوردستان لە ئێران، کە تایبەتمەندییە تەلارسازییەکانی جیاواز هەیە.",
      latitude: 35.311,
      longitude: 46.998
    }
  ];

  const createdRegions = [];
  for (const region of regions) {
    const createdRegion = await prisma.region.create({ data: region });
    createdRegions.push(createdRegion);
    console.log(`Created region: ${region.nameEn}`);
  }
  
  return createdRegions;
}

async function createBuildingTypes() {
  console.log('Creating building types...');
  
  const buildingTypes = [
    {
      nameEn: "Castle/Citadel",
      nameKu: "قەڵا/کۆتەل",
      descriptionEn: "Fortified structures built for defensive purposes, often on elevated ground.",
      descriptionKu: "بیناکانی قایمکراو کە بۆ مەبەستی بەرگری دروستکراون، زۆربەی جار لەسەر زەوی بەرز."
    },
    {
      nameEn: "Mosque",
      nameKu: "مزگەوت",
      descriptionEn: "Islamic places of worship, featuring domes, minarets, and prayer halls.",
      descriptionKu: "شوێنی پەرستنی ئیسلامی، کە گومبەز، مینارە و هۆڵی نوێژی تێدایە."
    },
    {
      nameEn: "Traditional House",
      nameKu: "خانووی نەریتی",
      descriptionEn: "Residential buildings constructed using traditional Kurdish architectural methods.",
      descriptionKu: "بینای نیشتەجێبوون کە بە شێوازی تەلارسازی نەریتی کوردی دروستکراوە."
    },
    {
      nameEn: "Bazaar",
      nameKu: "بازاڕ",
      descriptionEn: "Traditional marketplaces, often covered, featuring shops, stalls, and workshops.",
      descriptionKu: "بازاڕی نەریتی، زۆربەی جار داپۆشراو، کە دوکان، مەحڵ و کارگەی تێدایە."
    },
    {
      nameEn: "Monument",
      nameKu: "یادگاری",
      descriptionEn: "Structures built to commemorate historical events or figures.",
      descriptionKu: "بیناکان کە بۆ یادکردنەوەی ڕووداو یان کەسایەتییە مێژووییەکان دروستکراون."
    },
    {
      nameEn: "Bridge",
      nameKu: "پرد",
      descriptionEn: "Structures built to span physical obstacles for passage.",
      descriptionKu: "بیناکان کە بۆ تێپەڕاندنی بەربەستە فیزیکییەکان بۆ تێپەڕبوون دروستکراون."
    }
  ];

  const createdBuildingTypes = [];
  for (const type of buildingTypes) {
    const createdType = await prisma.buildingType.create({ data: type });
    createdBuildingTypes.push(createdType);
    console.log(`Created building type: ${type.nameEn}`);
  }
  
  return createdBuildingTypes;
}

async function createMaterials() {
  console.log('Creating materials...');
  
  const materials = [
    {
      nameEn: "Stone",
      nameKu: "بەرد",
      descriptionEn: "Natural stone used for construction, common in Kurdish architecture.",
      descriptionKu: "بەردی سروشتی کە بۆ بیناسازی بەکار دێت، باو لە تەلارسازی کوردی."
    },
    {
      nameEn: "Brick",
      nameKu: "خشت",
      descriptionEn: "Clay bricks, often used for walls and structures.",
      descriptionKu: "خشتی قوڕ، زۆربەی جار بۆ دیوار و بینا بەکار دێت."
    },
    {
      nameEn: "Wood",
      nameKu: "دار",
      descriptionEn: "Timber used for structural elements, doors, and decorative features.",
      descriptionKu: "داری درەخت کە بۆ توخمە پێکهاتەییەکان، دەرگا و تایبەتمەندییە ڕازاندنەوەکان بەکار دێت."
    },
    {
      nameEn: "Mud",
      nameKu: "قوڕ",
      descriptionEn: "Clay-based material used in traditional construction.",
      descriptionKu: "کەرەستەی لەسەر بنەمای قوڕ کە لە بیناسازی نەریتیدا بەکاردێت."
    },
    {
      nameEn: "Concrete",
      nameKu: "کۆنکرێت",
      descriptionEn: "Modern construction material used in contemporary buildings.",
      descriptionKu: "کەرەستەی بیناسازی نوێ کە لە بینا هاوچەرخەکاندا بەکار دێت."
    },
    {
      nameEn: "Marble",
      nameKu: "مەڕمەڕ",
      descriptionEn: "Decorative stone used for floors, walls, and ornamental features.",
      descriptionKu: "بەردی ڕازاندنەوە کە بۆ زەوی، دیوار و تایبەتمەندییە ڕازاندنەوەکان بەکار دێت."
    }
  ];

  const createdMaterials = [];
  for (const material of materials) {
    const createdMaterial = await prisma.material.create({ data: material });
    createdMaterials.push(createdMaterial);
    console.log(`Created material: ${material.nameEn}`);
  }
  
  return createdMaterials;
}

async function createBuildings(
  eras: any[], 
  regions: any[], 
  buildingTypes: any[], 
  materials: any[]
) {
  console.log('Creating buildings...');
  
  const buildings = [
    {
      titleEn: "Erbil Citadel",
      titleKu: "قەڵای هەولێر",
      alternateNamesEn: ["Hawler Castle", "Qelat"],
      alternateNamesKu: ["کۆتەلی هەولێر", "قەڵات"],
      locationEn: "Erbil, Kurdistan Region, Iraq",
      locationKu: "هەولێر، هەرێمی کوردستان، عێراق",
      overviewEn: "The Erbil Citadel is an ancient fortified settlement located in the center of Erbil. It has been continuously inhabited for over 6,000 years, making it one of the oldest continuously inhabited sites in the world. In 2014, it was designated as a UNESCO World Heritage Site.",
      overviewKu: "قەڵای هەولێر شوێنێکی کۆنی قایمکراوە کە لە ناوەندی هەولێر هەڵکەوتووە. بۆ ماوەی زیاتر لە ٦٠٠٠ ساڵ بەردەوام نیشتەجێبووە، کە دەیکاتە یەکێک لە کۆنترین شوێنە بەردەوام نیشتەجێبووەکان لە جیهاندا. لە ساڵی ٢٠١٤، وەک شوێنی میراتی جیهانی یونسکۆ دیاری کرا.",
      architecturalDetailsEn: [
        "Built on an artificial mound rising 32 meters above the surrounding plain",
        "Oval shape, approximately 430 meters long by 340 meters wide",
        "Surrounded by a continuous wall with a single entrance",
        "Contains Kurdish-style courtyard houses with distinctive architectural features"
      ],
      architecturalDetailsKu: [
        "لەسەر گردێکی دەستکرد دروستکراوە کە ٣٢ مەتر لە دەشتی دەوروبەری بەرزترە",
        "شێوەی هێلکەیی، نزیکەی ٤٣٠ مەتر درێژ و ٣٤٠ مەتر پان",
        "بە دیوارێکی بەردەوام دەوردراوە کە تەنها یەک دەروازەی هەیە",
        "خانووی حەوشەداری شێوازی کوردی لەخۆ دەگرێت کە تایبەتمەندی تەلارسازی جیاوازیان هەیە"
      ],
      latitude: 36.191,
      longitude: 44.010,
      eraId: eras[0].id, // Ancient Mesopotamian
      regionId: regions[0].id, // Erbil
      status: "PRESERVED",
      constructionYear: -6000,
      renovationYears: [1920, 1979, 2007],
      architectEn: "Unknown",
      architectKu: "نەزانراو",
      buildingTypeId: buildingTypes[0].id, // Castle/Citadel
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Erbil_Citadel.jpg/1920px-Erbil_Citadel.jpg",
          captionEn: "Aerial view of Erbil Citadel",
          captionKu: "دیمەنی هەوایی قەڵای هەولێر",
          isPrimary: true
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Erbil_Citadel_-_interior.jpg",
          captionEn: "Interior of Erbil Citadel",
          captionKu: "ناوەوەی قەڵای هەولێر",
          isPrimary: false
        }
      ],
      sources: [
        {
          titleEn: "UNESCO World Heritage Centre",
          titleKu: "ناوەندی میراتی جیهانی یونسکۆ",
          url: "https://whc.unesco.org/en/list/1437/",
          description: "Official UNESCO listing for Erbil Citadel"
        },
        {
          titleEn: "Erbil Citadel Revitalization Project",
          titleKu: "پڕۆژەی زیندووکردنەوەی قەڵای هەولێر",
          url: "https://www.erbilcitadel.org/",
          description: "Official website for the revitalization project"
        }
      ],
      materials: [
        { materialId: materials[0].id }, // Stone
        { materialId: materials[1].id }, // Brick
        { materialId: materials[3].id }  // Mud
      ]
    },
    {
      titleEn: "Grand Mosque of Sulaymaniyah",
      titleKu: "مزگەوتی گەورەی سلێمانی",
      alternateNamesEn: ["Central Mosque"],
      alternateNamesKu: ["مزگەوتی ناوەندی"],
      locationEn: "Sulaymaniyah, Kurdistan Region, Iraq",
      locationKu: "سلێمانی، هەرێمی کوردستان، عێراق",
      overviewEn: "The Grand Mosque of Sulaymaniyah is one of the oldest and most significant mosques in the city, showcasing traditional Islamic architecture with Kurdish influences.",
      overviewKu: "مزگەوتی گەورەی سلێمانی یەکێکە لە کۆنترین و گرنگترین مزگەوتەکانی شار، کە تەلارسازی نەریتی ئیسلامی لەگەڵ کاریگەری کوردی پیشان دەدات.",
      architecturalDetailsEn: [
        "Features a large prayer hall that can accommodate hundreds of worshippers",
        "Has a tall minaret visible from many parts of the city",
        "Decorated with traditional Kurdish geometric patterns",
        "Includes a central courtyard for gatherings"
      ],
      architecturalDetailsKu: [
        "هۆڵێکی گەورەی نوێژی هەیە کە دەتوانێت سەدان نوێژکەر جێگیر بکات",
        "مینارەیەکی بەرزی هەیە کە لە زۆربەی بەشەکانی شارەوە دەبینرێت",
        "بە نەخشی جیۆمەتری نەریتی کوردی ڕازێنراوەتەوە",
        "حەوشەیەکی ناوەندی بۆ کۆبوونەوە لەخۆدەگرێت"
      ],
      latitude: 35.559,
      longitude: 45.436,
      eraId: eras[2].id, // Islamic Golden Age
      regionId: regions[1].id, // Sulaymaniyah
      status: "PRESERVED",
      constructionYear: 1784,
      renovationYears: [1950, 2005],
      architectEn: "Ibrahim Ahmad Pasha",
      architectKu: "ئیبراهیم ئەحمەد پاشا",
      buildingTypeId: buildingTypes[1].id, // Mosque
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/5/53/Sulaymaniyah_Mosque.jpg",
          captionEn: "Grand Mosque of Sulaymaniyah",
          captionKu: "مزگەوتی گەورەی سلێمانی",
          isPrimary: true
        }
      ],
      sources: [
        {
          titleEn: "Sulaymaniyah Museum Documentation",
          titleKu: "بەڵگەنامەی مۆزەخانەی سلێمانی",
          url: "https://www.sulaymaniyahmuseum.org/",
          description: "Historical documentation from local museum"
        }
      ],
      materials: [
        { materialId: materials[0].id }, // Stone
        { materialId: materials[1].id }, // Brick
        { materialId: materials[5].id }  // Marble
      ]
    },
    {
      titleEn: "Delal Bridge",
      titleKu: "پردی دەلال",
      alternateNamesEn: ["Azadi Bridge"],
      alternateNamesKu: ["پردی ئازادی"],
      locationEn: "Zakho, Kurdistan Region, Iraq",
      locationKu: "زاخۆ، هەرێمی کوردستان، عێراق",
      overviewEn: "Delal Bridge is an ancient stone arch bridge spanning the Khabur River in the town of Zakho. It is a symbol of the region's rich history and architectural heritage.",
      overviewKu: "پردی دەلال پردێکی کەوانەیی بەردینی کۆنە کە ڕووباری خابووری لە شارۆچکەی زاخۆ تێدەپەڕێنێت. ئەمە هێمای مێژووی دەوڵەمەند و میراتی تەلارسازی ناوچەکەیە.",
      architecturalDetailsEn: [
        "Built using large stone blocks without mortar",
        "Features a single arch spanning approximately 30 meters",
        "Rises about 16 meters above the river",
        "Includes carved decorative elements typical of Kurdish craftsmanship"
      ],
      architecturalDetailsKu: [
        "بە بەکارهێنانی بلۆکی بەردی گەورە بێ مۆرتار دروستکراوە",
        "کەوانەیەکی تاک کە نزیکەی ٣٠ مەتر درێژ دەبێتەوە",
        "نزیکەی ١٦ مەتر لە سەروو ڕووبارەکەوە بەرز دەبێتەوە",
        "توخمی ڕازاندنەوەی هەڵکەندراوی تایبەت بە دەستکردی کوردی لەخۆ دەگرێت"
      ],
      latitude: 37.144,
      longitude: 42.686,
      eraId: eras[1].id, // Median Era
      regionId: regions[2].id, // Duhok
      status: "PRESERVED",
      constructionYear: 900,
      renovationYears: [1689, 2004],
      architectEn: "Unknown",
      architectKu: "نەزانراو",
      buildingTypeId: buildingTypes[5].id, // Bridge
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Zakho_Bridge.jpg",
          captionEn: "Historic Delal Bridge in Zakho",
          captionKu: "پردی مێژوویی دەلال لە زاخۆ",
          isPrimary: true
        }
      ],
      sources: [
        {
          titleEn: "Kurdistan Tourism Board",
          titleKu: "دەستەی گەشتیاری کوردستان",
          url: "https://kurdistantour.net/",
          description: "Official tourism information"
        }
      ],
      materials: [
        { materialId: materials[0].id } // Stone
      ]
    },
    {
      titleEn: "Taq-e Bostan",
      titleKu: "تاقی بۆستان",
      alternateNamesEn: ["Arch of the Garden"],
      alternateNamesKu: ["کەوانەی باخچە"],
      locationEn: "Kermanshah, Iran",
      locationKu: "کرماشان، ئێران",
      overviewEn: "Taq-e Bostan is a series of large rock reliefs from the era of the Sassanid Empire, carved around the 4th century CE. The carvings depict royal hunting scenes and the investiture ceremonies of Sassanid kings.",
      overviewKu: "تاقی بۆستان زنجیرەیەک لە نەخشی بەرجەستەی گەورەی بەردینە لە سەردەمی ئیمپراتۆریەتی ساسانی، کە لە دەوروبەری سەدەی چوارەمی زایینی هەڵکەندراوە. نەخشەکان دیمەنی ڕاوی شاهانە و ڕێوڕەسمی دامەزراندنی پاشاکانی ساسانی پیشان دەدەن.",
      architecturalDetailsEn: [
        "Features two large grottoes (ivans) cut into the cliff face",
        "Contains detailed rock reliefs of Sassanid kings and hunting scenes",
        "Includes a large panel showing the royal hunt",
        "Decorated with intricate carvings of boars, deer, and other animals"
      ],
      architecturalDetailsKu: [
        "دوو ئەشکەوتی گەورە (ئیڤان) کە لە ڕووی هەڵدێر بڕدراون",
        "نەخشی بەرجەستەی وردی پاشاکانی ساسانی و دیمەنی ڕاو لەخۆدەگرێت",
        "پانێڵێکی گەورە لەخۆدەگرێت کە ڕاوی شاهانە پیشان دەدات",
        "بە هەڵکەندنی ئاڵۆزی بەراز، ئاسک و ئاژەڵی تر ڕازێندراوەتەوە"
      ],
      latitude: 34.388,
      longitude: 47.116,
      eraId: eras[0].id, // Ancient Mesopotamian (closest match)
      regionId: regions[3].id, // Kermanshah
      status: "PRESERVED",
      constructionYear: 350,
      renovationYears: [1990, 2015],
      architectEn: "Sassanid Royal Artisans",
      architectKu: "هونەرمەندانی شاهانەی ساسانی",
      buildingTypeId: buildingTypes[4].id, // Monument
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Taq-e_Bostan_Kermanshah_Iran.jpg",
          captionEn: "Main grotto at Taq-e Bostan",
          captionKu: "ئەشکەوتی سەرەکی لە تاقی بۆستان",
          isPrimary: true
        }
      ],
      sources: [
        {
          titleEn: "UNESCO Tentative List",
          titleKu: "لیستی کاتیی یونسکۆ",
          url: "https://whc.unesco.org/en/tentativelists/5188/",
          description: "UNESCO documentation on Taq-e Bostan"
        }
      ],
      materials: [
        { materialId: materials[0].id } // Stone
      ]
    },
    {
      titleEn: "Sherwana Castle",
      titleKu: "قەڵای شێروانە",
      alternateNamesEn: ["Kela Shirwana"],
      alternateNamesKu: ["کێلا شیروانە"],
      locationEn: "Kalar, Kurdistan Region, Iraq",
      locationKu: "کەلار، هەرێمی کوردستان، عێراق",
      overviewEn: "Sherwana Castle is a historic castle in Kalar, built in the 18th century as the headquarters for the Jaff tribe, one of the largest Kurdish tribes. The castle showcases traditional Kurdish architectural elements.",
      overviewKu: "قەڵای شێروانە قەڵایەکی مێژووییە لە کەلار، کە لە سەدەی هەژدەیەم وەک بارەگای هۆزی جاف، یەکێک لە گەورەترین هۆزەکانی کورد دروستکراوە. قەڵاکە توخمە تەلارسازییە کوردییە نەریتییەکان پیشان دەدات.",
      architecturalDetailsEn: [
        "Built on a rectangular plan with four towers at the corners",
        "Features a central courtyard surrounded by rooms",
        "Constructed using local stone, mud, and wooden beams",
        "Includes decorative elements in the Kurdish architectural style"
      ],
      architecturalDetailsKu: [
        "لەسەر پلانێکی لاکێشەیی بە چوار قوللە لە گۆشەکان دروستکراوە",
        "حەوشەیەکی ناوەندی لەخۆ دەگرێت کە ژوورەکان دەوریان داوە",
        "بە بەکارهێنانی بەردی ناوچەیی، قوڕ و کاریتەی دار دروستکراوە",
        "توخمی ڕازاندنەوە بە شێوازی تەلارسازی کوردی لەخۆ دەگرێت"
      ],
      latitude: 34.619,
      longitude: 45.320,
      eraId: eras[3].id, // Ottoman Period
      regionId: regions[1].id, // Sulaymaniyah (closest)
      status: "RESTORED",
      constructionYear: 1734,
      renovationYears: [1990, 2010],
      architectEn: "Unknown",
      architectKu: "نەزانراو",
      buildingTypeId: buildingTypes[0].id, // Castle/Citadel
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/6/61/Sherwana_Castle.jpg",
          captionEn: "Sherwana Castle exterior",
          captionKu: "دەرەوەی قەڵای شێروانە",
          isPrimary: true
        }
      ],
      sources: [
        {
          titleEn: "Kurdistan Board of Tourism",
          titleKu: "دەستەی گەشتیاری کوردستان",
          url: "https://kurdistantourism.net/",
          description: "Official tourism information"
        }
      ],
      materials: [
        { materialId: materials[0].id }, // Stone
        { materialId: materials[2].id }, // Wood
        { materialId: materials[3].id }  // Mud
      ]
    },
    {
      titleEn: "Anahita Temple",
      titleKu: "پەرستگای ئەناهیتا",
      alternateNamesEn: ["Temple of Anahita", "Kangavar Temple"],
      alternateNamesKu: ["پەرستگەی ئەناهیتا", "پەرستگەی کەنگاوەر"],
      locationEn: "Kangavar, Kermanshah Province, Iran",
      locationKu: "کەنگاوەر، پارێزگای کرماشان، ئێران",
      overviewEn: "The Anahita Temple is an ancient stone structure dedicated to the Iranian goddess Anahita, dating back to the Parthian era. It showcases the architectural style of both Persian and Hellenic influences in the Kurdish region.",
      overviewKu: "پەرستگای ئەناهیتا بینایەکی بەردینی کۆنە کە تەرخانکراوە بۆ خواوەندی ئێرانی ئەناهیتا، کە بۆ سەردەمی پارتی دەگەڕێتەوە. شێوازی تەلارسازی کاریگەری فارسی و یۆنانی لە ناوچەی کوردی پیشان دەدات.",
      architecturalDetailsEn: [
        "Built on a large stone platform with massive columns",
        "Features a complex water management system for ritual purification",
        "Constructed using precisely cut limestone blocks",
        "Incorporates both Persian and Greek architectural elements"
      ],
      architecturalDetailsKu: [
        "لەسەر سەکۆیەکی بەردینی گەورە بە ستوونی زەبەلاح دروستکراوە",
        "سیستەمێکی ئاڵۆزی بەڕێوەبردنی ئاو بۆ پاککردنەوەی ئایینی لەخۆدەگرێت",
        "بە بەکارهێنانی بلۆکی بەردی هەکاری بە وردی بڕدراو دروستکراوە",
        "توخمی تەلارسازی فارسی و یۆنانی تێکەڵ دەکات"
      ],
      latitude: 34.505,
      longitude: 47.965,
      eraId: eras[0].id, // Ancient Mesopotamian
      regionId: regions[3].id, // Kermanshah
      status: "RUINS",
      constructionYear: -200,
      renovationYears: [1997],
      architectEn: "Unknown",
      architectKu: "نەزانراو",
      buildingTypeId: buildingTypes[4].id, // Monument
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Temple_of_Anahita_in_Kangavar.jpg",
          captionEn: "Ruins of the Anahita Temple",
          captionKu: "کاولبووەکانی پەرستگای ئەناهیتا",
          isPrimary: true
        }
      ],
      sources: [
        {
          titleEn: "Iranian Cultural Heritage Organization",
          titleKu: "ڕێکخراوی میراتی کولتووری ئێران",
          url: "https://www.ichto.ir",
          description: "Official documentation on the Anahita Temple"
        }
      ],
      materials: [
        { materialId: materials[0].id } // Stone
      ]
    },
    {
      titleEn: "Ahmad Khani Mosque",
      titleKu: "مزگەوتی ئەحمەدی خانی",
      alternateNamesEn: ["Ishakpasha Mosque"],
      alternateNamesKu: ["مزگەوتی ئیسحاق پاشا"],
      locationEn: "Doğubayazıt, Ağrı Province, Turkey",
      locationKu: "دۆغوبەیازید، پارێزگای ئاگری، تورکیا",
      overviewEn: "The Ahmad Khani Mosque is a historic mosque built in the 17th century, named after the famous Kurdish poet and scholar Ahmad Khani. It is an excellent example of Ottoman-era Kurdish architectural style.",
      overviewKu: "مزگەوتی ئەحمەدی خانی مزگەوتێکی مێژووییە کە لە سەدەی حەڤدەیەم دروستکراوە، ناونراوە بە ناوی شاعیر و زانای ناوداری کورد ئەحمەدی خانی. نموونەیەکی باشە لە شێوازی تەلارسازی کوردی سەردەمی عوسمانی.",
      architecturalDetailsEn: [
        "Features a single dome and a tall minaret",
        "Contains intricate stone carvings and calligraphy",
        "Built using local stone with decorative elements",
        "Includes a central prayer hall and a courtyard"
      ],
      architecturalDetailsKu: [
        "گومبەزێکی تاک و مینارەیەکی بەرزی هەیە",
        "هەڵکەندنی بەردینی ئاڵۆز و خۆشنووسی لەخۆدەگرێت",
        "بە بەکارهێنانی بەردی ناوچەیی لەگەڵ توخمی ڕازاندنەوە دروستکراوە",
        "هۆڵێکی ناوەندی نوێژ و حەوشەیەک لەخۆدەگرێت"
      ],
      latitude: 39.547,
      longitude: 44.088,
      eraId: eras[3].id, // Ottoman Period
      regionId: regions[0].id, // Closest available region
      status: "PRESERVED",
      constructionYear: 1680,
      renovationYears: [1970, 2008],
      architectEn: "Ishak Pasha",
      architectKu: "ئیسحاق پاشا",
      buildingTypeId: buildingTypes[1].id, // Mosque
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Ahmad_Khani_Mosque.jpg",
          captionEn: "Ahmad Khani Mosque with its distinctive minaret",
          captionKu: "مزگەوتی ئەحمەدی خانی لەگەڵ مینارەی تایبەتی",
          isPrimary: true
        }
      ],
      sources: [
        {
          titleEn: "Turkish Ministry of Culture and Tourism",
          titleKu: "وەزارەتی کولتوور و گەشتیاری تورکیا",
          url: "https://www.kulturturizm.gov.tr/",
          description: "Official documentation on historical mosques"
        }
      ],
      materials: [
        { materialId: materials[0].id }, // Stone
        { materialId: materials[5].id }  // Marble
      ]
    }
  ];

  for (const buildingData of buildings) {
    // Extract the related entity data
    const { images, sources, materials, ...buildingInfo } = buildingData;
    
    try {
      // Create the building
      const building = await prisma.building.create({
        data: buildingInfo
      });
      
      console.log(`Created building: ${buildingData.titleEn}`);
      
      // Create the images
      for (const imageData of images) {
        await prisma.image.create({
          data: {
            ...imageData,
            buildingId: building.id
          }
        });
      }
      console.log(`- Added ${images.length} images`);
      
      // Create the sources
      for (const sourceData of sources) {
        await prisma.source.create({
          data: {
            ...sourceData,
            buildingId: building.id
          }
        });
      }
      console.log(`- Added ${sources.length} sources`);
      
      // Create the material relationships
      for (const material of materials) {
        await prisma.buildingsOnMaterials.create({
          data: {
            buildingId: building.id,
            materialId: material.materialId
          }
        });
      }
      console.log(`- Added ${materials.length} materials`);
      
    } catch (error) {
      console.error(`Failed to create building ${buildingData.titleEn}:`, error);
    }
  }
}

// Execute the seeding function
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client
    await prisma.$disconnect();
  });