// Import GOT to make HTTP requests
import { got } from "got";
// Set the API URL
const API = "http://localhost:3000";
// Set the categories
const categories = ["confectionery", "electronics"];

// Update the order with the given ID
export async function update(id, amount) {
    console.log(`Updating order ${id} with amount ${amount}`);
    try {
        if (isNaN(+amount)) {
            log("Error: <AMOUNT> must be a number");
            process.exit(1);
        }
        // Use GOT to make a POST request to the API
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount },
        });
        // Log the result to the console
        console.log(`Order ${id} updated with amount ${amount}`);
    } catch (err) {
        // If there is an error, log it to the console and exit
        console.log(err.message);
        process.exit(1);
    }
}