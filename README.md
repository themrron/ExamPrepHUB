# ExamPrepHUB - React & Firebase Starter

This is a starter boilerplate for the ExamPrepHUB web application, using React for the frontend and Firebase for the backend services (Authentication, Firestore, Storage).

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- A Firebase project (see setup instructions below)

## Firebase Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new Firebase project or use an existing one.
3.  **Enable Authentication:**
    *   Go to Authentication > Sign-in method.
    *   Enable "Email/Password" and "Google" providers.
4.  **Enable Firestore Database:**
    *   Go to Firestore Database > Create database.
    *   Start in **test mode** for initial development.
    *   **IMPORTANT:** Secure your database with Firebase Security Rules before going to production.
5.  **Enable Storage:**
    *   Go to Storage > Get started.
    *   Note the default bucket rules (test mode allows reads/writes if authenticated). Secure these for production.
6.  **Register your Web App:**
    *   In your Firebase project settings (Project Overview > gear icon > Project settings).
    *   Under "Your apps", click the web icon (`</>`) to add a web app.
    *   Copy the `firebaseConfig` object provided.
7.  **Configure Environment Variables:**
    *   Create a `.env` file in the root of this project.
    *   Copy the content of `.env.example` (if provided) or add the following:
      ```
      REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
      REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
      REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
      REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
      REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"
      ```
    *   Replace `YOUR_...` values with your actual Firebase project configuration details.
    *   **IMPORTANT:** Add `.env` to your `.gitignore` file to prevent committing your Firebase credentials.

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Next Steps

This starter provides:
- Firebase setup
- Basic User Authentication (Email/Password, Google)
- Basic Question Paper listing (from Firestore)
- Basic Question Paper upload (to Firestore metadata & Cloud Storage for PDF)
- Admin-only route for uploading papers.

To build the full **ExamPrepHUB** application, you will need to:
- Implement detailed **Firebase Security Rules** for Firestore and Storage.
- Develop **Cloud Functions** for:
    - Automated exam scoring.
    - Sending notifications (FCM).
    - Data aggregation for analytics.
    - Complex admin actions.
- Build out the **Online Timed Exams** feature.
- Implement **Performance Tracking** and analytics.
- Create a comprehensive **Admin Panel** for managing content and users.
- Enhance UI/UX, add filtering, searching, pagination.
- Implement offline capabilities (PWA features if desired).
- Write unit, integration, and end-to-end tests.

## Firebase Security Rules (Placeholder - VERY IMPORTANT)

You **MUST** write robust security rules. Here's a very basic starting point for `firestore.rules`:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users: Allow users to read/write their own profile, admins can read all
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null; // Or more specific for signup
      allow list: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; // Admins can list users
    }

    // Question Papers: Allow authenticated users to read published, admins to CRUD
    match /questionPapers/{paperId} {
      allow read: if request.auth != null && resource.data.isPublished == true;
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
