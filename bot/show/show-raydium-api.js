import { fetchRaydiumPoolDataByMints } from '../raydium-api.js'; // Note the .js extension

// Test the function
async function displayRaydiumPoolData() {
    try {
        // Example mint addresses (replace with actual values or use process.env)
        const tokenOneMintAddress = process.env.TOKEN_ONE || 'YourDefaultTokenOneMintAddress';
        const tokenTwoMintAddress = process.env.TOKEN_TWO || 'YourDefaultTokenTwoMintAddress';

        const result = await fetchRaydiumPoolDataByMints(
            tokenOneMintAddress, // mint1
            tokenTwoMintAddress, // mint2
            'all',               // poolType
            'default',           // poolSortField
            'desc',              // sortType
            1000,                // pageSize
            1                    // page
        );

        // Log the full result
        console.log('Function Result:', JSON.stringify(result, null, 2));
        
        // Alternatively, log specific parts of the result if needed
        console.log('Result Data:', JSON.stringify(result.data, null, 2));
    } catch (error) {
        console.error('Error during function test:', error.message || error);
    }
}

// Run the test
displayRaydiumPoolData();
