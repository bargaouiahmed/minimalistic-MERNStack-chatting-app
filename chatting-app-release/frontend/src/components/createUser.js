import React, { useState } from 'react';

export const CreateUser = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.email || !formData.password) {
            console.error("Email and password are required!");
            setMessage("Email and password are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5500/register", {
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
            setMessage("User created successfully!");
            console.log(data);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setMessage("Error creating user. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 p-6 max-w-md mx-auto my-50" style={{backgroundColor:'#0E1125', padding:'50px', borderRadius:'20px', boxShadow:'20px 15px 10px 2px grey'}}>
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

                <div className="w-full flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {message && <p className=" p-5 text-center">{message}</p>}
        </div>
    );
};
