# SaaS Subscription Management API

A backend SaaS subscription management system built with Node.js, Express.js, MongoDB, and Mongoose. It provides user authentication, cookie-based sessions, subscription plans, plan upgrades, cancellations, and premium content access.

## Author

**Arman**

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- cookie-parser
- Postman

## Features

- User registration and login
- HTTP-only cookie-based authentication
- JWT verification middleware
- Subscription plan management
- User profile and dashboard APIs
- Subscribe to a plan
- Upgrade subscription plans
- Cancel subscriptions
- Premium content access control
- MongoDB database integration

## Project Structure

```text
firstproject/
├── config/
│   └── seedPlans.js
├── middleware/
│   └── auth/
│       └── authcheck.js
├── models/
│   ├── User.js
│   ├── plan.js
│   └── subscription.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── subscriptionRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd firstproject
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/saas
JWT_SECRET=replace_with_a_secure_random_secret
NODE_ENV=development
```

Never commit your `.env` file or expose your JWT secret.

## Run the Project

Start the development server:

```bash
npm run dev
```

The API will run at:

`http://localhost:5000`

Ensure MongoDB is running and your `package.json` includes the appropriate `dev` script.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in and set an authentication cookie |

### User

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/profile` | Get user profile |
| GET | `/user/dashboard` | Get subscription dashboard |
| GET | `/user/premium-content` | Access premium content |

### Subscriptions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/sub/plans` | Get available plans |
| POST | `/sub/subscribe` | Subscribe to a plan |
| PUT | `/sub/upgrade-plan` | Upgrade the current plan |
| POST | `/sub/cancel-subscription` | Cancel the current subscription |

Protected endpoints require a valid authentication cookie.

## Testing

Use Postman to test the API endpoints. Register an account, log in, retrieve the available plans, and test subscription operations using the plan IDs returned by the API.

## License

This project is developed for learning and portfolio purposes.
