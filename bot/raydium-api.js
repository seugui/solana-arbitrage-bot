import axios from 'axios';

// Enhanced function to fetch full API response with better logging
export async function fetchRaydiumPoolInfoByMultipleMints(
  poolType = 'all',
  poolSortField = 'default',
  sortType = 'desc',
  pageSize = 1000,
  page = 1
) {
  // Get mint values from environment variables
  const mint1 = process.env.TOKEN_ONE;
  const mint2 = process.env.TOKEN_TWO;

  // Validate that mint1 and mint2 are provided
  if (!mint1 || !mint2) {
    throw new Error('Both mint1 and mint2 must be defined in the .env file.');
  }

  const params = {
    mint1,
    mint2,
    poolType,
    poolSortField,
    sortType,
    pageSize,
    page,
  };

  try {
    // Make the API request
    const response = await axios.get('https://api-v3.raydium.io/pools/info/mint', { params });

    // Return the full response from the API
    return response.data;
  } catch (error) {
    console.error('Error fetching pool data:', error.message || error);
    throw new Error(`Failed to fetch pool data: ${error.message || error}`);
  }
}

