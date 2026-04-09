# Order Management System

## Setup Instructions

### 1. Start the Orders API
```bash
cd orders-api
npm install
npm start
```
The API will run on http://localhost:3001

### 2. Start the Frontend
```bash
cd ecommerce-app
npm run dev
```

## Features

### Checkout Page (`/checkout`)
- Shipping information form
- Order summary with cart items
- Places orders to the API
- Redirects to orders page on success

### Orders Page (`/orders`)
- Displays all orders for the logged-in user
- Shows order status (pending/completed)
- Lists all items in each order
- Shows order date and total

### Profile Page (`/profile`)
- User information display
- Quick view of recent orders
- Logout functionality
- Access to full orders list

## API Endpoints

- `GET /api/orders/:userId` - Get all orders for a user
- `POST /api/orders` - Create a new order

## Order Flow

1. User adds items to cart
2. User clicks "Proceed to Checkout" in cart
3. User fills shipping information
4. Order is posted to API
5. Cart is cleared
6. User is redirected to orders page
7. Orders are stored in `orders-api/orders.json`

## Navigation

- Header → Profile dropdown → Profile
- Header → Profile dropdown → Orders
- Cart → Checkout button → Checkout page
- Checkout → Place Order → Orders page
