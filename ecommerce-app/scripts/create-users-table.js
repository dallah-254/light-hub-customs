import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})

const createUsersTable = async () => {
  const command = new CreateTableCommand({
    TableName: 'LightHubUsers',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  })

  try {
    const response = await client.send(command)
    console.log('LightHubUsers table created successfully:', response)
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('LightHubUsers table already exists')
    } else {
      console.error('Error creating LightHubUsers table:', error)
    }
  }
}

createUsersTable()
