// show-function-results.js
import { fetchRaydiumPoolDataByMints } from '../raydium-api.js'; // Note the .js extension

// Test the function
async function displayRadyumPoolData() {
    try {
      const result = await fetchRaydiumPoolDataByMints(
        'all',          // poolType
        'default',      // poolSortField
        'desc',         // sortType
        1000,           // pageSize
        1               // page
      );
  
      // Log the full result
      console.log('Function Result:', JSON.stringify(result, null, 2));
      
      // Alternatively, log specific parts of the result if needed
      console.log('Result Data:', JSON.stringify(result.data, null, 2));
    } catch (error) {
      console.error('Error during function test:', error.message || error);
    }
  }
  
// Run the test
displayRadyumPoolData();