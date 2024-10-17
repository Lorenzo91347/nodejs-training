// Define `program` at the start of your file
import { Command } from "commander";
import { update, add, listCategories, listCategoryItems, categories } from "../src/utils.js";
import { interactiveApp } from "../src/prompts.js";

// Create a new Command Program
const program = new Command(); // Declare `program` here at the top

// Configure `program` commands and options
program
    .name("my-cli")
    .description("Back office for My App")
    .version("1.0.0")
    .option("-i, --interactive", "Run App in interactive mode");

// Update command configuration
program
    .command("update")
    .description("Update an order")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[ID]", "Order ID")
    .argument("[AMOUNT]", "Order Amount");

// Add command configuration
program
    .command("add")
    .description("Add Product by ID to a Category")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[CATEGORY]", "Product Category")
    .argument("[ID]", "Product ID")
    .argument("[NAME]", "Product Name")
    .argument("[AMOUNT]", "Product RRP")
    .argument("[INFO...]", "Product Info");

// List command configuration
program
    .command("list")
    .description("List categories")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .option("-a, --all", "List all categories")
    .argument("[CATEGORY]", "Category to list IDs for");

async function main(program) {
    const command = program?.args.at(0) || "";
    const cliArgs = program?.args.slice(1) || [];
    const options = program?.opts() || {};

    if (!command && !options.interactive) {
        program.help();
    }
    if (!command && options.interactive) {
        return interactiveApp();
    }
    if (command && options.interactive) {
        return interactiveApp(command);
    }
    if (options.interactive && cliArgs.length > 0) {
        program.error("Cannot specify both interactive and command");
    }

    switch (command) {
        case "add": {
            const [category, id, name, amount, info] = cliArgs;
            if (!categories.includes(category) || !category || !id || !name || !amount) {
                program.error("Invalid arguments specified for 'add'.");
            }
            await add(category, id, name, amount, info);
            break;
        }
        case "update": {
            const [id, amount] = cliArgs;
            if (!id || !amount) {
                program.error("Invalid arguments specified for 'update'.");
            }
            await update(id, amount);
            break;
        }
        case "list": {
            const { all } = options;
            const [category] = cliArgs;
            if (category && all) program.error("Cannot specify both category and 'all'");
            if (all || category === "all") {
                listCategories();
            } else if (categories.includes(category)) {
                await listCategoryItems(category);
            } else {
                program.error("Invalid category specified for 'list'.");
            }
            break;
        }
        default:
            await interactiveApp();
    }
}

// Parse the arguments from process.argv
program.parse(process.argv);

// Call `main` after parsing to handle the logic
main(program);




