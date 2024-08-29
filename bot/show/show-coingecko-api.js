// show-function-results.js
import { fetchSolanaCoingeckoTokenData } from '../coingecko-api.js'; // Note the .js extension

const mintAddress = "So11111111111111111111111111111111111111112";

fetchSolanaCoingeckoTokenData(mintAddress)
  .then(data => {
    if (data) {
      console.log('Symbol:', data.symbol);
      console.log('Name:', data.name);
      console.log('Current price (USD):', data.market_data.current_price_usd);
      console.log('Total value locked (USD):', data.market_data.total_value_locked_usd);
      console.log('Mcap to TVL ratio:', data.market_data.mcap_to_tvl_ratio);
      // Additional logging if needed
    } else {
      console.log('Failed to fetch token information.');
    }
  });