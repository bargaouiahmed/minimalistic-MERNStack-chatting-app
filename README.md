Chatting App
This project is a simple real-time chat application designed to strengthen understanding of websockets and Socket.io. It features real-time messaging and friend request functionality, with both a backend API and a frontend interface.

Project Structure
The repository is organized into three main parts:

Root: Contains Tailwind CSS dependencies for the frontend.
Backend: The Express.js API with Socket.io integration.
Frontend: The React-based UI for interacting with the chat features.
Prerequisites
Node.js installed on your system.
MongoDB for the database (you may use a local MongoDB instance or MongoDB Atlas for a hosted database).
A .env file for environment variables.
Setup Instructions
1. Clone the Repository
git clone https://github.com/bargaouiahmed/chatting-app-release.git
cd chatting-app-release
2. Create a .env File in the Backend Folder
Navigate to the backend folder and create a .env file to store the environment variables. This file should contain your MongoDB connection URI and JWT secret:

MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT secret>
3. Install Dependencies
Install the dependencies for each part of the application:

Root: Install Tailwind CSS dependencies

npm install
Backend: Navigate to the backend folder and install dependencies for the API server.


cd backend
npm install
Frontend: Navigate to the frontend folder and install dependencies for the React client.


cd ../frontend
npm install
4. Run the Application
To start each part of the application:

Backend Server: Navigate to the backend folder and start the server.


cd ../backend
npm start
The server should be running on http://localhost:5500 by default.

Frontend Client: Open a new terminal, navigate to the frontend folder, and start the React app.


cd ../frontend
npm start
The frontend will run on http://localhost:3000 by default.

5. Tailwind CSS
If Tailwind CSS needs to be built, run the following command from the root of the project:

npm run build
Features
User Registration & Authentication: Register and log in users with secure JWT-based authentication.
Real-Time Messaging: Send and receive messages instantly using Socket.io.
Friend Requests: Add and accept friends with real-time notifications.
Technologies Used
Frontend: React, Tailwind CSS
Backend: Express.js, MongoDB, Socket.io
Authentication: JSON Web Tokens (JWT)
Additional Notes
If you’re running MongoDB locally, ensure it is started before launching the backend server.
To manage dependencies effectively, make sure you’re in the correct folder (e.g., frontend or backend) before running any installation commands.
