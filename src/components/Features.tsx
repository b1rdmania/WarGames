export function Features() {
  const features = [
    {
      title: 'Leveraged Pairs',
      description: 'Trade narrative outcomes with 3x leverage via Pear Protocol',
      icon: '📈',
    },
    {
      title: 'Multi-Chain',
      description: 'Bridge from Ethereum, Arbitrum, Base, or Optimism via LI.FI',
      icon: '🌉',
    },
    {
      title: 'Instant Settlement',
      description: 'Open and close positions on-demand with market execution',
      icon: '⚡',
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-pear-panel border border-pear-lime/20 rounded-lg p-6 hover:border-pear-lime/40 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
