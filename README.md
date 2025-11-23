# Token Transaction System

A secure, scalable token-based transaction system built with **EJS + Node.js + Express + MongoDB**.

## 🚀 Features

- **Secure Authentication** - Custom authentication with bcrypt password hashing
- **Token Management** - Create, transfer, burn, deposit, and withdraw tokens
- **Real-time Balance Tracking** - Live balance updates from MongoDB
- **Transaction History** - Complete transaction log with timestamps, status, and descriptions
- **Reports & Analytics** - Visual charts and statistics with Chart.js
- **Admin Panel** - User management, token distribution, and balance reset

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## 🛠️ Installation

**Quick Start**: See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed setup instructions.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   - **Option A:** MongoDB Atlas (Cloud - Recommended)
     - Go to: https://www.mongodb.com/cloud/atlas/register
     - Create free account and cluster
     - Get connection string
   - **Option B:** Local MongoDB
     - Download: https://www.mongodb.com/try/download/community
     - Install and start MongoDB

3. **Configure environment variables**
   - Create `.env` file (see `.env.template`)
   - Add your MongoDB connection string:
     ```env
     PORT=3000
     SESSION_SECRET=your-random-secret-key
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/token-system
     ```

4. **Start the server**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Start the server**
   ```bash
   npm start
   ```

2. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Register a new account or login
   - Start managing tokens!

## 👤 Creating an Admin User

After registering a user, update the user in MongoDB:

**Using MongoDB Compass or Atlas:**
1. Find the `users` collection
2. Find your user document
3. Set `isAdmin` field to `true`

**Using MongoDB Shell:**
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## 📁 Project Structure

```
token-transaction-system/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── transactionController.js  # Transaction logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   └── Transaction.js        # Transaction model
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       ├── main.js          # Main JavaScript
│       ├── tokens.js        # Token management JS
│       └── admin.js         # Admin panel JS
├── routes/
│   ├── admin.js             # Admin routes
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard routes
│   ├── reports.js           # Reports routes
│   ├── tokens.js            # Token routes
│   └── transactions.js      # Transaction routes
├── views/
│   ├── admin/               # Admin templates
│   ├── auth/                # Auth templates
│   ├── dashboard/           # Dashboard templates
│   ├── reports/             # Reports templates
│   ├── tokens/              # Token templates
│   ├── transactions/        # Transaction templates
│   └── partials/            # Shared partials
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                # Main server file
```

## 🔒 Security Notes

- Never commit `.env` to version control
- Use strong session secrets in production
- Use strong passwords for MongoDB
- Enable MongoDB authentication
- Use HTTPS in production

## 🚀 Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Create a Heroku app: `heroku create`
3. Set environment variables: `heroku config:set MONGODB_URI=your-connection-string`
4. Deploy: `git push heroku main`

### Deploy to Vercel/Railway/Render

1. Connect your repository
2. Set `MONGODB_URI` environment variable in the dashboard
3. Deploy!

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built using EJS + Node.js + Express + MongoDB**
