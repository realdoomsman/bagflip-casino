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
        dark: {
          bg: '#0a0e13',
          panel: '#0d1117',
        },
        neon: {
          green: '#10b981',
          blue: '#06b6d4',
          purple: '#8b5cf6',
        },
        text: {
          primary: '#ffffff',
          secondary: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
export default config
