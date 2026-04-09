# Cognito Setup Instructions

Since I don't have permissions to create Cognito resources, you'll need to create the User Pool manually:

## Step 1: Create User Pool

```bash
aws cognito-idp create-user-pool \
  --pool-name LightHubCustomersPool \
  --auto-verified-attributes email \
  --username-attributes email \
  --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":false,"RequireUppercase":true}}' \
  --schema '[
    {"Name":"email","AttributeDataType":"String","Required":true,"Mutable":true},
    {"Name":"name","AttributeDataType":"String","Required":true,"Mutable":true},
    {"Name":"phone_number","AttributeDataType":"String","Required":true,"Mutable":true},
    {"Name":"address","AttributeDataType":"String","Required":true,"Mutable":true}
  ]' \
  --verification-message-template '{"DefaultEmailOption":"CONFIRM_WITH_CODE"}' \
  --email-configuration '{"EmailSendingAccount":"COGNITO_DEFAULT"}' \
  --region us-east-1
```

## Step 2: Create App Client

```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-name LightHubWebApp \
  --no-generate-secret \
  --region us-east-1
```

## Step 3: Update Config

Copy the UserPoolId and ClientId from the responses and update:
`ecommerce-app/src/config/cognito-config.js`

```javascript
export const cognitoConfig = {
  region: 'us-east-1',
  userPoolId: 'YOUR_USER_POOL_ID_HERE',
  clientId: 'YOUR_CLIENT_ID_HERE'
}
```

## Features Implemented:

✅ Registration form with all required fields:
- Email
- Name
- Phone Number (with country code)
- Address
- Password (min 8 chars, uppercase, lowercase, numbers)

✅ Email verification flow:
- User registers
- Receives verification code via email
- Enters code to verify
- Can resend code if needed

✅ Form validation
✅ Error handling
✅ Loading states
✅ Redirect to login after successful verification
