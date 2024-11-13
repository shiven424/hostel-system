# Hostel Mate Project

Hostel Mate is a web application that allows students to request room allocations, and admins/wardens to manage and assign rooms based on availability and preferences. This project has a frontend built with React and a backend powered by Flask, connecting to a MongoDB database.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Project Overview

The Hostel Mate application is designed to streamline room allocation processes for students, wardens, and administrators in hostel environments. 

### Features

- **Student Dashboard**: Students can submit room requests with preferences.
- **Admin Dashboard**: Admins can view, approve, and assign hostels to students.
- **Warden Dashboard**: Wardens can view requests for their hostel, approve/reject requests, and manage student room requests.

### Tech Stack

- **Frontend**: React, Chakra UI
- **Backend**: Flask, MongoDB
- **Database**: MongoDB (Local or cloud instance)

---

## Prerequisites

Make sure the following software is installed before proceeding:

- **Node.js** (v12 or later): [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js. Verify with `npm -v`.
- **Python** (v3.8 or later): [Download Python](https://www.python.org/downloads/)
- **pip**: Included with Python installation. Verify with `pip --version`.
- **MongoDB**: Local instance or cloud database (e.g., MongoDB Atlas). [Download MongoDB](https://www.mongodb.com/try/download/community)

---

## Project Structure

```bash
├── backend/                    # Backend (Flask + MongoDB) 
│ ├── main.py                   # Main Flask app 
│ ├── database.py               # Database connection and functions 
│ ├── collections_format.py     # Database connection and functions 
│ └── requirements.txt          # Python dependencies 
│ 
└── frontend/                   # Frontend (React)
 ├── src/                       # React source files 
 │ ├── api/                     # API functions 
 │ ├── components/              # UI components 
 │ ├── pages/                   # React pages 
 │ └── App.js                   # Main App component 
 └── package.json               # Frontend dependencies
```

## Installing Dependencies

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/hostel-mate.git
cd hostel-mate
```
### Backend Setup

Navigate to the Backend Directory:
```bash
cd backend
```
Install Python Dependencies:
```bash
pip install -r requirements.txt
```
### Frontend Setup

Navigate to the Frontend Directory:
```bash
cd ../frontend
```
Install Node.js Dependencies:
```bash
npm install
```
## Running the Project
After completing the backend and frontend setup:

### 1. Start the Backend Server
From the backend directory, activate the virtual environment if necessary and start the Flask server:
```bash
python main.py
```
The backend server will start at http://127.0.0.1:5000.

### 2. Start the Frontend Server
Open a new terminal, navigate to the frontend directory, and run:
```bash
npm start
```
The frontend server will start at http://localhost:3000.

Access the Application
Once both servers are running, open http://localhost:3000 in your browser to access the application.

## Troubleshooting

- **Module Not Found Errors:** Ensure all dependencies are installed with pip install -r requirements.txt (backend) and npm install (frontend).
- **MongoDB Connection Issues:** Ensure MongoDB is running and MONGO_URI in .env is correct.
- **CORS Issues:** If there are CORS errors, make sure the Flask CORS extension is configured properly in the backend.
- **Environment Variable Issues:** Verify .env files are correctly set up and referenced in both frontend and backend.

## Additional Resources
Flask Documentation

MongoDB Documentation

React Documentation

Chakra UI Documentation
