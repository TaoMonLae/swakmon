import {
  PrismaClient,
  PriceType,
  ListingStatus,
  ListingTier,
  CommissionType,
} from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { MYANMAR_STATES } from './myanmar-locations'

const prisma = new PrismaClient()


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function upsertTownship(name: string, stateId: number) {
  const existing = await prisma.township.findFirst({ where: { name, stateId } })
  if (existing) return existing
  return prisma.township.create({ data: { name, stateId } })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Seeding Swak Mon သွက်မန် database…')

  // ── Admin User ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@swakmon.mm' },
    update: { password: hashedPassword, name: 'Swak Mon သွက်မန် Admin' },
    create: {
      email: 'admin@swakmon.mm',
      password: hashedPassword,
      name: 'Swak Mon သွက်မန် Admin',
      role: 'admin',
    },
  })
  console.log('  ✓ Admin user')

  // ── Categories ──────────────────────────────────────────────────────────────
  const [catRent, catSale, catLand, catMoto] = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'rent' },
      update: { name: 'Property Rent', icon: 'ti-home', order: 1 },
      create: { name: 'Property Rent', slug: 'rent', icon: 'ti-home', order: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'sale' },
      update: { name: 'Property Sale', icon: 'ti-building', order: 2 },
      create: { name: 'Property Sale', slug: 'sale', icon: 'ti-building', order: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'land' },
      update: { name: 'Land Sale', icon: 'ti-trees', order: 3 },
      create: { name: 'Land Sale', slug: 'land', icon: 'ti-trees', order: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'moto' },
      update: { name: 'Motorcycles', icon: 'ti-motorbike', order: 4 },
      create: { name: 'Motorcycles', slug: 'moto', icon: 'ti-motorbike', order: 4 },
    }),
  ])
  console.log('  ✓ Categories')

  // ── States / Regions + Townships ──────────────────────────────────────────
  // Seed every Myanmar state, region and union territory along with all of its
  // townships so that admins can assign any location to a listing.
  const stateBySlug = new Map<string, { id: number; name: string; slug: string }>()
  const townshipByKey = new Map<string, { id: number; name: string; stateId: number }>()

  for (const s of MYANMAR_STATES) {
    const state = await prisma.state.upsert({
      where: { slug: s.slug },
      update: { name: s.name },
      create: { name: s.name, slug: s.slug },
    })
    stateBySlug.set(s.slug, state)

    const townships = await Promise.all(
      s.townships.map((name) => upsertTownship(name, state.id))
    )
    for (const t of townships) {
      townshipByKey.set(`${s.slug}:${t.name}`, t)
    }
  }
  console.log(`  ✓ States & Regions (${MYANMAR_STATES.length})`)
  console.log(`  ✓ Townships (${townshipByKey.size})`)

  // Named state/township references used by the sample listings below.
  const monState = stateBySlug.get('mon-state')!
  const karenState = stateBySlug.get('karen-state')!
  const thaninState = stateBySlug.get('thanintharyi')!

  const tw = {
    mawlamyine: townshipByKey.get('mon-state:Mawlamyine')!,
    thaton: townshipByKey.get('mon-state:Thaton')!,
    hpaAn: townshipByKey.get('karen-state:Hpa-An')!,
    myawaddy: townshipByKey.get('karen-state:Myawaddy')!,
    dawei: townshipByKey.get('thanintharyi:Dawei')!,
  }


  // ── Sample Listings ─────────────────────────────────────────────────────────

  type ListingUpsertData = Parameters<typeof prisma.listing.upsert>[0]

  const listings: ListingUpsertData[] = [
    {
      where: { listingRef: 'TM-00001' },
      update: {},
      create: {
        listingRef: 'TM-00001',
        title: '2-Bedroom House near Kyaikthanlan Pagoda',
        description: [
          'Comfortable 2-bedroom house located just a 5-minute walk from the iconic Kyaikthanlan Pagoda in central Mawlamyine.',
          'The property features a spacious living room, a modern kitchen, and a private yard suitable for a family.',
          'Utilities including water and electricity are separately metered. Street parking is available directly in front.',
          'Ideal for professionals or small families seeking a quiet, well-connected neighbourhood in Mon State\'s capital city.',
        ].join(' '),
        price: 350_000,
        priceLabel: '350,000/mo',
        priceType: PriceType.MONTHLY,
        status: ListingStatus.ACTIVE,
        tier: ListingTier.FEATURED,
        isFreeUntilSold: false,
        categoryId: catRent.id,
        stateId: monState.id,
        townshipId: tw.mawlamyine.id,
        images: [
          { url: 'https://picsum.photos/800/600?random=1', publicId: 'seed-1' },
          { url: 'https://picsum.photos/800/600?random=2', publicId: 'seed-2' },
        ],
      },
    },

    {
      where: { listingRef: 'TM-00002' },
      update: {},
      create: {
        listingRef: 'TM-00002',
        title: 'Flat Land 2 Acres — Hpa-An Town',
        description: [
          'Two acres of level, cleared land situated on the outskirts of Hpa-An Town with direct road frontage.',
          'The plot has been surveyed and all title documentation is in order, making it ready for immediate purchase.',
          'Suitable for residential development, commercial construction, or agricultural use given its fertile soil.',
          'Just 15 minutes from Hpa-An bus station, with electricity and municipal water supply available at the plot boundary.',
        ].join(' '),
        price: 45_000_000,
        priceLabel: '45,000,000',
        priceType: PriceType.FIXED,
        status: ListingStatus.ACTIVE,
        tier: ListingTier.BASIC,
        isFreeUntilSold: false,
        categoryId: catLand.id,
        stateId: karenState.id,
        townshipId: tw.hpaAn.id,
        images: [
          { url: 'https://picsum.photos/800/600?random=3', publicId: 'seed-3' },
          { url: 'https://picsum.photos/800/600?random=4', publicId: 'seed-4' },
        ],
      },
    },

    {
      where: { listingRef: 'TM-00003' },
      update: {},
      create: {
        listingRef: 'TM-00003',
        title: 'Honda Wave 125i 2022 — Like New',
        description: [
          '2022 model Honda Wave 125i in excellent condition with only 8,000 km on the odometer.',
          'Original factory paint (pearl white), no accidents, recently serviced with oil change and new brake pads.',
          'Both original keys present along with full registration paperwork and transfer documents ready.',
          'Selling due to owner relocating abroad; serious buyers only — price is firm at 2,800,000 MMK.',
        ].join(' '),
        price: 2_800_000,
        priceLabel: '2,800,000',
        priceType: PriceType.FIXED,
        status: ListingStatus.ACTIVE,
        tier: ListingTier.BASIC,
        isFreeUntilSold: false,
        categoryId: catMoto.id,
        stateId: monState.id,
        townshipId: tw.thaton.id,
        images: [
          { url: 'https://picsum.photos/800/600?random=5', publicId: 'seed-5' },
          { url: 'https://picsum.photos/800/600?random=6', publicId: 'seed-6' },
        ],
      },
    },

    {
      where: { listingRef: 'TM-00004' },
      update: {},
      create: {
        listingRef: 'TM-00004',
        title: '2-Storey Shophouse for Sale, Dawei Town',
        description: [
          'Prime 2-storey shophouse in the heart of Dawei Town on a high-footfall commercial street.',
          'Ground floor is currently operating as a retail space (250 sq ft); upper floor has 3 rooms used as a residential apartment.',
          'The property sits on a 40×60 ft plot with a clean land title (Form 7) and no encumbrances.',
          'An outstanding investment opportunity in Thanintharyi Region\'s growing regional capital — viewings welcome by appointment.',
        ].join(' '),
        price: 120_000_000,
        priceLabel: '120,000,000',
        priceType: PriceType.FIXED,
        status: ListingStatus.ACTIVE,
        tier: ListingTier.PREMIUM,
        isFreeUntilSold: false,
        categoryId: catSale.id,
        stateId: thaninState.id,
        townshipId: tw.dawei.id,
        images: [
          { url: 'https://picsum.photos/800/600?random=7', publicId: 'seed-7' },
          { url: 'https://picsum.photos/800/600?random=8', publicId: 'seed-8' },
        ],
      },
    },

    {
      where: { listingRef: 'TM-00005' },
      update: {},
      create: {
        listingRef: 'TM-00005',
        title: '3-Acre Agricultural Land on Myawaddy Road',
        description: [
          'Three acres of fertile agricultural land with direct access to the Myawaddy–Kawkareik main road in Karen State.',
          'The land is currently planted with teak saplings (approx. 3 years old) and has a small seasonal stream on the northern boundary.',
          'Title documentation (Form 105) is clear and the land can be transferred within 30 days of agreement.',
          'Seller is open to reasonable offers; commission of 3% applies on the final agreed sale price.',
          'Suitable for farming, plantation, or future residential subdivision subject to local authority approval.',
        ].join(' '),
        price: null,
        priceLabel: 'Negotiable',
        priceType: PriceType.NEGOTIABLE,
        status: ListingStatus.ACTIVE,
        tier: ListingTier.BASIC,
        isFreeUntilSold: true,
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 3.0,
        categoryId: catLand.id,
        stateId: karenState.id,
        townshipId: tw.myawaddy.id,
        images: [
          { url: 'https://picsum.photos/800/600?random=9', publicId: 'seed-9' },
          { url: 'https://picsum.photos/800/600?random=10', publicId: 'seed-10' },
        ],
      },
    },
  ]

  for (const data of listings) {
    await prisma.listing.upsert(data)
  }
  console.log('  ✓ Sample listings (TM-00001 → TM-00005)')

  console.log('\n✅ Seed complete.')
  if (process.env.NODE_ENV !== 'production') {
    console.log('   Admin login : admin@swakmon.mm')
    console.log('   Password    : admin123')
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
