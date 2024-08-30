// Import dotenv to load environment variables globally
import dotenv from 'dotenv';
import readline from 'readline';
import { exec } from 'child_process';
import { fetchAndSaveTokensData } from './save-json.js'; // Import the function

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
    console.log('1: Arbitraje Oportunities');
    console.log('2: Show Pools Info');
    console.log('3: Show Meteora API');
    console.log('4: Show Raydium API');
    console.log('5: Show Orca API');
    console.log('6: Fetch and Process JSON');
    console.log('7: Parse Save JSON');
    console.log('8: Show Jupiter API');
    console.log('9: Exit');
    rl.question('Choose an option: ', handleMenuSelection);
};

// Handle the user’s choice
const handleMenuSelection = (choice) => {
    switch (choice.trim()) {
        case '1':
            runScript('arbitraje-oportunities.js');
            break;
        case '2':
            runScript('show-pool-info.js');
            break;
        case '3':
            runScript('./show/show-meteora-api.js');
            break;
        case '4':
            runScript('./show/show-raydium-api.js');
            break;
        case '5':
            runScript('./show/show-orca-api.js');
            break;
        case '6':
            runScript('./save-json.js');
            break;
        case '7':
            runScript('./parse-save-json.js');
            break;
        case '8':
            runScript('./show/show-orca-api.js.js');
            break;
        case '9':
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

fetchAndSaveTokensData()
showMenu();