"use strict";
const data = [
    {
        id: "B1",
        name: "Chocolate Bar",
        rrp: "22.40",
        info: "Delicious overpriced chocolate.",
    },
];
export default async function (fastify, opts) {

    // the Get route only serves to retrieve the data object from the file

    fastify.get("/", async function (request, reply) {
        return data;
    });

    // the post route also updates the request with the new prefix id from request.mockDataInsert,and pairing it with the newly created item before
    //returning it
    fastify.post("/", async function (request, reply) {
        fastify.mockDataInsert(request, opts.prefix.slice(1), data);
        return data;
    });
}