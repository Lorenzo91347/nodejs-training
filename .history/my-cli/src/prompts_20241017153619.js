import Enquirer from "enquirer";
import {
    listCategoryItems,
    listCategories,
    update,
    add,

} from "./utils.js";
import { categories } from "./utils.js";
import { program } from "../bin/cmd.js";
import {
    log,
    error,
    displayAmount,
    displayCategory,
    displayID,
    displayInfo,
    displayKey,
    displayName,
    displayRRP,
    displaySuccess,
    displayText,
    displayTimestamp
} from "./displays.js";

// Import the Enquirer prompt types
const { prompt } = Enquirer;

const categoryQuestions = [
    {
        type: "autocomplete",
        name: "category",
        message: "Category",
        choices: categories,
    },
];

export const promptListIds = async () => {
    const { category } = await prompt(categoryQuestions);
    return listCategoryItems(category);
};

await promptListIds();

const orderQuestions = [
    ...categoryQuestions,
    {
        type: "input",
        name: "id",
        message: "ID",
    },
    {
        type: "input",
        name: "name",
        message: "Name",
    },
    {
        type: "input",
        name: "amount",
        message: "Amount",
    },
    {
        type: "input",
        name: "info",
        message: "Info",
    },
];

export const promptAddOrder = async () => {
    const { category, id, name, amount, info } = await prompt(orderQuestions);
    return add(category, id, name, amount, info);
};

const updateQuestions = [
    {
        type: "input",
        name: "id",
        message: "ID",
    },
    {
        type: "input",
        name: "amount",
        message: "Amount",
    },
];

export const promptUpdate = async () => {
    const { id, amount } = await prompt(updateQuestions);
    return update(id, amount);
};

const commandsList = ["add", "update", "list", "list by ID's", "help", "exit"];
const commandsQuestions = [
    {
        type: "autocomplete",
        name: "command",
        message: "Command",
        choices: commandsList,
    },
];
export const promptCommand = async () => {
    const { command } = await prompt(commandsQuestions);
    return command;
};

export const interactiveApp = async (cmd) => {
    log(displayText(`Back office for My App`));
    log(displayInfo(`Interactive Mode`));
    try {
        const command = cmd ?? await promptCommand();
        switch (command) {
            case "add":
                log(displayInfo(`Add Order`));
                await promptAddOrder();
                return interactiveApp();
            case "update":
                log(displayInfo(`Update Order`));
                await promptUpdate();
                return interactiveApp();
            case "list":
                log(displayInfo(`List Categories`));
                await listCategories();
                return interactiveApp();
            case "list by ID's":
                log(displayInfo(`List Category Items`));
                await promptListIds();
                return interactiveApp();
            case "help":
                program.help();
            case "exit":
                process.exit(0);
        }
    } catch (err) {
        error(err);
        process.exit(1);
    }
};
// Main function to run the program
async function main(program) {
    // Get the command, process.args and options
    const command = program?.args.at(0) || "";
    const cliArgs = program?.args.slice(1) || [];
    const options = program?.opts() || {};

    // Guard clauses
    if (!command && !options.interactive) {
        // Display the help
        program.help();
    }
    if (!command && options.interactive) {
        // Run the interactive app
        return interactiveApp();
    }
    if (command && options.interactive) {
        // Run the interactive app with the command
        return interactiveApp(command);
    }
    if (options.interactive && cliArgs.length > 0) {
        throw new Error("Cannot specify both interactive and command");
        process.exit(1);
    }
    // Execute the command
    switch (command) {
        case "add": {
            const [category, id, name, amount, info] = cliArgs;
            if (
                !categories.includes(category) ||
                !category ||
                !id ||
                !name ||
                !amount
            ) {
                throw new Error("Invalid arguments specified");
            }
            await add(category, id, name, amount, info);
            break;
        }
        case "update": {
            const [id, amount] = cliArgs;
            if (!id && !amount) {
                throw new Error("Invalid arguments specified");
            }
            await update(id, amount);
            break;
        }
        case "list": {
            const { all } = options;
            const [category] = cliArgs;
            if (category && all)
                throw new Error("Cannot specify both category and 'all'");
            if (all || category === "all") {
                listCategories();
            } else if (categories.includes(category)) {
                await listCategoryItems(category);
            } else {
                throw new Error("Invalid category specified");
            }
            break;
        }
        default:
            await interactiveApp();
    }
}
// Run the main function
main(program);


// Run the Interactive program
await interactiveApp();