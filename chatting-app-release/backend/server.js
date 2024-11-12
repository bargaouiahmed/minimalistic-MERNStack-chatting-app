
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Message = require('./messages');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

const onlineUsers = {};

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Error connecting to MongoDB", e);
    }
};

app.use(express.json());
app.use(cors());
connectDb();

// User registration endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, friends: [], pendingRequests: [] });
        await user.save();
        res.status(200).json(user);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error registering user');
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, email });
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
});

// Handle real-time communication and friend request handling
io.on('connection', (socket) => {
    // Register online user
    socket.on('registerUser', async (email) => {
        onlineUsers[email] = socket.id;

        const user = await User.findOne({ email });
        if (user) {
            io.to(socket.id).emit('updateFriends', user.friends);
            io.to(socket.id).emit('pendingRequests', user.pendingRequests);
        }
    });

    // Friend request event
    socket.on('sendFriendRequest', async ({ sender, receiver }) => {
        const receiverUser = await User.findOne({ email: receiver });
        if (receiverUser && !receiverUser.friends.includes(sender)) {
            receiverUser.pendingRequests.push(sender);
            await receiverUser.save();

            const receiverSocketId = onlineUsers[receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('pendingRequests', receiverUser.pendingRequests);
            }
        }
    });

    // Accept or decline friend request
    socket.on('respondToFriendRequest', async ({ sender, receiver, action }) => {
        const senderUser = await User.findOne({ email: sender });
        const receiverUser = await User.findOne({ email: receiver });

        if (action === 'accept') {
            receiverUser.friends.push(sender);
            senderUser.friends.push(receiver);
        }
        receiverUser.pendingRequests = receiverUser.pendingRequests.filter(req => req !== sender);
        await receiverUser.save();
        await senderUser.save();

        const receiverSocketId = onlineUsers[receiver];
        if (receiverSocketId) io.to(receiverSocketId).emit('updateFriends', receiverUser.friends);
    });

    // Message event with offline handling
    socket.on('sendMessage', async ({ to, message, sender }) => {
        const senderUser = await User.findOne({ email: sender });
        if (senderUser && senderUser.friends.includes(to)) {
            const newMessage = new Message({ from: sender, to, text: message });
            await newMessage.save();

            const recipientSocketId = onlineUsers[to];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receiveMessage', { from: sender, text: message });
            }
        }
    });

    // Retrieve messages between two users
    app.get('/messages/:sender/:receiver', async (req, res) => {
        const { sender, receiver } = req.params;
        try {
            const messages = await Message.find({
                $or: [{ from: sender, to: receiver }, { from: receiver, to: sender }]
            }).sort({ createdAt: 1 });
            res.json(messages);
        } catch (e) {
            res.status(500).send('Server error');
        }
    });

    socket.on('disconnect', () => {
        for (let email in onlineUsers) {
            if (onlineUsers[email] === socket.id) {
                delete onlineUsers[email];
                break;
            }
        }
    });
});

const PORT = 5500;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
