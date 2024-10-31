// backend/config/cognitoConfig.js
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1', // Cambia esto a la región donde tienes Cognito
});

const CognitoConfig = {
  UserPoolId: 'us-east-1_xxxxxxx', // Reemplaza con tu User Pool ID
  ClientId: 'xxxxxxxxxx', // Reemplaza con el App Client ID sin secreto
};

module.exports = CognitoConfig;
