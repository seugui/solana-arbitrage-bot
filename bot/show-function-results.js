import { fetchRaydiumPoolInfoByMultipleMints } from './raydium-api';
import { fetchTokenMetadata } from './metadata';
import readline from 'readline';

// Mapping of function names to actual functions
const functionMap = {
  '1': { name: 'Raydium Pool Info', func: fetchRaydiumPoolInfoByMultipleMints },
  '2': { name: 'Fetch Metadata', func: fetchTokenMetadata },
};

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to display the menu and handle user selection
function showMenu() {
  console.log('Select an option:');
  Object.entries(functionMap).forEach(([key, { name }]) => {
    console.log(`  ${key}. ${name}`);
  });
  rl.question('Enter the number of your choice: ', async (answer) => {
    if (functionMap[answer]) {
      try {
        const result = await functionMap[answer].func();
        console.log(`${functionMap[answer].name} Result:`, result);
      } catch (error) {
        console.error(`Failed to fetch and display data:`, error.message || error);
      }
    } else {
      console.log('Invalid choice. Please try again.');
    }
    rl.close(); // Close the readline interface
  });
}

// Show the menu to the user
showMenu();
