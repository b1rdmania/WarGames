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
        // Pear Protocol Branding
        'pear-dark': '#060902',
        'pear-panel': '#0e140f',
        'pear-panel-light': '#141c15',
        'pear-lime': '#a2db5c',
        'pear-lime-light': '#bde689',
        'pear-gray': '#a0a0a0',
        'pear-gray-dark': '#717171',
        'pear-accent': '#334128',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Fragment Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
