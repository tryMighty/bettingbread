import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PriceTicker() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketPrices'],
    queryFn: async () => {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,toncoin,cardano,avalanche-2,tron,spdr-s-p-500-etf-trust&vs_currencies=usd&include_24hr_change=true'
      );
      return res.data;
    },
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 2,
  });

  if (isLoading) {
    return <div className="text-tx-muted text-sm">Loading live market...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">Market data unavailable</div>;
  }

  const assets = [
    { id: 'bitcoin', symbol: 'BTC' },
    { id: 'ethereum', symbol: 'ETH' },
    { id: 'solana', symbol: 'SOL' },
    { id: 'binancecoin', symbol: 'BNB' },
    { id: 'ripple', symbol: 'XRP' },
    { id: 'dogecoin', symbol: 'DOGE' },
    { id: 'toncoin', symbol: 'TON' },
    { id: 'cardano', symbol: 'ADA' },
    { id: 'avalanche-2', symbol: 'AVAX' },
    { id: 'tron', symbol: 'TRX' },
    { id: 'spdr-s-p-500-etf-trust', symbol: 'SPY' },
  ];

  return (
    <div className="flex items-center gap-[44px] whitespace-nowrap pl-[28px] animate-tscroll">
      {assets.map((asset) => {
        const priceData = data?.[asset.id];
        if (!priceData) return null;

        const price = priceData.usd.toLocaleString();
        const change = priceData.usd_24h_change;
        const isPositive = change > 0;

        return (
          <div key={asset.id} className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-[13px] text-white">{asset.symbol}</span>
              <span className="font-semibold text-tx opacity-60 uppercase">${price}</span>
            </div>

            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-cash' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>

            <div className="w-[5px] h-[5px] rounded-full bg-br-mid shrink-0"></div>
          </div>
        );
      })}

      {/* Duplicate for seamless infinite scroll */}
      {assets.map((asset) => {
        const priceData = data?.[asset.id];
        if (!priceData) return null;

        const price = priceData.usd.toLocaleString();
        const change = priceData.usd_24h_change;
        const isPositive = change > 0;

        return (
          <div key={`dup-${asset.id}`} className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-[13px] text-white">{asset.symbol}</span>
              <span className="font-semibold text-tx opacity-60 uppercase">${price}</span>
            </div>

            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-cash' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>

            <div className="w-[5px] h-[5px] rounded-full bg-br-mid shrink-0"></div>
          </div>
        );
      })}
    </div>
  );
}