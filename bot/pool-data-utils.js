// pool-data-utils.js

// Function to standardize pool data
export function standardizePoolData(pools, source) {
    return pools.map(pool => {
      let id;
      let price;
      let tvl;
  
      switch (source) {
        case 'Raydium':
          id = pool.id;
          price = pool.price?.toFixed(2) ?? 'N/A';
          tvl = pool.tvl?.toFixed(2) ?? 'N/A';
          break;
  
        case 'Orca':
          id = pool.address;
          price = pool.price?.toFixed(2) ?? 'N/A';
          tvl = pool.tvl?.toFixed(2) ?? 'N/A';
          break;
  
        case 'Meteora':
          id = pool.pool_address;
          const [usdAmountB, usdAmountA] = pool.pool_token_usd_amounts;
          const [amountB, amountA] = pool.pool_token_amounts;
          const priceTokenA = parseFloat(usdAmountA) / parseFloat(amountA);
          price = isNaN(priceTokenA) ? 'N/A' : priceTokenA.toFixed(2);
          tvl = parseFloat(pool.pool_tvl)?.toFixed(2) ?? 'N/A';
          break;
  
        default:
          id = 'N/A';
          price = 'N/A';
          tvl = 'N/A';
          break;
      }
  
      return {
        id,
        price,
        tvl,
        source
      };
    });
  }
  