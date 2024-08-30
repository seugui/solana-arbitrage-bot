// extractAssetDetails.js
import { promises as fs } from 'fs';

// Define the fixed file path for the JSON data
const filePath = './tokens-data.json';

// Function to extract asset details based on a given platform value
export async function extractAssetDetails(platformValue) {
    try {
        // Read the JSON file asynchronously
        const data = await fs.readFile(filePath, 'utf8');
        
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        
        // Find the asset with the specified platform value
        const asset = jsonData.find(item => {
            return Object.values(item.platforms).includes(platformValue);
        });
        
        // Extract and return the details
        if (asset) {
            const details = {
                id: asset.id,
                symbol: asset.symbol,
                name: asset.name,
                price: asset.market_data.current_price_usd,
            };
            return details;
        } else {
            console.error(`No asset found for the platform value: ${platformValue}`);
            return null;
        }
    } catch (error) {
        console.error('Error reading or processing JSON file:', error);
        return null;
    }
}