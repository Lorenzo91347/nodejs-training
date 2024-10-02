# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).


To explain the full sample Electronics flow: when the Electronics category is selected, this triggers the input event listener of the category element. This, in turn, calls the realtimeOrders function passing electronics as the argument. The realtimeOrders function creates a WebSocket connection to ws://localhost:3000/orders/electronics, which triggers the WebSocket route handler in mock-srv/routes/orders/index.mjs on the server side. 
