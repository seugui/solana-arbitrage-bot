import axios from 'axios';

// Enhanced function to fetch Jupiter Swap API quote
export async function fetchQuote(
  inputMint,
  outputMint,
  amount,
  onlyDirectRoutes = 'true',
  swapMode = 'ExactIn',
  dexes,
) {
  const params = {
    inputMint,
    outputMint,
    amount,
    onlyDirectRoutes,
    swapMode,
    dexes,
  };

  try {
    const response = await axios.get('https://public.jupiterapi.com/quote', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error.message || error);
    throw new Error(`Failed to fetch Jupiter quote: ${error.message || error}`);
  }
}
