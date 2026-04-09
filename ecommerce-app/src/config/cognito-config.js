export const cognitoConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_x0Dl3nX6Z',
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '3l5bo817jisa8on8cs156fropk'
}
