# Afflatus // Creator Collaboration Intelligence

Afflatus is a cinema-grade creative production platform featuring bidirectional crew matchmaking, structured brief parsing, and C1 AI Production Copilot.

---

## Architecture Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion layout animations, Lucide icons.
- **Backend Service**: Express.js proxy listening on port 3000, Vite middleware for development, and bundled self-contained CommonJS server (`dist/server.cjs`) for production.
- **AI Engine**: `@google/genai` TypeScript SDK with resilient multi-tier fallback ladder (`gemini-3.6-flash` -> `gemini-3.1-flash-lite` -> `gemini-flash-latest` -> `gemini-3.7-flash`).
- **Database & Auth**: Firebase Authentication (Google OAuth + Email/Password) and Cloud Firestore with owner-isolated security rules.

---

## 1. Prerequisites & Environment Setup

Ensure you have the Google Cloud SDK and Firebase CLI installed and authenticated:

```bash
# Log in to Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required Google Cloud APIs
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

---

## 2. Secret Management Setup

Do not store raw API keys in plain text. Create and manage the `GEMINI_API_KEY` secret dynamically with Google Cloud Secret Manager:

```bash
# 1. Create the secret in Secret Manager
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# 2. Add your Gemini API key payload
echo -n "YOUR_GEMINI_API_KEY_HERE" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 3. Grant the default Cloud Run Compute service account access to read the secret
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 3. Database Security Configuration (Cloud Firestore)

Deploy the owner-bound Firestore security rules to protect user data from unauthorized reads/writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Global default-deny safety net
    match /{document=**} {
      allow read, write: if false;
    }

    // Users collection: Publicly readable for creator directory & discovery; users can only modify their own profile
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects: Publicly readable; project creators (seekerId) can create, edit, or remove their own projects
    match /projects/{projectId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.seekerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.seekerId == request.auth.uid;
    }
    
    // Matches: Accessible only by the involved seeker or collaborator
    match /matches/{matchId} {
      allow read: if request.auth != null && (
        resource.data.seekerId == request.auth.uid ||
        resource.data.collaboratorId == request.auth.uid
      );
      allow create: if request.auth != null && (
        request.resource.data.seekerId == request.auth.uid ||
        request.resource.data.collaboratorId == request.auth.uid
      );
      allow update: if request.auth != null && (
        resource.data.seekerId == request.auth.uid ||
        resource.data.collaboratorId == request.auth.uid
      );
      allow delete: if request.auth != null && resource.data.seekerId == request.auth.uid;
    }
    
    // Project Workspaces: Production workspace, shot lists, and budget items
    match /workspaces/{projectId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

Deploy the rules using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 4. Cloud Run Production Deployment Flow

Deploy the containerized full-stack application directly to Google Cloud Run:

```bash
# Build and deploy service to Cloud Run
gcloud run deploy afflatus-app \
  --source . \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --set-env-vars="NODE_ENV=production"
```

---

## 5. Required Campaign Labeling

Apply the mandatory resource label to register the service for automated challenge verification:

```bash
gcloud run services update afflatus-app \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-southeast1
```

---

## 6. Firebase Auth Domain Whitelisting

After obtaining your production Cloud Run URL (e.g., `https://afflatus-app-xyz.a.run.app` or custom domain):
1. Navigate to **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized domains**.
2. Click **Add domain** and enter your Cloud Run host domain.
3. This enables seamless Google Sign-In popups in production without CORS or domain rejection errors.
