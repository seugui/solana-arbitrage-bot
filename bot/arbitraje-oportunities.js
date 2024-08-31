import { format } from 'date-fns';
import { fetchRaydiumPoolDataByMints } from './raydium-api.js';
import { fetchOrcaPoolDataByMints } from './orca-api.js';
import { fetchMeteoraPoolDataByMints } from './meteora-api.js';
import { extractAssetDetails } from './parse-save-json.js';
import { standardizePoolData } from './pool-data-utils.js'; // Import the function

// Constants
const TVL_THRESHOLD = 50000;

// Function to process pools with filtering and formatting
function processPools(pools, tokenOneData, tokenTwoData) {
  return pools
    .filter(pool => parseFloat(pool.tvl) >= TVL_THRESHOLD) // Ensure that tvl is a number for comparison
    .map(pool => ({
      id: pool.id,
      price: pool.price,
      tokenA: tokenOneData.symbol,
      tokenB: tokenTwoData.symbol,
      tvl: pool.tvl,
      source: pool.source
    }));
}

// Main function to fetch, process, and display data
async function displayApiResponse() {
  console.clear(); // Clear the console at the start of each run
  const lastRunTime = new Date();
  const formattedDate = format(lastRunTime, 'yyyy-MM-dd HH:mm:ss');
  console.log(`Last run: ${formattedDate}`);

  try {
    const tokenOneMintAddress = process.env.TOKEN_ONE; 
    const tokenTwoMintAddress = process.env.TOKEN_TWO;

    // Fetch token data
    const tokenOneData = await extractAssetDetails(tokenOneMintAddress);
    const tokenTwoData = await extractAssetDetails(tokenTwoMintAddress);

    if (!tokenOneData || !tokenTwoData) {
      console.log('Failed to fetch token information.');
      return;
    }

    console.table([{
      symbol: tokenOneData.symbol,
      name: tokenOneData.name,
      price: tokenOneData.price
    }]);

    // Fetch and process Raydium pool data
    const raydiumResponse = await fetchRaydiumPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);
    const raydiumPools = standardizePoolData(raydiumResponse.data.data, 'Raydium');
    const raydiumTable = processPools(raydiumPools, tokenOneData, tokenTwoData);

    // Fetch and process Orca pool data
    const orcaPools = await fetchOrcaPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);
    const standardizedOrcaPools = standardizePoolData(orcaPools, 'Orca');
    const orcaTable = processPools(standardizedOrcaPools, tokenOneData, tokenTwoData);

    // Fetch and process Meteora pool data
    const meteoraPools = await fetchMeteoraPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);
    const standardizedMeteoraPools = standardizePoolData(meteoraPools, 'Meteora');
    const meteoraTable = processPools(standardizedMeteoraPools, tokenOneData, tokenTwoData);

    // Combine and sort data
    const combinedTable = [...raydiumTable, ...orcaTable, ...meteoraTable];
    combinedTable.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    console.table(combinedTable);

    // Find and display the best arbitrage opportunity
    const bestOpportunity = findBestArbitrageOpportunity(combinedTable);
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

  return opportunities.length ? opportunities.reduce((best, current) => 
    current.opportunity.priceDifference > best.opportunity.priceDifference ? current : best
  ) : null;
}

// Initial call to display the data immediately
displayApiResponse();

// Optionally, schedule the function to run periodically (e.g., every 60 seconds)
// setInterval(displayApiResponse, 60000);
