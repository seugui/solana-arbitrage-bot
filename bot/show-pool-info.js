import { fetchRaydiumPoolInfoByMultipleMints } from './raydium-api.js'; // Import the raydium fetching function

async function displayApiResponse() {
  try {
    // Fetch the data from the API
    const response = await fetchRaydiumPoolInfoByMultipleMints(
      'all',          // poolType
      'default',      // poolSortField
      'desc',         // sortType
      1000,           // pageSize
      1               // page
    );

    // Extract the data array
    let items = response.data.data;

    // Filter the items by TVL, for example, keep only those with a TVL greater than 1000
    const tvlThreshold = 10000; // Set your TVL threshold here
    items = items.filter(item => item.tvl >= tvlThreshold);

    // Prepare a structured array for logging
    const tableData = items.map(item => ({
        //ProgramId: item.programId,
        Id: item.id,
        Type: item.type,
        //MintA_Symbol: item.mintA.symbol,
        //MintA_Name: item.mintA.name,
        //MintA_Address: item.mintA.address,
        //MintB_Symbol: item.mintB.symbol,
        //MintB_Name: item.mintB.name,
        //MintB_Address: item.mintB.address,
        Price: item.price?.toFixed(2) ?? 'N/A',
        MintAmountA: item.mintAmountA?.toFixed(2) ?? 'N/A',
        MintAmountB: item.mintAmountB?.toFixed(2) ?? 'N/A',
        //FeeRate: item.feeRate,
        TVL: item.tvl?.toFixed(2) ?? 'N/A',
        //Day_Volume: item.day.volume,
        //Day_APR: item.day.apr,
        //Week_Volume: item.week.volume,
        //Week_APR: item.week.apr,
        //Month_Volume: item.month.volume,
        //Month_APR: item.month.apr,
        //PoolType: item.pooltype.join(', '),
        //RewardDefaultPoolInfos: item.rewardDefaultPoolInfos,
        //FarmUpcomingCount: item.farmUpcomingCount,
        //FarmOngoingCount: item.farmOngoingCount,
        //FarmFinishedCount: item.farmFinishedCount,
        //MarketId: item.marketId,
        //LP_Mint_Symbol: item.lpMint.symbol,
        //LP_Mint_Name: item.lpMint.name,
        //LP_Mint_Address: item.lpMint.address,
        LP_Price: item.lpPrice?.toFixed(2) ?? 'N/A',
        LP_Amount: item.lpAmount?.toFixed(2) ?? 'N/A'
    }));

    // Log the data in a tabular format
    console.table(tableData);
  } catch (error) {
    console.error('Error fetching or displaying data:', error.message || error);
  }
}

// Call the function to display the data
displayApiResponse();
