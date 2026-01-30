import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // war.market brand colors
        'war': {
          'deep': '#0e0e10',
          'warm': '#18171c',
          'surface': '#222127',
          'elevated': '#2c2a32',
        },
        'brand': {
          'amber': '#f97316',
          'amber-dim': '#c2590e',
          'gold': '#fbbf24',
          'gray': '#4a4752',
        },
        'text': {
          'primary': '#e8e6ed',
          'secondary': '#a8a3b3',
          'muted': '#6b6879',
          'disabled': '#3d3a45',
        },
        'status': {
          'profit': '#22c55e',
          'profit-dim': '#16a34a',
          'loss': '#ef4444',
          'loss-dim': '#dc2626',
          'warning': '#eab308',
          'info': '#3b82f6',
        },
        'border': {
          'DEFAULT': '#37343e',
          'subtle': '#2a2830',
          'focus': '#f97316',
        },
        // Legacy aliases for gradual migration
        'pear-dark': '#0e0e10',
        'pear-panel': '#18171c',
        'pear-panel-light': '#222127',
        'pear-lime': '#f97316',
        'pear-lime-light': '#fbbf24',
        'pear-gray': '#a8a3b3',
        'pear-gray-dark': '#6b6879',
        'pear-accent': '#c2590e',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
