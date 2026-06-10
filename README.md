# Job Application Tracker

A full stack web app to track job applications, update their status, and monitor your progress through a live dashboard.

## 🔗 Live Demo
[job-tracker.vercel.app](https://your-link.vercel.app)

## 📸 Screenshot
![App Screenshot](./screenshot.png)

## ✨ Features
- Add and manage job applications
- Update application status (Applied, Interview, Offer, Rejected)
- Live dashboard with stats per status
- Delete applications
- Responsive design

## 🛠 Tech Stack
**Frontend:** React, Tailwind CSS, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Deployment:** Vercel (frontend), Render (backend)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### Installation

# Clone the repository
git clone https://github.com/yourusername/job-tracker.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

### Running the app

# Run backend
cd backend
npm run dev

# Run frontend
cd frontend
npm run dev

## 🔐 Environment Variables

Create a `.env` file in the backend folder:

MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5050

Create a `.env` file in the frontend folder:

VITE_API_URL=http://localhost:5050

## 👤 Author
**Your Name**  
GitHub: [@yourusername](https://github.com/Jafarscript)  
LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com)
