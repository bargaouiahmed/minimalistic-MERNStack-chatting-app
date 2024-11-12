import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthorizedContext } from '../index.js';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5500'); // Connect to the Socket.io server

export const Form = () => {
    const { setIsAuthed } = useContext(AuthorizedContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //fetch user and authenticate them
        if (!formData.email || !formData.password) {
            setMessage("Email and password are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5500/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setToken(data.token);
            setMessage("Login successful!");

            setIsAuthed(true);
            localStorage.setItem('isAuthed', 'true');
            localStorage.setItem('User', data.email);

            socket.emit('registerUser', data.email); // Register socket by email

            // After login, navigate to the chat page
            navigate('/chat');
        } catch (error) {
            console.error('Login failed:', error);
            setMessage("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center space-y-4 p-6 max-w-md mx-auto my-50"
                style={{
                    backgroundColor: '#0E1125',
                    padding: '50px',
                    borderRadius: '20px',
                    boxShadow: '20px 15px 10px 2px grey'
                }}
            >
                <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-2 text-sm font-medium text-white">Email:</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-black h-10 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="password" className="mb-2 text-sm font-medium text-white">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-black h-10 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-md mt-4">Login</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};
