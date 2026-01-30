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
        // Terminal backgrounds
        'base': '#0a0a0b',
        'panel': '#111113',
        'input': '#18181b',
        'hover': '#1f1f23',

        // Text
        'primary': '#fafafa',
        'secondary': '#a1a1aa',
        'muted': '#71717a',
        'disabled': '#3f3f46',

        // Semantic
        'green': '#22c55e',
        'green-dim': '#16a34a',
        'red': '#ef4444',
        'red-dim': '#dc2626',
        'amber': '#f59e0b',
        'amber-dim': '#d97706',

        // Borders
        'border': '#27272a',
        'border-strong': '#3f3f46',

        // Legacy aliases
        'pear-dark': '#0a0a0b',
        'pear-panel': '#111113',
        'pear-lime': '#f59e0b',
        'war-deep': '#0a0a0b',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'none': '0',
        DEFAULT: '0',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
    },
  },
  plugins: [],
};
export default config;
