// Import GOT to make HTTP requests
import { got } from "got";
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

// Set the API URL
const API = "http://localhost:3000";

// Set the categories
export const categories = ["confectionery", "electronics"];

// Update the order with the given ID
export async function update(id, amount) {
    log(`${displayTimestamp()}`);
    log(
        `${displayInfo(`Updating Order`)} ${displayID(id)} ${displayText(
            "with amount"
        )} ${displayAmount(amount)}`
    );
    try {
        if (isNaN(+amount)) {
            error(" must be a number");
            process.exit(1);
        }
        // Use GOT to make a POST request to the API
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount },
        });
        // Log the result to the console
        log(
            `${displaySuccess()} ${displayText("Order")} ${displayID(
                id
            )} ${displayText("updated with amount")} ${displayAmount(amount)}`
        );
    } catch (err) {
        // If there is an error, log it to the console and exit
        console.log(err.message);
        process.exit(1);
    }
}

// Add a new order
export async function add(...args) {
    // Destructure the arguments
    let [category, id, name, amount, info] = args;
    log(`${displayTimestamp()}`);
    log(
        `${displayInfo(`Request to add item to category`)} ${displayCategory(
            category
        )}`
    );
    log(
        `${displayText("Adding item")} ${displayID(id)} ${displayText(
            "with amount"
        )} ${displayAmount(`$${amount}`)}`
    );
    try {
        if (isNaN(+amount)) {
            error(`<AMOUNT> must be a number`);
            process.exit(1);
        }
        // Use GOT to make a POST request to the API
        await got.post(`${API}/${category}`, {
            json: {
                id,
                name,
                rrp: +amount,
                info: info.join(" "),
            },
        });
        // Log the result to the console
        log(
            `${displaySuccess("Product Added! :")} ${displayID(id)} ${displayText("-")} ${displayName(
                name
            )} ${displayText("has been added to the")} ${displayCategory(
                category
            )} ${displayText("category")}`
        );
    } catch (err) {
        // If there is an error, log it to the console and exit
        error(err.message);
        process.exit(1);
    }
}

// List the categories
export function listCategories() {
    log(displayTimestamp());
    log(displayInfo("Listing Categories"));
    try {
        // Loop through the categories and log them to the console
        log(displayText("Categories received from API:"));
        for (const cat of categories) log(displayCategory(cat));
    } catch (err) {
        // If there is an error, log it to the console and exit
        error(err.message);
        process.exit(1);
    }
}

// List the IDs for the given category
export async function listCategoryItems(category) {
    log(displayTimestamp());
    log(`${displayInfo(`List IDs`)}`);

    try {
        // Use GOT to make a GET request to the API
        const result = await got(`${API}/${category}/`).json();
        // Log the result to the console
        log(`${displaySuccess("IDs received from API:")}`);
        for (const item of result) {
            log(`
${displayKey("ID:")}\t${displayID(item.id)}
${displayKey(`Name:`)}\t${displayName(item.name)}
${displayKey("RRP:")}\t${displayRRP(item.rrp)}
${displayKey("Product Info:")}\n\t${displayText(item.info)}
`);
        }
    } catch (err) {
        // If there is an error, log it to the console and exit
        error(err.message);
        process.exit(1);
    }
}
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