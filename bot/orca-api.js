import axios from 'axios';

export async function fetchOrcaPoolDataByMints(tokenAMint, tokenBMint) {
  if (!tokenAMint || !tokenBMint) {
        throw new Error('Both tokenAMint and tokenBMint must be provided.');
  }

  try {
    // Fetch the data from the Orca API
    const { data } = await axios.get('https://api.mainnet.orca.so/v1/whirlpool/list');

    // Extract the whirlpools data
    const pools = data.whirlpools;

    // Filter the pools by tokenA and tokenB mints
    const filteredPools = pools.filter(pool =>
      (pool.tokenA.mint === tokenAMint && pool.tokenB.mint === tokenBMint) ||
      (pool.tokenA.mint === tokenBMint && pool.tokenB.mint === tokenAMint)
    );

    // Return the filtered pools
    return filteredPools;
  } catch (error) {
    console.error('Error fetching Orca pool data:', error.message);
    throw error;
  }
}
