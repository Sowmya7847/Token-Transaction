# 🔑 Quick Password Setup Guide

## 🎯 Simple Steps to Get Your Password

### Step 1: Reset Password in MongoDB Atlas

1. **Open this link:**
   👉 https://cloud.mongodb.com/v2#/security/database/users

2. **Find user "Sowmya"** in the list

3. **Click the 3 dots (...)** next to the user OR click **Edit**

4. **Click "Edit Password"**

5. **Enter a NEW password** (make it simple, like: `MyPassword123`)
   - **IMPORTANT:** Write it down or remember it!

6. **Click "Update User"**

7. **Copy the password** you just set

---

### Step 2: Create .env File

Create a file named `.env` in your project root with this content:

```env
PORT=3000
SESSION_SECRET=my-secret-key-12345

MONGODB_URI=mongodb+srv://Sowmya:YOUR_PASSWORD_HERE@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
```

**Replace `YOUR_PASSWORD_HERE` with the password you just set!**

---

### Step 3: Allow Network Access

1. **Go to Network Access:**
   👉 https://cloud.mongodb.com/v2#/security/network/whitelist

2. **Click "Add IP Address"**

3. **Click "Allow Access from Anywhere"** (for development)

4. **Click "Confirm"**

---

### Step 4: Test Connection

Run:
```bash
node server.js
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.zccv28f.mongodb.net
🚀 Server running on http://localhost:3000
```

---

## 💡 Example .env File

If your password is `MyPassword123`, your `.env` should be:

```env
PORT=3000
SESSION_SECRET=my-secret-key-12345

MONGODB_URI=mongodb+srv://Sowmya:MyPassword123@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
```

---

## ⚠️ If Password Has Special Characters

If your password contains `@`, `#`, `$`, etc., you need to URL-encode them:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

**OR** just use a simple password without special characters!

---

## 🆘 Still Can't Find User?

**Create a NEW user:**

1. Go to: https://cloud.mongodb.com/v2#/security/database/users
2. Click **"Add New Database User"**
3. Username: `Sowmya` (or any name)
4. Password: Set a password
5. Privileges: **Atlas admin**
6. Click **"Add User"**
7. Use the new credentials in `.env`

---

**Follow these steps and you'll be connected in 2 minutes!** 🚀

