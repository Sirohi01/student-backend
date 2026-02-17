const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config({ path: './.env' });

const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Socket.io connection handler
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        socket.on('studySessionUpdate', (data) => {
            // Broadcast to room
            socket.to(data.room).emit('sessionUpdate', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
};

startServer();
