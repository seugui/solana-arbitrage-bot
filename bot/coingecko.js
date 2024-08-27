import axios from 'axios';

/**
 * Fetches token data for a given Solana mint address from CoinGecko.
 * 
 * @param {string} mintAddress - The mint address of the Solana token.
 * @returns {Promise<object|null>} - The extracted token data or null in case of error.
 */
export async function fetchSolanaCoingeckoTokenData(mintAddress) {
  const url = `https://api.coingecko.com/api/v3/coins/solana/contract/${mintAddress}`;

  try {
    const { data } = await axios.get(url);

    // Extract and transform specific fields from the API response
    const {
      id,
      symbol,
      name,
      asset_platform_id,
      platforms,
      detail_platforms,
      block_time_in_minutes,
      hashing_algorithm,
      categories,
      preview_listing,
      public_notice,
      additional_notices,
      localization,
      description,
      links,
      image,
      country_origin,
      genesis_date,
      sentiment_votes_up_percentage,
      sentiment_votes_down_percentage,
      market_cap_rank,
      market_data,
      community_data,
      developer_data,
      last_updated,
      tickers
    } = data;

    return {
      id,
      symbol,
      name,
      asset_platform_id,
      platforms,
      detail_platforms,
      block_time_in_minutes,
      hashing_algorithm,
      categories,
      preview_listing,
      public_notice,
      additional_notices,
      localization,
      description: description.en || description, // Fallback to the whole description if 'en' not available
      links,
      image,
      country_origin,
      genesis_date,
      sentiment_votes_up_percentage,
      sentiment_votes_down_percentage,
      market_cap_rank,
      market_data: {
        current_price_usd: market_data.current_price?.usd ?? null,
        total_value_locked_usd: market_data.total_value_locked?.usd ?? null,
        mcap_to_tvl_ratio: market_data.mcap_to_tvl_ratio,
        fdv_to_tvl_ratio: market_data.fdv_to_tvl_ratio,
        market_cap_usd: market_data.market_cap?.usd ?? null,
        fully_diluted_valuation_usd: market_data.fully_diluted_valuation?.usd ?? null,
        total_volume_usd: market_data.total_volume?.usd ?? null,
        high_24h_usd: market_data.high_24h?.usd ?? null,
        low_24h_usd: market_data.low_24h?.usd ?? null,
        ath_usd: market_data.ath?.usd ?? null,
        atl_usd: market_data.atl?.usd ?? null,
        price_change_24h_usd: market_data.price_change_24h?.usd ?? null,
        price_change_percentage_24h: market_data.price_change_percentage_24h,
        total_supply: market_data.total_supply,
        max_supply: market_data.max_supply,
        circulating_supply: market_data.circulating_supply,
      },
      community_data: {
        facebook_likes: community_data?.facebook_likes ?? null,
        twitter_followers: community_data?.twitter_followers ?? null,
        reddit_average_comments_48h: community_data?.reddit_average_comments_48h ?? null,
        reddit_average_posts_48h: community_data?.reddit_average_posts_48h ?? null,
        reddit_subscribers: community_data?.reddit_subscribers ?? null,
        telegram_channel_user_count: community_data?.telegram_channel_user_count ?? null,
        telegram_followers: community_data?.telegram_followers ?? null,
        whatsapp_group_user_count: community_data?.whatsapp_group_user_count ?? null,
      },
      developer_data: {
        forks: developer_data?.forks ?? null,
        stars: developer_data?.stars ?? null,
        subscribers: developer_data?.subscribers ?? null,
        total_issues: developer_data?.total_issues ?? null,
        closed_issues: developer_data?.closed_issues ?? null,
        pull_requests_merged: developer_data?.pull_requests_merged ?? null,
        pull_requests_contributed: developer_data?.pull_requests_contributed ?? null,
        code_additions_deletions_4_weeks: developer_data?.code_additions_deletions_4_weeks ?? null,
        commit_count_4_weeks: developer_data?.commit_count_4_weeks ?? null,
      },
      last_updated,
      tickers: tickers.map(ticker => ({
        symbol: ticker.symbol,
        market: ticker.market,
        current_price: ticker.current_price
      }))
    };
  } catch (error) {
    console.error('Error fetching token data:', error.message);
    return null;
  }
}

/*/ Sample usage
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
*/
