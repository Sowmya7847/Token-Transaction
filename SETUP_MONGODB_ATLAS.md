# 🍃 MongoDB Atlas Setup - Quick Guide

## ✅ Your MongoDB Atlas Connection

**Cluster:** `cluster0.zccv28f.mongodb.net`  
**Username:** `Sowmya`  
**Connection String:** `mongodb+srv://Sowmya:<db_password>@cluster0.zccv28f.mongodb.net/`

## 🚀 Quick Setup Steps

### Step 1: Get Your Database Password

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login to your account
3. Go to **Database Access** (left menu)
4. Find user: **Sowmya**
5. Click **Edit** or **...** → **Edit User**
6. If you forgot the password, click **Edit Password** and set a new one
7. **Copy the password** (you'll need it)

### Step 2: Update .env File

Create or update `.env` file in project root:

```env
PORT=3000
SESSION_SECRET=your-random-secret-key-here

# MongoDB Atlas Connection
# Replace YOUR_PASSWORD with your actual password from Step 1
MONGODB_URI=mongodb+srv://Sowmya:YOUR_PASSWORD@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
```

**Important:** 
- Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password
- Make sure to URL-encode special characters in password (e.g., `@` becomes `%40`)

### Step 3: Allow Network Access

1. In MongoDB Atlas, go to **Network Access** (left menu)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - OR add your current IP address
4. Click **Confirm**

### Step 4: Install Dependencies & Start

```bash
npm install
node server.js
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.zccv28f.mongodb.net
   Database: token-system
🚀 Server running on http://localhost:3000
```

## 🎉 Done!

Your project is now connected to MongoDB Atlas!

## 📝 Example .env File

```env
PORT=3000
SESSION_SECRET=my-super-secret-key-12345

MONGODB_URI=mongodb+srv://Sowmya:MyPassword123@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
```

## ⚠️ Troubleshooting

### "Authentication failed"
- Check your password is correct
- Make sure password is URL-encoded if it has special characters
- Verify username is correct: `Sowmya`

### "IP not whitelisted"
- Go to Network Access in MongoDB Atlas
- Add your IP or allow from anywhere

### "Connection timeout"
- Check your internet connection
- Verify cluster is running in MongoDB Atlas
- Try again after a few seconds

---

**Your MongoDB Atlas is ready! Just add your password to .env file!** 🚀

