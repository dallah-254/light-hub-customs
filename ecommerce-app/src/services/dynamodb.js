import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, QueryCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { awsConfig } from '../config/aws-config'

const client = new DynamoDBClient({
  region: awsConfig.region,
  credentials: awsConfig.credentials
})

const docClient = DynamoDBDocumentClient.from(client)

export const getCategories = async () => {
  try {
    const command = new ScanCommand({
      TableName: awsConfig.dynamodb.tableName,
      ProjectionExpression: 'category'
    })
    
    const response = await docClient.send(command)
    const categories = [...new Set(response.Items.map(item => item.category).filter(Boolean))]
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const getProductsBySection = async (section) => {
  try {
    const command = new ScanCommand({
      TableName: awsConfig.dynamodb.tableName,
      FilterExpression: '#sec = :section',
      ExpressionAttributeNames: {
        '#sec': 'section'
      },
      ExpressionAttributeValues: {
        ':section': section
      }
    })
    const response = await docClient.send(command)
    return response.Items || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getProductById = async (productId) => {
  try {
    const command = new ScanCommand({
      TableName: awsConfig.dynamodb.tableName,
      FilterExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
      }
    })
    const response = await docClient.send(command)
    return response.Items?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export const getProductsByCategory = async (category) => {
  try {
    const command = new ScanCommand({
      TableName: awsConfig.dynamodb.tableName,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    })
    const response = await docClient.send(command)
    return response.Items || []
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

export const getVehicleMakes = async () => {
  try {
    const command = new ScanCommand({
      TableName: 'VehicleData',
      ProjectionExpression: 'make'
    })
    const response = await docClient.send(command)
    const makes = [...new Set(response.Items.map(item => item.make))]
    return makes.sort()
  } catch (error) {
    console.error('Error fetching vehicle makes:', error)
    return []
  }
}

export const getVehicleModels = async (make) => {
  try {
    const command = new QueryCommand({
      TableName: 'VehicleData',
      KeyConditionExpression: 'make = :make',
      ExpressionAttributeValues: {
        ':make': make
      }
    })
    const response = await docClient.send(command)
    return response.Items.map(item => ({ model: item.model, years: item.years }))
  } catch (error) {
    console.error('Error fetching vehicle models:', error)
    return []
  }
}

export const getBulbSizes = async (make, model) => {
  try {
    const command = new GetCommand({
      TableName: 'BulbData',
      Key: {
        vehicleKey: `${make}#${model}`
      }
    })
    const response = await docClient.send(command)
    return response.Item || null
  } catch (error) {
    console.error('Error fetching bulb sizes:', error)
    return null
  }
}

export const saveUserToDynamoDB = async (userData) => {
  try {
    const command = new PutCommand({
      TableName: 'LightHubUsers',
      Item: {
        userId: userData.email,
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
    await docClient.send(command)
    return true
  } catch (error) {
    console.error('Error saving user to DynamoDB:', error)
    return false
  }
}
