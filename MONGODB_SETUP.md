# 🍃 MongoDB Setup Guide

## ✅ Great Choice! MongoDB is Much Simpler

No billing required! No complex setup! Just install and run.

## 🚀 Quick Setup (2 Options)

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Free tier includes:**
- 512 MB storage
- Shared cluster
- Perfect for development

**Steps:**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster
4. Create database user
5. Get connection string
6. Add to `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/token-system?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB (On Your Computer)

**Steps:**
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Default connection: `mongodb://localhost:27017/token-system`
5. Add to `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/token-system
   ```

## 📝 Update .env File

Create or update `.env` file:

```env
PORT=3000
SESSION_SECRET=your-random-secret-key
MONGODB_URI=mongodb://localhost:27017/token-system
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/token-system
```

## 🔧 Install Dependencies

```bash
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing

## ✅ Test Connection

```bash
node server.js
```

You should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on http://localhost:3000
```

## 🎉 Done!

Your project is now using MongoDB instead of Firebase!

**Benefits:**
- ✅ No billing required
- ✅ Simple setup
- ✅ Works locally or in cloud
- ✅ All features work the same

## 📚 Next Steps

1. Install dependencies: `npm install`
2. Set up MongoDB (Atlas or local)
3. Update `.env` with `MONGODB_URI`
4. Start server: `node server.js`
5. Register and test!

---

**Need help?** Check MongoDB Atlas docs: https://docs.atlas.mongodb.com/

