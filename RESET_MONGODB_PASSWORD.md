# 🔑 Reset MongoDB Atlas Password

## Option 1: Reset Existing User Password (Recommended)

### Steps:

1. **Go to MongoDB Atlas:**
   👉 https://cloud.mongodb.com/

2. **Login** to your account

3. **Go to Database Access:**
   - Click **Database Access** in the left menu
   - Or go directly: https://cloud.mongodb.com/v2#/security/database/users

4. **Find User "Sowmya":**
   - Look for user: **Sowmya**
   - Click the **...** (three dots) next to the user
   - OR click **Edit** button

5. **Reset Password:**
   - Click **Edit Password**
   - Enter a **new password** (remember this!)
   - Click **Update User**

6. **Copy the new password** and use it in your `.env` file

---

## Option 2: Create a New Database User

If you can't find the user or want to create a new one:

1. **Go to Database Access:**
   👉 https://cloud.mongodb.com/v2#/security/database/users

2. **Click "Add New Database User"**

3. **Choose Authentication Method:**
   - Select **Password**
   - Username: `Sowmya` (or any name you want)
   - Password: Create a strong password
   - **IMPORTANT:** Copy this password!

4. **Set User Privileges:**
   - Select **Atlas admin** (for full access)
   - OR **Read and write to any database**

5. **Click "Add User"**

6. **Use the new credentials in .env:**
   ```env
   MONGODB_URI=mongodb+srv://Sowmya:NEW_PASSWORD@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
   ```

---

## Option 3: Use Connection String from Atlas

1. **Go to MongoDB Atlas Dashboard:**
   👉 https://cloud.mongodb.com/

2. **Click "Connect"** button on your cluster

3. **Choose "Connect your application"**

4. **Copy the connection string** - it will look like:
   ```
   mongodb+srv://Sowmya:<password>@cluster0.zccv28f.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace `<password>`** with your actual password

6. **Add database name** before the `?`:
   ```
   mongodb+srv://Sowmya:YOUR_PASSWORD@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
   ```

---

## 📝 Quick Steps Summary

1. Login to MongoDB Atlas
2. Go to **Database Access**
3. Find user **Sowmya** → Click **Edit** → **Edit Password**
4. Set new password → **Update User**
5. Copy the password
6. Add to `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://Sowmya:NEW_PASSWORD@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
   ```

---

## ⚠️ Important Notes

- **Password must be URL-encoded** if it contains special characters:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

- **Example:** If password is `My@Pass#123`, use `My%40Pass%23123` in connection string

- **Or use a simple password** without special characters to avoid encoding issues

---

## 🚀 After Setting Password

1. Create `.env` file with your password
2. Run: `node server.js`
3. You should see: `✅ MongoDB Connected`

---

**Need help?** Let me know and I can guide you through any step!

