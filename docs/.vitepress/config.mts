import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'WAR.MARKET',
  description: 'Trade narratives, not tickers.',

  srcExclude: ['_archive/**'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Docs', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'App', link: 'https://war.market' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'What is war.market', link: '/guide/' },
            { text: 'How it works', link: '/guide/how-it-works' },
            { text: 'Your first trade', link: '/guide/first-trade' },
          ]
        },
        {
          text: 'Markets',
          items: [
            { text: 'Understanding markets', link: '/guide/markets' },
            { text: 'Geopolitical', link: '/guide/markets-geopolitical' },
            { text: 'Crypto', link: '/guide/markets-crypto' },
          ]
        },
        {
          text: 'Trading',
          items: [
            { text: 'Placing trades', link: '/guide/trading' },
            { text: 'Managing positions', link: '/guide/positions' },
            { text: 'Risk', link: '/guide/risk' },
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/b1rdmania/WarGames' },
      { icon: 'x', link: 'https://x.com/b1rdmania' }
    ],

    footer: {
      message: 'Trade the tension.',
      copyright: '© 2026 war.market'
    }
  }
})
