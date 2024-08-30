// show-function-results.js
import { fetchSolanaCoingeckoTokenData } from '../coingecko-api.js'; // Note the .js extension

// Test the function
async function displayCoingeckoData() {
  try {
    const result = await fetchSolanaCoingeckoTokenData(process.env.TOKEN_ONE);

    // Log the full result
    console.log('Function Result:', JSON.stringify(result, null, 2));
    
    // Alternatively, log specific parts of the result if needed
    console.log('Result Data:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error('Error during function test:', error.message || error);
  }
}

// Execute the function to display the data
displayCoingeckoData();