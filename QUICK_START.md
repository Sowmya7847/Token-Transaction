# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14 or higher) installed
- MongoDB Atlas account (or local MongoDB)

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Configure Environment
Create a `.env` file in the project root with:
```env
PORT=3000
SESSION_SECRET=your-random-secret-key-here
MONGODB_URI=mongodb+srv://Sowmya:YOUR_PASSWORD@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
```

**Important:** Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password.

## Step 3: Verify Configuration
```bash
npm run verify
```

This will check:
- ✅ Environment variables are set
- ✅ MongoDB connection is working
- ✅ All dependencies are installed

## Step 4: Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Step 5: Access the Application
Open your browser and go to: **http://localhost:3000**

## First Steps
1. **Register a new account** at `/register`
2. **Login** at `/login`
3. **Create an admin user** (optional):
   - After registering, go to MongoDB Atlas
   - Find your user in the `users` collection
   - Set `isAdmin: true` in the user document

## Features Available
- ✅ User Authentication (Login/Register)
- ✅ Token Management (Deposit, Withdraw, Transfer, Burn)
- ✅ Transaction History with Pagination
- ✅ Reports & Analytics with Charts
- ✅ Admin Panel (User Management, Token Distribution)

## Troubleshooting

### MongoDB Connection Error
1. Check your `.env` file has the correct `MONGODB_URI`
2. Verify MongoDB Atlas Network Access allows your IP
3. Make sure your MongoDB password is correct
4. Check MongoDB Atlas cluster is running

### Port Already in Use
Change the `PORT` in `.env` to a different port (e.g., 3001)

### Session Issues
Make sure `SESSION_SECRET` is set in `.env` with a random string

## Need Help?
- Check `README.md` for detailed documentation
- See `MONGODB_SETUP.md` for MongoDB setup instructions
- Review `ENV_TEMPLATE.txt` for environment variable examples


