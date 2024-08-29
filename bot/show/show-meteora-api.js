import { fetchMeteoraPoolDataByMints } from '../meteora-api.js'; // Adjust the path accordingly

async function displayMeteoraPoolData() {
  try {
    // Fetch the filtered pool data from Meteora API
    const filteredPools = await fetchMeteoraPoolDataByMints(
      process.env.TOKEN_ONE,  // Get tokenA mint from .env
      process.env.TOKEN_TWO   // Get tokenB mint from .env
    );

    // Log a summary of the filtered pools to avoid exceeding the buffer size
    if (filteredPools.length === 0) {
      console.log('No pools found for the given tokens.');
    } else {
      console.log(`Total Pools Found: ${filteredPools.length}`);
      
      // Prepare the Meteora table data
      const meteoraTable = filteredPools.map(pool => ({
        id: pool.pool_address,
        price: parseFloat(pool.pool_lp_price_in_usd)?.toFixed(2) ?? 'N/A',
        tokenA: pool.pool_name,
        tokenB: pool.pool_name,
        tvl: parseFloat(pool.pool_tvl)?.toFixed(2) ?? 'N/A',
        source: 'Meteora' // Indicate the source of the data
      }));

      // Log a few examples if the data is too large
      console.table(meteoraTable.slice(0, 50)); // Display the first 5 entries
      
      if (filteredPools.length > 50) {
        console.log('... and more pools. Displayed the first 5 pools.');
      }
    }

  } catch (error) {
    console.error('Error displaying Meteora pool data:', error.message || error);
  }
}

// Execute the function to display the data
displayMeteoraPoolData();
