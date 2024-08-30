import { fetchSolanaCoingeckoTokenData } from './coingecko-api.js'; // Note the .js extension
import fs from 'fs'; // Node.js file system module
import path from 'path'; // Node.js path module

// Function to fetch and save JSON results for multiple tokens
export async function fetchAndSaveTokensData() { // Export the function
  try {
    // Collect all token environment variables dynamically
    const tokens = Object.keys(process.env)
      .filter(key => key.startsWith('TOKEN_'))
      .map(key => process.env[key])
      .filter(Boolean); // Filters out any undefined or empty values

    if (tokens.length === 0) {
      console.log('No tokens provided.');
      return;
    }

    // Fetch data for each token
    const tokenDataArray = await Promise.all(tokens.map(async (token) => {
      try {
        const data = await fetchSolanaCoingeckoTokenData(token);
        return data;
      } catch (error) {
        console.error(`Error fetching data for token: ${token}`, error.message || error);
        return null; // Return null if there's an error fetching data
      }
    }));

    // Determine the directory where save-json.js is located
    const currentDirectory = path.dirname(new URL(import.meta.url).pathname);

    // Set the path for the JSON file
    const filePath = path.join(currentDirectory, 'tokens-data.json');

    // Save the fetched data to the JSON file in the specified directory
    fs.writeFileSync(filePath, JSON.stringify(tokenDataArray, null, 2));

  } catch (error) {
    console.error('Error fetching or saving tokens:', error.message || error);
  }
}

// Execute the function to fetch, save, and display token data if the script is run directly
if (import.meta.url === new URL('file://' + process.argv[1]).href) {
    fetchAndSaveTokensData();
}
