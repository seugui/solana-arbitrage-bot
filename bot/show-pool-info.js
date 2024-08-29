import { fetchSolanaCoingeckoTokenData } from './coingecko-api.js'; 
import { fetchRaydiumPoolDataByMints } from './raydium-api.js';
import { fetchOrcaPoolDataByMints } from './orca-api.js'; // Import the Orca API function
import { fetchMeteoraPoolDataByMints } from './meteora-api.js'; // Import the Meteora API function

async function displayApiResponse() {
  try {
    // Get token mint addresses from environment variables
    const tokenOneMintAddress = process.env.TOKEN_ONE;
    const tokenTwoMintAddress = process.env.TOKEN_TWO;
    
    // Fetch the token data from the CoinGecko API
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

    // Define your TVL threshold
    const tvlThreshold = 100000;

    // Extract and filter the data array by TVL
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
    const orcaPools = await fetchOrcaPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);

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

    // Fetch the data from the Meteora API
    const meteoraPools = await fetchMeteoraPoolDataByMints(tokenOneMintAddress, tokenTwoMintAddress);

    // Filter Meteora pools by TVL
    const filteredMeteoraPools = meteoraPools.filter(pool => parseFloat(pool.pool_tvl) >= tvlThreshold);

    // Prepare a structured array for logging filtered Meteora pool data
    const meteoraTable = filteredMeteoraPools.map(pool => {
      // Extract USD values and amounts
      const [usdAmountA, usdAmountB] = pool.pool_token_usd_amounts;
      const [amountA, amountB] = pool.pool_token_amounts;

      // Calculate token prices
      const priceTokenA = parseFloat(usdAmountA) / parseFloat(amountA);
      const priceTokenB = parseFloat(usdAmountB) / parseFloat(amountB);

      return {
        id: pool.pool_address,
        price: priceTokenB.toFixed(2) ?? 'N/A',
        tokenA: pool.pool_name,
        tokenB: pool.pool_name,
        tvl: parseFloat(pool.pool_tvl)?.toFixed(2) ?? 'N/A',
        source: 'Meteora' // Indicate the source of the data
      };
    });

    // Combine Raydium, Orca, and Meteora data into a single array
    const combinedTable = [...raydiumTable, ...orcaTable, ...meteoraTable];

    // Log combined data in a tabular format
    console.table(combinedTable);
    
  } catch (error) {
    console.error('Error fetching or displaying data:', error.message || error);
  }
}

// Call the function to display the data
displayApiResponse();
