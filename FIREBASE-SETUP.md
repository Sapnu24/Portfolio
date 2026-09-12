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
3. Enter a project name (e.g. `acierto-portfolio`).
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
     authDomain: "acierto-portfolio.firebaseapp.com",
     projectId: "acierto-portfolio",
     storageBucket: "acierto-portfolio.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
5. Copy these values to your `frontend/.env` file.

---

## 3. Configure Local Environment Variables

Open `frontend/.env` in your code and fill in the values:

```env
VITE_GEMINI_KEY=AIzaSyAS3nZ-aYbqWmccVhwQZqDwjfEyRFdf1sY

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=acierto-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=acierto-portfolio
VITE_FIREBASE_STORAGE_BUCKET=acierto-portfolio.firebasestorage.app
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
Click the **"Rules"** tab in Firestore and replace the rules with:

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
    match /skill_categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /career_roadmap/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /banner_skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /certifications/{document} {
      allow read: if true;
      allow write: if request.auth != null;
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

## 5. Set up Firebase Storage & Security Rules

1. In Firebase Console left sidebar, click **"Build"** → **"Storage"**.
2. Click **"Get started"**.
3. Choose security rules and your storage location (same as Firestore).
4. Click the **"Rules"** tab in Storage and use the following rules:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Project thumbnail images and Resume PDF files
    match /projects/thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /resumes/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Catch-all
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
Click **"Publish"** to apply the rules.

---

## 6. Collections & Data Schemas

### 1. `settings/hero` (or `profile`)
- `greeting` (string): e.g. `"Hi! I'm"`
- `name` (string): e.g. `"Neil Patrick Acierto"`
- `role` (string): e.g. `"Full-Stack Developer (Laravel PHP)"`
- `bio` (string): e.g. `"Full-stack developer focused on responsive design..."`
- `githubUrl` (string): e.g. `"https://github.com/Neil1227"`
- `facebookUrl` (string): e.g. `"https://facebook.com/DncngBlde"`
- `indeedUrl` (string): e.g. `"https://www.indeed.com/profile/yourprofile"`
- `yearsExperience` (string): e.g. `"1+"` (programming years)
- `resumeUrl` (string): Firebase Storage download URL or `/Acierto_Neil_Patrick_CV.pdf`

### 2. `skill_categories`
- `title` (string): e.g. `"Frontend Development"`
- `icon` (string): `"code" | "brush" | "server" | "users" | "laptop"`
- `color` (string): hex color code
- `skills` (array of strings): `["React JS", "HTML", "CSS", "JS"]`
- `order` (number)

### 3. `career_roadmap`
- `role` (string): e.g. `"Webapp Developer"`
- `company` (string): e.g. `"Pampanga State Agricultural University"`
- `period` (string): e.g. `"06/2025 - 06/2026"`
- `description` (string): Detailed responsibilities and accomplishments
- `tags` (array of strings): `["React JS", "Laravel PHP", "Bootstrap"]`
- `iconType` (string): `"briefcase" | "graduation" | "laptop" | "award"`
- `order` (number)

### 4. `banner_skills`
- `name` (string): e.g. `"React"`
- `iconKey` (string): `"react" | "laravel" | "php" | "mysql" | "python" | ...`
- `iconUrl` (string, optional): Custom icon image URL
- `isVisible` (boolean): `true | false`
- `order` (number)

### 5. `projects`
- `title` (string): e.g. `"RIET Website"`
- `description` (string): e.g. `"Official institutional website..."`
- `technologies` (array of strings): `["Laravel PHP", "MySQL", "Bootstrap", "JavaScript"]`
- `status` (string): `"Completed" | "Deployment" | "In progress"`
- `duration` (string): `"1 year"`
- `team` (string): `"Solo" | "Team"`
- `featured` (boolean): `true | false`
- `image` (string): Firebase Storage download URL or `/img/projects/riet.png`
- `demoUrl` (string): URL for demo
- `githubUrl` (string): URL for GitHub repo
- `order` (number)

---

## 7. Enable Firebase Authentication (for Admin Dashboard)

1. In Firebase Console sidebar, click **"Build"** → **"Authentication"**.
2. Click **"Get started"**.
3. In the **Sign-in method** tab, click **Email/Password**.
4. Toggle **Enable** (leave Email link disabled), and click **Save**.
5. Go to the **Users** tab and click **"Add user"**.
6. Enter your admin email (e.g. `neilpatrickacierto27@gmail.com`) and your secure password.

Now you can log into `http://localhost:5173/admin` with this email and password to manage all content dynamically!

---

## 8. Update Vercel Environment Variables

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

## 9. Resilience & Fallback

Your codebase is built with an automatic offline/preview fallback:
- If Firebase environment variables are not yet configured or if Firestore has no documents, your portfolio automatically displays the built-in fallback data and caches local changes in `localStorage`.
