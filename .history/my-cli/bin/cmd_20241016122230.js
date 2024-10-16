#!/usr/bin/env node

import got from 'got'
import { Command } from "commander";
// Create a new Command Program
const program = new Command();

// Create a new Program
program
    .name("my-cli") // Set the name of the program
    .description("Back office for My App") // Set the description
    .version("1.0.0"); // Set the version
// Parse the arguments from process.argv
program.parse();

// API  variable, can be adapted to a production URL 

const API = "http://localhost:3000";

const usage = (msg = 'Back office for My App') => {
    console.log(`\n${msg}\n`);
    console.log("Usage: cmd <ID> <AMOUNT>");
};

// Get the arguments from the command line
const argv = process.argv.slice(2);
// If there are no arguments, show the usage and exit
if (argv.length < 2) {
    usage();
    process.exit(1);
}

// Deconstruct the arguments into variables
const [argID, argAmount] = argv;

// Check if the Amount is a number
const amount = parseInt(argAmount);
// If the amount is not a number, show the usage and exit
if (isNaN(amount)) {
    usage("Error: <AMOUNT> must be a number");
    process.exit(1);
}

// Update the order with the given ID
try {
    // Use GOT to make a POST request to the API
    await got.post(`${API}/orders/${argID}`, {
        json: { amount },
    });
    // Log the result to the console
    console.log(`Order ${argID} updated with amount ${amount}`);
} catch (err) {
    // If there is an error, log it to the console and exit
    console.log(err.message);
    process.exit(1);
}

