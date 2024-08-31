import { format } from 'date-fns';
import { fetchRaydiumPoolDataByMints } from './raydium-api.js';
import { fetchOrcaPoolDataByMints } from './orca-api.js';
import { fetchMeteoraPoolDataByMints } from './meteora-api.js';
import { extractAssetDetails } from './parse-save-json.js';
import { standardizePoolData } from './pool-data-utils.js'; // Import the function

// Constants
const TVL_THRESHOLD = 50000;
const REFRESH_INTERVAL = 60000; // 60 seconds

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
  } catch (error) {
    console.error('Error fetching or displaying data:', error.message || error);
  }
}

// Initial call to display the data immediately
displayApiResponse();
