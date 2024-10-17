// Define `program` at the start of your file
import { Command } from "commander";
import { update, add, listCategories, listCategoryItems, categories } from "../src/utils.js";
import { interactiveApp } from "../src/prompts.js";

export const program = new Command();

program
    .name("my-cli")
    .description("Back office for My App")
    .version("1.0.0")
    .option("-i, --interactive", "Run App in interactive mode");

// Update command
program
    .command("update")
    .description("Update an order")
    .argument("[ID]", "Order ID")
    .argument("[AMOUNT]", "Order Amount");

// Add command
program
    .command("add")
    .description("Add Product by ID to a Category")
    .argument("[CATEGORY]", "Product Category")
    .argument("[ID]", "Product ID")
    .argument("[NAME]", "Product Name")
    .argument("[AMOUNT]", "Product RRP")
    .argument("[INFO...]", "Product Info");

// List command
program
    .command("list")
    .description("List categories")
    .option("-a, --all", "List all categories")
    .argument("[CATEGORY]", "Category to list IDs for");

async function main() {
    // Parse and process options and arguments
    program.parse(process.argv);

    const options = program.opts();
    const [command, ...args] = program.args;

    if (options.interactive) {
        // Handle interactive mode for the specific command if provided
        return interactiveApp(command);
    }

    switch (command) {
        case "add": {
            const [category, id, name, amount, info] = args;
            if (!categories.includes(category) || !id || !name || !amount) {
                program.error("Invalid arguments specified for 'add'.");
            }
            await add(category, id, name, amount, info);
            break;
        }
        case "update": {
            const [id, amount] = args;
            if (!id || !amount) {
                program.error("You must provide both 'ID' and 'AMOUNT' for the update command.");
            }
            await update(id, amount);
            break;
        }
        case "list": {
            const { all } = program.commands.find(cmd => cmd.name() === "list").opts();
            const [category] = args;
            if (category && all) {
                program.error("Cannot specify both category and 'all'");
            }
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
            program.help(); // Shows help if no valid command is provided
    }
}

main();


