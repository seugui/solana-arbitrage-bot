import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

// Initialize umi
const umi = createUmi("https://mainnet.helius-rpc.com/?api-key=f2a2a09e-dfa0-48ff-9823-dd714dd5d0ae");

/**
 * Fetches metadata for a given token mint address and extracts all fields.
 *
 * @param {string} mintAddress - The mint address of the token.
 * @returns {Promise<{ publicKey: string, mint: MintData, metadata: MetadataData }>} - Object containing all extracted fields.
 */
export async function fetchTokenMetadata(mintAddress) {
    try {
        const asset = await fetchDigitalAsset(umi, mintAddress);

        // Extract all fields from the asset
        const { publicKey, mint, metadata } = asset;

        // Extract fields from mint and metadata
        const mintData = {
            publicKey: mint.publicKey,
            header: {
                executable: mint.header.executable,
                owner: mint.header.owner,
                lamports: mint.header.lamports,
                rentEpoch: mint.header.rentEpoch,
                exists: mint.header.exists,
            },
            mintAuthority: mint.mintAuthority,
            supply: mint.supply,
            decimals: mint.decimals,
            isInitialized: mint.isInitialized,
            freezeAuthority: mint.freezeAuthority,
        };

        const metadataData = {
            publicKey: metadata.publicKey,
            header: {
                executable: metadata.header.executable,
                owner: metadata.header.owner,
                lamports: metadata.header.lamports,
                rentEpoch: metadata.header.rentEpoch,
                exists: metadata.header.exists,
            },
            key: metadata.key,
            updateAuthority: metadata.updateAuthority,
            mint: metadata.mint,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
            creators: metadata.creators,
            primarySaleHappened: metadata.primarySaleHappened,
            isMutable: metadata.isMutable,
            editionNonce: metadata.editionNonce,
            tokenStandard: metadata.tokenStandard,
            collection: metadata.collection,
            uses: metadata.uses,
            collectionDetails: metadata.collectionDetails,
            programmableConfig: metadata.programmableConfig,
        };

        // Return an object containing all extracted fields
        return { publicKey, mint: mintData, metadata: metadataData };
    } catch (error) {
        console.error('Error fetching digital asset:', error);
        throw error;  // Re-throw the error to allow further handling if needed
    }
}

/*/ Sample Test Case (Limited as it relies on external API)
(async () => {
    try {
      const exampleMintAddress = "So11111111111111111111111111111111111111112";
      const { mint, metadata } = await fetchTokenMetadata(exampleMintAddress);
      console.log("Mint:", mint.publicKey);
      console.log("Name:", metadata.name);
      console.log("Symbol:", metadata.symbol);
    } catch (error) {
      console.error("Error during test:", error);
    }
  })();
*/  