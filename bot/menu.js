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
    console.log('1: Arbitraje Oportunities');
    console.log('2: Show Pools Info');
    console.log('3: Show Meteora API');
    console.log('4: Show Raydium API');
    console.log('5: Show Orca API');
    console.log('6: Fetch and Process JSON'); // New option
    console.log('7: Exit');
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
        case '6':  // New case for fetching and processing JSON
            runScript('./show/save-json.js');
            break;
        case '7':
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

// Function to fetch JSON data from API and extract values
const fetchAndProcessJson = async () => {
    try {
        console.log('Fetching JSON data from API...');
        const response = await fetch('https://api.example.com/data'); // Replace with your API URL
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        // Process the JSON data to extract values
        extractValues(data);

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        showMenu(); // Show the menu again after processing
    }
};

// Function to extract specific values from the JSON data
const extractValues = (data) => {
    // Example: Extract a specific value from the JSON
    const specificValue = data.key; // Replace with the actual key you want to extract
    console.log('Extracted value:', specificValue);

    // You can add more logic to handle the extracted data
};

// Show the menu when the program starts
showMenu();
