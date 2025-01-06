import { fetchQuote } from '../jupiter-api.js'; // Import the fetchQuote function
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test the fetchQuote function
async function displayQuoteResults() {
  try {
    // Use environment variables for inputMint, outputMint, and amount
    const inputMint = process.env.TOKEN_ONE; // SOL mint
    const outputMint = process.env.TOKEN_TWO; // USDC mint
    const amount = '1000000000'; // Amount in lamports (1 SOL = 1,000,000 lamports)

    // Call the function
    const result = await fetchQuote(inputMint, outputMint, amount);

    // Log the full result
    console.log('Function Result:', JSON.stringify(result, null, 2));

    // Alternatively, log specific parts of the result if needed
    if (result?.bestQuote) {
      console.log('Best Quote:', JSON.stringify(result.bestQuote, null, 2));
    } else {
      console.log('No best quote found in the result.');
    }
  } catch (error) {
    console.error('Error during function test:', error.message || error);
  }
}

// Execute the function to display the data
displayQuoteResults();
