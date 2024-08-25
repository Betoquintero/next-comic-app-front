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
        'marvel-red': '#EC1D24',
        'light-red': '#e4979a',
        'dc-blue': '#0078F0',
        'light-blue': '#0078F0',
        'dark-grey': '#1E1F21',
        'light-grey': '#f5f4f4',
      },
      backgroundImage: {
        'dc-background': "url('/img/background-img-dc.jpg')",
        'marvel-background': "url('/img/background-img-marvel.jpg')",
        'mixed-background': "url('/img/marvel-dc-home.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
