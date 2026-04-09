# Admin Dashboard

## Access

**URL:** `http://localhost:5173/admin`

## Built-in Credentials

```
Username: admin
Password: LightHub2026!
```

## Features

### 1. Overview Dashboard
- Total orders count
- Pending orders count
- Completed orders count
- Total revenue
- Recent orders table

### 2. Orders Management
- View all orders
- Update order status (dropdown)
- Order details:
  - Order ID
  - Customer name & email
  - Order date
  - Number of items
  - Total amount
  - Current status

**Order Statuses:**
- Pending
- Processing
- Shipped
- Delivered
- Completed
- Cancelled

### 3. Products Management
- Coming soon

### 4. Customers Management
- Coming soon

## API Endpoints Used

- `GET /api/orders/all` - Fetch all orders
- `PATCH /api/orders/:orderId/status` - Update order status

## Security

- Admin authentication required
- Session stored in localStorage
- Auto-redirect if not authenticated
- Logout functionality

## Navigation

- 📊 Overview - Dashboard with stats
- 📦 Orders - Full orders management
- 💡 Products - Product management (coming soon)
- 👥 Customers - Customer management (coming soon)
- 🚪 Logout - End admin session

## Usage

1. Navigate to `/admin`
2. Login with credentials
3. View dashboard statistics
4. Manage orders by updating status
5. Logout when done
