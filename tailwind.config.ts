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
        // Terminal theme (single source of truth)
        'pear-dark': '#0a0a0a',
        'pear-panel': '#121212',
        'pear-panel-light': '#171717',
        'pear-lime': '#02ff81',
        'pear-lime-light': '#7dffc2',
        'pear-gray': '#a0a0a0',
        'pear-gray-dark': '#717171',
        'pear-accent': '#334128',
      },
      fontFamily: {
        sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
