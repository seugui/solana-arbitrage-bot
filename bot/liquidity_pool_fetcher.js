const fetch = require('node-fetch'); // Ensure fetch is available

// Retrieve environment variables from process.env
const SHYFT_API_KEY = process.env.SHYFT_API_KEY;
const token_one = process.env.TOKEN_ONE;
const token_two = process.env.TOKEN_TWO;


if (!SHYFT_API_KEY || !token_one || !token_two) {
    throw new Error('Environment variables SHYFT_API_KEY, SOL, or MSOL are not defined.');
}

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
    `https://programs.shyft.to/v0/graphql?api_key=${SHYFT_API_KEY}&network=mainnet-beta`,
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
  const { errors, data } = await fetchPools(token_one, token_two);

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log('Raydium pools: ', data?.Raydium_LiquidityPoolv4.length);
  console.log('Orca pools: ', data?.ORCA_WHIRLPOOLS_whirlpool.length);
}


startQuery();
