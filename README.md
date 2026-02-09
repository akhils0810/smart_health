# Smart Health Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application for tracking daily health activities and diet.

## Features

- **User Authentication**: Register and Login with JWT authentication.
- **Dashboard**: View BMI status, daily calorie summary (burned vs consumed), and weekly progress charts.
- **Activity Tracker**: Log exercises and view history.
- **Diet Tracker**: Log meals and view daily intake.
- **Profile**: View and update personal health details (Age, Gender, Height, Weight).

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following content:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/smart-health-tracker
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and go to `http://localhost:5173`.
2. Register a new account.
3. Log in to access the dashboard.
4. Add activities and meals to see your stats update.
