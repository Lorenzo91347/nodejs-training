import {
    bgCyan,
    bgPurple,
    bgRed,
    bgYellow,
    txBlue,
    txCyan,
    txGreen,
    txPurple,
    txRed,
    txYellow,
} from "./colors.js";

// Export the output display functions

// Log the usage of the command to the console
export const log = (msg) => console.log(`\n${msg}\n`);

// Log the error to the console
export const error = (msg) =>
    console.error(`${bgRed.inverse(`⚠️ Error:`)}\n${txRed(msg)}\n`);