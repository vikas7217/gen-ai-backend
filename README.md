# Authentication System Backend

## Overview

This project is a secure and scalable User Authentication and Authorization System built using Node.js, Express.js, MongoDB, Redis, JWT, and Google OAuth.

The system provides complete user authentication functionality including user registration, login, logout, password recovery, email verification using OTP, Google OAuth authentication, JWT-based authorization, refresh token management, and token blacklisting.

The application is containerized using Docker and can be deployed locally, on cloud platforms, or through Docker Hub.

---

# Features

## User Registration

* Register new users using email and password.
* Passwords are securely hashed before storage.
* User information is stored in MongoDB.

## User Login

* Secure login using email and password.
* JWT Access Token generated after successful authentication.
* Refresh Token generated for session management.
* Tokens are stored in secure HTTP-only cookies.

## JWT Authentication

* Access Token validation on every protected API request.
* Middleware-based route protection.
* Unauthorized requests are rejected automatically.

## Refresh Token Mechanism

* Generates a Refresh Token during login.
* Allows users to obtain new Access Tokens without logging in again.
* Improves security and user experience.

## Logout

* User logout functionality.
* Access Tokens are blacklisted after logout.
* Blacklisted tokens are stored in Redis.
* Prevents reuse of invalidated tokens.

## Token Blacklisting

* Redis-based token blacklist implementation.
* Every incoming token is checked against Redis.
* Blacklisted tokens are denied access immediately.

## OTP Verification

* OTP is sent to the user's registered email address.
* OTP is temporarily stored in Redis.
* OTP expiration is managed automatically.
* User verification occurs only when the submitted OTP matches the stored OTP.

## Forgot Password

* Users can request password reset links or OTPs.
* Verification process ensures account ownership.
* Secure password reset workflow.

## Reset Password

* Allows users to create a new password after verification.
* Passwords are securely hashed before storage.

## Google OAuth Authentication

* Login and registration using Google Account.
* OAuth integration implemented using Google APIs.
* Seamless social authentication experience.

## Docker Support

* Dockerized backend application.
* Easy deployment across different environments.
* Docker Hub image available for quick setup.

---

# Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Cache & Session Management

* Redis

### Authentication

* JWT (JSON Web Token)
* Refresh Tokens
* Google OAuth

### Email Service

* Nodemailer

### Containerization

* Docker

---

# System Flow

1. User registers with email and password.
2. Password is hashed and stored in MongoDB.
3. User logs in.
4. Access Token and Refresh Token are generated.
5. Tokens are stored in secure cookies.
6. Protected routes validate JWT tokens.
7. Logout operation blacklists tokens in Redis.
8. OTP verification uses Redis for temporary storage.
9. Password reset process verifies user identity before updating credentials.
10. Google OAuth provides alternative authentication.

---

# Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
PORT=

MONGO_URI=

JWT_SECRET=

REDIS_HOST=
REDIS_PORT=
REDIS_PROVIDER=

NOTIFY_EMAIL=
NOTIFY_EMAIL_PASSWORD=

HOST=
MAIL_PORT=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

ORIGIN_ALLOW=
```

## Important

Replace all environment variable values with your own credentials and configuration before running the application.

Never commit your `.env` file to GitHub.

---

# Installation

## Clone Repository

```bash
git clone <repository-url>

cd <project-folder>
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Start Production Server

```bash
npm start
```

---

# Docker Setup

## Build Docker Image

```bash
docker build -t auth-system .
```

## Run Docker Container

```bash
docker run -p 5000:5000 auth-system
```

## Pull From Docker Hub

```bash
docker pull <your-dockerhub-image>
```

## Run Docker Hub Image

```bash
docker run -p 5000:5000 <your-dockerhub-image>
```

---

# Redis server 
```bash

docker run -p 6379:6379 -d redis:8.0-rc1
```

```bash
npm install redis
```

# Security Features

* Password Hashing
* JWT Authentication
* Refresh Token Rotation
* Secure Cookies
* Redis Token Blacklisting
* OTP Expiration Management
* Environment Variable Protection
* Protected Routes Middleware
* Google OAuth Authentication

---

# API Modules

* User Registration
* User Login
* User Logout
* Refresh Token
* OTP Verification
* Forgot Password
* Reset Password
* Google OAuth Login
* Protected Route Authorization

---

# Future Enhancements

* Role-Based Access Control (RBAC)
* Multi-Factor Authentication (MFA)
* Email Verification Workflow
* Session Management Dashboard
* Audit Logs
* Rate Limiting and Brute Force Protection

---

# Author

Developed as a secure authentication backend solution using Node.js, MongoDB, Redis, JWT, Google OAuth, and Docker.
