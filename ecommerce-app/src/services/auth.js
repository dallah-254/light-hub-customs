import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { cognitoConfig } from '../config/cognito-config'

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId
})

export const signUp = (email, password, name, phoneNumber, address) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }),
      new CognitoUserAttribute({ Name: 'address', Value: address })
    ]

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result.user)
    })
  })
}

export const confirmSignUp = (email, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    })

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err)
    })
  })
}

export const resendConfirmationCode = (email) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

export const getCurrentUser = () => {
  return userPool.getCurrentUser()
}

export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser) {
    cognitoUser.signOut()
  }
  localStorage.removeItem('userSession')
}

export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.forgotPassword({
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err)
    })
  })
}

export const confirmPassword = (email, code, newPassword) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err)
    })
  })
}
