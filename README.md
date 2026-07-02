# Cruise0 — Auth0 Demo App

A React SPA demonstrating Auth0 identity features, built for the Okta TAM Technical Challenge.

## Features

- **Universal Login** — Auth0-hosted login page with email/password and Google social login
- **Email Verification Guard** — Users with unverified emails are blocked from the app
- **Account Linking** — Logging in with Google automatically links to an existing email/password account via Post-Login Action

## Tech Stack

- React + Vite (SPA)
- @auth0/auth0-react SDK
- Auth0 Post-Login Action (Node.js) for account linking via Management API

## Setup

### Prerequisites
- Node.js v18+
- An Auth0 tenant

### Install & Run

```bash
npm install
npm run dev
```

### Environment Variables

Create :

```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-spa-client-id
```

### Auth0 Configuration

**Application settings (Single Page Application):**
- Allowed Callback URLs: 
- Allowed Logout URLs: 
- Allowed Web Origins: 

**Social Connection:**
- Enable Google OAuth2 in Auth0 dashboard → Authentication → Social

**Account Linking (Post-Login Action):**

Create a Post-Login Action with these secrets:
| Key | Value |
|-----|-------|
| AUTH0_DOMAIN | your-tenant.auth0.com |
| AUTH0_CLIENT_ID | M2M app client ID |
| AUTH0_CLIENT_SECRET | M2M app client secret |

The M2M application needs  and  permissions on the Auth0 Management API.

## How Account Linking Works

1. User signs up with email/password →  identity created
2. User logs in with Google (same email) → Post-Login Action triggers
3. Action fetches a Management API token via client credentials
4. Action finds the existing  user by email
5. Action links the Google identity to the existing user
6. Result: one user profile with two linked identities

## Project Structure

```
src/
  main.jsx     # Auth0Provider setup
  App.jsx      # Main app with auth state handling
action/
  link-accounts.js           # Post-Login Action (Account Linking) — deployed on Auth0
  block-disposable-emails.js # Pre-Registration Action — deployed on Auth0
```
