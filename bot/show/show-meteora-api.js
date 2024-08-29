import { fetchOrcaPoolDataByMints } from '../orca-api.js'; // Adjust the path accordingly

async function displayOrcaPoolData() {
  try {
    // Fetch the filtered pool data
    const filteredPools = await fetchOrcaPoolDataByMints(
      process.env.TOKEN_ONE,  // Get tokenA mint from .env
      process.env.TOKEN_TWO   // Get tokenB mint from .env
    );

    // Log a summary of the filtered pools to avoid exceeding the buffer size
    if (filteredPools.length === 0) {
      console.log('No pools found for the given tokens.');
    } else {
      console.log(`Total Pools Found: ${filteredPools.length}`);
      
      // Optionally log a few examples if the data is too large
      filteredPools.slice(0, 5).forEach(pool => {
        console.log(JSON.stringify(pool, null, 2));
      });
      
      // Inform the user if there are more pools not shown
      if (filteredPools.length > 5) {
        console.log('... and more pools. Displayed the first 5 pools.');
      }
    }

  } catch (error) {
    console.error('Error displaying Orca pool data:', error.message || error);
  }
}

// Execute the function to display the data
displayOrcaPoolData();