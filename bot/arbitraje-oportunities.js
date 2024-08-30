import { fetchSolanaCoingeckoTokenData } from './coingecko-api.js'; 
import { fetchRaydiumPoolDataByMints } from './raydium-api.js';
import { fetchOrcaPoolDataByMints } from './orca-api.js'; 
import { fetchMeteoraPoolDataByMints } from './meteora-api.js'; 

async function displayApiResponse() {
  try {
    const tokenOneMintAddress = process.env.TOKEN_ONE; 
    const tokenTwoMintAddress = process.env.TOKEN_TWO;
    
    // Fetch the token data from the CoinGecko API
    const tokenData = await fetchSolanaCoingeckoTokenData(tokenOneMintAddress);
    if (tokenData) {
      const tokenTable = {
        symbol: tokenData.symbol,
        name: tokenData.name,
        currentPriceUSD: tokenData.market_data.current_price_usd,
        volume24hUSD: tokenData.market_data.total_volume_usd || 'N/A'
      };
      console.table([tokenTable]);
    } else {
      console.log('Failed to fetch token information.');
    }

    // Fetch the data from the Raydium API
    const raydiumResponse = await fetchRaydiumPoolDataByMints(
      'all', 
      'default', 
      'desc', 
      1000, 
      1
    );
    const tvlThreshold = 50000;
    const filteredRaydiumPools = raydiumResponse.data.data.filter(pool => pool.tvl >= tvlThreshold);
    const raydiumTable = filteredRaydiumPools.map(pool => ({
      id: pool.id,
      price: pool.price?.toFixed(2) ?? 'N/A',
      tokenA: pool.mintA.address,
      tokenB: pool.mintB.address,
      tvl: pool.tvl?.toFixed(2) ?? 'N/A',
      source: 'Raydium'
    }));

    // Fetch the data from the Orca API
    const orcaPools = await fetchOrcaPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);
    const filteredOrcaPools = orcaPools.filter(pool => pool.tvl >= tvlThreshold);
    const orcaTable = filteredOrcaPools.map(pool => ({
      id: pool.address,
      price: pool.price?.toFixed(2) ?? 'N/A',
      tokenA: pool.tokenA.mint,
      tokenB: pool.tokenB.mint,
      tvl: pool.tvl?.toFixed(2) ?? 'N/A',
      source: 'Orca'
    }));

    // Fetch the data from the Meteora API
    const meteoraPools = await fetchMeteoraPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);
    const filteredMeteoraPools = meteoraPools.filter(pool => parseFloat(pool.pool_tvl) >= tvlThreshold);
    const meteoraTable = filteredMeteoraPools.map(pool => {
      const [usdAmountB, usdAmountA] = pool.pool_token_usd_amounts;
      const [amountB, amountA] = pool.pool_token_amounts;
      const [mintB, mintA] = pool.pool_token_mints;
      const tokenA = mintA;
      const tokenB = mintB;
      const priceTokenA = parseFloat(usdAmountA) / parseFloat(amountA);
      const priceTokenB = parseFloat(usdAmountB) / parseFloat(amountB);
      return {
        id: pool.pool_address,
        price: priceTokenA.toFixed(2) ?? 'N/A',
        tokenA: tokenA,
        tokenB: tokenB,
        tvl: parseFloat(pool.pool_tvl)?.toFixed(2) ?? 'N/A',
        source: 'Meteora'
      };
    });

    // Combine Raydium, Orca, and Meteora data into a single array
    const combinedTable = [...raydiumTable, ...orcaTable, ...meteoraTable];

    // Ensure that all pools are included and sorted by price in descending order
    combinedTable.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    console.table(combinedTable);

    // Find the best arbitrage opportunity
    const bestOpportunity = findBestArbitrageOpportunity(combinedTable);

    // Display the best opportunity along with pools involved
    if (bestOpportunity) {
      console.table([bestOpportunity.opportunity]);
      console.table(bestOpportunity.pools);
    } else {
      console.log('No arbitrage opportunities found.');
    }
    
  } catch (error) {
    console.error('Error fetching or displaying data:', error.message || error);
  }
}

// Function to find the best arbitrage opportunity from a combined table
function findBestArbitrageOpportunity(combinedTable) {
  const priceMap = new Map();
  const opportunities = [];

  combinedTable.forEach(pool => {
    const key = `${pool.tokenA}-${pool.tokenB}`;
    const currentPrice = parseFloat(pool.price);

    if (priceMap.has(key)) {
      const { minPricePool, maxPricePool } = priceMap.get(key);

      if (currentPrice < parseFloat(minPricePool.price)) {
        priceMap.set(key, { minPricePool: pool, maxPricePool });
      }
      if (currentPrice > parseFloat(maxPricePool.price)) {
        priceMap.set(key, { minPricePool, maxPricePool: pool });
      }

      const minPrice = parseFloat(priceMap.get(key).minPricePool.price);
      const maxPrice = parseFloat(priceMap.get(key).maxPricePool.price);
      const priceDifference = maxPrice - minPrice;
      if (priceDifference > 0) {
        opportunities.push({
          opportunity: {
            tokenA: priceMap.get(key).minPricePool.tokenA,
            tokenB: priceMap.get(key).minPricePool.tokenB,
            priceA: minPrice,
            priceB: maxPrice,
            priceDifference,
            source: `Arbitrage Opportunity`
          },
          pools: [
            { ...priceMap.get(key).minPricePool, source: priceMap.get(key).minPricePool.source },
            { ...priceMap.get(key).maxPricePool, source: priceMap.get(key).maxPricePool.source }
          ]
        });
      }
    } else {
      priceMap.set(key, { minPricePool: pool, maxPricePool: pool });
    }
  });

  if (opportunities.length === 0) {
    return null;
  }

  return opportunities.reduce((best, current) => {
    return (current.opportunity.priceDifference > best.opportunity.priceDifference) ? current : best;
  });
}

// Call the function to display the data
displayApiResponse();
