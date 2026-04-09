const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const ORDERS_FILE = path.join(__dirname, 'orders.json')

// Initialize orders file
const initOrdersFile = async () => {
  try {
    await fs.access(ORDERS_FILE)
  } catch {
    await fs.writeFile(ORDERS_FILE, JSON.stringify([]))
  }
}

// Get orders by user ID
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8')
    const orders = JSON.parse(data)
    const userOrders = orders.filter(order => order.userId === req.params.userId)
    res.json(userOrders)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8')
    const orders = JSON.parse(data)
    
    const newOrder = {
      id: Date.now().toString(),
      ...req.body
    }
    
    orders.push(newOrder)
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
    
    res.status(201).json(newOrder)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' })
  }
})

initOrdersFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Orders API running on http://localhost:${PORT}`)
  })
})
