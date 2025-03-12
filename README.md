# BasaFinder API

BasaFinder is a full-stack web application providing a smart rental housing solution. The backend is built with Node.js, Express.js, and MongoDB, implementing JWT authentication, role-based access control, and secure password hashing using bcrypt. It facilitates rental listings, user management, rental requests, and payment handling.

## Live Deployment Link

[Bike-Store-Server](https://basafinder-backend-one.vercel.app/)

## Features

- 🛒 **Authentication & Authorization:**
- Custom JWT-based authentication

- Password hashing using bcrypt

- Role-based access control (Admin, Landlord, Tenant)

- 🛒 **CRUD Operations:**
- Manage rental listings

- Submit and process rental requests

- Admin controls for user and listing management

- 👤 **Rental Management:**
- Submit and process rental requests

- Admin controls for user and listing management

- 🌟 **Search & Filter:**
- Search by location, price range, and district, division

- 💳 **Payments:**
- Payment integration after request approval (ShurjoPay)

- 📨 **Email Notifications:**
- Automated email updates for rental requests.

- Development Tools:
  - Live reload with ts-node-dev.
  - Build with tsc.
  - Lint and format code using Prettier and ESLint.

## Tech Stack

**Dependencies:** Node, Express, mongoose, dotenv, cors, shurjopay

**Dependencies:** typescript, ts-node-dev, prettier, eslint-config-prettier, @typescript-eslint/_, @types/_

- **Server:** ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
- **Framework:** ![Express](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white)
- **Database:** ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)
- **Language:** ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
- **Payment Gateway:** ![SurjoPay](https://img.shields.io/badge/-SurjoPay-FF4500)

## Secure Payment Integration with SurjoPay

This project integrates **SurjoPay**, a reliable and secure payment gateway, to manage customer payments efficiently. Here are the key benefits of using SurjoPay:

- **Encryption:** End-to-end encryption to protect sensitive financial data.
- **Fraud Prevention:** Advanced mechanisms to detect and prevent fraudulent transactions.
- **Seamless Checkout:** Provides a fast and user-friendly checkout experience for customers.
- **Multi-currency Support:** Allows customers to pay using various currencies.
- **Payment Status:** Automatic order status updates based on payment confirmations.

### Payment Flow

1. Customer places an request via `/api/rental-request/pay-rental-request`.
2. SurjoPay processes the payment.
3. Upon successful payment, the order is marked as "Paid" in the system.
4. Payment confirmation or failure is handled through secure callbacks.

## Prerequisites

Ensure you have the following installed:

- Node.js (>=16.x)
- npm or yarn
- MongoDB (running locally or a hosted instance)

## Getting Started

## 1 Clone the Repository

```bash
git clone https://github.com/gopalbasak1/BasaFinder-Backend.git
cd Bike-Store-Server
```

## 2 Install Dependencies

```bash
npm install
```

## 3 Environment Setup

Create a .env file in the root directory and configure the following variables:

```bash
(DATABASE_URL) MONGO_URI=<your-mongodb-connection-string>
PORT=<port-number>
```

## 4 Run the Project

- Development: Start the server with hot reloading:

```bash
npm run dev
```

- Production: Build and start the server: Start the server with hot reloading:

```bash
npm run build
npm start:prod
```

### Configuration

To set up SurjoPay, configure the following environment variables in your `.env` file:

````bash
SURJOPAY_SP_ENDPOINT=<add-sp-endpoint>
SURJOPAY_SP_USERNAME=<add-sp-username>
SURJOPAY_SP_PASSWORD=<your-sp-password>
SURJOPAY_SP_PREFIX=<add-SP>
SURJOPAY_SP_RETURN_URL=<your-localhost(frontend)-orders-verify>

## 5 API Endpoints

- **API Endpoints**

 **Authentication**
  - POST /auth/register - Register a new user.
  - POST /auth/login - User login & JWT token generation.

 **Tenant**
 - POST /rental-request/tenants/requests - Create rental request

 - GET /rental-request/tenants/requests - Get tenant’s rental requests
 - POST /rental-request/pay-rental-request - make payment tenant’s rental requests

 - POST /rental-request/verify - verify payment tenant’s rental requests

 - PATCH /api/users/:id - Update tenant profile


 **Landlord**

 - POST /rental/landlords/listings - Create a rental listing

 - GET /rental/landlords/listings - Get all listings by landlord

 - PATCH /rental/landlords/listings/:id - Update listing

 - DELETE /rental/landlords/listings/:id  - Delete listing

 - GET /rental-request/landlords/requests - Get rental requests

 - PUT /rental-request/landlords/requests/:id - Approve/Reject request


 **Admin**

 - GET /api/users/admin- Retrieve all users
 - PUT /api/users/admin/users/:id- Update user role
 - POST /api/users/admin/change-status/:id- Update user active or in-active

 - DELETE /api/users/admin/:id- Delete user

 - GET /api/rental/admin/landlords/listings - Retrieve all listings

 - GET /api/rental-request/admin/requests - Retrieve all listings request

 - PUT /api/rental/admin/listings/:id - Update listing

 - PUT /api/rental/admin/listings/:id - Delete listing

## Scripts

- `npm run dev`: Run the server in development mode with hot reload.
- `npm run build`: Build the project using TypeScript.
- `npm run start:prod`: Run the production build.
- `npm run lint`: Run ESLint for linting TypeScript files.
- `npm run lint:fix`: Automatically fix linting issues.
- `npm run prettier`: Format files using Prettier.
- `npm run prettier:fix`: Fix and format files with Prettier.

## Project Structure

```bash
plaintext

src/
├── controllers/   # Request handlers
├── interfaces/    # TypeScript interfaces
├── models/        # Mongoose schemas
├── routes/        # API route definitions
├── server.ts      # Application entry point

````

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License. See the LICENSE file for details.
