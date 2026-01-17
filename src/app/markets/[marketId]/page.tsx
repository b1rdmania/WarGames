import MarketDetailClientWrapper from './MarketDetailClientWrapper';

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ marketId: string }>;
}) {
  const { marketId } = await params;
  return <MarketDetailClientWrapper marketId={marketId} />;
}

