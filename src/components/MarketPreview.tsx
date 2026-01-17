export function MarketPreview({ onConnect }: { onConnect: () => void }) {
  const markets = [
    {
      id: 'flippening',
      name: 'The Flippening',
      description: 'Will ETH overtake BTC in market cap?',
      pairs: 'ETH vs BTC',
      trend: '+2.4%',
    },
    {
      id: 'ai-bubble',
      name: 'AI Bubble Pop',
      description: 'Are AI stock valuations sustainable?',
      pairs: 'QQQ vs NVDA',
      trend: '-1.2%',
    },
    {
      id: 'japan-awakens',
      name: 'Japan Awakens',
      description: 'Will Japan end 30 years of stagnation?',
      pairs: 'EWJ vs SPY',
      trend: '+0.8%',
    },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-transparent to-pear-panel/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Active Markets
          </h2>
          <p className="text-gray-400 text-lg">
            Choose your narrative and place your bet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div
              key={market.id}
              className="relative bg-pear-panel-light border border-pear-lime/20 rounded-lg p-6 hover:border-pear-lime/40 transition-all group cursor-pointer"
              onClick={onConnect}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{market.name}</h3>
                <span
                  className={`text-sm font-mono ${
                    market.trend.startsWith('+') ? 'text-pear-lime' : 'text-red-400'
                  }`}
                >
                  {market.trend}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">{market.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">{market.pairs}</span>
                <span className="text-xs text-pear-lime font-bold">3x Leverage</span>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-pear-lime/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-pear-lime font-bold">Connect to Trade →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
