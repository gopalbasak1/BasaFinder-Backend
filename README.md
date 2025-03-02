# Bike Store API

A robust and scalable REST API for managing bikes and orders, built using TypeScript, jwt, password salt, Node.js, Express, Mongoose and MongoDB.

## Live Deployment Link

[Bike-Store-Server](https://bike-store-ebon.vercel.app/)

## Features

- 🛒 **Bike Management:** Add, update, delete, and fetch bike details with strict validations.
- 👤 **User Management:** Add, update, and fetch user details securely.
- 🌟 **Review System:** Add and fetch customer reviews.
- 🛍️ **Order Management:** Create and manage orders with price calculations.
- 🔒 **Secure Authentication:** Uses JWT tokens and password hashing with bcrypt.
- 💳 **Secure Payment System:** Integration with ShurjoPay to handle payments securely and efficiently.
- Validation: Uses Generic for schema validation and ensures data integrity.
- TypeScript Support: Full TypeScript support for type safety and better developer experience.
- Environment Configuration: Manage sensitive information securely using dotenv.
- Code Quality: Integrated ESLint and Prettier for consistent code styling and linting.
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

1. Customer places an order via `/api/orders`.
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
git clone https://github.com/gopalbasak1/Bike-Store-Server.git
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

- Bikes
  - POST /api/products: Add a new bike.
  - GET /api/products: Fetch all bikes.
  - GET /api/products/:productId: Fetch a bike by ID.
  - PATCH /api/products/:productId: Update bike details.
  - DELETE /api/products/:productId: Delete a bike.
- Orders
  - POST /api/orders: Place a new order.
  - GET /api/orders: Fetch all order bikes.
  - GET /api/orders/revenue: Total revenue calculated from all orders.
- Reviews
  - POST /api/orders: Place a new order.
  - GET /api/orders: Fetch all order bikes.

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
