import axios from 'axios';

export async function fetchRaydiumPoolInfoByMultipleMints(
  mint1,
  mint2,
  poolType = 'all',
  poolSortField = 'default',
  sortType = 'desc',
  pageSize = 1000,
  page = 1
) {
  try {
    const params = {
      mint1,
      mint2,
      poolType,
      poolSortField,
      sortType,
      pageSize,
      page,
    };

    const response = await axios.get('https://api-v3.raydium.io/pools/info/mint', { params });

    if (!response.data.success) {
      throw new Error(`Error fetching pool data: ${response.data.message}`);
    }

    const poolData = response.data.data;

    return poolData;
  } catch (error) {
    console.error('Error fetching pool data:', error);
    throw error;
  }
}

// Sample Test Case (Limited as it relies on external API)
(async () => {
    try {
      const exampleMintAddress = "So11111111111111111111111111111111111111112";
      const { mint, metadata } = await fetchRaydiumPoolInfoByMultipleMints(exampleMintAddress);
      console.log("Mint:", mint.publicKey);
      console.log("Name:", metadata.name);
      console.log("Symbol:", metadata.symbol);
    } catch (error) {
      console.error("Error during test:", error);
    }
  })();