import Enquirer from "enquirer";
import { listCategoryItems } from "./utils.js";
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