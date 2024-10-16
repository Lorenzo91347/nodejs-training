"use strict";
import fp from "fastify-plugin";
import { PassThrough } from "node:stream";
import websocketPlugin from '@fastify/websocket';  // Import the WebSocket plugin

// Mock data
const orders = {
    A1: { total: 3 },
    A2: { total: 7 },
    B1: { total: 101 },
};

// Map category to ID prefix
const catToPrefix = {
    electronics: "A",
    confectionery: "B",
};

// Create a stream of orders
const orderStream = new PassThrough({ objectMode: true });

// Simulate real-time orders
async function* realtimeOrdersSimulator() {
    for await (const { id, total } of orderStream) {
        yield JSON.stringify({ id, total });
    }
}

// Add order to stream and update total
function addOrder(id, amount) {
    if (orders.hasOwnProperty(id) === false) {
        const err = new Error(`Order ${id} not found`);
        err.status = 404;
        throw err;
    }
    if (Number.isInteger(amount) === false) {
        const err = new Error('Supplied amount must be an integer');
        err.status = 400;
        throw err;
    }
    orders[id].total += amount;
    const { total } = orders[id]
    console.log("Adding order: %o", { id, total });
    orderStream.write({ id, total });
}

// Return current orders
function* currentOrders(category) {
    const idPrefix = catToPrefix[category];
    if (!idPrefix) return;
    const ids = Object.keys(orders).filter((id) => id[0] === idPrefix);
    for (const id of ids) {
        yield JSON.stringify({ id, ...orders[id] });
    }
}

// Calculate next ID
const calculateID = (idPrefix, data) => {
    const sorted = [...new Set(data.map(({ id }) => id))];
    const next = Number(sorted.pop().slice(1)) + 1;
    return `${idPrefix}${next}`;
};

// Plugin
export default fp(async function (fastify, opts) {
    // Register WebSocket plugin
    fastify.register(websocketPlugin);

    // Decorate fastify instance with the current orders logic
    fastify.decorate("currentOrders", currentOrders);
    fastify.decorate("realtimeOrders", realtimeOrdersSimulator);
    fastify.decorate("addOrder", addOrder);
    fastify.decorate("mockDataInsert", function (request, category, data) {
        const idPrefix = catToPrefix[category];
        const id = calculateID(idPrefix, data);
        data.push({ id, ...request.body });
        return data;
    });

    // WebSocket route and logic
    function monitorMessages(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data);
            try {
                if (message.cmd === "update-category") {
                    return sendCurrentOrders(message.payload.category, socket);
                }
            } catch (err) {
                fastify.log.warn(
                    "WebSocket Message (data: %o) Error: %s",
                    message,
                    err.message
                );
            }
        });
    }

    function sendCurrentOrders(category, socket) {
        const orders = Array.from(fastify.currentOrders(category));
        for (const order of orders) {
            socket.send(order);
        }
    }

    fastify.get(
        "/:category",
        { websocket: true },
        async ({ socket }, request) => {
            monitorMessages(socket);
            sendCurrentOrders(request.params.category, socket);
            for await (const order of fastify.realtimeOrders()) {
                if (socket.readyState >= socket.CLOSING) break;
                socket.send(order);
            }
        }
    );

    // HTTP POST route for adding orders
    fastify.post("/:id", async (request) => {
        const { id } = request.params;
        fastify.addOrder(id, request.body.amount);
        return { ok: true };
    });
});