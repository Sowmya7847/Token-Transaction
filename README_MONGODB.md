# 🍃 Token Transaction System - MongoDB Version

## ✅ Migration Complete: Firebase → MongoDB

Your project has been successfully migrated from Firebase to MongoDB!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster
4. Create database user
5. Get connection string
6. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/token-system
   ```

**Option B: Local MongoDB**
1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Default connection: `mongodb://localhost:27017/token-system`
4. Add to `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/token-system
   ```

### 3. Create .env File
```env
PORT=3000
SESSION_SECRET=your-random-secret-key
MONGODB_URI=mongodb://localhost:27017/token-system
```

### 4. Start Server
```bash
node server.js
```

## ✅ What Changed

- ✅ **Database**: Firebase Firestore → MongoDB
- ✅ **Authentication**: Firebase Auth → Custom (bcryptjs)
- ✅ **No Billing Required**: MongoDB is free!
- ✅ **All Features Work**: Same functionality, simpler setup

## 📁 New Files

- `config/database.js` - MongoDB connection
- `models/User.js` - User model with password hashing
- `models/Transaction.js` - Transaction model
- `MONGODB_SETUP.md` - Detailed setup guide

## 🎯 Features (All Working)

- ✅ User Registration & Login
- ✅ Token Management (Create, Transfer, Burn, Deposit, Withdraw)
- ✅ Transaction History
- ✅ Reports & Analytics with Charts
- ✅ Admin Panel
- ✅ Real-time Balance Updates

## 🔧 Create Admin User

After registering, update user in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

Or use MongoDB Compass GUI to edit the user document.

## 🎉 Benefits

- ✅ **No Billing** - MongoDB is free
- ✅ **Simple Setup** - Just install and connect
- ✅ **Local or Cloud** - Your choice
- ✅ **Same Features** - Everything works the same

---

**Your project is ready! Just set up MongoDB and start the server!** 🚀

