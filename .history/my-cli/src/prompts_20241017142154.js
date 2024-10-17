import Enquirer from "enquirer";
import { listCategoryItems } from "./utils.js";
import { categories } from "./utils.js";
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