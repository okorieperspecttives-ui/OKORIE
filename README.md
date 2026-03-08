# AI Trade Journal

AI Trade Journal is a Next.js web app for AI-assisted trading journaling, with a minimal landing page, theme toggle (light/dark), and Firebase-backed authentication.

## Features

- Token-based light/dark theme system from `app/globals.css`
- Global top-right theme toggle
- Focused home CTA flow to `/auth`
- Authentication page with:
  - Email/password sign in & sign up
  - Strict email and password validation
  - Google sign-in via Firebase Auth

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

Create a `.env.local` file in the project root and set:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then in Firebase Console:

1. Enable **Email/Password** under Authentication > Sign-in method.
2. Enable **Google** as a provider.
3. Add your local domain (for dev) in authorized domains if required.

## Validation Rules Implemented

- Email must match standard email format
- Password must include:
  - at least 12 characters
  - uppercase letter
  - lowercase letter
  - number
  - special character
  - no spaces

## Build & Lint

```bash
npm run lint
npm run build
```
