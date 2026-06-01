import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb-inspired palette (see DESIGN.md)
        rausch: {
          DEFAULT: '#ff385c',
          active: '#e00b41',
          disabled: '#ffd1da',
        },
        ink: '#222222',
        body: '#3f3f3f',
        muted: {
          DEFAULT: '#6a6a6a',
          soft: '#929292',
        },
        hairline: {
          DEFAULT: '#dddddd',
          soft: '#ebebeb',
          strong: '#c1c1c1',
        },
        canvas: '#ffffff',
        surface: {
          soft: '#f7f7f7',
          strong: '#f2f2f2',
        },
        'error-text': '#c13515',
        'legal-link': '#428bff',
        // Brand tokens remapped to the new system (kept for backward compatibility)
        brand: {
          green: '#222222', // ink — dark surfaces & text
          amber: '#ff385c', // rausch — single accent / primary CTA
          cream: '#ffffff', // canvas — white page floor
        },
      },
      fontFamily: {
        display: ['Inter', 'Circular', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Circular', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        float: 'rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0',
      },
    },
  },
  plugins: [],
}

export default config
