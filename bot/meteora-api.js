import axios from 'axios';

export async function fetchMeteoraPoolDataByMints(tokenAMint, tokenBMint) {
  if (!tokenAMint || !tokenBMint) {
    throw new Error('Both tokenAMint and tokenBMint must be provided.');
  }

  try {
    // Fetch the data from the Meteora API
    const response = await axios.get('https://amm-v2.meteora.ag/pools');
    const pools = response.data; // The response is directly an array of pool objects

    // Ensure pools is an array
    if (!Array.isArray(pools)) {
      throw new Error('Unexpected API response structure.');
    }

    // Filter the pools by tokenA and tokenB mints
    const filteredPools = pools.filter(pool =>
      pool.pool_token_mints.includes(tokenAMint) &&
      pool.pool_token_mints.includes(tokenBMint)
    );

    // Return the filtered pools
    return filteredPools;
  } catch (error) {
    // Log the error and rethrow it
    console.error('Error fetching Meteora pool data:', error.message);
    throw error;
  }
}
