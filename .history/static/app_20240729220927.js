'use strict'


// API URL
const API = 'https://api-gate2.movieglu.com/';
const WS_API = "ws://localhost:3000";
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString(); // Returns date in yyyy-mm-ddThh:mm:ss.sssZ format
}

// Function to get geolocation
function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve(`${latitude}; ${longitude}`);
                },
                (error) => {
                    reject('Geolocation error: ' + error.message);
                }
            );
        } else {
            reject('Geolocation not supported');
        }
    });
}

// Populate products from API method
const populateProducts = async (category, method = 'GET', payload) => {

    //selects the element in the index.html that has id "products"
    const products = document.querySelector('#products')

    //makes sure the content inside the tag is set to ''
    products.innerHTML = ''

    //sends the request to the API with content depending on which category button is pressed

    const send = method === 'GET' ? {} : {
        headers: {
            'CLIENT': 'BOOL',
            'X-API-KEY': 'VajfhrhToT6NuMS2WnU3f2OVxTXuvFRqa1DN7NHL',
            'AUTHORIZATION': 'Basic Qk9PTF9YWDpMYmF3NUw1QlNVNXk=',
            'TERRITORY': 'XX',
            'API-VERSION': 'v200',
            'GEOLOCATION': geoLocation,
            'DEVICE-DATETIME': deviceDateTime,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    /* now it awaits the fetch ,the first part includes the root given by the variable API,the second by the category selected,
    then the method is set by the variable "send" */

    const res = await fetch(`${API}/${category}`, { method, ...send })

    /*  now, after receiving the response, it iterates through the content and creates a new element named "product-element" into the referred tag 
     for each of the keys, creates a slot into the span element with a name matching that of the key,and then turns the text content of the node
     to the value of the corresponding key, it then appends the created span to the referred "item" (in this case 'product-item') */

    const data = await res.json()
    for (const product of data) {
        const item = document.createElement('product-item')
        for (const key of ['name', 'rrp', 'info']) {
            const span = document.createElement('span')
            span.slot = key
            span.textContent = product[key]
            item.appendChild(span)
        }
        products.appendChild(item)
    }
}

// Get elements from DOM
const category = document.querySelector('#category')
const add = document.querySelector('#add')

let socket = null;
// Realtime orders via Websocket
const realtimeOrders = (category) => {
    if (socket === null) {
        socket = new WebSocket(`${WS_API}/orders/${category}`);
    } else {
        socket.send(
            // Send update-category command to server
            JSON.stringify({ cmd: "update-category", payload: { category } })
        );
    }
    // Listen for messages
    socket.addEventListener("message", ({ data }) => {
        try {
            const { id, total } = JSON.parse(data);
            const item = document.querySelector(`[data-id="${id}"]`);
            if (item === null) return;
            const span =
                item.querySelector('[slot="orders"]') || document.createElement("span");
            span.slot = "orders";
            span.textContent = total;
            item.appendChild(span);
        } catch (err) {
            console.error(err);
        }
    });
};

// Populate products on page load
category.addEventListener("input", async ({ target }) => {
    add.style.display = "block";
    await populateProducts(target.value);
    realtimeOrders(target.value);
});

// Add product form handler
add.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { target } = e;
    const payload = {
        name: target.name.value,
        rrp: target.rrp.value,
        info: target.info.value,
    };
    await populateProducts(category.value, "POST", payload);
    realtimeOrders(category.value);
    // Reset form
    target.reset();
});

// Define custom element
customElements.define(
    "product-item",
    class Item extends HTMLElement {
        constructor() {
            super();
            const itemTmpl = document.querySelector("#item").content;
            this.attachShadow({
                mode: "open"
            }).appendChild(itemTmpl.cloneNode(true));
        }
    }
);
