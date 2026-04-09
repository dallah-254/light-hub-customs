export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  },
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_x0Dl3nX6Z',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '3l5bo817jisa8on8cs156fropk'
  },
  dynamodb: {
    tableName: import.meta.env.VITE_DYNAMODB_TABLE_NAME || 'LH-Products'
  }
}
