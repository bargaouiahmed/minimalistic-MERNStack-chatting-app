import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5500');

export const ChatInterface = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState('');
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendRequestEmail, setFriendRequestEmail] = useState('');

    useEffect(() => {
        const userEmail = localStorage.getItem('User');
        if (!userEmail) navigate('/');

        // Register user on connection
        socket.emit('registerUser', userEmail);

        socket.on('updateFriends', (friendsList) => setFriends(friendsList));
        socket.on('pendingRequests', (requests) => setFriendRequests(requests));
        socket.on('receiveMessage', (message) => setMessages((prev) => [...prev, message]));

        return () => {
            socket.off('updateFriends');
            socket.off('pendingRequests');
            socket.off('receiveMessage');
        };
    }, [navigate]);

    useEffect(() => {
        if (selectedFriend) {
            fetchMessages(selectedFriend);
        }
    }, [selectedFriend]);

    const fetchMessages = async (friend) => {
        const userEmail = localStorage.getItem('User');
        try {
            const response = await axios.get(`http://localhost:5500/messages/${userEmail}/${friend}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = () => {
        if (!selectedFriend || !newMessage.trim()) {
            alert('Please select a friend and enter a message');
            return;
        }
        const sender = localStorage.getItem('User');
        socket.emit('sendMessage', { to: selectedFriend, message: newMessage, sender });
        setMessages((prev) => [...prev, { from: sender, text: newMessage }]);
        setNewMessage('');
    };

    const sendFriendRequest = () => {
        socket.emit('sendFriendRequest', { sender: localStorage.getItem('User'), receiver: friendRequestEmail });
        setFriendRequestEmail('');
    };

    const respondToFriendRequest = (email, action) => {
        socket.emit('respondToFriendRequest', { sender: email, receiver: localStorage.getItem('User'), action });
        setFriendRequests(friendRequests.filter((req) => req !== email));
        if (action === 'accept') setFriends((prev) => [...prev, email]);
    };

    const handleLogout = () => {
        localStorage.removeItem('User');
        navigate('/');
    };

    return (
        
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat Interface</h1>


            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>

            <div className="mb-6 w-full max-w-lg">
                <input
                    value={friendRequestEmail}
                    onChange={(e) => setFriendRequestEmail(e.target.value)}
                    placeholder="Friend email"
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <button
                    onClick={sendFriendRequest}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
                >
                    Send Friend Request
                </button>
            </div>

            <div className="mb-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Pending Friend Requests</h2>
                {friendRequests.map((email, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 bg-white p-3 rounded shadow">
                        <span className="font-medium text-gray-800">{email}</span>
                        <div>
                            <button
                                onClick={() => respondToFriendRequest(email, 'accept')}
                                className="mr-2 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => respondToFriendRequest(email, 'decline')}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Friends</h2>
                <select
                    onChange={(e) => setSelectedFriend(e.target.value)}
                    value={selectedFriend}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Select Friend</option>
                    {friends.map((friend, index) => (
                        <option key={index} value={friend}>
                            {friend}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Messages</h2>
                <div className="bg-white p-4 rounded shadow max-h-64 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <strong className="text-gray-800">{msg.from}:</strong> <span className="text-gray-600">{msg.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-lg flex items-center">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow px-4 py-2 border rounded-l"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
