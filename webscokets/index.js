// Import necessary modules
const express = require('express'); // Express framework for handling HTTP requests
const http = require('http'); // Built-in Node.js module for creating an HTTP server
const { Server } = require('socket.io'); // Import Socket.IO for real-time communication

// Initialize Express app
const app = express(); // Create an instance of an Express application
const server = http.createServer(app); // Create an HTTP server and attach Express app to it
const io = new Server(server); // Initialize a new instance of Socket.IO with the HTTP server

// Declare variables to manage admin and clients
let adminSocket = null; // Variable to store the admin's socket connection
const clients = new Map(); // Create a Map to store client socket connections (socket.id -> socket)

// Serve static files from the 'public' directory
app.use(express.static('public')); // Serves HTML, CSS, and client-side JS files

// Handle a new client connection
io.on('connection', (socket) => { // Listens for a new client connection
    console.log(`User connected: ${socket.id}`); // Logs the user's unique socket ID

    socket.emit('client_id', socket.id); // Sends the client's unique ID to them after connection

    // Handle client registration as either an admin or normal user
    socket.on('register', (role) => { // Listens for 'register' event from the client
        if (role === 'admin') { // If the user is an admin
            adminSocket = socket; // Store the admin's socket
            console.log('Admin connected'); // Log that an admin has connected
        } else { // If the user is a normal client
            clients.set(socket.id, socket); // Store the client's socket in the clients Map
            console.log(`Client registered: ${socket.id}`); // Log the registration of a client
        }
    });

    // Handle private messaging between clients and the admin
    socket.on('private_message', ({ to, message }) => { // Listens for a 'private_message' event
        if (to === 'admin' && adminSocket) { // If the message is for the admin
            adminSocket.emit('message', { from: socket.id, message }); // Send message to the admin
        } else if (clients.has(to)) { // If the recipient is a normal client
            clients.get(to).emit('message', { from: socket.id, message }); // Send message to the client
        }
    });

    // Handle clients joining chat rooms
    socket.on('join_room', (room) => { // Listens for a 'join_room' event
        socket.join(room); // Add the client to the specified room
        console.log(`${socket.id} joined room: ${room}`); // Log room joining
    });

    // Handle sending messages to a specific room
    socket.on('room_message', ({ room, message }) => { // Listens for 'room_message' event
        io.to(room).emit('message', { from: socket.id, message }); // Send message to all users in the room
    });

    // Handle broadcasting messages to all connected users
    socket.on('broadcast', (message) => { // Listens for 'broadcast' event
        io.emit('message', { from: 'Admin', message }); // Send message to all clients
    });

    // Handle user disconnection
    socket.on('disconnect', () => { // Listens for 'disconnect' event
        clients.delete(socket.id); // Remove the client from the clients Map
        console.log(`User disconnected: ${socket.id}`); // Log that the user has disconnected
    });
});

// Start the server and listen on port 3000
server.listen(3000, () => { // Start the server
    console.log('Server running on http://localhost:3000'); // Log the server URL
});
