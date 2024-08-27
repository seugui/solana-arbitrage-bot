import axios from 'axios'; // Import Axios
import Table from 'cli-table3'; // Import cli-table3
import { fetchTokenMetadata } from './metadata.js'; // Import the metadata fetching function

// Retrieve environment variables from process.env
const { SHYFT_API_KEY, TOKEN_ONE: token_one, TOKEN_TWO: token_two } = process.env;

// Ensure environment variables are defined
if (!SHYFT_API_KEY || !token_one || !token_two) {
    throw new Error('Environment variables SHYFT_API_KEY, TOKEN_ONE, or TOKEN_TWO are not defined.');
}

// Function to fetch liquidity pools
async function fetchPools(tokenOne, tokenTwo) {
    const liquidityQuery = `
        query MyQuery {
            Raydium_LiquidityPoolv4(
                where: {baseMint: {_eq: ${JSON.stringify(tokenOne)}}, quoteMint: {_eq: ${JSON.stringify(tokenTwo)}}}
            ) {
                pubkey
                baseMint
                quoteMint
            }
            ORCA_WHIRLPOOLS_whirlpool(
                where: {tokenMintB: {_eq: ${JSON.stringify(tokenTwo)}}, tokenMintA: {_eq: ${JSON.stringify(tokenOne)}}}
            ) {
                pubkey
                tokenMintA
                tokenMintB
            }
        }
    `;

    try {
        const response = await axios.post(
            `https://programs.shyft.to/v0/graphql?api_key=${SHYFT_API_KEY}&network=mainnet-beta`,
            { query: liquidityQuery },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        console.error('Axios error:', error);
        throw error; // Re-throw error to be handled in calling function
    }
}

// Main function to start querying and display data
async function startQuery() {
    try {
        const { errors, data } = await fetchPools(token_one, token_two);

        if (errors) {
            console.error(errors);
            return;
        }

        // Initialize table
        const table = new Table({
            head: ['Pool', 'Base Mint', 'Base Symbol', 'Quote Mint', 'Quote Symbol', 'Dex'],
            colWidths: [50, 30, 20, 30, 20, 10] // Adjust column widths as necessary
        });

        // Process Raydium pools
        if (data?.Raydium_LiquidityPoolv4 && data.Raydium_LiquidityPoolv4.length > 0) {
            for (const pool of data.Raydium_LiquidityPoolv4) {
                const pubkey = pool.pubkey || 'Unknown Pool';
                const baseMint = pool.baseMint || 'N/A';
                const quoteMint = pool.quoteMint || 'N/A';
                const dex = 'Raydium';
                const baseSymbol = await fetchTokenMetadata(baseMint);
                const quoteSymbol = await fetchTokenMetadata(quoteMint);

                table.push([pubkey, baseMint, baseSymbol, quoteMint, quoteSymbol, dex]);
            }
        }

        // Process Orca pools
        if (data?.ORCA_WHIRLPOOLS_whirlpool && data.ORCA_WHIRLPOOLS_whirlpool.length > 0) {
            for (const pool of data.ORCA_WHIRLPOOLS_whirlpool) {
                const pubkey = pool.pubkey || 'Unknown Pool';
                const baseMint = pool.tokenMintA || 'N/A';
                const quoteMint = pool.tokenMintB || 'N/A';
                const dex = 'Orca';
                const baseSymbol = await fetchTokenMetadata(baseMint);
                const quoteSymbol = await fetchTokenMetadata(quoteMint);

                table.push([pubkey, baseMint, baseSymbol, quoteMint, quoteSymbol, dex]);
            }
        }

        // Print the table
        console.log(table.toString());
    } catch (error) {
        console.error('Failed to fetch pools:', error);
    }
}

// Start querying
startQuery();
