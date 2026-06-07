import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { t, translateName, Locale } from '@/lib/i18n'
import { getLocale as getServerLocale } from '@/lib/i18n-server'

export const metadata: Metadata = { title: 'Post Your Ad | Swak Mon သွက်မန်' }

const STEPS = [
  { n: '1', titleKey: 'post.step1.title', descKey: 'post.step1.desc' },
  { n: '2', titleKey: 'post.step2.title', descKey: 'post.step2.desc' },
  { n: '3', titleKey: 'post.step3.title', descKey: 'post.step3.desc' },
]

interface TierConfig {
  tier: string
  label: string
  basePrice: number
  unit: string
  active: boolean
}

const DEFAULT_TIER_CONFIG: TierConfig[] = [
  { tier: 'BASIC',    label: 'Basic',    basePrice: 0,     unit: 'free',     active: true },
  { tier: 'FEATURED', label: 'Featured', basePrice: 5000,  unit: 'per week', active: true },
  { tier: 'PREMIUM',  label: 'Premium',  basePrice: 12000, unit: 'per week', active: true },
]

const TIER_FEATURES: Record<string, string[]> = {
  BASIC:    ['Standard search position', 'Live within 24 hours', 'Up to 3 photos'],
  FEATURED: ['Top of category results', 'Featured badge', 'Up to 10 photos', 'Priority review'],
  PREMIUM:  ['Homepage spotlight', 'All categories top', 'Up to 20 photos', 'Social media share'],
}

function formatPrice(tier: TierConfig, locale: Locale): string {
  if (tier.tier === 'BASIC' || tier.basePrice === 0) return t('post.tiers.free', locale)
  const basePriceFormatted = tier.basePrice.toLocaleString()
  return locale === 'my'
    ? `${basePriceFormatted} ကျပ် / ${t('post.tiers.per_week', locale)}`
    : `${basePriceFormatted} MMK/${tier.unit.replace('per ', '')}`
}

export default async function PostAdPage() {
  const locale = getServerLocale()

  // Load persisted pricing config (falls back to defaults if not yet saved).
  const config = await prisma.pricingConfig
    .findUnique({ where: { id: 'global' } })
    .catch(() => null)

  const tierConfig: TierConfig[] = config
    ? (config.tiers as unknown as TierConfig[])
    : DEFAULT_TIER_CONFIG

  // Only show active tiers on the public page.
  const activeTiers = tierConfig.filter((t) => t.active)

  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+95XXXXXXXXXX'
  const waClean   = waNumber.replace(/\D/g, '')
  const waMsg     = encodeURIComponent('Hi, I want to post a listing on Swak Mon သွက်မန်')
  const viberNumber = process.env.NEXT_PUBLIC_VIBER_NUMBER ?? '+95XXXXXXXXXX'
  const fbUrl     = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://facebook.com/swakmonmm'
  const phone     = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '+95XXXXXXXXXX'
  const email     = process.env.NEXT_PUBLIC_EMAIL ?? 'ads@swakmon.com.mm'

  const checklistItems = [
    t('post.checklist.item1', locale),
    t('post.checklist.item2', locale),
    t('post.checklist.item3', locale),
    t('post.checklist.item4', locale),
    t('post.checklist.item5', locale),
    t('post.checklist.item6', locale),
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* 1. BREADCRUMB + HEADER */}
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-green">{t('browse.breadcrumb.home', locale)}</Link></li>
          <li><span className="mx-1">›</span></li>
          <li className="text-gray-700">{t('nav.postad', locale)}</li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-brand-green">
        {t('post.title', locale)}
      </h1>
      <p className="mt-2 text-gray-600">
        {t('post.desc', locale)}
      </p>

      {/* 2. HOW IT WORKS */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.n} className="relative flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
              {step.n}
            </div>
            <p className="mt-3 text-sm font-bold text-gray-900">{t(step.titleKey, locale)}</p>
            <p className="mt-1 text-xs text-gray-500">{t(step.descKey, locale)}</p>
            {i < STEPS.length - 1 && (
              <div className="absolute right-0 top-5 hidden -translate-y-1/2 translate-x-1/2 text-gray-300 sm:block">
                <i className="ti ti-arrow-right text-xl" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. TWO-COLUMN MAIN CONTENT */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[3fr_2fr]">
        {/* LEFT – Contact methods */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('post.team.title', locale)}</h2>

          {/* WhatsApp - primary card */}
          <a
            href={`https://wa.me/${waClean}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-4 rounded-xl border-2 border-green-500 bg-white p-5 transition hover:shadow-md"
          >
            <i className="ti ti-brand-whatsapp text-3xl text-green-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-900">WhatsApp</p>
              <p className="text-sm text-gray-500">{waNumber}</p>
            </div>
            <span className="absolute right-3 top-3">
              <Badge variant="featured">{t('post.team.recommended', locale)}</Badge>
            </span>
          </a>

          {/* Viber + Facebook side by side */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={`viber://chat?number=${viberNumber}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md"
            >
              <i className="ti ti-phone text-2xl text-violet-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Viber</p>
                <p className="text-xs text-gray-500">{viberNumber}</p>
              </div>
            </a>
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md"
            >
              <i className="ti ti-brand-facebook text-2xl text-blue-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('post.team.fb_page', locale)}</p>
                <p className="text-xs text-gray-500 truncate">swakmonmm</p>
              </div>
            </a>
          </div>

          {/* Text links */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Call/SMS: <a href={`tel:${phone}`} className="text-brand-green hover:underline">{phone}</a></span>
            <span>Email: <a href={`mailto:${email}`} className="text-brand-green hover:underline">{email}</a></span>
          </div>

          {/* Info box */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <i className="ti ti-clock text-base" aria-hidden="true" />
            {t('post.team.reply_time', locale)}
          </div>
        </div>

        {/* RIGHT – What to include */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('post.checklist.title', locale)}</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <ul className="space-y-3">
              {checklistItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <i className="ti ti-check mt-0.5 text-base text-green-600 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. LISTING TYPE SECTION */}
      <section className="mt-14">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">{t('post.tiers.title', locale)}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {activeTiers.map((tier) => {
            const isFeatured = tier.tier === 'FEATURED'
            return (
              <div
                key={tier.tier}
                className={`rounded-xl border p-5 ${
                  isFeatured
                    ? 'border-brand-amber bg-brand-amber/5 ring-1 ring-brand-amber/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{translateName(tier.label, locale)}</p>
                  {isFeatured && <Badge variant="featured">{t('post.tiers.popular', locale)}</Badge>}
                </div>
                <p className="mt-1 text-lg font-bold text-brand-green">{formatPrice(tier, locale)}</p>
                <ul className="mt-3 space-y-1.5">
                  {(TIER_FEATURES[tier.tier] ?? []).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="ti ti-check text-green-500" aria-hidden="true" />
                      {translateName(f, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
