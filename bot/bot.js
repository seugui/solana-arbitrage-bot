// Load environment variables from .env file
require('dotenv').config();

async function fetchPools(tokenOne, tokenTwo) {
  // Define the GraphQL query
  const liquidityQuery = `
    query MyQuery {
      Raydium_LiquidityPoolv4(
        where: {baseMint: {_eq: ${JSON.stringify(tokenOne)}}, quoteMint: {_eq: ${JSON.stringify(tokenTwo)}}}
      ) {
        _updatedAt
        amountWaveRatio
        baseDecimal
        baseLotSize
        baseMint
        baseNeedTakePnl
        baseTotalPnl
        baseVault
        depth
        lpMint
        lpReserve
        lpVault
        marketId
        marketProgramId
        maxOrder
        maxPriceMultiplier
        minPriceMultiplier
        minSeparateDenominator
        minSeparateNumerator
        minSize
        nonce
        openOrders
        orderbookToInitTime
        owner
        pnlDenominator
        pnlNumerator
        poolOpenTime
        punishCoinAmount
        punishPcAmount
        quoteDecimal
        quoteLotSize
        quoteMint
        quoteNeedTakePnl
        quoteTotalPnl
        quoteVault
        resetFlag
        state
        status
        swapBase2QuoteFee
        swapBaseInAmount
        swapBaseOutAmount
        swapFeeDenominator
        swapFeeNumerator
        swapQuote2BaseFee
        swapQuoteInAmount
        swapQuoteOutAmount
        systemDecimalValue
        targetOrders
        tradeFeeDenominator
        tradeFeeNumerator
        volMaxCutRatio
        withdrawQueue
        pubkey
      }
      ORCA_WHIRLPOOLS_whirlpool(
        where: {tokenMintB: {_eq: ${JSON.stringify(tokenTwo)}}, tokenMintA: {_eq: ${JSON.stringify(tokenOne)}}}
      ) {
        _lamports
        feeGrowthGlobalA
        feeGrowthGlobalB
        feeRate
        liquidity
        protocolFeeOwedA
        protocolFeeOwedB
        protocolFeeRate
        rewardLastUpdatedTimestamp
        sqrtPrice
        tickCurrentIndex
        tickSpacing
        tokenMintA
        tokenMintB
        tokenVaultA
        tokenVaultB
        whirlpoolsConfig
        pubkey
      }
    }
  `;

  const result = await fetch(
    `https://mainnet.helius-rpc.com/?api-key=f2a2a09e-dfa0-48ff-9823-dd714dd5d0ae`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: liquidityQuery,
      })
    }
  );

  return await result.json();
}

async function startQuery() {
  const { errors, data } = await fetchPools(process.env.TOKEN_ONE, process.env.TOKEN_TWO);
  
  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log('Raydium pools: ', data?.Raydium_LiquidityPoolv4.length);
  console.log('Orca pools: ', data?.ORCA_WHIRLPOOLS_whirlpool.length);
}

startQuery();
