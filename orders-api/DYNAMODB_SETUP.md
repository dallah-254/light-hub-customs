# Orders System - DynamoDB Setup

## ✅ DynamoDB Table Created

**Table Name:** `LightHubOrders`
**Region:** us-east-1
**Status:** Active

### Table Schema

**Primary Key:**
- `orderId` (String, HASH) - Unique order identifier (e.g., ORD-1712345678901)

**Global Secondary Index:**
- **UserIdIndex**
  - Partition Key: `userId` (String)
  - Sort Key: `createdAt` (String)
  - Allows querying all orders for a specific user, sorted by date

### Order Attributes

```json
{
  "orderId": "ORD-1712345678901",
  "userId": "user@example.com",
  "items": [
    {
      "productId": "123",
      "name": "Product Name",
      "price": 1500.00,
      "quantity": 2,
      "image": "url"
    }
  ],
  "subtotal": 3000.00,
  "shipping": 200.00,
  "total": 3200.00,
  "shippingInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0712345678",
    "address": "123 Main St",
    "apartment": "Apt 4B",
    "city": "Nairobi",
    "county": "Nairobi",
    "postalCode": "00100"
  },
  "deliveryMethod": "standard",
  "paymentMethod": "mpesa",
  "orderNotes": "Please call before delivery",
  "status": "pending",
  "createdAt": "2026-04-09T20:45:00.000Z",
  "updatedAt": "2026-04-09T20:45:00.000Z"
}
```

### Order Status Values

- `pending` - Order placed, awaiting processing
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order delivered to customer
- `completed` - Order completed successfully
- `cancelled` - Order cancelled

## API Endpoints

### 1. Get User Orders
```
GET /api/orders/:userId
```
Returns all orders for a specific user, sorted by newest first.

### 2. Create Order
```
POST /api/orders
Content-Type: application/json

{
  "userId": "user@example.com",
  "items": [...],
  "subtotal": 3000.00,
  "shipping": 200.00,
  "total": 3200.00,
  "shippingInfo": {...},
  "deliveryMethod": "standard",
  "paymentMethod": "mpesa",
  "orderNotes": "Optional notes",
  "status": "pending"
}
```

### 3. Update Order Status
```
PATCH /api/orders/:orderId/status
Content-Type: application/json

{
  "status": "completed"
}
```

## Running the Server

### Local JSON File (Development)
```bash
npm start
```

### DynamoDB (Production)
```bash
npm run start:dynamodb
```

## AWS Configuration

Make sure your AWS credentials are configured:
```bash
aws configure
```

Or set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

## Capacity & Pricing

**Provisioned Capacity:**
- Read: 5 units
- Write: 5 units

**Estimated Cost:** ~$2.50/month for low traffic

To switch to on-demand pricing:
```bash
aws dynamodb update-table \
  --table-name LightHubOrders \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Monitoring

View orders in AWS Console:
https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#table?name=LightHubOrders

## Migration from JSON to DynamoDB

If you have existing orders in `orders.json`, run:
```bash
node migrate-to-dynamodb.js
```
