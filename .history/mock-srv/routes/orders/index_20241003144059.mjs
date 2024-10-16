"use strict";
import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';

export default async function (fastify, opts) {
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

    fastify.post("/:id", async (request) => {
        const { id } = request.params;
        fastify.addOrder(id, request.body.amount);
        return { ok: true };
    });
}
