import axios from 'axios';

export async function fetchMeteoraPoolDataByMints(tokenAMint, tokenBMint) {
  if (!tokenAMint || !tokenBMint) {
    throw new Error('Both tokenAMint and tokenBMint must be provided.');
  }

  try {
    // Fetch the data from the Meteora API
    const { data } = await axios.get('https://amm-v2.meteora.ag/pools');

    // Extract the pool data
    const pools = data.pools;

    // Filter the pools by tokenA and tokenB mints
    const filteredPools = pools.filter(pool =>
      pool.pool_token_mints.includes(tokenAMint) &&
      pool.pool_token_mints.includes(tokenBMint)
    );

    // Return the filtered pools
    return filteredPools;
  } catch (error) {
    console.error('Error fetching Meteora pool data:', error.message);
    throw error;
  }
}
