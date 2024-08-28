import { fetchRaydiumPoolInfoByMultipleMintstchRaydiumPoolInfoByMultipleMints } from './raydium-api.js'; // Import the raydium fetching function

function displayApiResponse(response) {
  // Parse the JSON response
  const data = JSON.parse(response);

  // Extract the data array
  const items = data.data.data;

  // Prepare a structured array for logging
  const tableData = items.map(item => ({
      //ProgramId: item.programId,
      Id: item.id,
      //MintA_Symbol: item.mintA.symbol,
      //MintA_Name: item.mintA.name,
      //MintA_Address: item.mintA.address,
      //MintB_Symbol: item.mintB.symbol,
      //MintB_Name: item.mintB.name,
      //MintB_Address: item.mintB.address,
      Price: item.price.toFixed(2),
      MintAmountA: item.mintAmountA.toFixed(2),
      MintAmountB: item.mintAmountB.toFixed(2),
      //FeeRate: item.feeRate,
      TVL: item.tvl.toFixed(2),
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
      LP_Mint_Symbol: item.lpMint.symbol,
      //LP_Mint_Name: item.lpMint.name,
      //LP_Mint_Address: item.lpMint.address,
      LP_Price: item.lpPrice.toFixed(2),
      LP_Amount: item.lpAmount.toFixed(2)
  }));

  // Log the data in a tabular format
  console.table(tableData);
}

// Example usage
const apiResponse = 

displayApiResponse(apiResponse);
