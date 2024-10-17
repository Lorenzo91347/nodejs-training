import { Command } from "commander";
import { update, add, listCategories, listCategoryItems, categories } from "../src/utils.js";
import { interactiveApp } from "../src/prompts.js";

export const program = new Command(); // Export `program` here

// Configure `program` commands and options
program
    .name("my-cli")
    .description("Back office for My App")
    .version("1.0.0");

// Update command configuration with interactive handling
program
    .command("update")
    .description("Update an order")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[ID]", "Order ID")
    .argument("[AMOUNT]", "Order Amount")
    .action(async (id, amount, options) => {
        if (options.interactive) {
            return interactiveApp("update");
        }
        if (!id || !amount) {
            program.error("You must provide both 'ID' and 'AMOUNT' for the update command.");
        }
        await update(id, amount);
    });

// Add command configuration with interactive handling
program
    .command("add")
    .description("Add Product by ID to a Category")
    .option("-i, --interactive", "Run Add Command in interactive mode")
    .argument("[CATEGORY]", "Product Category")
    .argument("[ID]", "Product ID")
    .argument("[NAME]", "Product Name")
    .argument("[AMOUNT]", "Product RRP")
    .argument("[INFO...]", "Product Info")
    .action(async (category, id, name, amount, info, options) => {
        if (options.interactive) {
            return interactiveApp("add");
        }
        if (!categories.includes(category) || !id || !name || !amount) {
            program.error("Invalid arguments specified for 'add'.");
        }
        await add(category, id, name, amount, info);
    });

// List command configuration with interactive handling
program
    .command("list")
    .description("List categories")
    .option("-i, --interactive", "Run List Command in interactive mode")
    .option("-a, --all", "List all categories")
    .argument("[CATEGORY]", "Category to list IDs for")
    .action(async (category, options) => {
        if (options.interactive) {
            return interactiveApp("list");
        }
        if (category && options.all) {
            program.error("Cannot specify both category and 'all'");
        }
        if (options.all || category === "all") {
            listCategories();
        } else if (categories.includes(category)) {
            await listCategoryItems(category);
        } else {
            program.error("Invalid category specified for 'list'.");
        }
    });

// Parse and execute commands
program.parse(process.argv);



