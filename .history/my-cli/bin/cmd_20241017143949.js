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
export const program = new Command();
const API = "http://localhost:3000";

// Log the usage of the command to the console
const usage = (msg = "Back office for My App") => {
    console.log(`\n${msg}\n`);
};

// Create a new Command Program const program = new Command();

// Create a new Program
program
    // Set the name of the program
    .name("my-cli")
    // Set the description
    .description("Back office for My App")
    // Set the version
    .version("1.0.0")
    // Set the option to run application in interactive mode
    .option("-i, --interactive", "Run App in interactive mode")
    // Set the primary program action to be executed when no commands are specified
    .action(() => {
        // No-operation (noop)
    });



// Create a command for updating an order
program
    .command("update")
    .description("Update an order")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[ID]", "Order ID")
    .argument("[AMOUNT]", "Order Amount");

// Create a command for listing categories by IDs
program
    .command("add")
    .description("Add Product by ID to a Category")
    // Set the option to run command in interactive mode
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[CATEGORY]", "Product Category")
    .argument("[ID]", "Product ID")
    .argument("[NAME]", "Product Name")
    .argument("[AMOUNT]", "Product RRP")
    .argument("[INFO...]", "Product Info");

// Create a command for listing categories
program
    .command("list")
    .description("List categories")
    // Set the option to run command in interactive mode
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .option("-a, --all", "List all categories")
    .argument("[CATEGORY]", "Category to list IDs for");

// Parse the arguments from process.argv
program.parse();
