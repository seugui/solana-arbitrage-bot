import { fetchSolanaCoingeckoTokenData } from './coingecko-api.js'; 
import { fetchRaydiumPoolDataByMints } from './raydium-api.js';
import { fetchOrcaPoolDataByMints } from './orca-api.js'; // Import the Orca API function

async function displayApiResponse() {
  try {
    // Fetch the token data from the CoinGecko API
    const tokenOneMintAddress = process.env.TOKEN_ONE; // Use the appropriate mint address
    const tokenData = await fetchSolanaCoingeckoTokenData(tokenOneMintAddress);

    if (tokenData) {
      // Prepare a structured object for the token data
      const tokenTable = {
        symbol: tokenData.symbol,
        name: tokenData.name,
        currentPriceUSD: tokenData.market_data.current_price_usd,
        volume24hUSD: tokenData.market_data.total_volume_usd || 'N/A'
      };

      // Display the token data in a table format
      console.table([tokenTable]);
    } else {
      console.log('Failed to fetch token information.');
    }

    // Fetch the data from the Raydium API
    const raydiumResponse = await fetchRaydiumPoolDataByMints(
      'all',          // poolType
      'default',      // poolSortField
      'desc',         // sortType
      1000,           // pageSize
      1               // page
    );

    // Extract and filter the data array by TVL
    const tvlThreshold = 50000; // Set your TVL threshold here
    const filteredRaydiumPools = raydiumResponse.data.data.filter(pool => pool.tvl >= tvlThreshold);

    // Prepare a structured array for logging Raydium data
    const raydiumTable = filteredRaydiumPools.map(pool => ({
        id: pool.id,
        price: pool.price?.toFixed(2) ?? 'N/A',
        tokenA: pool.mintA.symbol,
        tokenB: pool.mintB.symbol,
        tvl: pool.tvl?.toFixed(2) ?? 'N/A',
        source: 'Raydium' // Indicate the source of the data
    }));

    // Fetch the data from the Orca API
    const orcaPools = await fetchOrcaPoolDataByMints(process.env.TOKEN_ONE, process.env.TOKEN_TWO);

    // Filter Orca pools by TVL
    const filteredOrcaPools = orcaPools.filter(pool => pool.tvl >= tvlThreshold);

    // Prepare a structured array for logging filtered Orca pool data
    const orcaTable = filteredOrcaPools.map(pool => ({
        id: pool.address,
        price: pool.price?.toFixed(2) ?? 'N/A',
        tokenA: pool.tokenA.symbol === 'SOL' ? 'WSOL' : pool.tokenA.symbol, // Replace 'SOL' with 'WSOL'
        tokenB: pool.tokenB.symbol,
        tvl: pool.tvl?.toFixed(2) ?? 'N/A',
        source: 'Orca' // Indicate the source of the data
    }));

    // Combine Raydium and Orca data into a single array
    const combinedTable = [...raydiumTable, ...orcaTable];

    // Sort the combined data by price in descending order
    combinedTable.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceB - priceA; // Descending order
    });

    // Log combined data in a tabular format
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
  // Create a map to store the best and worst prices for each token pair
  const priceMap = new Map();
  const opportunities = [];

  combinedTable.forEach(pool => {
    const key = `${pool.tokenA}-${pool.tokenB}`;
    const currentPrice = parseFloat(pool.price);

    if (priceMap.has(key)) {
      const { minPricePool, maxPricePool } = priceMap.get(key);

      // Update the min and max price pools if needed
      if (currentPrice < parseFloat(minPricePool.price)) {
        priceMap.set(key, { minPricePool: pool, maxPricePool });
      }
      if (currentPrice > parseFloat(maxPricePool.price)) {
        priceMap.set(key, { minPricePool, maxPricePool: pool });
      }

      // Calculate the price difference and store the opportunity if there's a positive difference
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
      // Initialize the price map with the first pool for this token pair
      priceMap.set(key, { minPricePool: pool, maxPricePool: pool });
    }
  });

  // Find the best opportunity (highest price difference)
  if (opportunities.length === 0) {
    return null;
  }

  return opportunities.reduce((best, current) => {
    return (current.opportunity.priceDifference > best.opportunity.priceDifference) ? current : best;
  });
}

// Call the function to display the data
displayApiResponse();
