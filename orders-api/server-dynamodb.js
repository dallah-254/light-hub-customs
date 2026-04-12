const express = require('express')
const cors = require('cors')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// DynamoDB setup
const client = new DynamoDBClient({ region: 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(client)
const TABLE_NAME = 'LightHubOrders'

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Light Hub Orders API', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      orders: '/api/orders',
      products: '/api/products',
      customers: '/api/customers'
    }
  })
})

// Track order by order ID (must be before /:userId route)
app.get('/api/orders/track/:orderId', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { orderId: req.params.orderId }
    }
    
    const result = await docClient.send(new GetCommand(params))
    
    if (result.Item) {
      res.json(result.Item)
    } else {
      res.status(404).json({ error: 'Order not found' })
    }
  } catch (error) {
    console.error('Error tracking order:', error)
    res.status(500).json({ error: 'Failed to track order' })
  }
})

// Get all orders (admin)
app.get('/api/orders/all', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME
    }
    
    const result = await docClient.send(new ScanCommand(params))
    res.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching all orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Get orders by user ID
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.params.userId
      },
      ScanIndexForward: false // Sort by newest first
    }
    
    const result = await docClient.send(new QueryCommand(params))
    res.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const orderId = `ORD-${Date.now()}`
    const timestamp = new Date().toISOString()
    
    const order = {
      orderId,
      userId: req.body.userId,
      items: req.body.items,
      subtotal: req.body.subtotal,
      shipping: req.body.shipping || 0,
      total: req.body.total,
      shippingInfo: req.body.shippingInfo,
      deliveryMethod: req.body.deliveryMethod,
      paymentMethod: req.body.paymentMethod,
      orderNotes: req.body.orderNotes || '',
      status: req.body.status || 'pending',
      createdAt: timestamp,
      updatedAt: timestamp
    }
    
    const params = {
      TableName: TABLE_NAME,
      Item: order
    }
    
    await docClient.send(new PutCommand(params))
    res.status(201).json({ ...order, id: orderId })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body
    const timestamp = new Date().toISOString()
    
    const params = {
      TableName: TABLE_NAME,
      Key: { orderId: req.params.orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': timestamp
      },
      ReturnValues: 'ALL_NEW'
    }
    
    const result = await docClient.send(new UpdateCommand(params))
    res.json(result.Attributes)
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Orders API running on http://localhost:${PORT}`)
  console.log(`Using DynamoDB table: ${TABLE_NAME}`)
})

// Product Management Endpoints
const PRODUCTS_TABLE = 'LH-Products'

// Get all products
app.get('/api/products/all', async (req, res) => {
  try {
    const params = {
      TableName: PRODUCTS_TABLE
    }
    
    const result = await docClient.send(new ScanCommand(params))
    res.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const params = {
      TableName: PRODUCTS_TABLE,
      Item: product
    }
    
    await docClient.send(new PutCommand(params))
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Update product
app.put('/api/products/:productId', async (req, res) => {
  try {
    const product = {
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    
    const params = {
      TableName: PRODUCTS_TABLE,
      Item: product
    }
    
    await docClient.send(new PutCommand(params))
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Delete product
app.delete('/api/products/:productId', async (req, res) => {
  try {
    const params = {
      TableName: PRODUCTS_TABLE,
      Key: { productId: req.params.productId }
    }
    
    const { DeleteCommand } = require('@aws-sdk/lib-dynamodb')
    await docClient.send(new DeleteCommand(params))
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Customer Management
app.get('/api/customers', async (req, res) => {
  try {
    // Get all orders
    const ordersParams = {
      TableName: TABLE_NAME
    }
    const ordersResult = await docClient.send(new ScanCommand(ordersParams))
    const orders = ordersResult.Items || []

    // Group orders by customer email
    const customerMap = {}
    
    orders.forEach(order => {
      const email = order.userId || order.shippingInfo?.email
      if (!email) return

      if (!customerMap[email]) {
        customerMap[email] = {
          email,
          name: order.shippingInfo?.fullName || '',
          phone: order.shippingInfo?.phone || '',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          status: 'active'
        }
      }

      customerMap[email].totalOrders++
      customerMap[email].totalSpent += order.total || 0
      
      // Update last order date if this order is more recent
      if (new Date(order.createdAt) > new Date(customerMap[email].lastOrderDate)) {
        customerMap[email].lastOrderDate = order.createdAt
      }
    })

    const customers = Object.values(customerMap)
    res.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
})
