const { Connection, PublicKey } = require('@solana/web3.js');
const { Metadata } = require('@metaplex-foundation/mpl-token-metadata');

// Define the Metadata Program ID for Solana mainnet
const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1VBs4b5ghmhK7yNW8R7AehbPrw');

// Ensure SHYFT_API_KEY is set in the environment variables
const SHYFT_API_KEY = process.env.SHYFT_API_KEY;

// Solana's Mainnet endpoint with API key
const connection = new Connection(`https://rpc.shyft.to?api_key=${SHYFT_API_KEY}`);

// Function to get metadata address
async function getMetadataAddress(mint) {
    try {
        const mintPublicKey = new PublicKey(mint);
        const [metadataAddress] = await PublicKey.findProgramAddress(
            [
                Buffer.from('metadata'),
                METADATA_PROGRAM_ID.toBuffer(),
                mintPublicKey.toBuffer(),
            ],
            METADATA_PROGRAM_ID
        );
        return metadataAddress;
    } catch (error) {
        console.error('Error getting metadata address:', error);
        throw error;
    }
}

// Function to fetch token symbol from metadata
async function fetchTokenSymbol(mintAddress) {
    try {
        const metadataAddress = await getMetadataAddress(mintAddress);
        const metadataAccount = await Metadata.load(connection, metadataAddress);
        const { data } = metadataAccount;
        return data.symbol || 'Unknown'; // Ensure there's a fallback if `symbol` is undefined
    } catch (error) {
        console.error('Error fetching token metadata:', error);
        return 'Unknown';
    }
}

module.exports = {
    fetchTokenSymbol,
};
