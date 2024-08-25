const { gql, GraphQLClient } = require('graphql-request');
const { Connection, PublicKey } = require('@solana/web3.js');
const { Market } = require('@project-serum/serum');

// Retrieve environment variables from process.env
const SHYFT_API_KEY = process.env.SHYFT_API_KEY;
const PROGRAM_ID = process.env.PROGRAM_ID;

if (!SHYFT_API_KEY || !PROGRAM_ID) {
    throw new Error('Environment variables SHYFT_API_KEY or PROGRAM_ID are not defined.');
}

const endpoint = `https://programs.shyft.to/v0/graphql?api_key=${SHYFT_API_KEY}`;
const rpcEndpoint = `https://rpc.shyft.to/?api_key=${SHYFT_API_KEY}`;

const graphQLClient = new GraphQLClient(endpoint, {
  method: 'POST',
  jsonSerializer: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
}); // Initialize gQL Client

async function getPoolInfo(address) {
  // We only fetch fields necessary for us
  const query = gql`
    query MyQuery($where: Raydium_LiquidityPoolv4_bool_exp) {
      Raydium_LiquidityPoolv4(
        where: { pubkey: { _eq: ${JSON.stringify(address)} } }
      ) {
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
    }
  `;

  return await graphQLClient.request(query);
}

async function addMarketInfo(pool) {
  // Load Market Info from openbook
  const connection = new Connection(rpcEndpoint, 'confirmed');

  const marketPubKey = new PublicKey(pool.marketId);
  const nullProgramId = new PublicKey('11111111111111111111111111111111');
  const marketProgramPubKey = new PublicKey(pool.marketProgramId);
  const market = await Market.load(connection, marketPubKey, undefined, marketProgramPubKey);
  const marketInfo = market?._decoded;

  // Fetch market authority
  const associatedAuthority = getAssociatedAuthority({
    programId: marketProgramPubKey,
    marketId: marketPubKey,
  });

  // Convert PublicKey instances to their string representations
  const toPublicKeyString = (key) => key.toString();

  return {
    baseDecimals: pool.baseDecimal,
    baseMint: toPublicKeyString(new PublicKey(pool.baseMint)),
    baseVault: toPublicKeyString(new PublicKey(pool.baseVault)),
    quoteDecimals: pool.quoteDecimal,
    quoteMint: toPublicKeyString(new PublicKey(pool.quoteMint)),
    quoteVault: toPublicKeyString(new PublicKey(pool.quoteVault)),
    marketId: toPublicKeyString(marketPubKey),
    marketAuthority: associatedAuthority?.publicKey ? toPublicKeyString(associatedAuthority.publicKey) : null,
    marketProgramId: toPublicKeyString(marketProgramPubKey),
    version: 4,
    withdrawQueue: toPublicKeyString(new PublicKey(pool?.withdrawQueue)),
    lpVault: toPublicKeyString(new PublicKey(pool.lpVault)),
    openOrders: toPublicKeyString(new PublicKey(pool.openOrders)),
    marketVersion: 3,
    marketBaseVault: marketInfo?.baseVault ? toPublicKeyString(new PublicKey(marketInfo.baseVault)) : null,
    marketQuoteVault: marketInfo?.quoteVault ? toPublicKeyString(new PublicKey(marketInfo.quoteVault)) : null,
    marketBids: marketInfo?.bids ? toPublicKeyString(new PublicKey(marketInfo.bids)) : null,
    marketAsks: marketInfo?.asks ? toPublicKeyString(new PublicKey(marketInfo.asks)) : null,
    marketEventQueue: marketInfo?.eventQueue ? toPublicKeyString(new PublicKey(marketInfo.eventQueue)) : null,
    lpMint: toPublicKeyString(new PublicKey(pool.lpMint)),
    programId: toPublicKeyString(new PublicKey(PROGRAM_ID)), // Use environment variable
    targetOrders: toPublicKeyString(new PublicKey(pool.targetOrders)),
    lookupTableAccount: toPublicKeyString(nullProgramId),
    lpDecimals: pool.baseDecimal,
    id: toPublicKeyString(new PublicKey(pool.pubkey)),
  };
}

function getAssociatedAuthority({ programId, marketId }) {
  const seeds = [marketId.toBuffer()];

  let nonce = 0;
  let publicKey;

  while (nonce < 100) {
    try {
      // Buffer.alloc(7) nonce u64
      const seedsWithNonce = seeds.concat(Buffer.from([nonce]), Buffer.alloc(7));
      publicKey = PublicKey.createProgramAddressSync(seedsWithNonce, programId);
    } catch (err) {
      if (err instanceof TypeError) {
        throw err;
      }
      nonce++;
      continue;
    }
    return { publicKey, nonce };
  }

  console.log('unable to find a viable program address nonce', 'params', {
    programId,
    marketId,
  });
}

(async () => {
  // Replace this with token address for which you want to get Pools
  const pool = await getPoolInfo('6a1CsrpeZubDjEJE9s1CMVheB6HWM5d7m1cj2jkhyXhj');

  // This just needs parsed pool, you can fetch through token address, pair, etc.
  const poolAndMarketInfo = await addMarketInfo(pool.Raydium_LiquidityPoolv4[0]);
  console.log('Combined with market info');
  console.log(poolAndMarketInfo);
})();
