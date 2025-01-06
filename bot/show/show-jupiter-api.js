import { fetchQuote } from '../jupiter-api.js'; // Import the fetchQuote function
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Path to the JSON file
const dexesFilePath = './dexes.json';

async function displayQuoteResults() {
  try {
    // Use environment variables for inputMint, outputMint, and amount
    const inputMint = process.env.TOKEN_ONE; // SOL mint
    const outputMint = process.env.TOKEN_TWO; // USDC mint
    const amount = process.env.AMOUNT; // Amount in lamports (1 SOL = 1,000,000 lamports)
    const onlyDirectRoutes = 'true'; // Direct Routes
    const swapMode = 'ExactIn'; // Swap Mode

    // Load the JSON file and extract all DEX names
    const dexesData = JSON.parse(fs.readFileSync(dexesFilePath, 'utf8'));
    const dexNames = Object.values(dexesData); // Extract all DEX names

    console.log(`Using DEXes: ${dexNames.join(', ')}`);

    // Array to store results for table display
    const tableData = [];

    // Loop through each DEX and fetch the quote
    for (const dexName of dexNames) {
      try {
        const result = await fetchQuote(inputMint, outputMint, amount, onlyDirectRoutes, swapMode, dexName);

        if (result && result.outAmount) {
          // Extract key details for the table
          const route = result.routePlan?.[0]?.swapInfo || {};
          tableData.push({
            DEX: dexName,
            "Input Mint": "Sol", // Masking Input Mint
            "Output Mint": "USDC", // Masking Output Mint
            "In Amount": (result.inAmount / 1_000_000_000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Out Amount": parseFloat((result.outAmount / 1_000_000).toFixed(6)), // Numeric value for sorting
            "Price Impact (%)": parseFloat(result.priceImpactPct).toFixed(4), // Limit to 4 decimals
            "AMM Key": route.ammKey || "N/A",
          });
        }
      } catch (error) {
        console.error(`Error fetching quote for ${dexName}:`, error.message || error);
      }
    }

    // Sort the table data by 'Out Amount' in ascending order
    tableData.sort((a, b) => a["Out Amount"] - b["Out Amount"]);

    // Display the collected data as a table
    console.table(tableData);
  } catch (error) {
    console.error('Critical error during function test:', error.message || error);
  }
}

// Execute the function to display the data
displayQuoteResults();
