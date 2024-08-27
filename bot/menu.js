// Import dotenv to load environment variables globally
import dotenv from 'dotenv';
import readline from 'readline';
import { exec } from 'child_process';

// Load environment variables
dotenv.config();

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display the menu
const showMenu = () => {
    console.log('\n--- Menu ---');
    console.log('1: Get Pool and OpenBook Market Info');
    console.log('2: Fetch Liquidity Pools for Token');
    console.log('3: Exit');
    rl.question('Choose an option: ', handleMenuSelection);
};

// Handle the user’s choice
const handleMenuSelection = (choice) => {
    switch (choice.trim()) {
        case '1':
            runScript('raydium-api.js');
            break;
        case '2':
            runScript('liquidity_pool_fetcher.js');
            break;
        case '3':
            console.log('Exiting...');
            rl.close();
            process.exit(0);
        default:
            console.log('Invalid option, please try again.');
            showMenu();
    }
};

// Run the selected script
const runScript = (scriptName) => {
    console.log(`Running ${scriptName}...`);
    exec(`node ${scriptName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${scriptName}:`, error);
            return;
        }
        if (stderr) {
            console.error(`Error output from ${scriptName}:`, stderr);
        }
        console.log(stdout);
        showMenu(); // Show the menu again after the script finishes
    });
};

// Show the menu when the program starts
showMenu();
