# Firebase & Cloud Firestore Setup Instructions

This guide walks you through setting up **Firebase**, **Cloud Firestore**, and **Firebase Storage** for your dynamic portfolio and admin panel.

---

## 🌟 Why Firebase for your Portfolio?
- **Always Online (24/7)**: Firebase Spark (Free Tier) **never pauses or sleeps** due to inactivity.
- **50,000 Free Reads / Day**: More than enough for high portfolio traffic.
- **Firebase Storage (5GB Free)**: Store and serve project thumbnails and PDF resumes with high performance.
- **Built-in Authentication**: Secure Admin dashboard login.

---

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **"Add project"** (or **"Create a project"**).
3. Enter a project name (e.g. `smv-portfolio` or `sean-velasco-portfolio`).
4. (Optional) Google Analytics: You can enable or disable it, then click **"Create project"**.
5. Wait for the project to finish creating, then click **"Continue"**.

---

## 2. Register your Web App & Get Credentials

1. On your project overview page in Firebase Console, click the **Web icon (`</>`)** to add a web app.
2. Enter an app nickname (e.g. `Portfolio Frontend`).
3. Leave "Firebase Hosting" unchecked for now, and click **"Register app"**.
4. Firebase will show a `firebaseConfig` object looking like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD...",
     authDomain: "smv-portfolio.firebaseapp.com",
     projectId: "smv-portfolio",
     storageBucket: "smv-portfolio.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
5. Copy these values to your root `.env` file.

---

## 3. Configure Local Environment Variables

Create or open `.env` in your project root and populate the values:

```env
# Firebase Web App Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=smv-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smv-portfolio
VITE_FIREBASE_STORAGE_BUCKET=smv-portfolio.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 4. Set up Cloud Firestore Database & Security Rules

1. In the Firebase Console left sidebar, click **"Build"** → **"Firestore Database"**.
2. Click **"Create database"**.
3. Choose a database location closest to your users (e.g. `asia-southeast1` for Singapore/Philippines or default `us-central1`).
4. Select **"Start in production mode"**, then click **"Create"**.

### Recommended Firestore Security Rules
Click the **"Rules"** tab in Firestore and paste these secure rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for portfolio visitors, write/edit restricted to authenticated admin
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /banner_skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /career_roadmap/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /messages/{document} {
      allow create: if true; // Allows visitors to send contact messages
      allow read, update, delete: if request.auth != null;
    }
    match /analytics/{document} {
      allow create, update: if true;
      allow read, delete: if request.auth != null;
    }

    // Default rule
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
Click **"Publish"** to apply the rules.

---

## 5. Collections & Initial Database Seeding

Once Firebase is connected, the admin panel at `/admin` will automatically offer 1-click database synchronization:

### Active Collections:
1. **`settings/hero`**:
   - `name`: `"Sean Marion Velasco"`
   - `role`: `"Web Developer – Full Stack"`
   - `yearsExperience`: `"2-3 years"`
   - `githubUrl`: `"https://github.com/Sapnu24"`
   - `upworkUrl`: `"https://www.upwork.com/freelancers/~01c5be6cda3726622f?mp_source=share"`
   - `email`: `"seanmarionvelasco.work@gmail.com"`

2. **`projects`**:
   - 10 configured projects with thumbnails, tags, categories (`Systems` / `Websites`), duration, and team info.

3. **`banner_skills`**:
   - 36 curated technologies across 4 marquee rows with auto icon mapping and `showInHero` flags.

---

## 6. Enable Firebase Authentication (for Admin Dashboard)

1. In Firebase Console sidebar, click **"Build"** → **"Authentication"**.
2. Click **"Get started"**.
3. In the **Sign-in method** tab, click **Email/Password**.
4. Toggle **Enable** (leave Email link disabled), and click **Save**.
5. Go to the **Users** tab and click **"Add user"**.
6. Enter your admin email (e.g. `seanmarionvelasco.work@gmail.com`) and your secure password.

Now you can log into `http://localhost:5173/admin` or `https://yourdomain.com/admin` with this email and password to manage all content dynamically!

---

## 7. Update Vercel Environment Variables

When deploying to Vercel:
1. Go to your [Vercel Dashboard](https://vercel.com).
2. Select your portfolio project.
3. Go to **Settings** → **Environment Variables**.
4. Add the 6 variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Trigger a **Redeploy** in Vercel.

---

## 8. Resilience & Fallback

Your codebase is built with an automatic offline/preview fallback:
- If Firebase environment variables are not yet configured or if Firestore has no documents, your portfolio automatically displays the built-in fallback data and caches local changes in `localStorage`.
