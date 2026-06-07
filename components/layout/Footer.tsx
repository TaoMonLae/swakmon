import Link from 'next/link'
import { getContactUrl } from '@/lib/utils'
import { t, translateName } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

const CATEGORIES = [
  { href: '/browse/rent', label: 'Property Rent' },
  { href: '/browse/sale', label: 'Property Sale' },
  { href: '/browse/land', label: 'Land Sale' },
  { href: '/browse/moto', label: 'Motorcycles' },
]

const STATES = [
  { href: '/browse/all?state=mon-state', label: 'Mon State' },
  { href: '/browse/all?state=karen-state', label: 'Karen State' },
  { href: '/browse/all?state=thanintharyi', label: 'Thanintharyi Region' },
]

export function Footer() {
  const locale = getLocale()
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+95XXXXXXXXXX'
  const viber = process.env.NEXT_PUBLIC_VIBER_NUMBER ?? '+95XXXXXXXXXX'
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://facebook.com/swakmonmm'
  const email = process.env.NEXT_PUBLIC_EMAIL ?? 'ads@swakmon.com.mm'

  return (
    <footer className="border-t border-hairline bg-canvas text-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-xl font-semibold text-rausch">
              Swak Mon သွက်မန်
            </p>
            <p className="mt-2 text-sm text-muted">
              {t('footer.description', locale)}
            </p>
          </div>

          {/* Categories */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">
              {t('footer.categories', locale)}
            </p>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-muted transition hover:text-ink hover:underline">
                    {translateName(cat.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* States */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">
              {t('footer.states', locale)}
            </p>
            <ul className="space-y-2 text-sm">
              {STATES.map((state) => (
                <li key={state.href}>
                  <Link href={state.href} className="text-muted transition hover:text-ink hover:underline">
                    {translateName(state.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">
              {t('footer.contact', locale)}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={getContactUrl('whatsapp', whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-ink hover:underline"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={getContactUrl('viber', viber)}
                  className="text-muted transition hover:text-ink hover:underline"
                >
                  Viber
                </a>
              </li>
              <li>
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-ink hover:underline"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-muted transition hover:text-ink hover:underline"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal band */}
        <p className="mt-10 border-t border-hairline pt-6 text-center text-xs text-muted">
          {t('footer.copyright', locale)}
        </p>
      </div>
    </footer>
  )
}
