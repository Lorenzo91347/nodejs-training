#!/usr/bin/env node
//import { got } from "got";
import { Command } from "commander";
import {
    update,
    add,
    listCategories,
    listCategoryItems
} from "../src/utils.js";
// Create a new Command Program
const program = new Command();
const API = "http://localhost:3000";

// Log the usage of the command to the console
const usage = (msg = "Back office for My App") => {
    console.log(`\n${msg}\n`);
};
// Update the order with the given ID
/* async function updateItem(id, amount) {
    usage(`Updating order ${id} with amount ${amount}`);
    try {
        if (isNaN(+amount)) {
            usage("Error: <AMOUNT> must be a number");
            process.exit(1);
        }
        // Use GOT to make a POST request to the API
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount },
        });
        // Log the result to the console
        usage(`Order ${id} updated with amount ${amount}`);
    } catch (err) {
        // If there is an error, log it to the console and exit
        console.error(err.message);
        process.exit(1);
    }
} */

// Create a new Program
program
    .name("my-cli") // Set the name of the program
    .description("Back office for My App") // Set the description
    .version("1.0.0"); // Set the version

// Create a command for adding a new order
program
    // Set the command name
    .command("update")
    // Set the argument ID to be required
    .argument("<ID>", "Order ID")
    // Set the argument AMOUNT to be required
    .argument("<AMOUNT>", "Order Amount")
    // Set the action to be executed when the command is run
    .action(async (id, amount) => await update(id, amount));

// Parse the arguments from process.argv
/* program.parse(); */

// Create a command for listing categories by IDs
program
    // Set the command name
    .command("add")
    // Set the command description
    .description("Add Product by ID to a Category")
    // Set the category to be required
    .argument("<CATEGORY>", "Product Category")
    // Set the argument ID to be required
    .argument("<ID>", "Product ID")
    // Set the argument NAME to be required
    .argument("<NAME>", "Product Name")
    // Set the argument AMOUNT to be required
    .argument("<AMOUNT>", "Product RRP")
    // Set the argument INFO to be optional
    .argument("[INFO...]", "Product Info")
    // Set the action to be executed when the command is run
    .action(
        async (category, id, name, amount, info) =>
            await add(category, id, name, amount, info)
    );
// Parse the arguments from process.argv
/* program.parse(); */

// Create a command for listing categories
program
    // Set the command name
    .command("list")
    // Set the command description
    .description("List categories")
    // Set the category to be optional
    .argument("[CATEGORY]", "Category to list IDs for")
    // Set the option to list all categories
    .option("-a, --all", "List all categories")
    // Set the action to be executed when the command is run
    .action(async (args, opts) => {
        if (args && opts.all)
            throw new Error("Cannot specify both category and 'all'");
        if (opts.all || args === "all") {
            listCategories();
        } else if (args === "confectionery" || args === "electronics") {
            await listCategoryItems(args);
        } else {
            throw new Error("Invalid category specified");
        }
    });
program.parse();
