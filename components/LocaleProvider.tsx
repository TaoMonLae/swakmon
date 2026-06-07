'use client'

import React, { createContext, useContext } from 'react'
import { Locale } from '@/lib/i18n'

const LocaleContext = createContext<Locale>('en')

export function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}
