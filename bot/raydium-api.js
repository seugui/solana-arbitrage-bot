import axios from 'axios';

// Enhanced function to fetch Raydium pool data by mint addresses
export async function fetchRaydiumPoolDataByMints(
  mint1,
  mint2,
  poolType = 'all',
  poolSortField = 'default',
  sortType = 'desc',
  pageSize = 1000,
  page = 1
) {
  if (!mint1 || !mint2) {
    throw new Error('Both mint1 and mint2 must be provided.');
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
    return response.data;
  } catch (error) {
    console.error('Error fetching Raydium pool data:', error.message || error);
    throw new Error(`Failed to fetch Raydium pool data: ${error.message || error}`);
  }
}
