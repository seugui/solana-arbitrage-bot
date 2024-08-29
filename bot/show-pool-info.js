import { fetchSolanaCoingeckoTokenData } from './coingecko-api.js'; 
import { fetchRaydiumPoolInfoByMultipleMints } from './raydium-api.js';
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
    const raydiumResponse = await fetchRaydiumPoolInfoByMultipleMints(
      'all',          // poolType
      'default',      // poolSortField
      'desc',         // sortType
      1000,           // pageSize
      1               // page
    );

    // Extract and filter the data array by TVL
    const tvlThreshold = 10000; // Set your TVL threshold here
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
        tokenA: pool.tokenA.symbol,
        tokenB: pool.tokenB.symbol,
        tvl: pool.tvl?.toFixed(2) ?? 'N/A',
        source: 'Orca' // Indicate the source of the data
    }));

    // Combine Raydium and Orca data into a single array
    const combinedTable = [...raydiumTable, ...orcaTable];

    // Log combined data in a tabular format
    console.table(combinedTable);
    
  } catch (error) {
    console.error('Error fetching or displaying data:', error.message || error);
  }
}

// Call the function to display the data
displayApiResponse();
