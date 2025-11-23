# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database** (Start in test mode for now)
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate New Private Key**
   - Save the downloaded JSON file as `serviceAccountKey.json` in the project root

3. **Environment Variables**
   - Copy `.env.example` to `.env` (or create `.env` manually)
   - Get your Firebase config from **Project Settings** > **General** > **Your apps** > **Web app**
   - Fill in the values:
     ```env
     PORT=3000
     SESSION_SECRET=change-this-to-a-random-string
     FIREBASE_API_KEY=your-api-key-here
     FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     FIREBASE_APP_ID=your-app-id
     ```

4. **Firestore Security Rules**
   Update your Firestore rules in Firebase Console:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
       match /transactions/{transactionId} {
         allow read: if request.auth != null;
         allow write: if false; // Only server can write transactions
       }
     }
   }
   ```

5. **Create Admin User**
   - Register a user through the web interface
   - Go to Firebase Console > Firestore
   - Find the `users` collection
   - Open your user document
   - Add field: `isAdmin` (boolean) = `true`

6. **Run the Server**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open `http://localhost:3000`
   - Login or register
   - Start using the system!

## Troubleshooting

### "serviceAccountKey.json not found"
- Make sure you downloaded the service account key from Firebase Console
- Place it in the project root directory
- The file should be named exactly `serviceAccountKey.json`

### "Firebase initialization error"
- Check that all environment variables in `.env` are correct
- Verify your Firebase project ID matches
- Ensure Firestore is enabled in your Firebase project

### "Permission denied" errors
- Check your Firestore security rules
- Make sure Authentication is enabled
- Verify the user document exists in Firestore

### Session not persisting
- Check that `SESSION_SECRET` is set in `.env`
- Clear browser cookies and try again
- Ensure cookies are enabled in your browser

## Production Deployment

1. **Set Environment Variables**
   - Use your hosting platform's environment variable settings
   - Never commit `.env` or `serviceAccountKey.json` to git

2. **Service Account Key**
   - Upload `serviceAccountKey.json` as a secret file
   - Or use environment variable `FIREBASE_SERVICE_ACCOUNT` with JSON content

3. **Update Session Secret**
   - Use a strong, random string for `SESSION_SECRET`
   - Generate one: `openssl rand -base64 32`

4. **Enable HTTPS**
   - Most platforms provide HTTPS automatically
   - Update Firebase authorized domains if needed

5. **Firestore Rules**
   - Update security rules for production
   - Test thoroughly before going live

